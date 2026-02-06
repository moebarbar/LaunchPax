import type { SectionContent } from "@shared/schema";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useThemeMotion } from "./motion-wrapper";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

interface PricingData {
  headline?: string;
  subheadline?: string;
  plans?: PricingPlan[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

export default function SectionPricing({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as PricingData;
  const plans = data.plans || [];
  const themeMotion = useThemeMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: themeMotion.duration, ease: themeMotion.easing }
    }
  };
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/30" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10" 
          style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} 
        />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-10" 
          style={{ background: "var(--brand-accent, hsl(var(--primary)))" }} 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              Pricing
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-pricing-headline">
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-pricing-subheadline">
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              data-testid={`card-pricing-plan-${index}`}
              className={`relative group ${plan.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {plan.highlighted && (
                <div 
                  className="absolute -inset-[2px] rounded-[2rem] opacity-50 blur-sm"
                  style={{
                    background: `linear-gradient(135deg, 
                      var(--brand-primary, hsl(var(--primary))) 0%, 
                      var(--brand-accent, hsl(var(--primary))) 100%)`
                  }}
                />
              )}
              
              <div 
                className={`relative h-full p-8 sm:p-10 rounded-3xl flex flex-col transition-all duration-500 ${
                  plan.highlighted 
                    ? "text-white shadow-2xl" 
                    : "border backdrop-blur-sm group-hover:shadow-xl group-hover:-translate-y-1"
                }`}
                style={plan.highlighted ? {
                  background: `linear-gradient(135deg, 
                    var(--brand-primary, hsl(var(--primary))) 0%, 
                    var(--brand-secondary, hsl(var(--primary))) 100%)`
                } : {
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-gray-900 text-sm font-semibold shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl sm:text-6xl font-bold tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className={`text-lg ${plan.highlighted ? "text-white/70" : "text-muted-foreground"}`}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.highlighted ? "bg-white/20" : ""
                          }`}
                          style={!plan.highlighted ? { 
                            backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)"
                          } : {}}
                        >
                          <Check 
                            className="w-4 h-4" 
                            style={!plan.highlighted ? { 
                              color: "var(--brand-primary, hsl(var(--primary)))" 
                            } : { color: "white" }}
                          />
                        </div>
                        <span className={plan.highlighted ? "text-white/90" : "text-muted-foreground"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  asChild
                  size="lg"
                  className={`w-full text-base py-6 rounded-xl transition-all duration-300 group/btn ${
                    plan.highlighted
                      ? "bg-white text-gray-900 hover:bg-white/90 shadow-lg"
                      : "shadow-lg hover:shadow-xl"
                  }`}
                  style={!plan.highlighted ? {
                    backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                    borderColor: "var(--brand-primary, hsl(var(--primary)))",
                    color: "white"
                  } : {}}
                  data-testid={`button-pricing-cta-${index}`}
                >
                  <a href={plan.ctaLink || "#contact"} className="flex items-center justify-center gap-2">
                    {plan.ctaText || "Get Started"}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
