import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Star } from "lucide-react";

interface HeroData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundImageB64?: string;
  badge?: string;
  trustLogos?: string[];
}

interface SectionHeroProps {
  section: SectionContent;
  siteName?: string;
}

export default function SectionHero({ section, siteName }: SectionHeroProps) {
  const data = (section.data || {}) as HeroData;
  
  const hasBackgroundImage = data.backgroundImage || data.backgroundImageB64;
  const backgroundImageUrl = data.backgroundImageB64 
    ? `data:image/png;base64,${data.backgroundImageB64}`
    : data.backgroundImage;
  
  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {hasBackgroundImage ? (
        <>
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            data-testid="img-hero-background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% -20%, 
                  hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, 
                  transparent 50%),
                radial-gradient(ellipse 60% 40% at 100% 0%, 
                  hsl(var(--brand-accent-hsl, var(--primary)) / 0.1) 0%, 
                  transparent 40%),
                radial-gradient(ellipse 50% 30% at 0% 100%, 
                  hsl(var(--brand-secondary-hsl, var(--primary)) / 0.08) 0%, 
                  transparent 40%),
                linear-gradient(to bottom, 
                  hsl(var(--background)) 0%, 
                  hsl(var(--muted) / 0.3) 100%)
              `
            }}
          />
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-20 right-[20%] w-72 h-72 rounded-full blur-[100px]"
              style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
            />
            <motion.div 
              animate={{ 
                y: [0, 30, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-32 left-[15%] w-96 h-96 rounded-full blur-[120px]"
              style={{ background: "var(--brand-accent, hsl(var(--primary)))" }}
            />
            <motion.div 
              animate={{ 
                x: [0, 20, 0],
                opacity: [0.15, 0.25, 0.15]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-1/3 left-[60%] w-64 h-64 rounded-full blur-[80px]"
              style={{ background: "var(--brand-secondary, hsl(var(--muted)))" }}
            />
          </div>

          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </>
      )}
      
      <div className="max-w-5xl mx-auto text-center relative z-10 py-20">
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border ${
                hasBackgroundImage 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-primary/5 border-primary/10 text-primary"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1] ${
            hasBackgroundImage ? "text-white" : ""
          }`}
          style={hasBackgroundImage ? {} : {
            background: `linear-gradient(135deg, 
              var(--foreground) 0%, 
              var(--foreground) 50%,
              hsl(var(--brand-primary-hsl, var(--primary))) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "inherit",
          }}
          data-testid="text-hero-headline"
        >
          {data.headline || siteName || "Welcome"}
        </motion.h1>

        {data.subheadline && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4 sm:px-0 ${
              hasBackgroundImage ? "text-white/85" : "text-muted-foreground"
            }`}
            data-testid="text-hero-subheadline"
          >
            {data.subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {data.ctaText && (
            <Button
              asChild
              size="lg"
              className="text-base sm:text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
              data-testid="button-hero-cta"
              style={{
                backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                borderColor: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              <a href={data.ctaLink || "#contact"} className="flex items-center gap-2">
                {data.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
          
          {data.secondaryCtaText && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className={`text-base sm:text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all duration-300 group ${
                hasBackgroundImage 
                  ? "border-white/30 text-white hover:bg-white/10" 
                  : "border-border/50 hover:bg-muted/50"
              }`}
              data-testid="button-hero-secondary-cta"
            >
              <a href={data.secondaryCtaLink || "#about"} className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                {data.secondaryCtaText}
              </a>
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className={`flex items-center gap-1 ${hasBackgroundImage ? "text-white/70" : "text-muted-foreground"}`}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm font-medium">Trusted by 10,000+ customers</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
