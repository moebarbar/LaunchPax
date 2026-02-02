import type { SectionContent } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface CtaData {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function SectionCta({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as CtaData;
  
  return (
    <section 
      className="py-16 sm:py-20 px-4 sm:px-6 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, 
          var(--brand-primary, hsl(var(--primary))) 0%, 
          var(--brand-secondary, hsl(var(--primary))) 100%)`
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          data-testid="text-cta-headline"
        >
          {data.headline || "Ready to Get Started?"}
        </h2>
        {data.subheadline && (
          <p 
            className="text-base sm:text-lg opacity-90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            data-testid="text-cta-subheadline"
          >
            {data.subheadline}
          </p>
        )}
        {data.buttonText && (
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-gray-900"
            data-testid="button-cta-action"
          >
            <a href={data.buttonLink || "#contact"}>
              {data.buttonText}
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}
