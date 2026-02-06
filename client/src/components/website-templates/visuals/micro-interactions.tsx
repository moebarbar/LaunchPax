import { useRef, useState, useEffect, Children, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  animate,
} from "framer-motion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down";
  className?: string;
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const range = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [multiplier * range, multiplier * -range]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  duration?: number;
  className?: string;
  once?: boolean;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  direction = "up",
  duration = 0.6,
  className = "",
  once = true,
}: StaggerRevealProps) {
  const initialMap: Record<string, { opacity: number; x?: number; y?: number; scale?: number }> = {
    up: { opacity: 0, y: 30 },
    down: { opacity: 0, y: -30 },
    left: { opacity: 0, x: 30 },
    right: { opacity: 0, x: -30 },
    scale: { opacity: 0, scale: 0.85 },
    none: { opacity: 0 },
  };

  const initial = initialMap[direction];
  const visible = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
    >
      {Children.map(children, (child, i) => (
        <motion.div
          variants={{
            hidden: initial,
            visible: {
              ...visible,
              transition: {
                duration,
                delay: i * staggerDelay,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
          }}
          style={{ willChange: "transform, opacity" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticElement({
  children,
  strength = 0.3,
  className = "",
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * strength;
    const dy = (e.clientY - centerY) * strength;
    const maxMove = 8;
    x.set(Math.max(-maxMove, Math.min(maxMove, dx)));
    y.set(Math.max(-maxMove, Math.min(maxMove, dy)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  variant?: "word" | "char" | "line" | "blur";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function TextReveal({
  text,
  as: Tag = "p",
  variant = "line",
  className = "",
  style,
  delay = 0,
}: TextRevealProps) {
  const MotionTag = motion.create(Tag);

  if (variant === "line") {
    return (
      <MotionTag
        className={className}
        style={{ ...style, willChange: "transform, opacity" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {text}
      </MotionTag>
    );
  }

  if (variant === "blur") {
    return (
      <MotionTag
        className={className}
        style={{ ...style, willChange: "transform, opacity, filter" }}
        initial={{ opacity: 0, filter: "blur(10px)", y: 8 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {text}
      </MotionTag>
    );
  }

  if (variant === "word") {
    const words = text.split(" ");
    return (
      <Tag className={className} style={style}>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "inline" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              style={{ display: "inline-block", willChange: "transform, opacity", marginRight: "0.25em" }}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: delay + i * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  const chars = text.split("");
  return (
    <Tag className={className} style={style}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: "inline" }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            style={{
              display: "inline-block",
              willChange: "transform, opacity",
              whiteSpace: char === " " ? "pre" : undefined,
            }}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  delay: delay + i * 0.025,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

interface CountUpAnimationProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CountUpAnimation({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  style,
}: CountUpAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const [displayVal, setDisplayVal] = useState("0");

  const hasDecimals = useMemo(() => value % 1 !== 0, [value]);
  const decimalPlaces = useMemo(() => {
    if (!hasDecimals) return 0;
    const str = value.toString();
    const dotIndex = str.indexOf(".");
    return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
  }, [value, hasDecimals]);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionVal, value, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        if (hasDecimals) {
          setDisplayVal(v.toFixed(decimalPlaces));
        } else {
          setDisplayVal(Math.round(v).toLocaleString());
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, motionVal, hasDecimals, decimalPlaces]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
}

interface HoverTiltProps {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  className?: string;
}

export function HoverTilt({
  children,
  maxTilt = 5,
  scale = 1.02,
  className = "",
}: HoverTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scaleVal = useMotionValue(1);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 15 });
  const springScale = useSpring(scaleVal, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-yPos * maxTilt * 2);
    rotateY.set(xPos * maxTilt * 2);
    scaleVal.set(scale);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scaleVal.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: 800,
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
}

export function AnimatedGradientBorder({
  children,
  borderWidth = 1,
  borderRadius = 12,
  className = "",
}: AnimatedGradientBorderProps) {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      setRotation((elapsed / 20) % 360);
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const primaryColor = "var(--brand-primary, hsl(var(--primary)))";
  const secondaryColor = "var(--brand-secondary, hsl(var(--primary)))";
  const accentColor = "var(--brand-accent, hsl(var(--primary)))";

  return (
    <div
      className={`relative ${className}`}
      style={{ borderRadius, padding: borderWidth }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius,
          background: `conic-gradient(from ${rotation}deg, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${primaryColor})`,
          opacity: 0.7,
        }}
      />
      <div
        className="relative"
        style={{
          borderRadius: borderRadius - borderWidth,
          backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
