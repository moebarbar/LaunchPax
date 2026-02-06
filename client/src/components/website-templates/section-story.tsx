import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, DotGrid } from "./visuals/floating-elements";

interface StoryData {
  headline?: string;
  subheadline?: string;
  paragraphs?: string[];
  image?: string;
  imageB64?: string;
  quote?: string;
  quoteAuthor?: string;
  stats?: { value: string; label: string }[];
  layout?: "left" | "right" | "center" | "editorial";
}

export default function SectionStory({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as StoryData;
  const paragraphs = data.paragraphs || [];
  const layout = data.layout || "editorial";
  const hasImage = data.image || data.imageB64;
  const imageUrl = data.imageB64 ? `data:image/png;base64,${data.imageB64}` : data.image;
  const themeMotion = useThemeMotion();

  if (layout === "editorial") {
    return (
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <FloatingOrb size={400} x="5%" y="30%" opacity={0.04} />
          <FloatingOrb size={300} x="90%" y="60%" opacity={0.03} delay={3} />
          <DotGrid opacity={0.01} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: themeMotion.durationSlow }}
              className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
            >
              {data.headline && (
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
                  style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                  {data.headline.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <span 
                          className="bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-accent, hsl(var(--primary))) 100%)`
                          }}
                        >
                          {word}
                        </span>
                      ) : (
                        word + ' '
                      )}
                    </span>
                  ))}
                </h2>
              )}
              
              {data.subheadline && (
                <p className="text-xl leading-relaxed"
                  style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                  {data.subheadline}
                </p>
              )}

              {data.stats && data.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-6 mt-10 pt-10"
                  style={{ borderTop: "1px solid var(--brand-border, hsl(var(--border)))" }}>
                  {data.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: themeMotion.duration }}
                    >
                      <p className="text-4xl font-bold tracking-tight"
                        style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                        {stat.value}
                      </p>
                      <p className="text-sm mt-1"
                        style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: themeMotion.durationSlow, delay: 0.2 }}
              className="lg:col-span-7 space-y-8"
            >
              {hasImage && (
                <motion.div
                  className="relative rounded-3xl overflow-hidden mb-12"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} />
                  <img src={imageUrl} alt="" className="relative w-full aspect-[16/10] object-cover rounded-3xl" />
                </motion.div>
              )}

              {paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: themeMotion.duration }}
                  className={`text-lg ${i === 0 ? 'text-2xl font-light leading-relaxed' : 'leading-relaxed'}`}
                  style={{ color: i === 0 ? "var(--brand-text, hsl(var(--foreground)))" : "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
                >
                  {paragraph}
                </motion.p>
              ))}

              {data.quote && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: themeMotion.duration }}
                  className="relative pl-8 py-4 mt-12"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                    style={{ background: `linear-gradient(to bottom, var(--brand-primary, hsl(var(--primary))), transparent)` }} />
                  <p className="text-2xl font-medium italic leading-relaxed"
                    style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                    "{data.quote}"
                  </p>
                  {data.quoteAuthor && (
                    <footer className="mt-4"
                      style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                      - {data.quoteAuthor}
                    </footer>
                  )}
                </motion.blockquote>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={350} x="50%" y="30%" opacity={0.04} />
        <DotGrid opacity={0.01} />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.durationSlow }}
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8"
              style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
              {data.headline}
            </h2>
          )}
          
          {data.subheadline && (
            <p className="text-xl sm:text-2xl leading-relaxed mb-12"
              style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
              {data.subheadline}
            </p>
          )}

          <div className="space-y-6 text-left">
            {paragraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: themeMotion.duration }}
                className="text-lg leading-relaxed"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
