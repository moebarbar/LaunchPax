import type { SectionContent } from "@shared/schema";
import { Check } from "lucide-react";

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
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl border p-8 relative ${
                plan.highlighted 
                  ? "bg-primary text-primary-foreground border-primary scale-105 shadow-xl" 
                  : "bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-foreground text-primary px-4 py-1 rounded-full text-sm font-medium">
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
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={`${plan.highlighted ? "opacity-80" : "text-muted-foreground"}`}>
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "" : "text-primary"}`} />
                      <span className={`text-sm ${plan.highlighted ? "opacity-90" : "text-muted-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={plan.ctaLink || "#contact"}
                className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-primary-foreground text-primary hover-elevate"
                    : "bg-primary text-primary-foreground hover-elevate"
                }`}
              >
                {plan.ctaText || "Get Started"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
