import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useThemeMotion } from "./motion-wrapper";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsData {
  headline?: string;
  subheadline?: string;
  items?: StatItem[];
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue) || hasAnimated) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const updateNumber = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * numericValue);
            
            if (numericValue >= 1000) {
              setDisplayValue(current.toLocaleString());
            } else {
              setDisplayValue(current.toString());
            }

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(updateNumber);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref}>
      {prefix}{displayValue}{suffix}
    </div>
  );
}

export default function SectionStats({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as StatsData;
  const items = data.items || [];
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            var(--brand-primary, hsl(var(--primary))) 0%, 
            var(--brand-secondary, hsl(var(--primary))) 50%,
            var(--brand-accent, hsl(var(--primary))) 100%)`
        }}
      />
      
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]"
        />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
            className="text-center mb-16 sm:mb-20 text-white"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-stats-headline">
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto" data-testid="text-stats-subheadline">
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: themeMotion.duration, delay: index * 0.1 }}
              className="text-center group"
              data-testid={`stat-item-${index}`}
            >
              <div className="relative p-8 rounded-2xl backdrop-blur-sm border border-white/10 bg-white/5 transition-all duration-300 group-hover:bg-white/10 overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                />

                <div 
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-white tracking-tight"
                  data-testid={`text-stat-value-${index}`}
                >
                  <AnimatedNumber value={item.value} prefix={item.prefix} suffix={item.suffix} />
                </div>
                <p 
                  className="text-sm sm:text-base text-white/70 uppercase tracking-widest font-medium"
                  data-testid={`text-stat-label-${index}`}
                >
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
