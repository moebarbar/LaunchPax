import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface LargeTypographyProps {
  text: string;
  highlight?: string;
  className?: string;
}

export function LargeTypography({ text, highlight, className = "" }: LargeTypographyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  
  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className={`py-32 sm:py-40 lg:py-48 px-4 sm:px-8 text-center overflow-hidden ${className}`}
    >
      <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-black tracking-tighter leading-[0.85]">
        {text.split(' ').map((word, i) => (
          <span key={i} className="inline-block mr-[0.2em]">
            {word === highlight ? (
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-accent, hsl(var(--primary))) 100%)`
                }}
              >
                {word}
              </span>
            ) : (
              word
            )}
          </span>
        ))}
      </h2>
    </motion.div>
  );
}

interface ParallaxDividerProps {
  className?: string;
}

export function ParallaxDivider({ className = "" }: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const x1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  
  return (
    <div ref={ref} className={`relative h-40 overflow-hidden ${className}`}>
      <motion.div 
        style={{ x: x1 }}
        className="absolute inset-0 flex items-center whitespace-nowrap"
      >
        <div 
          className="h-px w-[200%]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, var(--brand-primary, hsl(var(--primary))) 50%, transparent 100%)`
          }}
        />
      </motion.div>
      <motion.div 
        style={{ x: x2 }}
        className="absolute inset-0 flex items-center whitespace-nowrap"
      >
        <div 
          className="h-px w-[200%] opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent 0%, var(--brand-accent, hsl(var(--primary))) 50%, transparent 100%)`
          }}
        />
      </motion.div>
    </div>
  );
}

interface AnimatedGradientBgProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function AnimatedGradientBg({ children, className = "", intensity = "medium" }: AnimatedGradientBgProps) {
  const opacities = {
    low: "opacity-10",
    medium: "opacity-20",
    high: "opacity-30"
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div 
        className={`absolute inset-0 ${opacities[intensity]}`}
        animate={{
          background: [
            `radial-gradient(ellipse 80% 60% at 0% 0%, var(--brand-primary, hsl(var(--primary))) 0%, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 100% 100%, var(--brand-primary, hsl(var(--primary))) 0%, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 100% 0%, var(--brand-primary, hsl(var(--primary))) 0%, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 0% 100%, var(--brand-primary, hsl(var(--primary))) 0%, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 0% 0%, var(--brand-primary, hsl(var(--primary))) 0%, transparent 70%)`,
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className={`absolute inset-0 ${opacities[intensity]}`}
        animate={{
          background: [
            `radial-gradient(ellipse 60% 50% at 100% 50%, var(--brand-accent, hsl(var(--primary))) 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 50% at 0% 50%, var(--brand-accent, hsl(var(--primary))) 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 50% at 50% 0%, var(--brand-accent, hsl(var(--primary))) 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 50% at 50% 100%, var(--brand-accent, hsl(var(--primary))) 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 50% at 100% 50%, var(--brand-accent, hsl(var(--primary))) 0%, transparent 60%)`,
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 3
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export function FloatingElements({ count = 5, className = "" }: FloatingElementsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + (i * 20)}%`,
            top: `${20 + (i * 15) % 60}%`,
            background: i % 2 === 0 
              ? "var(--brand-primary, hsl(var(--primary)))"
              : "var(--brand-accent, hsl(var(--primary)))",
            opacity: 0.3
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export function RevealOnScroll({ 
  children, 
  direction = "up", 
  delay = 0,
  className = "" 
}: RevealOnScrollProps) {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 }
  };
  
  const { y, x } = directions[direction];
  
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className = "" }: TextRevealProps) {
  const words = text.split(' ');
  
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                delay: i * 0.05
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
