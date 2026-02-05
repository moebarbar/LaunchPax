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
    if (total === 4) return "lg:col-span-1";
    if (total === 5) return index < 2 ? "lg:col-span-1" : "lg:col-span-1";
    if (index === 0) return "lg:col-span-2 lg:row-span-2";
    if (index === 3) return "lg:col-span-2";
    return "lg:col-span-1";
  };

  const getCardStyle = (index: number, total: number) => total > 5 && index === 0;
  
  return (
    <section 
      className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden" 
      style={{ backgroundColor: "var(--brand-background, #fafafa)" }}
    >
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--brand-text, #000) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20 sm:mb-24"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8 uppercase tracking-wider"
              style={{ 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.08)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              Why choose us
            </motion.span>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1]"
              style={{ 
                color: "var(--brand-heading, var(--brand-text, #0f172a))",
                letterSpacing: "-0.03em",
              }}
            >{data.headline}</h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-0 font-light"
                style={{ color: "var(--brand-muted, #64748b)" }}
              >{data.subheadline}</p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "star"] || Star;
            const isLarge = getCardStyle(index, items.length);
            
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group relative rounded-3xl transition-all duration-500 ${getBentoSize(index, items.length)}`}
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                }}
              >
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12), 0 8px 20px -8px rgba(0,0,0,0.08)",
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-3xl border transition-colors duration-300"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                />
                <div className={`relative z-10 ${isLarge ? 'p-10' : 'p-8'}`}>
                  <div 
                    className={`${isLarge ? 'w-16 h-16' : 'w-14 h-14'} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ 
                      background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.1) 0%, hsl(var(--brand-primary-hsl, var(--primary)) / 0.05) 100%)`,
                    }}
                  >
                    <IconComponent 
                      className={`${isLarge ? 'w-8 h-8' : 'w-7 h-7'}`}
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    />
                  </div>
                  
                  <h3 
                    className={`${isLarge ? 'text-2xl' : 'text-xl'} font-bold mb-4 tracking-tight`}
                    style={{ 
                      color: "#0f172a",
                      letterSpacing: "-0.02em",
                    }}
                  >{item.title}</h3>
                  <p 
                    className={`${isLarge ? 'text-base' : 'text-[15px]'} leading-relaxed`}
                    style={{ color: "#64748b" }}
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
