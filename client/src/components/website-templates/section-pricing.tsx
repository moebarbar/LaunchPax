import type { SectionContent } from "@shared/schema";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-headline">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-pricing-subheadline">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              data-testid={`card-pricing-plan-${index}`}
              className={`rounded-2xl p-8 relative flex flex-col transition-all duration-300 ${
                plan.highlighted 
                  ? "text-white shadow-2xl scale-105 z-10" 
                  : "bg-card border shadow-sm hover:shadow-md"
              }`}
              style={plan.highlighted ? {
                background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
              } : {}}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                {plan.description && (
                  <p className={`text-sm mb-4 ${plan.highlighted ? "opacity-90" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-lg ${plan.highlighted ? "opacity-80" : "text-muted-foreground"}`}>
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div 
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? "bg-white/20" : ""
                        }`}
                        style={!plan.highlighted ? { backgroundColor: "var(--brand-primary, hsl(var(--primary)))", opacity: 0.1 } : {}}
                      >
                        <Check 
                          className="w-3.5 h-3.5 flex-shrink-0" 
                          style={!plan.highlighted ? { color: "var(--brand-primary, hsl(var(--primary)))" } : {}}
                        />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? "opacity-90" : "text-muted-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                asChild
                size="lg"
                variant={plan.highlighted ? "secondary" : "default"}
                className={`w-full ${
                  plan.highlighted
                    ? "bg-white text-gray-900"
                    : ""
                }`}
                style={!plan.highlighted ? {
                  backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                  borderColor: "var(--brand-primary, hsl(var(--primary)))"
                } : {}}
                data-testid={`button-pricing-cta-${index}`}
              >
                <a href={plan.ctaLink || "#contact"}>
                  {plan.ctaText || "Get Started"}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
