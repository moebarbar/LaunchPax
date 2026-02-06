import { motion } from "framer-motion";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";

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
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-16 sm:mb-20"
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20 transform -translate-x-1/2" />
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
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
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                  >
                    {step.number || index + 1}
                  </div>
                </div>
                
                <div className={`lg:w-[calc(50%-4rem)] ${index % 2 === 0 ? "lg:text-right lg:pr-8" : "lg:text-left lg:pl-8"}`}>
                  <div className="themed-card bg-card border border-border rounded-2xl p-8 shadow-lg hover-elevate">
                    <div className="lg:hidden flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                      >
                        {step.number || index + 1}
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    
                    <h3 className="hidden lg:block text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                <div className="hidden lg:block lg:w-[calc(50%-4rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
