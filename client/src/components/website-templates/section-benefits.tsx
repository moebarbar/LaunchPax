import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@shared/schema";

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
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-benefits">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, var(--brand-primary, hsl(var(--primary))) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 80%, var(--brand-secondary, hsl(var(--primary))) 0%, transparent 50%)`
          }}
        />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
        
        <div className="space-y-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <h3 className="text-3xl sm:text-4xl font-bold mb-6">{benefit.title}</h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {benefit.description}
                </p>
                
                {benefit.highlights && benefit.highlights.length > 0 && (
                  <ul className="space-y-4">
                    {benefit.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                        >
                          <Check
                            className="w-4 h-4"
                            style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                          />
                        </div>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                {benefit.image ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-auto"
                    />
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-video rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(var(--brand-primary-hsl, var(--primary)) / 0.1) 0%, 
                        hsl(var(--brand-secondary-hsl, var(--primary)) / 0.1) 100%)`
                    }}
                  >
                    <div
                      className="text-8xl font-bold opacity-20"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    >
                      {index + 1}
                    </div>
                  </div>
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
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl"
              style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
              data-testid="button-benefits-cta"
            >
              <a href={data.ctaLink || "#contact"}>
                {data.ctaText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
