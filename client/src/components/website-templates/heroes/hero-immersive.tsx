import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FloatingShapes } from "../visuals/floating-elements";
import { NoiseTexture, AnimatedGradientBorder, AbstractBlob } from "../visuals";

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

export default function HeroImmersive({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {(data.imageB64 || data.image) ? (
          <>
            <motion.img
              src={data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image}
              alt=""
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </>
        ) : (
          <>
            <div className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, hsl(220 60% 10%) 0%, hsl(240 50% 15%) 50%, hsl(280 40% 12%) 100%)`
              }}
            />
            <FloatingShapes />
          </>
        )}
      </div>

      <NoiseTexture opacity={0.03} />

      <div className="absolute top-16 left-10 pointer-events-none hidden md:block">
        <AbstractBlob color="var(--brand-primary, hsl(var(--primary)))" size={300} opacity={0.05} />
      </div>

      <motion.div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
      />

      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10"
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{ background: "var(--brand-accent, hsl(var(--primary)))" }}
      />

      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
        backgroundSize: "50px 50px",
      }} />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[0.95]"
          style={{ letterSpacing: "-0.03em", textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
        >
          {data.headline}
        </motion.h1>

        {(data.statement || data.subheadline) && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            {data.statement || data.subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4"
        >
          {data.ctaText && (
            <AnimatedGradientBorder borderRadius={999}>
              <Button
                asChild size="lg"
                className="w-full sm:w-auto rounded-full bg-white text-black shadow-2xl"
                data-testid="button-hero-cta"
              >
                <a href={data.ctaLink || "#contact"}>
                  {data.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </AnimatedGradientBorder>
          )}
          {data.secondaryCtaText && (
            <Button
              asChild size="lg" variant="outline"
              className="w-full sm:w-auto h-14 px-10 text-lg rounded-full border-white/30 text-white backdrop-blur-sm"
            >
              <a href={data.secondaryCtaLink || "#"}>
                {data.secondaryCtaText}
              </a>
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
