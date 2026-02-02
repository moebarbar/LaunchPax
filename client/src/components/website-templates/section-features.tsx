import type { SectionContent } from "@shared/schema";
import { Star, Shield, Zap, Heart, Target, Users, Clock, Check, Award, Globe, Briefcase, Settings, Wrench, Lightbulb } from "lucide-react";
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
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function SectionFeatures({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as FeaturesData;
  const items = data.items || [];
  
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">{data.subheadline}</p>
            )}
          </motion.div>
        )}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "star"] || Star;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="p-6 sm:p-8 rounded-xl bg-background border shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div 
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-200"
                  style={{ 
                    backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)"
                  }}
                >
                  <IconComponent 
                    className="w-6 sm:w-7 h-6 sm:h-7" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
