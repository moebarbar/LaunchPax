import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, GradientMesh, DotGrid, ShineEffect } from "./visuals/floating-elements";
import { ChecklistPanel } from "./visuals/checklist-panel";

interface Benefit {
  title: string;
  description: string;
  highlights?: string[];
  image?: string;
}

interface BenefitsData {
  headline?: string;
  subheadline?: string;
  benefits?: Benefit[];
  ctaText?: string;
  ctaLink?: string;
}

export function SectionBenefits({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as BenefitsData;
  const benefits = data.benefits || [];
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-benefits">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={500} x="10%" y="20%" opacity={0.06} />
        <FloatingOrb size={400} x="80%" y="60%" opacity={0.04} delay={3} />
        <div style={{ opacity: 0.3 }}><GradientMesh /></div>
        <DotGrid opacity={0.02} />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-16 sm:mb-20"
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
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
        
        <div className="space-y-24">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: themeMotion.durationSlow, delay: index * 0.1 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 text-lg font-bold"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))))`,
                    color: "white",
                  }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.div>

                <h3 className="text-3xl sm:text-4xl font-bold mb-6"
                  style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                  {benefit.title}
                </h3>
                <p className="text-lg mb-8 leading-relaxed"
                  style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                  {benefit.description}
                </p>
                
                {benefit.highlights && benefit.highlights.length > 0 && (
                  <ul className="space-y-4">
                    {benefit.highlights.map((highlight, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))))`,
                          }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                          {highlight}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                {benefit.image ? (
                  <motion.div
                    className="relative rounded-2xl overflow-hidden shadow-2xl group"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={benefit.image} alt={benefit.title} className="w-full h-auto" />
                    <div className="absolute inset-0 opacity-10"
                      style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChecklistPanel
                      items={benefit.highlights?.map((h, i) => ({
                        title: h,
                        status: i < (benefit.highlights?.length || 0) - 1 ? "complete" as const : "active" as const,
                      })) || [
                        { title: "Strategy aligned", status: "complete" as const },
                        { title: "Implementation ready", status: "complete" as const },
                        { title: "Growth tracking", status: "active" as const },
                      ]}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {data.ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration, delay: 0.3 }}
            className="mt-20 text-center"
          >
            <ShineEffect>
              <Button
                asChild size="lg"
                className="rounded-xl"
                style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                data-testid="button-benefits-cta"
              >
                <a href={data.ctaLink || "#contact"}>
                  {data.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </ShineEffect>
          </motion.div>
        )}
      </div>
    </section>
  );
}
