import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

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
              transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          </>
        ) : (
          <>
            <div 
              className="w-full h-full"
              style={{
                background: `radial-gradient(ellipse at center, 
                  hsl(240 30% 8%) 0%, 
                  hsl(0 0% 0%) 100%)`
              }}
            />
            <motion.div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 80% 50% at 50% 50%, 
                  hsl(var(--brand-primary-hsl, 240 70% 50%) / 0.15) 0%, 
                  transparent 70%)`
              }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </>
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            style={{
              left: `${25 + i * 25}%`,
              height: "100%",
            }}
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: [0, 0.5, 0], y: "100%" }}
            transition={{
              duration: 4,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <span className="inline-block px-6 py-2 text-xs font-semibold tracking-[0.3em] uppercase text-white/70 border border-white/20">
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9]"
          style={{ 
            letterSpacing: "-0.04em",
            textShadow: "0 0 80px rgba(0,0,0,0.5)"
          }}
        >
          {data.headline?.split(' ').map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {(data.statement || data.subheadline) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto font-light"
            style={{ letterSpacing: "0.02em" }}
          >
            {data.statement || data.subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-14 flex flex-wrap justify-center gap-6"
        >
          {data.ctaText && (
            <Button
              asChild
              size="lg"
              className="rounded-none bg-white text-black"
              data-testid="button-hero-cta"
            >
              <a href={data.ctaLink || "#contact"}>
                <span className="relative z-10 flex items-center">
                  {data.ctaText}
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </a>
            </Button>
          )}
          {data.secondaryCtaText && (
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-16 px-12 text-lg rounded-none text-white hover:bg-white/10 border border-white/30 group"
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
        style={{
          background: "linear-gradient(to top, black, transparent)"
        }}
      />
    </section>
  );
}
