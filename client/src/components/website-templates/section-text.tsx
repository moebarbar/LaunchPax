import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { DotGrid } from "./visuals/floating-elements";

interface TextData {
  headline?: string;
  content?: string;
  alignment?: "left" | "center" | "right";
}

export default function SectionText({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as TextData;
  const alignment = data.alignment || "left";
  
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };
  
  return (
    <section className="py-20 sm:py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <DotGrid opacity={0.01} />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {data.headline && (
          <motion.h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-tight ${alignment === "center" ? "text-center" : ""}`}
            style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-testid="text-section-headline"
          >
            {data.headline}
          </motion.h2>
        )}
        {data.content && (
          <div className={`prose prose-lg dark:prose-invert max-w-none ${alignmentClasses[alignment]}`}>
            {data.content.split("\n\n").map((paragraph, index) => (
              <motion.p
                key={index}
                className="mb-6 leading-relaxed text-lg"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                data-testid={`text-paragraph-${index}`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
