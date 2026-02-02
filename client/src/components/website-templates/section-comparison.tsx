import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionContent } from "@shared/schema";

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
  
  const renderValue = (value: boolean | string | undefined, isUs: boolean = false) => {
    if (typeof value === "boolean") {
      if (value) {
        return (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
              isUs ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
            }`}
          >
            <Check className="w-5 h-5" />
          </div>
        );
      }
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 text-red-400 flex items-center justify-center mx-auto">
          <X className="w-5 h-5" />
        </div>
      );
    }
    if (value === undefined || value === null || value === "") {
      return (
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <Minus className="w-5 h-5" />
        </div>
      );
    }
    return <span className={`font-medium ${isUs ? "text-foreground" : "text-muted-foreground"}`}>{value}</span>;
  };
  
  return (
    <section className="py-24 sm:py-32" data-testid="section-comparison">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 font-semibold text-muted-foreground">
                    Feature
                  </th>
                  <th
                    className="p-6 text-center font-bold"
                    style={{ 
                      backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.05)",
                      color: "var(--brand-primary, hsl(var(--primary)))"
                    }}
                  >
                    {data.ourName || "Us"}
                  </th>
                  {competitorNames.map((name, i) => (
                    <th key={i} className="p-6 text-center font-medium text-muted-foreground">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border/50 ${index % 2 === 0 ? "bg-muted/20" : ""}`}
                  >
                    <td className="p-6 font-medium">{item.feature}</td>
                    <td
                      className="p-6 text-center"
                      style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.02)" }}
                    >
                      {renderValue(item.us, true)}
                    </td>
                    {(item.competitors || []).map((value, i) => (
                      <td key={i} className="p-6 text-center">
                        {renderValue(value)}
                      </td>
                    ))}
                  </tr>
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
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl"
              style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
              data-testid="button-comparison-cta"
            >
              <a href={data.ctaLink || "#contact"}>
                {data.ctaText}
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
