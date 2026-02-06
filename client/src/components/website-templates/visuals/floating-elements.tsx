import { motion } from "framer-motion";

interface FloatingOrbProps {
  color?: string;
  size?: number;
  x?: string;
  y?: string;
  delay?: number;
  duration?: number;
  blur?: number;
  opacity?: number;
}

export function FloatingOrb({
  color = "var(--brand-primary, hsl(var(--primary)))",
  size = 300,
  x = "50%",
  y = "50%",
  delay = 0,
  duration = 20,
  blur = 80,
  opacity = 0.15,
}: FloatingOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -25, 15, 0],
        scale: [1, 1.15, 0.95, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

interface GradientMeshProps {
  colors?: string[];
  className?: string;
  animated?: boolean;
}

export function GradientMesh({
  colors,
  className = "",
  animated = true,
}: GradientMeshProps) {
  const c = colors || [
    "var(--brand-primary, hsl(var(--primary)))",
    "var(--brand-secondary, hsl(var(--primary)))",
    "var(--brand-accent, hsl(var(--primary)))",
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <FloatingOrb color={c[0]} size={500} x="20%" y="30%" delay={0} opacity={0.12} blur={100} />
      <FloatingOrb color={c[1]} size={400} x="70%" y="60%" delay={3} opacity={0.1} blur={90} />
      <FloatingOrb color={c[2] || c[0]} size={350} x="50%" y="80%" delay={6} opacity={0.08} blur={80} />
      {animated && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${c[0]}10 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 30%, ${c[1]}08 0%, transparent 50%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

interface DotGridProps {
  color?: string;
  spacing?: number;
  opacity?: number;
  className?: string;
}

export function DotGrid({
  color = "var(--brand-text, currentColor)",
  spacing = 40,
  opacity = 0.03,
  className = "",
}: DotGridProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
      }}
    />
  );
}

interface GridLinesProps {
  color?: string;
  spacing?: number;
  opacity?: number;
  className?: string;
}

export function GridLines({
  color = "var(--brand-primary, hsl(var(--primary)))",
  spacing = 60,
  opacity = 0.04,
  className = "",
}: GridLinesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
      }}
    />
  );
}

interface FloatingShapeProps {
  className?: string;
}

export function FloatingShapes({ className = "" }: FloatingShapeProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute w-16 h-16 border-2 rounded-lg"
        style={{
          borderColor: "var(--brand-primary, hsl(var(--primary)))",
          opacity: 0.1,
          top: "15%",
          right: "10%",
        }}
        animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-8 h-8 rounded-full"
        style={{
          background: "var(--brand-accent, hsl(var(--primary)))",
          opacity: 0.08,
          top: "60%",
          left: "5%",
        }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-24 h-24 border rounded-full"
        style={{
          borderColor: "var(--brand-secondary, hsl(var(--primary)))",
          opacity: 0.06,
          bottom: "20%",
          right: "20%",
        }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: `20px solid var(--brand-primary, hsl(var(--primary)))`,
          opacity: 0.07,
          top: "40%",
          left: "15%",
        }}
        animate={{ rotate: [0, 360], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

interface SectionDividerProps {
  type?: "wave" | "curve" | "angle" | "zigzag";
  position?: "top" | "bottom";
  color?: string;
  height?: number;
  className?: string;
}

export function SectionDivider({
  type = "wave",
  position = "bottom",
  color = "var(--brand-background, hsl(var(--background)))",
  height = 80,
  className = "",
}: SectionDividerProps) {
  const paths: Record<string, string> = {
    wave: "M0,40 C150,80 350,0 500,40 C650,80 850,0 1000,40 L1000,100 L0,100 Z",
    curve: "M0,60 Q250,0 500,60 Q750,100 1000,60 L1000,100 L0,100 Z",
    angle: "M0,100 L500,20 L1000,100 L1000,100 L0,100 Z",
    zigzag: "M0,60 L100,40 L200,60 L300,40 L400,60 L500,40 L600,60 L700,40 L800,60 L900,40 L1000,60 L1000,100 L0,100 Z",
  };

  return (
    <div
      className={`absolute left-0 right-0 overflow-hidden pointer-events-none ${className} ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
      style={{ height, transform: position === "top" ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: "block" }}
      >
        <path d={paths[type]} fill={color} />
      </svg>
    </div>
  );
}

interface ShineButtonEffectProps {
  children: React.ReactNode;
  className?: string;
}

export function ShineEffect({ children, className = "" }: ShineButtonEffectProps) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          transform: "translateX(-100%)",
        }}
        animate={{ transform: ["translateX(-100%)", "translateX(100%)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
      />
    </div>
  );
}
