import type { SectionContent } from "@shared/schema";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
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
          let start = 0;
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

    if (ref.current) {
      observer.observe(ref.current);
    }

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
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]"
        />
      </div>

      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: themeMotion.duration, delay: index * 0.1 }}
              className="text-center group"
              data-testid={`stat-item-${index}`}
            >
              <div 
                className="inline-block px-8 py-6 rounded-2xl backdrop-blur-sm border border-white/10 bg-white/5 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105"
              >
                <div 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-white tracking-tight"
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
