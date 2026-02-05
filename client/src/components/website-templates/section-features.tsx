import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users, Clock, Check, Award, Globe, Briefcase, Settings, Wrench, Lightbulb, TrendingUp, Rocket, Lock, Cpu, BarChart3, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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
  cpu: Cpu,
  chart: BarChart3,
  message: MessageSquare,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
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

export default function SectionFeatures({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as FeaturesData;
  const items = data.items || [];
  
  const getBentoSize = (index: number, total: number) => {
    if (total <= 3) return "col-span-1";
    if (total === 4) {
      return index < 2 ? "lg:col-span-1" : "lg:col-span-1";
    }
    if (total === 5) {
      return index < 2 ? "lg:col-span-1" : "lg:col-span-1";
    }
    if (index === 0) return "lg:col-span-2 lg:row-span-2";
    if (index === 3) return "lg:col-span-2";
    return "lg:col-span-1";
  };

  const getCardStyle = (index: number, total: number) => {
    const isLarge = total > 5 && index === 0;
    return isLarge;
  };
  
  return (
    <section 
      className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden" 
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
              Why choose us
            </motion.span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              style={{ color: "var(--brand-heading, var(--brand-text, #0f172a))" }}
            >{data.headline}</h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
                style={{ color: "var(--brand-muted, #475569)" }}
              >{data.subheadline}</p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "star"] || Star;
            const isLarge = getCardStyle(index, items.length);
            
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className={`group relative p-6 sm:p-8 rounded-2xl border transition-all duration-500 ${getBentoSize(index, items.length)}`}
                style={{
                  backgroundColor: "var(--brand-card-bg, var(--brand-surface, #ffffff))",
                  borderColor: "var(--brand-border, #e2e8f0)"
                }}
              >
                <div className="relative z-10">
                  <div 
                    className={`${isLarge ? 'w-16 h-16' : 'w-12 h-12'} rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105`}
                    style={{ 
                      backgroundColor: "var(--brand-surface, #ffffff)",
                      border: "1px solid var(--brand-border, #e2e8f0)"
                    }}
                  >
                    <IconComponent 
                      className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'}`}
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    />
                  </div>
                  
                  <h3 
                    className={`${isLarge ? 'text-2xl' : 'text-xl'} font-semibold mb-3 tracking-tight`}
                    style={{ color: "var(--brand-heading, var(--brand-text, #0f172a))" }}
                  >{item.title}</h3>
                  <p 
                    className={`${isLarge ? 'text-base' : 'text-sm'} leading-relaxed`}
                    style={{ color: "var(--brand-muted, #475569)" }}
                  >{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
