import { motion, useScroll, useSpring } from "framer-motion";

interface RadialGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  x?: string;
  y?: string;
  animate?: boolean;
  className?: string;
}

export function RadialGlow({
  color = "var(--brand-primary, hsl(var(--primary)))",
  size = 400,
  opacity = 0.15,
  x = "50%",
  y = "50%",
  animate = false,
  className = "",
}: RadialGlowProps) {
  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    left: x,
    top: y,
    transform: "translate(-50%, -50%)",
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity,
    willChange: animate ? "opacity" : undefined,
  };

  if (animate) {
    return (
      <motion.div
        className={`pointer-events-none ${className}`}
        style={style}
        animate={{ opacity: [opacity, opacity * 1.4, opacity] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return <div className={`pointer-events-none ${className}`} style={style} />;
}

interface MultiStopGradientProps {
  stops?: { color: string; position: number }[];
  angle?: number;
  animated?: boolean;
  className?: string;
}

export function MultiStopGradient({
  stops,
  angle = 135,
  animated = false,
  className = "",
}: MultiStopGradientProps) {
  const defaultStops = [
    { color: "var(--brand-primary, hsl(var(--primary)))", position: 0 },
    { color: "var(--brand-secondary, hsl(var(--primary)))", position: 50 },
    { color: "var(--brand-accent, hsl(var(--primary)))", position: 100 },
  ];

  const resolvedStops = stops || defaultStops;
  const gradientStops = resolvedStops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");

  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${angle}deg, ${gradientStops})`,
  };

  if (animated) {
    return (
      <div
        className={`pointer-events-none ${className}`}
        style={{
          ...style,
          background: undefined,
          willChange: "transform",
        }}
      >
        <div
          className="absolute inset-0 animate-[gradient-rotate_20s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, ${gradientStops})`,
            filter: "blur(60px)",
            opacity: 0.6,
          }}
        />
        <style>{`
          @keyframes gradient-rotate {
            from { transform: rotate(0deg) scale(1.5); }
            to { transform: rotate(360deg) scale(1.5); }
          }
        `}</style>
      </div>
    );
  }

  return <div className={`pointer-events-none ${className}`} style={style} />;
}

interface NoiseTextureProps {
  opacity?: number;
  blend?: string;
  className?: string;
}

export function NoiseTexture({
  opacity = 0.03,
  blend = "overlay",
  className = "",
}: NoiseTextureProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        mixBlendMode: blend as React.CSSProperties["mixBlendMode"],
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </div>
  );
}

interface MeshGradientBackgroundProps {
  colors?: string[];
  animate?: boolean;
  className?: string;
}

export function MeshGradientBackground({
  colors,
  animate = false,
  className = "",
}: MeshGradientBackgroundProps) {
  const c = colors || [
    "var(--brand-primary, hsl(var(--primary)))",
    "var(--brand-secondary, hsl(var(--primary)))",
    "var(--brand-accent, hsl(var(--primary)))",
    "var(--brand-background, hsl(var(--background)))",
  ];

  const layers = [
    { cx: "25%", cy: "25%", color: c[0] },
    { cx: "75%", cy: "20%", color: c[1] },
    { cx: "60%", cy: "70%", color: c[2] || c[0] },
    { cx: "30%", cy: "80%", color: c[3] || c[1] },
  ];

  const staticBackground = layers
    .map(
      (l) =>
        `radial-gradient(ellipse at ${l.cx} ${l.cy}, ${l.color} 0%, transparent 60%)`
    )
    .join(", ");

  if (animate) {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ background: "var(--brand-background, hsl(var(--background)))" }}
      >
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              width: "80%",
              height: "80%",
              left: layer.cx,
              top: layer.cy,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(ellipse, ${layer.color} 0%, transparent 70%)`,
              opacity: 0.5,
              willChange: "transform",
            }}
            animate={{
              x: [0, 30 * (i % 2 === 0 ? 1 : -1), -20 * (i % 2 === 0 ? -1 : 1), 0],
              y: [0, -25 * (i % 2 === 0 ? 1 : -1), 15 * (i % 2 === 0 ? -1 : 1), 0],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ background: staticBackground }}
    />
  );
}

interface SectionColorEvolutionProps {
  children: React.ReactNode;
  index: number;
  totalSections: number;
  baseHue?: number;
  hueShift?: number;
  className?: string;
}

export function SectionColorEvolution({
  children,
  index,
  totalSections,
  baseHue = 0,
  hueShift = 8,
  className = "",
}: SectionColorEvolutionProps) {
  const rotation = baseHue + index * hueShift;
  const progressOpacity = 0.02 + (index / Math.max(totalSections - 1, 1)) * 0.03;

  return (
    <div
      className={`relative ${className}`}
      style={{
        filter: `hue-rotate(${rotation}deg)`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, 
            var(--brand-primary, hsl(var(--primary))) 0%, 
            transparent 100%)`,
          opacity: progressOpacity,
        }}
      />
      {children}
    </div>
  );
}

interface GlowLineProps {
  direction?: "horizontal" | "vertical";
  animated?: boolean;
  className?: string;
}

export function GlowLine({
  direction = "horizontal",
  animated = false,
  className = "",
}: GlowLineProps) {
  const isHorizontal = direction === "horizontal";
  const gradientDir = isHorizontal ? "90deg" : "180deg";

  const lineStyle: React.CSSProperties = {
    position: "relative",
    width: isHorizontal ? "100%" : "2px",
    height: isHorizontal ? "2px" : "100%",
    background: `linear-gradient(${gradientDir}, transparent 0%, var(--brand-primary, hsl(var(--primary))) 30%, var(--brand-secondary, hsl(var(--primary))) 50%, var(--brand-primary, hsl(var(--primary))) 70%, transparent 100%)`,
    overflow: "hidden",
  };

  if (animated) {
    return (
      <div className={`pointer-events-none ${className}`} style={lineStyle}>
        <div
          className="absolute inset-0 animate-[glow-shimmer_3s_ease-in-out_infinite]"
          style={{
            background: isHorizontal
              ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)"
              : "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            willChange: "transform",
          }}
        />
        <style>{`
          @keyframes glow-shimmer {
            0% { transform: ${isHorizontal ? "translateX(-100%)" : "translateY(-100%)"}; }
            100% { transform: ${isHorizontal ? "translateX(100%)" : "translateY(100%)"}; }
          }
        `}</style>
      </div>
    );
  }

  return <div className={`pointer-events-none ${className}`} style={lineStyle} />;
}

interface ScrollProgressBarProps {
  className?: string;
}

export function ScrollProgressBar({ className = "" }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[3px] origin-left pointer-events-none ${className}`}
      style={{
        scaleX,
        background: `linear-gradient(90deg, var(--brand-primary, hsl(var(--primary))), var(--brand-secondary, hsl(var(--primary))))`,
        zIndex: 9999,
        willChange: "transform",
      }}
    />
  );
}
