import { motion } from "framer-motion";
import { CSSProperties } from "react";

export type VisualEffectType = 
  | "gradient"
  | "textured" 
  | "animated"
  | "layered"
  | "glassmorphism"
  | "minimal"
  | "noise"
  | "mesh";

interface VisualEffectProps {
  type: VisualEffectType;
  primaryColor?: string;
  secondaryColor?: string;
  opacity?: number;
  className?: string;
}

export function VisualEffectBackground({ 
  type, 
  primaryColor = "var(--brand-primary, hsl(var(--primary)))",
  secondaryColor = "var(--brand-secondary, hsl(var(--primary)))",
  opacity = 0.5,
  className = ""
}: VisualEffectProps) {
  switch (type) {
    case "gradient":
      return <GradientBackground primary={primaryColor} secondary={secondaryColor} opacity={opacity} className={className} />;
    case "textured":
      return <TexturedBackground primary={primaryColor} opacity={opacity} className={className} />;
    case "animated":
      return <AnimatedBackground primary={primaryColor} secondary={secondaryColor} opacity={opacity} className={className} />;
    case "layered":
      return <LayeredBackground primary={primaryColor} secondary={secondaryColor} opacity={opacity} className={className} />;
    case "glassmorphism":
      return <GlassmorphismBackground primary={primaryColor} opacity={opacity} className={className} />;
    case "noise":
      return <NoiseBackground opacity={opacity} className={className} />;
    case "mesh":
      return <MeshBackground primary={primaryColor} secondary={secondaryColor} opacity={opacity} className={className} />;
    case "minimal":
    default:
      return null;
  }
}

function GradientBackground({ primary, secondary, opacity, className }: { primary: string; secondary: string; opacity: number; className: string }) {
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, transparent 100%)`,
        opacity
      }}
    />
  );
}

function TexturedBackground({ primary, opacity, className }: { primary: string; opacity: number; className: string }) {
  return (
    <>
      <div 
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundColor: primary,
          opacity: opacity * 0.1
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.05
        }}
      />
    </>
  );
}

function AnimatedBackground({ primary, secondary, opacity, className }: { primary: string; secondary: string; opacity: number; className: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: primary,
          opacity: opacity * 0.4,
          top: "10%",
          left: "20%"
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: secondary,
          opacity: opacity * 0.3,
          bottom: "20%",
          right: "15%"
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-[60px]"
        style={{
          background: `linear-gradient(45deg, ${primary}, ${secondary})`,
          opacity: opacity * 0.25,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

function LayeredBackground({ primary, secondary, opacity, className }: { primary: string; secondary: string; opacity: number; className: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 0% 0%, ${primary} 0%, transparent 50%)`,
          opacity: opacity * 0.5
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 100% 100%, ${secondary} 0%, transparent 50%)`,
          opacity: opacity * 0.4
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${primary} 0%, transparent 30%)`,
          opacity: opacity * 0.2
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

function GlassmorphismBackground({ primary, opacity, className }: { primary: string; opacity: number; className: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div 
        className="absolute inset-0 backdrop-blur-3xl"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, transparent 100%)`,
          opacity: opacity * 0.15
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)",
          opacity: 0.5
        }}
      />
    </div>
  );
}

function NoiseBackground({ opacity, className }: { opacity: number; className: string }) {
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: opacity * 0.1
      }}
    />
  );
}

function MeshBackground({ primary, secondary, opacity, className }: { primary: string; secondary: string; opacity: number; className: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mesh1" cx="0%" cy="0%" r="100%">
            <stop offset="0%" style={{ stopColor: primary, stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="mesh2" cx="100%" cy="100%" r="100%">
            <stop offset="0%" style={{ stopColor: secondary, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="mesh3" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style={{ stopColor: primary, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#mesh1)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#mesh2)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#mesh3)" />
      </svg>
    </div>
  );
}

export function SectionDivider({ 
  variant = "wave",
  color = "var(--brand-primary, hsl(var(--primary)))"
}: { 
  variant?: "wave" | "diagonal" | "curved" | "triangle";
  color?: string;
}) {
  const getPath = () => {
    switch (variant) {
      case "wave":
        return "M0,0 C150,60 350,0 500,30 L500,100 L0,100 Z";
      case "diagonal":
        return "M0,100 L500,0 L500,100 Z";
      case "curved":
        return "M0,100 Q250,0 500,100 L500,100 L0,100 Z";
      case "triangle":
        return "M250,0 L500,100 L0,100 Z";
      default:
        return "M0,0 C150,60 350,0 500,30 L500,100 L0,100 Z";
    }
  };
  
  return (
    <div className="relative h-16 sm:h-24 -mt-1 z-10">
      <svg
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d={getPath()}
          fill={color}
          opacity="0.05"
        />
      </svg>
    </div>
  );
}

export function FloatingShape({
  shape = "circle",
  size = 100,
  color = "var(--brand-primary, hsl(var(--primary)))",
  blur = 50,
  position = { top: "10%", left: "10%" },
  animation = true
}: {
  shape?: "circle" | "square" | "blob";
  size?: number;
  color?: string;
  blur?: number;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  animation?: boolean;
}) {
  const shapeStyle: CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: color,
    filter: `blur(${blur}px)`,
    opacity: 0.3,
    ...position
  };
  
  if (shape === "circle") {
    shapeStyle.borderRadius = "50%";
  } else if (shape === "blob") {
    shapeStyle.borderRadius = "30% 70% 70% 30% / 30% 30% 70% 70%";
  }
  
  if (!animation) {
    return <div style={shapeStyle} />;
  }
  
  return (
    <motion.div
      style={shapeStyle}
      animate={{
        x: [0, 20, 0],
        y: [0, -15, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
