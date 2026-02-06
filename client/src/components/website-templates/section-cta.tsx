import type { SectionContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useThemeMotion } from "./motion-wrapper";
import { ShineEffect } from "./visuals/floating-elements";
import { BrowserMockup } from "./visuals/browser-mockup";

interface CtaData {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryText?: string;
}

export default function SectionCta({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as CtaData;
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: themeMotion.durationSlow }}
        className="max-w-6xl mx-auto relative"
      >
        <div 
          className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              var(--brand-primary, hsl(var(--primary))) 0%, 
              var(--brand-secondary, hsl(var(--primary))) 50%,
              var(--brand-accent, hsl(var(--primary))) 100%)`
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"
            />
          </div>

          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          <div className="relative z-10 grid lg:grid-cols-5 gap-8 items-center py-16 sm:py-24 px-8 sm:px-16">
            <div className="lg:col-span-3 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: themeMotion.duration }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8"
              >
                <Sparkles className="w-4 h-4" />
                {data.secondaryText || "Limited time offer"}
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: themeMotion.duration, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight"
                data-testid="text-cta-headline"
              >
                {data.headline || "Ready to Get Started?"}
              </motion.h2>

              {data.subheadline && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: themeMotion.duration, delay: 0.2 }}
                  className="text-lg sm:text-xl text-white/80 mb-10 sm:mb-12 max-w-2xl leading-relaxed"
                  data-testid="text-cta-subheadline"
                >
                  {data.subheadline}
                </motion.p>
              )}

              {data.buttonText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: themeMotion.duration, delay: 0.3 }}
                >
                  <ShineEffect>
                    <Button
                      asChild size="lg"
                      className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full bg-white text-gray-900 shadow-xl group"
                      data-testid="button-cta-action"
                    >
                      <a href={data.buttonLink || "#contact"} className="flex items-center gap-2">
                        {data.buttonText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </ShineEffect>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-2 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 40, rotateY: -10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-2xl bg-white/5 blur-xl" />
                <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/15" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 rounded bg-white/20 w-24" />
                        <div className="h-1.5 rounded bg-white/10 w-16" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <motion.div key={i} className="p-3 rounded-lg bg-white/8 border border-white/5"
                          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15 }}>
                          <div className="h-1.5 rounded bg-white/15 w-10 mb-2" />
                          <div className="h-4 rounded bg-white/20 w-14 font-bold" />
                        </motion.div>
                      ))}
                    </div>
                    <div className="h-12 rounded-lg bg-white/8 overflow-hidden">
                      <svg viewBox="0 0 200 48" className="w-full h-full">
                        <motion.path d="M0,40 Q30,20 60,30 T120,15 T200,20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.6 }} />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
