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
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };
  
  return (
    <section className="py-20 px-6 bg-background">
      <div className={`max-w-4xl mx-auto`}>
        {data.headline && (
          <h2 
            className={`text-3xl md:text-4xl font-bold mb-8 ${alignment === "center" ? "text-center" : ""}`}
            data-testid="text-section-headline"
          >
            {data.headline}
          </h2>
        )}
        {data.content && (
          <div className={`prose prose-lg dark:prose-invert max-w-none ${alignmentClasses[alignment]}`}>
            {data.content.split("\n\n").map((paragraph, index) => (
              <p 
                key={index} 
                className="text-muted-foreground mb-6 leading-relaxed text-lg"
                data-testid={`text-paragraph-${index}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
