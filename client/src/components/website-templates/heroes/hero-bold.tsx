import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

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

export default function HeroBold({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      
      <motion.div 
        className="absolute -top-1/2 -right-1/4 w-[100vw] h-[100vw] rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, var(--brand-primary, hsl(var(--primary))) 0%, transparent 60%)`
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      <motion.div 
        className="absolute -bottom-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, var(--brand-accent, hsl(var(--primary))) 0%, transparent 60%)`
        }}
        animate={{ 
          scale: [1, 1.15, 1],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="relative z-10 w-full max-w-[95vw] mx-auto px-4 sm:px-8 py-20">
        <div className="space-y-8">
          {data.badge && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
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
            transition={{ duration: 1, delay: 0.1 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black tracking-tighter leading-[0.85]"
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
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            {(data.statement || data.subheadline) && (
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                {data.statement || data.subheadline}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6"
          >
            {data.ctaText && (
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-full shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`,
                  boxShadow: `0 20px 50px -15px var(--brand-primary, hsl(var(--primary)))`
                }}
                data-testid="button-hero-cta"
              >
                <a href={data.ctaLink || "#contact"}>
                  {data.ctaText}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </a>
              </Button>
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

        {(data.imageB64 || data.image) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="absolute bottom-0 right-0 w-1/2 h-[70%] hidden xl:block"
          >
            <div 
              className="absolute -inset-8 rounded-3xl blur-3xl opacity-30"
              style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
            />
            <img
              src={data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image}
              alt=""
              className="relative w-full h-full object-contain object-bottom"
            />
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
