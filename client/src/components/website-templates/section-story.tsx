import type { SectionContent } from "@shared/schema";
import { motion } from "framer-motion";

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

  if (layout === "editorial") {
    return (
      <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
            >
              {data.headline && (
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
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
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {data.subheadline}
                </p>
              )}

              {data.stats && data.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-6 mt-10 pt-10 border-t border-border/50">
                  {data.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <p 
                        className="text-4xl font-bold tracking-tight"
                        style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 space-y-8"
            >
              {hasImage && (
                <div className="relative rounded-3xl overflow-hidden mb-12">
                  <div 
                    className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                  <img
                    src={imageUrl}
                    alt=""
                    className="relative w-full aspect-[16/10] object-cover rounded-3xl"
                  />
                </div>
              )}

              {paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`text-lg ${i === 0 ? 'text-2xl font-light leading-relaxed' : 'text-muted-foreground leading-relaxed'}`}
                >
                  {paragraph}
                </motion.p>
              ))}

              {data.quote && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative pl-8 py-4 border-l-4 mt-12"
                  style={{ borderColor: "var(--brand-primary, hsl(var(--primary)))" }}
                >
                  <p className="text-2xl font-medium italic leading-relaxed">
                    "{data.quote}"
                  </p>
                  {data.quoteAuthor && (
                    <footer className="mt-4 text-muted-foreground">
                      — {data.quoteAuthor}
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">
              {data.headline}
            </h2>
          )}
          
          {data.subheadline && (
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-12">
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
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-lg text-muted-foreground leading-relaxed"
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
