import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, GradientMesh, DotGrid, ShineEffect } from "./visuals/floating-elements";

interface ComparisonItem {
  feature: string;
  us: boolean | string;
  competitors?: (boolean | string)[];
}

interface ComparisonData {
  headline?: string;
  subheadline?: string;
  ourName?: string;
  competitorNames?: string[];
  items?: ComparisonItem[];
  ctaText?: string;
  ctaLink?: string;
}

export function SectionComparison({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as ComparisonData;
  const items = data.items || [];
  const competitorNames = data.competitorNames || ["Others"];
  const themeMotion = useThemeMotion();
  
  const renderValue = (value: boolean | string | undefined, isUs: boolean = false) => {
    if (typeof value === "boolean") {
      if (value) {
        return (
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
            style={isUs ? {
              background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))))`,
            } : {
              backgroundColor: "var(--brand-muted, hsl(var(--muted)))",
            }}
            whileInView={{ scale: [0.5, 1.1, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Check className={`w-4 h-4 ${isUs ? "text-white" : ""}`}
              style={!isUs ? { color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" } : undefined} />
          </motion.div>
        );
      }
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))", opacity: 0.5 }}>
          <X className="w-4 h-4" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }} />
        </div>
      );
    }
    if (value === undefined || value === null || value === "") {
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: "var(--brand-muted, hsl(var(--muted)))", opacity: 0.3 }}>
          <Minus className="w-4 h-4" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }} />
        </div>
      );
    }
    return <span className={`font-medium ${isUs ? "" : "opacity-60"}`}
      style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{value}</span>;
  };
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-comparison">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={400} x="5%" y="30%" opacity={0.04} />
        <div style={{ opacity: 0.2 }}><GradientMesh /></div>
        <DotGrid opacity={0.015} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-12"
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
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
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration, delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm"
          style={{
            backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
            border: "1px solid var(--brand-border, hsl(var(--border)))",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--brand-border, hsl(var(--border)))" }}>
                  <th className="text-left p-6 font-semibold"
                    style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                    Feature
                  </th>
                  <th className="p-6 text-center font-bold relative"
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                    <div className="absolute inset-0"
                      style={{ background: `linear-gradient(180deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.08) 0%, transparent 100%)` }} />
                    <span className="relative">{data.ourName || "Us"}</span>
                  </th>
                  {competitorNames.map((name, i) => (
                    <th key={i} className="p-6 text-center font-medium"
                      style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    style={{
                      borderBottom: "1px solid var(--brand-border, hsl(var(--border)))",
                      backgroundColor: index % 2 === 0 ? "transparent" : "var(--brand-muted, hsl(var(--muted)) / 0.3)",
                    }}
                  >
                    <td className="p-6 font-medium"
                      style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                      {item.feature}
                    </td>
                    <td className="p-6 text-center relative">
                      <div className="absolute inset-0"
                        style={{ background: `hsl(var(--brand-primary-hsl, var(--primary)) / 0.02)` }} />
                      <div className="relative">{renderValue(item.us, true)}</div>
                    </td>
                    {(item.competitors || []).map((value, i) => (
                      <td key={i} className="p-6 text-center">
                        {renderValue(value)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {data.ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <ShineEffect>
              <Button
                asChild size="lg"
                className="rounded-xl"
                style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                data-testid="button-comparison-cta"
              >
                <a href={data.ctaLink || "#contact"}>
                  {data.ctaText}
                </a>
              </Button>
            </ShineEffect>
          </motion.div>
        )}
      </div>
    </section>
  );
}
