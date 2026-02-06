import { motion } from "framer-motion";
import { type ReactNode, useMemo, useRef, useEffect, useState } from "react";

function parseDuration(cssValue: string, fallback: number): number {
  if (!cssValue) return fallback;
  const trimmed = cssValue.trim();
  if (trimmed.endsWith("ms")) return parseFloat(trimmed) / 1000;
  if (trimmed.endsWith("s")) return parseFloat(trimmed);
  const num = parseFloat(trimmed);
  return isNaN(num) ? fallback : num;
}

function parseEasing(cssValue: string, fallback: number[]): number[] {
  if (!cssValue) return fallback;
  const trimmed = cssValue.trim();
  const match = trimmed.match(/cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])];
  }
  return fallback;
}

export function useThemeMotion() {
  const ref = useRef<HTMLElement | null>(null);
  const [tokens, setTokens] = useState({
    duration: 0.5,
    durationFast: 0.15,
    durationSlow: 0.5,
    durationVerySlow: 0.8,
    easing: [0.22, 1, 0.36, 1] as number[],
    easingOut: [0, 0, 0.2, 1] as number[],
  });

  useEffect(() => {
    const el = ref.current || document.documentElement;
    const cs = getComputedStyle(el);

    const d = parseDuration(cs.getPropertyValue("--brand-motion-duration"), 0.5);
    const df = parseDuration(cs.getPropertyValue("--brand-motion-fast"), 0.15);
    const ds = parseDuration(cs.getPropertyValue("--brand-motion-slow"), 0.5);
    const dvs = parseDuration(cs.getPropertyValue("--brand-motion-very-slow"), 0.8);
    const e = parseEasing(cs.getPropertyValue("--brand-motion-easing"), [0.22, 1, 0.36, 1]);
    const eo = parseEasing(cs.getPropertyValue("--brand-motion-easing-out"), [0, 0, 0.2, 1]);

    setTokens({ duration: d, durationFast: df, durationSlow: ds, durationVerySlow: dvs, easing: e, easingOut: eo });
  }, []);

  return { ref, ...tokens };
}

const DEFAULT_DURATION = 0.5;
const DEFAULT_EASING: number[] = [0.25, 0.1, 0.25, 1];

function useMotionValues() {
  const [vals, setVals] = useState({ dur: DEFAULT_DURATION, ease: DEFAULT_EASING });
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const dur = parseDuration(cs.getPropertyValue("--brand-motion-duration"), DEFAULT_DURATION);
    const ease = parseEasing(cs.getPropertyValue("--brand-motion-easing"), DEFAULT_EASING);
    setVals({ dur, ease });
  }, []);
  return vals;
}

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up",
  className = "" 
}: MotionWrapperProps) {
  const { dur, ease } = useMotionValues();
  const variants = useMemo(() => ({
    hidden: (dir: string) => ({
      opacity: 0,
      y: dir === "up" ? 40 : dir === "down" ? -40 : 0,
      x: dir === "left" ? 40 : dir === "right" ? -40 : 0,
    }),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  }), []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: dur, 
        delay,
        ease
      }}
      variants={variants}
      custom={direction}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: staggerDelay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const { dur, ease } = useMotionValues();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: dur * 0.8, ease }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  delay = 0,
  className = "" 
}: MotionWrapperProps) {
  const { dur, ease } = useMotionValues();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: dur * 0.8, 
        delay,
        ease
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
