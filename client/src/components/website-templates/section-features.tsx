import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users } from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesData {
  headline?: string;
  subheadline?: string;
  items?: FeatureItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  target: Target,
  users: Users,
};

export default function SectionFeatures({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as FeaturesData;
  const items = data.items || [];
  
  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "star"] || Star;
            return (
              <div key={index} className="p-6 rounded-lg bg-background border hover-elevate transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
