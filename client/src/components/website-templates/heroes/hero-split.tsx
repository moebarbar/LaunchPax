import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useThemeMotion } from "../motion-wrapper";
import { BrowserMockup } from "../visuals/browser-mockup";
import { ChecklistPanel } from "../visuals/checklist-panel";
import { FloatingOrb, DotGrid } from "../visuals/floating-elements";
import { AbstractBlob, AnimatedGradientBorder, ParallaxLayer } from "../visuals";

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
  const themeMotion = useThemeMotion();
  const hasImage = data.image || data.imageB64;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }}>
      <div className="absolute inset-0" style={{ backgroundColor: "var(--brand-background, hsl(var(--background)))" }} />
      
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={600} x="70%" y="30%" opacity={0.08} blur={120} />
      <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={400} x="20%" y="70%" delay={4} opacity={0.06} blur={100} />
      <DotGrid opacity={0.02} spacing={50} />

      <div className="absolute bottom-10 left-10 pointer-events-none hidden md:block">
        <AbstractBlob color="var(--brand-primary, hsl(var(--primary)))" size={300} opacity={0.06} />
      </div>

      <div className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="flex items-center px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0">
            <div className="max-w-xl space-y-8">
              {data.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: themeMotion.duration }}
                >
                  <span 
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ 
                      backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                      color: "var(--brand-primary, hsl(var(--primary)))"
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} />
                    {data.badge}
                  </span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: themeMotion.durationSlow, delay: 0.1 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]"
                style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}
              >
                {data.headline}
              </motion.h1>

              {(data.statement || data.subheadline) && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: themeMotion.duration, delay: 0.2 }}
                  className="text-lg sm:text-xl leading-relaxed"
                  style={{ color: "var(--brand-text-secondary, var(--brand-muted, hsl(var(--muted-foreground))))" }}
                >
                  {data.statement || data.subheadline}
                </motion.p>
              )}

              {features.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: themeMotion.duration, delay: 0.3 }}
                  className="space-y-3"
                >
                  {features.slice(0, 4).map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                      >
                        <Check className="w-3.5 h-3.5" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                      </div>
                      <span style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: themeMotion.duration, delay: 0.4 }}
                className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4"
              >
                {data.ctaText && (
                  <AnimatedGradientBorder borderRadius={999}>
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
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  </AnimatedGradientBorder>
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
            transition={{ duration: themeMotion.durationVerySlow, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center p-8 xl:p-12"
          >
            <ParallaxLayer speed={0.3}>
              {hasImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 p-6 rounded-xl backdrop-blur-xl border shadow-2xl"
                    style={{
                      backgroundColor: "var(--brand-card-bg, hsl(var(--card) / 0.9))",
                      borderColor: "var(--brand-border, hsl(var(--border)))",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: themeMotion.durationSlow, delay: 0.8 }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                        style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                      >
                        {siteName?.charAt(0) || "L"}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{siteName || "Trusted by thousands"}</p>
                        <p className="text-sm" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>Join the growing community</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="w-full max-w-lg space-y-4">
                  <BrowserMockup url={`${siteName?.toLowerCase().replace(/\s/g, '') || 'yoursite'}.com`} />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Active Users", val: "2,847", change: "+24%" },
                      { label: "Revenue", val: "$48.2k", change: "+18%" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        className="p-3 rounded-xl border backdrop-blur-sm"
                        style={{
                          backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                          borderColor: "var(--brand-border, hsl(var(--border)))",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.15 }}
                      >
                        <p className="text-xs" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>{stat.label}</p>
                        <p className="text-lg font-bold" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{stat.val}</p>
                        <span className="text-xs font-medium" style={{ color: "#22c55e" }}>{stat.change}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </ParallaxLayer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
