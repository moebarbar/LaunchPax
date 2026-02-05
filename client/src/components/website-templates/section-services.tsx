import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users, Clock, Check, Award, Globe, Briefcase, Settings, Wrench, Lightbulb, TrendingUp, Rocket, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
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
  trending: TrendingUp,
  rocket: Rocket,
  lock: Lock,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function SectionServices({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as ServicesData;
  const items = data.items || [];
  
  return (
    <section 
      className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-background, #f8fafc)" }}
    >
      
      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
              Our Services
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-services-headline">
              {data.headline}
            </h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" 
                style={{ color: "var(--brand-muted, #475569)" }}
                data-testid="text-services-subheadline"
              >
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "briefcase"] || Briefcase;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group relative"
                data-testid={`card-service-${index}`}
              >
                <div 
                  className="relative h-full p-8 sm:p-10 rounded-3xl border transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--brand-card-bg, #ffffff)",
                    borderColor: "var(--brand-border, #e2e8f0)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: "var(--brand-surface, #ffffff)",
                      border: "1px solid var(--brand-border, #e2e8f0)"
                    }}
                  >
                    <IconComponent 
                      className="w-8 h-8"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    />
                  </div>

                  <h3 
                    className="text-xl sm:text-2xl font-semibold mb-3 tracking-tight"
                    style={{ color: "var(--brand-heading, var(--brand-text, #0f172a))" }}
                  >{item.title}</h3>
                  <p 
                    className="mb-6 leading-relaxed"
                    style={{ color: "var(--brand-muted, #475569)" }}
                  >{item.description}</p>

                  {item.price && (
                    <p 
                      className="text-2xl sm:text-3xl font-bold mb-6"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    >
                      {item.price}
                    </p>
                  )}

                  {item.features && item.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {item.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className="flex items-center gap-3 text-sm"
                          style={{ color: "var(--brand-muted, #475569)" }}
                        >
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: "var(--brand-surface, #ffffff)"
                            }}
                          >
                            <Check 
                              className="w-3 h-3" 
                              style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                            />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center gap-2 text-sm font-medium group/link cursor-pointer"
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
