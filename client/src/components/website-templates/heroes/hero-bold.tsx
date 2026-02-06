import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useThemeMotion } from "../motion-wrapper";
import { FloatingOrb, FloatingShapes } from "../visuals/floating-elements";
import { MetricsGrid } from "../visuals/metrics-display";
import { MeshGradientBackground, AnimatedGradientBorder, ParallaxLayer, DecorativeCircles } from "../visuals";
import { useDesignPersonality } from "../design-personality";

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
  backgroundImage?: string;
  backgroundImageB64?: string;
}

export default function HeroBold({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;
  const themeMotion = useThemeMotion();
  const hasImage = data.image || data.backgroundImage || data.imageB64 || data.backgroundImageB64;
  const personality = useDesignPersonality();

  const visualPanel = hasImage ? (
    <div className="relative">
      <div 
        className="absolute -inset-8 rounded-3xl blur-3xl opacity-30"
        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
      />
      <img
        src={data.imageB64 || data.backgroundImageB64 ? `data:image/png;base64,${data.imageB64 || data.backgroundImageB64}` : (data.image || data.backgroundImage)}
        alt=""
        className="relative w-full rounded-2xl shadow-2xl object-cover"
        style={{ maxHeight: "70vh" }}
      />
    </div>
  ) : (
    <div className="relative">
      <div 
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-15"
        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
      />
      <MetricsGrid />
    </div>
  );

  const ctaStyle = personality.ctaButtonStyle;
  const isTransparentCta = ctaStyle === "outlined" || ctaStyle === "ghost" || ctaStyle === "minimal";
  const ctaRadius = ctaStyle === "sharp" ? "0.375rem" : ctaStyle === "solid" ? "0.75rem" : ctaStyle === "ghost" ? "0.5rem" : ctaStyle === "minimal" ? "0.25rem" : "9999px";
  const ctaBg = isTransparentCta ? "transparent" : `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`;
  const ctaColor = isTransparentCta ? "var(--brand-primary, hsl(var(--primary)))" : "white";
  const ctaBorder = ctaStyle === "outlined" ? "2px solid var(--brand-primary, hsl(var(--primary)))" : "none";
  const ctaShadow = isTransparentCta ? "none" : `0 20px 50px -15px var(--brand-primary, hsl(var(--primary)))`;

  const ctaButton = (
    <Button
      asChild
      size="lg"
      className="w-full sm:w-auto"
      style={{ 
        borderRadius: ctaRadius,
        background: ctaBg,
        color: ctaColor,
        border: ctaBorder,
        boxShadow: ctaShadow,
      }}
      data-testid="button-hero-cta"
    >
      <a href={data.ctaLink || "#contact"}>
        {data.ctaText}
        <ArrowRight className="ml-3 w-6 h-6" />
      </a>
    </Button>
  );

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="absolute inset-0" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }} />
      
      {personality.showFloatingOrbs && (
        <>
          <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={800} x="80%" y="20%" opacity={0.15} blur={100} duration={20} />
          <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={600} x="10%" y="80%" delay={3} opacity={0.1} blur={90} duration={18} />
        </>
      )}
      <FloatingShapes />
      {personality.effectIntensity === "high" && <MeshGradientBackground className="opacity-[0.08]" />}

      {personality.showDecorativeSvgs && (
        <div className="absolute top-20 right-10 pointer-events-none hidden md:block">
          <DecorativeCircles color="var(--brand-primary, hsl(var(--primary)))" opacity={0.04} size={400} />
        </div>
      )}

      <div className="relative z-10 w-full max-w-[95vw] mx-auto px-4 sm:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-3 space-y-8">
            {data.badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: themeMotion.duration }}
              >
                <span 
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-accent, hsl(var(--primary))) 100%)`,
                    color: "white"
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  {data.badge}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: themeMotion.durationVerySlow, delay: 0.1 }}
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85]"
            >
              {data.headline?.split(' ').slice(0, 2).join(' ')}
              <br />
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-accent, hsl(var(--primary))) 100%)`
                }}
              >
                {data.headline?.split(' ').slice(2).join(' ') || data.headline?.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: themeMotion.durationSlow, delay: 0.3 }}
              className="max-w-2xl"
            >
              {(data.statement || data.subheadline) && (
                <p className="text-xl sm:text-2xl leading-relaxed" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                  {data.statement || data.subheadline}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: themeMotion.duration, delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6"
            >
              {data.ctaText && (
                personality.ctaButtonStyle === "gradient-border" ? (
                  <AnimatedGradientBorder borderRadius={999}>
                    {ctaButton}
                  </AnimatedGradientBorder>
                ) : ctaButton
              )}
              {data.secondaryCtaText && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-16 px-10 text-lg rounded-full border-2"
                >
                  <a href={data.secondaryCtaLink || "#"}>
                    {data.secondaryCtaText}
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: themeMotion.durationVerySlow, delay: 0.3 }}
            className="hidden lg:block lg:col-span-2"
          >
            {personality.showParallax ? (
              <ParallaxLayer speed={0.3}>
                {visualPanel}
              </ParallaxLayer>
            ) : visualPanel}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
