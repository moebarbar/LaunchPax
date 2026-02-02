import { motion } from "framer-motion";
import { Shield, Award, Clock, CheckCircle, Star, Users, Zap, Lock } from "lucide-react";
import type { SectionContent } from "@shared/schema";

interface TrustSignal {
  icon?: string;
  title: string;
  description?: string;
}

interface TrustSignalsData {
  headline?: string;
  subheadline?: string;
  signals?: TrustSignal[];
  logos?: { name: string; image?: string }[];
  certifications?: string[];
  stats?: { value: string; label: string }[];
}

const iconMap: Record<string, typeof Shield> = {
  shield: Shield,
  award: Award,
  clock: Clock,
  check: CheckCircle,
  star: Star,
  users: Users,
  zap: Zap,
  lock: Lock,
};

export function SectionTrustSignals({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as TrustSignalsData;
  const signals = data.signals || [];
  const logos = data.logos || [];
  const certifications = data.certifications || [];
  const stats = data.stats || [];
  
  return (
    <section className="py-20 sm:py-24 bg-muted/20" data-testid="section-trust-signals">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {(data.headline || data.subheadline) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {data.headline && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {data.headline}
              </h2>
            )}
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}
        
        {signals.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {signals.map((signal, index) => {
              const Icon = iconMap[signal.icon || "check"] || CheckCircle;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{signal.title}</h3>
                    {signal.description && (
                      <p className="text-sm text-muted-foreground">{signal.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 py-8 border-y border-border"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-4xl sm:text-5xl font-bold mb-2"
                  style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}
        
        {logos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className="h-8 sm:h-10 opacity-50 grayscale transition-all duration-300"
                >
                  {logo.image ? (
                    <img
                      src={logo.image}
                      alt={logo.name}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-muted-foreground">
                      {logo.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {certifications.map((cert, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm"
              >
                <CheckCircle className="w-4 h-4" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                {cert}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
