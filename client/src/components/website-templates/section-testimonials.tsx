import type { SectionContent } from "@shared/schema";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, AnimatedGradientBorder, HoverTilt, AbstractBlob } from "./visuals";

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsData {
  headline?: string;
  subheadline?: string;
  items?: TestimonialItem[];
}

export default function SectionTestimonials({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as TestimonialsData;
  const items = data.items || [];
  const themeMotion = useThemeMotion();
  const hasFeatured = items.length >= 3;
  const featured = hasFeatured ? items[0] : null;
  const gridItems = hasFeatured ? items.slice(1) : items;
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={500} x="85%" y="25%" opacity={0.06} blur={120} />
      <FloatingOrb color="var(--brand-accent, hsl(var(--primary)))" size={400} x="5%" y="75%" delay={4} opacity={0.05} blur={100} />
      <AbstractBlob
        variant={2}
        color="var(--brand-primary, hsl(var(--primary)))"
        size={300}
        opacity={0.04}
        className="absolute top-1/3 right-[10%] pointer-events-none hidden md:block"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              Testimonials
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-testimonials-headline">
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" data-testid="text-testimonials-subheadline"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow }}
            className="mb-10"
          >
            <AnimatedGradientBorder borderWidth={2} borderRadius={24}>
            <div 
              className="relative rounded-3xl border overflow-hidden"
              style={{
                background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.03) 0%, hsl(var(--card)) 30%)`,
                borderColor: "hsl(var(--border) / 0.5)"
              }}
            >
              <div className="absolute top-8 right-8 opacity-[0.04]">
                <Quote className="w-32 h-32" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
              </div>

              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-1 flex items-center justify-center p-8 md:p-12"
                  style={{ background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.05)" }}>
                  <motion.div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl md:text-4xl shadow-xl"
                    style={{ 
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                    }}
                    whileHover={{ scale: 1.05, rotate: 3 }}
                  >
                    {featured.author?.charAt(0) || "?"}
                  </motion.div>
                </div>

                <div className="md:col-span-4 p-8 md:p-12">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div key={star} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }} transition={{ delay: 0.1 + star * 0.06, type: "spring" }}>
                        <Star className="w-5 h-5" style={{ fill: "#facc15", color: "#facc15" }} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl leading-relaxed mb-8 font-light italic"
                    style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                    "{featured.quote}"
                  </p>
                  <div>
                    <p className="font-bold text-lg" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{featured.author}</p>
                    {(featured.role || featured.company) && (
                      <p className="text-sm" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        {featured.role}{featured.role && featured.company && " at "}{featured.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </AnimatedGradientBorder>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gridItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: themeMotion.duration, delay: index * 0.08 }}
              className="group relative"
              data-testid={`card-testimonial-${index}`}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <HoverTilt maxTilt={3} scale={1.01}>
              <div 
                className="relative h-full p-8 sm:p-10 rounded-3xl border backdrop-blur-sm transition-all duration-500"
                style={{
                  background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div className="absolute top-6 right-6 opacity-[0.06]">
                  <Quote className="w-12 h-12" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                </div>

                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4" style={{ fill: "#facc15", color: "#facc15" }} />
                  ))}
                </div>
                
                <p className="text-base sm:text-lg leading-relaxed relative z-10 mb-8"
                  style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                  "{item.quote}"
                </p>
                
                <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: "hsl(var(--border) / 0.3)" }}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                    }}
                  >
                    {item.author?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{item.author}</p>
                    {(item.role || item.company) && (
                      <p className="text-sm" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        {item.role}{item.role && item.company && " at "}{item.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              </HoverTilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
