import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

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
  features?: string[];
}

export default function HeroSplit({ section, siteName }: { section: SectionContent; siteName?: string }) {
  const data = (section.data || {}) as HeroData;
  const features = data.features || [];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="absolute inset-0" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }} />
      
      <div className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="flex items-center px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
            <div className="max-w-xl space-y-8">
              {data.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span 
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ 
                      backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                      color: "var(--brand-primary, hsl(var(--primary)))"
                    }}
                  >
                    {data.badge}
                  </span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]"
              >
                {data.headline}
              </motion.h1>

              {(data.statement || data.subheadline) && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
                >
                  {data.statement || data.subheadline}
                </motion.p>
              )}

              {features.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-3"
                >
                  {features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                      >
                        <Check 
                          className="w-3 h-3" 
                          style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                        />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </motion.ul>
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
                    className="w-full sm:w-auto rounded-xl shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                    }}
                    data-testid="button-hero-cta"
                  >
                    <a href={data.ctaLink || "#contact"}>
                      {data.ctaText}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                )}
                {data.secondaryCtaText && (
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto h-12 px-8 text-base rounded-xl"
                  >
                    <a href={data.secondaryCtaLink || "#"}>
                      {data.secondaryCtaText}
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0">
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
                      var(--brand-primary, hsl(var(--primary))) 0%, 
                      var(--brand-secondary, hsl(var(--primary))) 50%,
                      var(--brand-accent, hsl(var(--primary))) 100%)`
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
            </div>

            <motion.div
              className="absolute bottom-12 left-12 right-12 p-8 rounded-2xl backdrop-blur-xl bg-background/80 border shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                >
                  {siteName?.charAt(0) || "✓"}
                </div>
                <div>
                  <p className="font-semibold">{siteName || "Trusted by thousands"}</p>
                  <p className="text-sm text-muted-foreground">Join the growing community</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
