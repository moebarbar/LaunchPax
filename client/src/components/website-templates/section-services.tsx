import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users, Clock, Check, Award, Globe, Briefcase, Settings, Wrench, Lightbulb } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
  price?: string;
  features?: string[];
}

interface ServicesData {
  headline?: string;
  subheadline?: string;
  items?: ServiceItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  target: Target,
  users: Users,
  clock: Clock,
  check: Check,
  award: Award,
  globe: Globe,
  briefcase: Briefcase,
  settings: Settings,
  wrench: Wrench,
  lightbulb: Lightbulb,
};

export default function SectionServices({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as ServicesData;
  const items = data.items || [];
  
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-services-headline">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-services-subheadline">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "star"] || Briefcase;
            return (
              <div key={index} className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 group" data-testid={`card-service-${index}`}>
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-200"
                  style={{ 
                    backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)"
                  }}
                >
                  <IconComponent 
                    className="w-7 h-7" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                {item.price && (
                  <p 
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  >
                    {item.price}
                  </p>
                )}
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-2">
                    {item.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check 
                          className="w-4 h-4 flex-shrink-0" 
                          style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
