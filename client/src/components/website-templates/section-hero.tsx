import type { SectionContent } from "@shared/schema";

interface HeroData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

interface SectionHeroProps {
  section: SectionContent;
  siteName?: string;
}

export default function SectionHero({ section, siteName }: SectionHeroProps) {
  const data = (section.data || {}) as HeroData;
  
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          {data.headline || siteName || "Welcome"}
        </h1>
        {data.subheadline && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {data.subheadline}
          </p>
        )}
        {data.ctaText && (
          <a
            href={data.ctaLink || "#contact"}
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md bg-primary text-primary-foreground hover-elevate active-elevate-2 transition-colors"
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
