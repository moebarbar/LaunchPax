import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    <section 
      className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, 
          hsl(var(--brand-primary-hsl, var(--primary)) / 0.08) 0%, 
          hsl(var(--brand-secondary-hsl, var(--muted)) / 0.05) 50%,
          hsl(var(--brand-accent-hsl, var(--primary)) / 0.03) 100%)`
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl"
          style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
          style={{ background: "var(--brand-accent, hsl(var(--primary)))" }}
        />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight"
          data-testid="text-hero-headline"
        >
          {data.headline || siteName || "Welcome"}
        </motion.h1>
        {data.subheadline && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0"
            data-testid="text-hero-subheadline"
          >
            {data.subheadline}
          </motion.p>
        )}
        {data.ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Button
              asChild
              size="lg"
              data-testid="button-hero-cta"
              style={{
                backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                borderColor: "var(--brand-primary, hsl(var(--primary)))"
              }}
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
