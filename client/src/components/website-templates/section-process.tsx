import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, DotGrid } from "./visuals/floating-elements";
import { getIcon } from "./icon-map";

interface ProcessData {
  headline?: string;
  subheadline?: string;
  steps?: {
    number: string | number;
    title: string;
    description: string;
    icon?: string;
  }[];
}

export function SectionProcess({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as ProcessData;
  const steps = data.steps || [];
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-process">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={400} x="80%" y="30%" opacity={0.05} blur={100} />
      <DotGrid opacity={0.015} spacing={50} />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ 
              backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
              color: "var(--brand-primary, hsl(var(--primary)))"
            }}
          >
            How it Works
          </motion.span>
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}>
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="text-lg sm:text-xl max-w-3xl mx-auto"
              style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2"
            style={{ background: `linear-gradient(to bottom, transparent, var(--brand-primary, hsl(var(--primary))), transparent)`, opacity: 0.2 }} />
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const StepIcon = step.icon ? getIcon(step.icon, CircleDot) : null;
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: themeMotion.duration, delay: index * 0.15 }}
                className={`relative lg:flex lg:items-center lg:gap-12 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                    style={{ 
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`,
                      boxShadow: `0 10px 30px -5px var(--brand-primary, hsl(var(--primary)))`
                    }}
                    whileInView={{ scale: [0, 1.15, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.15, type: "spring", stiffness: 300 }}
                  >
                    {StepIcon ? <StepIcon className="w-7 h-7" /> : (step.number || index + 1)}
                  </motion.div>
                </div>
                
                <div className={`lg:w-[calc(50%-4rem)] ${index % 2 === 0 ? "lg:text-right lg:pr-8" : "lg:text-left lg:pl-8"}`}>
                  <motion.div 
                    className="rounded-2xl border p-8 shadow-sm transition-all duration-300"
                    style={{
                      backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                      borderColor: "var(--brand-border, hsl(var(--border)))",
                    }}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  >
                    <div className="lg:hidden flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)` }}
                      >
                        {StepIcon ? <StepIcon className="w-5 h-5" /> : (step.number || index + 1)}
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}>{step.title}</h3>
                    </div>
                    
                    <h3 className="hidden lg:block text-2xl font-bold mb-4" style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}>{step.title}</h3>
                    <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }} className="leading-relaxed">{step.description}</p>

                    <motion.div
                      className="mt-4 h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.15, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="hidden lg:block lg:w-[calc(50%-4rem)]" />
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
