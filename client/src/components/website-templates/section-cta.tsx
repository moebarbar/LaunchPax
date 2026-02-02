import type { SectionContent } from "@shared/schema";

interface CtaData {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function SectionCta({ section }: { section: SectionContent }) {
  const data = section.data as CtaData;
  
  return (
    <section className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          {data.headline || "Ready to Get Started?"}
        </h2>
        {data.subheadline && (
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {data.subheadline}
          </p>
        )}
        {data.buttonText && (
          <a
            href={data.buttonLink || "#contact"}
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md bg-background text-foreground hover-elevate active-elevate-2 transition-colors"
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
