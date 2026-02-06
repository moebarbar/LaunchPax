import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, DotGrid } from "./visuals/floating-elements";
import { ProgressRing } from "./visuals/metrics-display";

interface CaseStudy {
  title: string;
  client?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  metrics?: { label: string; value: string }[];
  image?: string;
  testimonial?: { quote: string; author: string; role: string };
}

interface CaseStudiesData {
  headline?: string;
  subheadline?: string;
  cases?: CaseStudy[];
}

export function SectionCaseStudies({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as CaseStudiesData;
  const cases = data.cases || [];
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-case-studies">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={450} x="90%" y="15%" opacity={0.04} />
        <FloatingOrb size={300} x="5%" y="70%" opacity={0.03} delay={5} />
        <DotGrid opacity={0.015} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-16"
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
        
        <div className="space-y-20">
          {cases.map((caseStudy, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: themeMotion.durationSlow, delay: index * 0.1 }}
              className="rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm"
              style={{
                backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                border: "1px solid var(--brand-border, hsl(var(--border)))",
              }}
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {caseStudy.image ? (
                  <div className="relative h-64 lg:h-auto overflow-hidden group">
                    <motion.img
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    {caseStudy.industry && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                        style={{
                          backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                          color: "white",
                        }}>
                        {caseStudy.industry}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-64 lg:h-auto flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(var(--brand-primary-hsl, var(--primary)) / 0.1) 0%,
                        hsl(var(--brand-primary-hsl, var(--primary)) / 0.03) 100%)`,
                    }}>
                    <FloatingOrb size={200} x="50%" y="50%" opacity={0.08} />
                    {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                      <div className="relative z-10 grid grid-cols-2 gap-4 p-8">
                        {caseStudy.metrics.slice(0, 4).map((metric, i) => {
                          const numVal = parseInt(metric.value.replace(/[^0-9]/g, '')) || 50;
                          return (
                            <div key={i} className="text-center">
                              <ProgressRing value={Math.min(numVal, 100)} size={60} strokeWidth={5} label={metric.label} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {caseStudy.industry && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                          color: "white",
                        }}>
                        {caseStudy.industry}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                    {caseStudy.title}
                  </h3>
                  
                  {caseStudy.client && (
                    <p className="text-lg font-medium mb-4"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                      {caseStudy.client}
                    </p>
                  )}
                  
                  {caseStudy.challenge && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        The Challenge
                      </h4>
                      <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        {caseStudy.challenge}
                      </p>
                    </div>
                  )}
                  
                  {caseStudy.solution && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        Our Solution
                      </h4>
                      <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        {caseStudy.solution}
                      </p>
                    </div>
                  )}
                  
                  {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      {caseStudy.metrics.map((metric, i) => (
                        <motion.div
                          key={i}
                          className="text-center p-4 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.08), hsl(var(--brand-primary-hsl, var(--primary)) / 0.02))`,
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <div className="text-2xl sm:text-3xl font-bold"
                            style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                            {metric.value}
                          </div>
                          <div className="text-sm mt-1"
                            style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                            {metric.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {caseStudy.testimonial && (
                    <blockquote className="pl-6 italic mb-6 relative"
                      style={{
                        color: "var(--brand-muted-text, hsl(var(--muted-foreground)))",
                      }}>
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        style={{ background: `linear-gradient(to bottom, var(--brand-primary, hsl(var(--primary))), transparent)` }} />
                      "{caseStudy.testimonial.quote}"
                      <footer className="mt-2 not-italic">
                        <strong style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                          {caseStudy.testimonial.author}
                        </strong>
                        {caseStudy.testimonial.role && (
                          <span className="text-sm"> - {caseStudy.testimonial.role}</span>
                        )}
                      </footer>
                    </blockquote>
                  )}
                  
                  <Button
                    variant="ghost" className="self-start group"
                    data-testid={`button-case-study-${index}`}
                  >
                    View Full Case Study
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
