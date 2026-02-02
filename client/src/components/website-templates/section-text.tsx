import type { SectionContent } from "@shared/schema";

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
    center: "text-center",
    right: "text-right",
  };
  
  return (
    <section className="py-12 px-6">
      <div className={`max-w-4xl mx-auto ${alignmentClasses[alignment]}`}>
        {data.headline && (
          <h2 className="text-3xl font-bold mb-6">{data.headline}</h2>
        )}
        {data.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {data.content.split("\n").map((paragraph, index) => (
              <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
