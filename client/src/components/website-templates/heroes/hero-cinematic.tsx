import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useThemeMotion } from "../motion-wrapper";
import { NoiseTexture, AnimatedGradientBorder } from "../visuals";

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

export default function HeroCinematic({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;
  const themeMotion = useThemeMotion();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        {(data.imageB64 || data.image) ? (
          <>
            <motion.img
              src={data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image}
              alt=""
              className="w-full h-full object-cover opacity-60"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: themeMotion.durationVerySlow, ease: themeMotion.easing }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          </>
        ) : (
          <>
            <div className="w-full h-full"
              style={{ background: `radial-gradient(ellipse at center, hsl(240 30% 8%) 0%, hsl(0 0% 0%) 100%)` }} />
            <motion.div 
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, hsl(var(--brand-primary-hsl, 240 70% 50%) / 0.15) 0%, transparent 70%)` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse 40% 60% at 70% 60%, hsl(var(--brand-primary-hsl, 240 70% 50%) / 0.08) 0%, transparent 70%)` }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </>
        )}
      </div>

      <NoiseTexture opacity={0.03} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            style={{ left: `${25 + i * 25}%`, height: "100%" }}
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: [0, 0.5, 0], y: "100%" }}
            transition={{ duration: 4, delay: i * 1.5, repeat: Infinity, ease: "linear" }}
          />
        ))}

        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: themeMotion.durationSlow }}
            className="mb-10"
          >
            <span className="inline-block px-6 py-2 text-xs font-semibold tracking-[0.3em] uppercase text-white/70 border border-white/20 backdrop-blur-sm">
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: themeMotion.durationVerySlow, delay: 0.2 }}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.9]"
          style={{ letterSpacing: "-0.04em", textShadow: "0 0 80px rgba(0,0,0,0.5)" }}
        >
          {data.headline?.split(' ').map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: themeMotion.durationSlow, delay: 0.3 + i * 0.1 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {(data.statement || data.subheadline) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: themeMotion.durationVerySlow, delay: 0.8 }}
            className="mt-10 text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto font-light"
            style={{ letterSpacing: "0.02em" }}
          >
            {data.statement || data.subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: themeMotion.durationSlow, delay: 1 }}
          className="mt-14 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6"
        >
          {data.ctaText && (
            <AnimatedGradientBorder borderRadius={999}>
              <Button
                asChild size="lg"
                className="w-full sm:w-auto rounded-none bg-white text-black shadow-2xl"
                data-testid="button-hero-cta"
              >
                <a href={data.ctaLink || "#contact"}>
                  <span className="relative z-10 flex items-center">
                    {data.ctaText}
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </span>
                </a>
              </Button>
            </AnimatedGradientBorder>
          )}
          {data.secondaryCtaText && (
            <Button
              asChild size="lg" variant="ghost"
              className="w-full sm:w-auto h-16 px-12 text-lg rounded-none text-white border border-white/30 group backdrop-blur-sm"
            >
              <a href={data.secondaryCtaLink || "#"}>
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                {data.secondaryCtaText}
              </a>
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
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
