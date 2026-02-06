import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users, Clock, Check, Award, Globe, Briefcase, Settings, Wrench, Lightbulb, TrendingUp, Rocket, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, GridLines, AbstractBlob, GlowLine } from "./visuals";
import { useDesignPersonality } from "./design-personality";

interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
  price?: string;
  features?: string[];
}

interface ServicesData {
  headline?: string;
  subheadline?: string;
  items?: ServiceItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  star: Star, shield: Shield, zap: Zap, heart: Heart, target: Target, users: Users,
  clock: Clock, check: Check, award: Award, globe: Globe, briefcase: Briefcase,
  settings: Settings, wrench: Wrench, lightbulb: Lightbulb, trending: TrendingUp,
  rocket: Rocket, lock: Lock,
};

export default function SectionServices({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as ServicesData;
  const items = data.items || [];
  const themeMotion = useThemeMotion();
  const personality = useDesignPersonality();
  
  return (
    <section 
      className="py-28 sm:py-36 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}
    >
      {personality.showFloatingOrbs && <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={500} x="90%" y="30%" opacity={0.06} blur={120} />}
      {personality.showFloatingOrbs && <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={300} x="5%" y="70%" delay={4} opacity={0.04} blur={80} />}
      {personality.showDotGrid && <GridLines opacity={0.02} spacing={80} />}
      
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
              Our Services
            </motion.span>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1]" 
              style={{ letterSpacing: "-0.03em", color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}
              data-testid="text-services-headline"
            >
              {data.headline}
            </h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light" 
                style={{ color: "var(--brand-text-secondary, var(--brand-muted, hsl(var(--muted-foreground))))" }}
                data-testid="text-services-subheadline"
              >
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="space-y-8">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "briefcase"] || Briefcase;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: themeMotion.duration, delay: index * 0.1 }}
                  className="group"
                  data-testid={`card-service-${index}`}
                >
                  <div 
                    className="relative rounded-[2rem] border overflow-hidden transition-all duration-500"
                    style={{
                      backgroundColor: "var(--brand-card-bg, var(--brand-surface, hsl(var(--card))))",
                      borderColor: "var(--brand-border, rgba(0,0,0,0.06))",
                      boxShadow: "var(--brand-card-shadow, 0 1px 3px rgba(0,0,0,0.04))",
                    }}
                  >
                    <div className={`grid md:grid-cols-5 gap-0 ${!isEven ? 'md:direction-rtl' : ''}`}>
                      <div className={`md:col-span-3 p-8 sm:p-10 lg:p-12 ${!isEven ? 'md:order-2' : ''}`}>
                        <div className="flex items-center gap-4 mb-6">
                          <motion.div
                            className="w-3 h-3 rounded-full"
                            style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          />
                          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <h3 
                          className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight"
                          style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))", letterSpacing: "-0.02em" }}
                        >{item.title}</h3>
                        <p 
                          className="mb-6 leading-relaxed text-base"
                          style={{ color: "var(--brand-text-secondary, var(--brand-muted, hsl(var(--muted-foreground))))" }}
                        >{item.description}</p>

                        {item.price && (
                          <p className="text-3xl font-bold mb-6" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                            {item.price}
                          </p>
                        )}

                        {item.features && item.features.length > 0 && (
                          <ul className="space-y-3 mb-8">
                            {item.features.map((feature, fi) => (
                              <motion.li 
                                key={fi} 
                                className="flex items-center gap-3 text-[15px]"
                                style={{ color: "var(--brand-text-secondary, var(--brand-muted, hsl(var(--muted-foreground))))" }}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + fi * 0.06 }}
                              >
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}>
                                  <Check className="w-3 h-3" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                                </div>
                                {feature}
                              </motion.li>
                            ))}
                          </ul>
                        )}

                        <Button
                          asChild variant="ghost" className="p-0 h-auto font-semibold group/link"
                          style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                        >
                          <a href="#contact" className="flex items-center gap-2">
                            Learn more
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform duration-300" />
                          </a>
                        </Button>
                      </div>

                      <div className={`md:col-span-2 relative ${!isEven ? 'md:order-1' : ''}`}>
                        {isEven && personality.showDecorativeSvgs && (
                          <AbstractBlob
                            variant={((index % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                            color="var(--brand-primary, hsl(var(--primary)))"
                            size={200}
                            opacity={0.06}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          />
                        )}
                        <div 
                          className="h-full min-h-[200px] md:min-h-0 flex items-center justify-center p-8"
                          style={{ background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.04)" }}
                        >
                          <motion.div
                            className="relative w-24 h-24"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          >
                            <div className="absolute inset-0 rounded-3xl" style={{
                              background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, hsl(var(--brand-primary-hsl, var(--primary)) / 0.05) 100%)`,
                            }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <IconComponent className="w-12 h-12" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                            </div>
                            <motion.div
                              className="absolute -inset-4 rounded-[2rem] border"
                              style={{ borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute -inset-8 rounded-[2.5rem] border border-dashed"
                              style={{ borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.06)" }}
                              animate={{ rotate: [360, 0] }}
                              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {index < items.length - 1 && personality.showGlowLines && (
                  <div className="py-2">
                    <GlowLine animated={false} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
