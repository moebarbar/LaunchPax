import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";

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
    <section className="py-24 sm:py-32 bg-muted/30" data-testid="section-case-studies">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-16"
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
        
        <div className="space-y-16">
          {cases.map((caseStudy, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: themeMotion.durationSlow, delay: index * 0.1 }}
              className="themed-card bg-card border border-border rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {caseStudy.image && (
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>
                )}
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {caseStudy.industry && (
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {caseStudy.industry}
                    </span>
                  )}
                  
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    {caseStudy.title}
                  </h3>
                  
                  {caseStudy.client && (
                    <p className="text-lg font-medium mb-4" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                      {caseStudy.client}
                    </p>
                  )}
                  
                  {caseStudy.challenge && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">The Challenge</h4>
                      <p className="text-muted-foreground">{caseStudy.challenge}</p>
                    </div>
                  )}
                  
                  {caseStudy.solution && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Our Solution</h4>
                      <p className="text-muted-foreground">{caseStudy.solution}</p>
                    </div>
                  )}
                  
                  {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      {caseStudy.metrics.map((metric, i) => (
                        <div key={i} className="text-center p-4 bg-muted/50 rounded-xl">
                          <div
                            className="text-2xl sm:text-3xl font-bold"
                            style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                          >
                            {metric.value}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {caseStudy.testimonial && (
                    <blockquote className="border-l-4 pl-4 italic text-muted-foreground mb-6" style={{ borderColor: "var(--brand-primary, hsl(var(--primary)))" }}>
                      "{caseStudy.testimonial.quote}"
                      <footer className="mt-2 not-italic">
                        <strong>{caseStudy.testimonial.author}</strong>
                        {caseStudy.testimonial.role && <span className="text-sm"> — {caseStudy.testimonial.role}</span>}
                      </footer>
                    </blockquote>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="self-start"
                    data-testid={`button-case-study-${index}`}
                  >
                    View Full Case Study
                    <ArrowRight className="ml-2 w-4 h-4" />
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
