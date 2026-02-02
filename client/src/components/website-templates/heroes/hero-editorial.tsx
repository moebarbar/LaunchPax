import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motionPresets } from "@/lib/design-tokens";

interface HeroData {
  headline?: string;
  subheadline?: string;
  statement?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
  image?: string;
  imageB64?: string;
}

export default function HeroEditorial({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;

  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      <motion.div 
        className="absolute top-20 right-0 w-[60%] h-[80%] opacity-10"
        animate={{ 
          rotate: [0, 2, 0, -2, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          background: `radial-gradient(ellipse at center, var(--brand-primary, hsl(var(--primary))) 0%, transparent 70%)`
        }}
      />

      <div className="absolute top-1/4 left-[10%] w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--brand-accent, hsl(var(--primary)))" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8 space-y-8">
            {data.badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm"
                  style={{ 
                    borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.3)",
                    color: "var(--brand-primary, hsl(var(--primary)))"
                  }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" 
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} 
                  />
                  {data.badge}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9]"
              style={{ letterSpacing: "-0.03em" }}
            >
              {data.headline?.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? (
                    <span 
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-accent, hsl(var(--primary))) 100%)`
                      }}
                    >
                      {word}
                    </span>
                  ) : (
                    word + ' '
                  )}
                </span>
              ))}
            </motion.h1>

            {data.statement && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground max-w-3xl leading-relaxed"
              >
                {data.statement}
              </motion.p>
            )}

            {data.subheadline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-muted-foreground max-w-2xl"
              >
                {data.subheadline}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4"
            >
              {data.ctaText && (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-full shadow-xl group"
                  style={{ 
                    background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                  }}
                  data-testid="button-hero-cta"
                >
                  <a href={data.ctaLink || "#contact"}>
                    {data.ctaText}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              )}
              {data.secondaryCtaText && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full backdrop-blur-sm"
                  data-testid="button-hero-secondary-cta"
                >
                  <a href={data.secondaryCtaLink || "#"}>
                    <Play className="mr-2 w-5 h-5" />
                    {data.secondaryCtaText}
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block lg:col-span-4"
          >
            <div className="relative">
              <div 
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
                style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
              />
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border shadow-2xl">
                {(data.imageB64 || data.image) ? (
                  <img
                    src={data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(var(--brand-primary-hsl, var(--primary)) / 0.1) 0%, 
                        hsl(var(--brand-accent-hsl, var(--primary)) / 0.05) 100%)`
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ 
          background: `linear-gradient(90deg, transparent 0%, var(--brand-primary, hsl(var(--primary))) 50%, transparent 100%)`
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </section>
  );
}
