import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useThemeMotion } from "../motion-wrapper";
import { FloatingOrb, GradientMesh } from "../visuals/floating-elements";
import { GeometricPattern, AnimatedGradientBorder, GlowLine } from "../visuals";
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
}

export default function HeroMinimal({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;
  const hasImage = data.image || data.imageB64;
  const imageUrl = data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image;
  const themeMotion = useThemeMotion();
  const personality = useDesignPersonality();

  const ctaStyle = personality.ctaButtonStyle;
  const isTransparentCta = ctaStyle === "outlined" || ctaStyle === "ghost" || ctaStyle === "minimal";
  const ctaRadius = ctaStyle === "sharp" ? "0.375rem" : ctaStyle === "solid" ? "0.75rem" : ctaStyle === "ghost" ? "0.5rem" : ctaStyle === "minimal" ? "0.25rem" : "9999px";
  const ctaBg = isTransparentCta ? "transparent" : `linear-gradient(135deg, var(--brand-primary, #3b82f6) 0%, var(--brand-secondary, var(--brand-primary, #2563eb)) 100%)`;
  const ctaColor = isTransparentCta ? (hasImage ? "rgba(255,255,255,0.9)" : "var(--brand-primary, hsl(var(--primary)))") : "white";
  const ctaBorder = ctaStyle === "outlined" ? (hasImage ? "2px solid rgba(255,255,255,0.4)" : "2px solid var(--brand-primary, hsl(var(--primary)))") : "none";

  const ctaButton = (
    <Button
      asChild
      size="lg"
      className="w-full sm:w-auto px-8 py-6 text-base font-medium shadow-xl"
      style={{ 
        borderRadius: ctaRadius,
        background: ctaBg,
        color: ctaColor,
        border: ctaBorder,
        ...(isTransparentCta && { boxShadow: "none" }),
      }}
      data-testid="button-hero-cta"
    >
      <a href={data.ctaLink || "#contact"} className="flex items-center gap-2">
        {data.ctaText}
        <ArrowRight className="w-5 h-5" />
      </a>
    </Button>
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {hasImage ? (
        <>
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </>
      ) : (
        <>
          <div className="absolute inset-0" style={{ backgroundColor: "var(--brand-background, #fafafa)" }} />
          <GradientMesh />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {personality.showDecorativeSvgs && (
            <div className="absolute inset-0 pointer-events-none hidden sm:block">
              <GeometricPattern color="var(--brand-primary, hsl(var(--primary)))" opacity={0.02} size={400} />
            </div>
          )}
        </>
      )}
      
      <div className={`relative z-10 text-center px-6 sm:px-8 max-w-5xl mx-auto py-24 ${hasImage ? 'text-white' : ''}`}>
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: themeMotion.duration, ease: themeMotion.easing }}
            className="mb-10"
          >
            <span 
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm border ${
                hasImage ? 'bg-white/10 border-white/20 text-white/90' : 'shadow-sm'
              }`}
              style={!hasImage ? { 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.08)",
                borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.15)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              } : {}}
            >
              <Sparkles className="w-4 h-4" />
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: themeMotion.durationSlow, delay: 0.1, ease: themeMotion.easing }}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] ${hasImage ? 'text-white' : ''}`}
          style={{ 
            letterSpacing: "-0.035em",
            fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            textShadow: hasImage ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
            ...(!hasImage && { color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }),
          }}
        >
          {data.headline?.split('.').map((part, i, arr) => (
            <span key={i} className="block">
              {part.trim()}
              {i < arr.length - 1 && part.trim() && '.'}
            </span>
          ))}
        </motion.h1>

        {(data.statement || data.subheadline) && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: themeMotion.durationSlow, delay: 0.25, ease: themeMotion.easing }}
            className={`mt-8 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light ${hasImage ? 'text-white/85' : ''}`}
            style={{ 
              fontFamily: "var(--font-body, 'Inter', sans-serif)",
              ...(!hasImage && { color: "var(--brand-muted, var(--brand-text-secondary, hsl(var(--muted-foreground))))" }),
            }}
          >
            {data.statement || data.subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: themeMotion.duration, delay: 0.4, ease: themeMotion.easing }}
          className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4"
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
              className={`w-full sm:w-auto rounded-full px-8 py-6 text-base font-medium backdrop-blur-sm ${
                hasImage ? 'text-white border-white/30 bg-white/10' : ''
              }`}
              style={!hasImage ? {
                color: "var(--brand-text, hsl(var(--foreground)))",
                borderColor: "var(--brand-border, hsl(var(--border)))",
              } : {}}
              data-testid="button-hero-secondary-cta"
            >
              <a href={data.secondaryCtaLink || "#"}>
                {data.secondaryCtaText}
              </a>
            </Button>
          )}
        </motion.div>
      </div>
      
      {!hasImage ? (
        personality.showGlowLines ? (
          <div className="absolute bottom-0 left-0 right-0">
            <GlowLine animated />
          </div>
        ) : null
      ) : (
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: themeMotion.duration }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2 border-white/40"
          >
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
