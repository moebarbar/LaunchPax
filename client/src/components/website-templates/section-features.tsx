import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users, Clock, Check, Award, Globe, Briefcase, Settings, Wrench, Lightbulb, TrendingUp, Rocket, Lock, Cpu, BarChart3, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, DotGrid } from "./visuals/floating-elements";
import { HoverTilt, GeometricPattern } from "./visuals";
import { useDesignPersonality } from "./design-personality";

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesData {
  headline?: string;
  subheadline?: string;
  items?: FeatureItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  star: Star, shield: Shield, zap: Zap, heart: Heart, target: Target, users: Users,
  clock: Clock, check: Check, award: Award, globe: Globe, briefcase: Briefcase,
  settings: Settings, wrench: Wrench, lightbulb: Lightbulb, trending: TrendingUp,
  rocket: Rocket, lock: Lock, cpu: Cpu, chart: BarChart3, message: MessageSquare,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function SectionFeatures({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as FeaturesData;
  const items = data.items || [];
  const themeMotion = useThemeMotion();
  const personality = useDesignPersonality();

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: themeMotion.duration, ease: themeMotion.easing } }
  };
  
  const getBentoLayout = (index: number, total: number): string => {
    if (total <= 3) return "col-span-1";
    if (total === 4) return "col-span-1";
    if (total === 5) {
      if (index === 0) return "lg:col-span-2 lg:row-span-2";
      return "col-span-1";
    }
    if (index === 0) return "lg:col-span-2 lg:row-span-2";
    if (index === 3) return "lg:col-span-2";
    return "col-span-1";
  };

  const isLargeCard = (index: number, total: number) => (total >= 5 && index === 0);

  const miniVisuals = [
    (color: string) => (
      <svg viewBox="0 0 60 40" className="w-full h-full">
        <motion.path d="M5,35 Q15,10 30,25 T55,15" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} />
        <circle cx="30" cy="25" r="3" fill={color} opacity={0.3} />
      </svg>
    ),
    (color: string) => (
      <div className="grid grid-cols-3 gap-1 w-full h-full p-1">
        {[0.8, 0.5, 0.9, 0.3, 0.7, 0.6].map((h, i) => (
          <motion.div key={i} className="rounded-sm" style={{ background: color, opacity: 0.15 + h * 0.2 }}
            initial={{ scaleY: 0 }} whileInView={{ scaleY: h }} viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }} />
        ))}
      </div>
    ),
    (color: string) => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <motion.circle cx="30" cy="30" r="22" fill="none" stroke={color} strokeWidth="3" strokeDasharray="100 40" strokeLinecap="round"
          initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <circle cx="30" cy="30" r="8" fill={color} opacity={0.15} />
      </svg>
    ),
    (color: string) => (
      <div className="flex items-end gap-1 w-full h-full p-1">
        {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-t-sm" style={{ background: color, height: `${h * 100}%`, opacity: 0.2 + h * 0.15 }}
            initial={{ scaleY: 0, originY: 1 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: "easeOut" }} />
        ))}
      </div>
    ),
  ];
  
  return (
    <section 
      className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden" 
      style={{ backgroundColor: "var(--brand-background, #fafafa)" }}
    >
      {personality.showFloatingOrbs && <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={400} x="80%" y="20%" opacity={0.05} blur={100} />}
      {personality.showFloatingOrbs && <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={300} x="10%" y="80%" delay={5} opacity={0.04} blur={80} />}
      {personality.showDotGrid && <DotGrid opacity={0.02} spacing={40} />}
      {personality.showDecorativeSvgs && <GeometricPattern pattern="circles" opacity={0.03} color="var(--brand-primary, hsl(var(--primary)))" className="absolute inset-0 pointer-events-none hidden sm:block" />}
      
      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow, ease: themeMotion.easing }}
            className="text-center mb-20 sm:mb-24"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8 uppercase tracking-wider"
              style={{ 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.08)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              Why choose us
            </motion.span>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1]"
              style={{ color: "var(--brand-heading, var(--brand-text, #0f172a))", letterSpacing: "-0.03em" }}
            >{data.headline}</h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-0 font-light"
                style={{ color: "var(--brand-muted, #64748b)" }}
              >{data.subheadline}</p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "star"] || Star;
            const large = isLargeCard(index, items.length);
            const miniVisual = miniVisuals[index % miniVisuals.length];
            
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className={`group relative ${getBentoLayout(index, items.length)}`}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12), 0 12px 24px -8px rgba(0,0,0,0.08)",
                  }}
                />
                {(() => {
                  const cardInner = (
                    <div 
                      className="relative h-full rounded-3xl border overflow-hidden transition-all duration-500"
                      style={{
                        backgroundColor: "var(--brand-card-bg, var(--brand-surface, hsl(var(--card))))",
                        boxShadow: "var(--brand-card-shadow, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03))",
                        borderColor: "var(--brand-border, rgba(0,0,0,0.06))",
                      }}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.04) 0%, transparent 60%)`,
                        }}
                      />

                      <div className={`relative z-10 ${large ? 'p-10' : 'p-8'}`}>
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div 
                            className={`${large ? 'w-16 h-16' : 'w-14 h-14'} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                            style={{ 
                              background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.12) 0%, hsl(var(--brand-primary-hsl, var(--primary)) / 0.05) 100%)`,
                            }}
                          >
                            <IconComponent 
                              className={`${large ? 'w-8 h-8' : 'w-7 h-7'}`}
                              style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                            />
                          </div>
                          <div className={`${large ? 'w-16 h-16' : 'w-12 h-12'} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}>
                            {miniVisual("var(--brand-primary, hsl(var(--primary)))")}
                          </div>
                        </div>
                        
                        <h3 
                          className={`${large ? 'text-2xl' : 'text-xl'} font-bold mb-4 tracking-tight`}
                          style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))", letterSpacing: "-0.02em" }}
                        >{item.title}</h3>
                        <p 
                          className={`${large ? 'text-base' : 'text-[15px]'} leading-relaxed`}
                          style={{ color: "var(--brand-text-secondary, var(--brand-muted, hsl(var(--muted-foreground))))" }}
                        >{item.description}</p>

                        {large && (
                          <motion.div
                            className="mt-6 h-16 rounded-xl overflow-hidden"
                            style={{ background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.04)" }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                          >
                            <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="featureChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" style={{ stopColor: "var(--brand-primary, hsl(var(--primary)))", stopOpacity: 0.2 }} />
                                  <stop offset="100%" style={{ stopColor: "var(--brand-primary, hsl(var(--primary)))", stopOpacity: 0.02 }} />
                                </linearGradient>
                              </defs>
                              <motion.path d="M0,50 Q50,20 100,35 T200,15 T300,25" fill="none" stroke="var(--brand-primary, hsl(var(--primary)))" strokeWidth="2" strokeLinecap="round"
                                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.6 }} />
                              <path d="M0,50 Q50,20 100,35 T200,15 T300,25 L300,60 L0,60 Z" fill="url(#featureChartGrad)" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                  return personality.showHoverTilt ? (
                    <HoverTilt maxTilt={3} scale={1.01}>{cardInner}</HoverTilt>
                  ) : cardInner;
                })()}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
