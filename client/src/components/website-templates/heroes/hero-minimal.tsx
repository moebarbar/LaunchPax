import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroData {
  headline?: string;
  subheadline?: string;
  statement?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
}

export default function HeroMinimal({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-20">
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-sm font-medium text-muted-foreground tracking-wide">
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.15]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {data.headline}
        </motion.h1>

        {(data.statement || data.subheadline) && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {data.statement || data.subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4"
        >
          {data.ctaText && (
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-lg"
              style={{ 
                backgroundColor: "var(--brand-primary, hsl(var(--primary)))"
              }}
              data-testid="button-hero-cta"
            >
              <a href={data.ctaLink || "#contact"}>
                {data.ctaText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          )}
          {data.secondaryCtaText && (
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto rounded-lg text-muted-foreground"
              data-testid="button-hero-secondary-cta"
            >
              <a href={data.secondaryCtaLink || "#"}>
                {data.secondaryCtaText}
              </a>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
