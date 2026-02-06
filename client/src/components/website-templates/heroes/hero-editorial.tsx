import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useThemeMotion } from "../motion-wrapper";
import { FloatingOrb, DotGrid, ShineEffect } from "../visuals/floating-elements";
import { PhoneMockup } from "../visuals/browser-mockup";

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
  const themeMotion = useThemeMotion();
  const hasImage = data.image || data.imageB64;

  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, var(--brand-background, hsl(var(--background))), var(--brand-surface, hsl(var(--muted))) 70%)` }} />
      
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={500} x="75%" y="30%" opacity={0.08} blur={100} />
      <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={200} x="15%" y="45%" delay={5} opacity={0.06} blur={60} />
      <DotGrid opacity={0.015} spacing={50} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7 space-y-8">
            {data.badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: themeMotion.duration }}
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
              transition={{ duration: themeMotion.durationSlow, delay: 0.1 }}
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
                transition={{ duration: themeMotion.durationSlow, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-light max-w-3xl leading-relaxed"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
              >
                {data.statement}
              </motion.p>
            )}

            {data.subheadline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: themeMotion.duration, delay: 0.3 }}
                className="text-lg max-w-2xl"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
              >
                {data.subheadline}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: themeMotion.duration, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4"
            >
              {data.ctaText && (
                <ShineEffect>
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
                </ShineEffect>
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
            transition={{ duration: themeMotion.durationVerySlow, delay: 0.3 }}
            className="hidden lg:flex lg:col-span-5 justify-center"
          >
            {hasImage ? (
              <div className="relative w-full">
                <div 
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                  style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                />
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border shadow-2xl">
                  <img
                    src={data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <PhoneMockup />
            )}
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
        transition={{ duration: themeMotion.durationVerySlow, delay: 0.5 }}
      />
    </section>
  );
}
