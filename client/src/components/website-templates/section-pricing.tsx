import type { SectionContent } from "@shared/schema";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, ShineEffect } from "./visuals/floating-elements";

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

export default function SectionPricing({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as PricingData;
  const plans = data.plans || [];
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/30" />
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={400} x="20%" y="20%" opacity={0.06} blur={120} />
      <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={350} x="80%" y="80%" delay={3} opacity={0.05} blur={100} />

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
              <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" data-testid="text-pricing-subheadline"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: themeMotion.duration, delay: index * 0.1 }}
              data-testid={`card-pricing-plan-${index}`}
              className={`relative group ${plan.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}`}
              whileHover={!plan.highlighted ? { y: -6, transition: { duration: 0.3 } } : undefined}
            >
              {plan.highlighted && (
                <>
                  <motion.div 
                    className="absolute -inset-[2px] rounded-[2rem]"
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-accent, hsl(var(--primary))) 100%)`
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute -inset-4 rounded-[3rem] blur-2xl opacity-15"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} />
                </>
              )}
              
              <div 
                className={`relative h-full p-8 sm:p-10 rounded-3xl flex flex-col transition-all duration-500 ${
                  plan.highlighted ? "text-white shadow-2xl" : "border backdrop-blur-sm"
                }`}
                style={plan.highlighted ? {
                  background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                } : {
                  background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <motion.span 
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-gray-900 text-sm font-semibold shadow-lg"
                      initial={{ scale: 0, y: 10 }}
                      whileInView={{ scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </motion.span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/80" : ""}`}
                      style={!plan.highlighted ? { color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" } : {}}>
                      {plan.description}
                    </p>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <motion.span 
                      className="text-5xl sm:text-6xl font-bold tracking-tight"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                    >
                      {plan.price}
                    </motion.span>
                    {plan.period && (
                      <span className={`text-lg ${plan.highlighted ? "text-white/70" : ""}`}
                        style={!plan.highlighted ? { color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" } : {}}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, fi) => (
                      <motion.li 
                        key={fi} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + fi * 0.05 }}
                      >
                        <motion.div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.highlighted ? "bg-white/20" : ""
                          }`}
                          style={!plan.highlighted ? { backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" } : {}}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + fi * 0.05, type: "spring" }}
                        >
                          <Check className="w-4 h-4" style={!plan.highlighted ? { color: "var(--brand-primary, hsl(var(--primary)))" } : { color: "white" }} />
                        </motion.div>
                        <span className={plan.highlighted ? "text-white/90" : ""}
                          style={!plan.highlighted ? { color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" } : {}}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {plan.highlighted ? (
                  <ShineEffect>
                    <Button
                      asChild size="lg"
                      className="w-full text-base py-6 rounded-xl bg-white text-gray-900 shadow-lg"
                      data-testid={`button-pricing-cta-${index}`}
                    >
                      <a href={plan.ctaLink || "#contact"} className="flex items-center justify-center gap-2">
                        {plan.ctaText || "Get Started"}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </ShineEffect>
                ) : (
                  <Button
                    asChild size="lg"
                    className="w-full text-base py-6 rounded-xl shadow-lg"
                    style={{ backgroundColor: "var(--brand-primary, hsl(var(--primary)))", color: "white" }}
                    data-testid={`button-pricing-cta-${index}`}
                  >
                    <a href={plan.ctaLink || "#contact"} className="flex items-center justify-center gap-2">
                      {plan.ctaText || "Get Started"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
