import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, GradientMesh, DotGrid } from "./visuals/floating-elements";
import { ProgressRing } from "./visuals/metrics-display";
import { getIcon } from "./icon-map";

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

export function SectionTrustSignals({ section }: { section: SectionContent }) {
  const themeMotion = useThemeMotion();
  const data = (section.data || {}) as TrustSignalsData;
  const signals = data.signals || [];
  const logos = data.logos || [];
  const certifications = data.certifications || [];
  const stats = data.stats || [];
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-trust-signals">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={350} x="85%" y="20%" opacity={0.04} delay={1} />
        <div style={{ opacity: 0.2 }}><GradientMesh /></div>
        <DotGrid opacity={0.015} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {(data.headline || data.subheadline) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
            className="text-center mb-16"
          >
            {data.headline && (
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
                style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                {data.headline}
              </h2>
            )}
            {data.subheadline && (
              <p className="text-lg max-w-2xl mx-auto"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}
        
        {signals.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {signals.map((signal, index) => {
              const Icon = getIcon(signal.icon, CheckCircle);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: themeMotion.duration, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-xl backdrop-blur-sm"
                  style={{
                    backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                    border: "1px solid var(--brand-border, hsl(var(--border)))",
                  }}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.15), hsl(var(--brand-primary-hsl, var(--primary)) / 0.05))`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1"
                      style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                      {signal.title}
                    </h3>
                    {signal.description && (
                      <p className="text-sm" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        {signal.description}
                      </p>
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
            transition={{ duration: themeMotion.duration, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 py-10 rounded-2xl backdrop-blur-sm"
            style={{
              backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
              border: "1px solid var(--brand-border, hsl(var(--border)))",
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="text-4xl sm:text-5xl font-bold mb-2"
                  style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {logos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration, delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-center text-sm uppercase tracking-[0.2em] mb-8"
              style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {logos.map((logo, index) => (
                <motion.div
                  key={index}
                  className="h-8 sm:h-10 opacity-40 grayscale transition-all duration-500"
                  whileHover={{ opacity: 0.8, filter: "grayscale(0)" }}
                >
                  {logo.image ? (
                    <img src={logo.image} alt={logo.name} className="h-full w-auto object-contain" />
                  ) : (
                    <span className="text-lg font-semibold"
                      style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                      {logo.name}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {certifications.map((cert, index) => (
              <motion.span
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                style={{
                  backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                  border: "1px solid var(--brand-border, hsl(var(--border)))",
                  color: "var(--brand-text, hsl(var(--foreground)))",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="w-4 h-4" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                {cert}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
