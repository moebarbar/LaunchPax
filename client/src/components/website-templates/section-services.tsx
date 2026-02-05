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
      className="py-28 sm:py-36 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="absolute inset-0 opacity-[0.4]" style={{
        background: `linear-gradient(180deg, var(--brand-background, #f8fafc) 0%, transparent 30%, transparent 70%, var(--brand-background, #f8fafc) 100%)`,
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
              Our Services
            </motion.span>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1]" 
              style={{ letterSpacing: "-0.03em", color: "#0f172a" }}
              data-testid="text-services-headline"
            >
              {data.headline}
            </h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light" 
                style={{ color: "#64748b" }}
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
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon?.toLowerCase() || "briefcase"] || Briefcase;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
                data-testid={`card-service-${index}`}
              >
                <div 
                  className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 12px 24px -12px rgba(0,0,0,0.1)",
                  }}
                />
                <div 
                  className="relative h-full p-10 sm:p-12 rounded-[2rem] border transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div 
                    className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, var(--brand-primary, #3b82f6) 0%, transparent 70%)`,
                      opacity: 0.06,
                    }}
                  />
                  
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3"
                    style={{ 
                      background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.12) 0%, hsl(var(--brand-primary-hsl, var(--primary)) / 0.06) 100%)`,
                    }}
                  >
                    <IconComponent 
                      className="w-8 h-8"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    />
                  </div>

                  <h3 
                    className="text-2xl font-bold mb-4 tracking-tight"
                    style={{ color: "#0f172a", letterSpacing: "-0.02em" }}
                  >{item.title}</h3>
                  <p 
                    className="mb-8 leading-relaxed text-[15px]"
                    style={{ color: "#64748b" }}
                  >{item.description}</p>

                  {item.price && (
                    <p 
                      className="text-3xl font-bold mb-8"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    >
                      {item.price}
                    </p>
                  )}

                  {item.features && item.features.length > 0 && (
                    <ul className="space-y-4 mb-10">
                      {item.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className="flex items-center gap-3 text-[15px]"
                          style={{ color: "#475569" }}
                        >
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, hsl(var(--brand-primary-hsl, var(--primary)) / 0.08) 100%)`,
                            }}
                          >
                            <Check 
                              className="w-3.5 h-3.5" 
                              style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                            />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    asChild
                    variant="ghost"
                    className="p-0 h-auto font-semibold group/link"
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  >
                    <a href="#contact" className="flex items-center gap-2">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform duration-300" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
