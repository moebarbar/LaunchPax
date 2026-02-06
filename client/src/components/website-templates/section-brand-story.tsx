import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { SectionContent } from "@shared/schema";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, DotGrid, ShineEffect } from "./visuals/floating-elements";

interface BrandStoryData {
  headline?: string;
  subheadline?: string;
  origin?: {
    title: string;
    content: string;
    image?: string;
  };
  mission?: {
    title: string;
    content: string;
  };
  vision?: {
    title: string;
    content: string;
  };
  values?: {
    name: string;
    description: string;
    icon?: string;
  }[];
  founderQuote?: {
    quote: string;
    author: string;
    role: string;
    image?: string;
  };
  milestones?: {
    year: string;
    title: string;
    description?: string;
  }[];
}

export function SectionBrandStory({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as BrandStoryData;
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" data-testid="section-brand-story">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb size={500} x="15%" y="10%" opacity={0.05} />
        <FloatingOrb size={350} x="80%" y="70%" opacity={0.03} delay={4} />
        <DotGrid opacity={0.015} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: themeMotion.duration }}
          className="text-center mb-16"
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="text-lg sm:text-xl max-w-3xl mx-auto"
              style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        {data.origin && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-24"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6"
                style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                {data.origin.title}
              </h3>
              <p className="text-lg leading-relaxed whitespace-pre-line"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {data.origin.content}
              </p>
            </div>
            {data.origin.image ? (
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <img src={data.origin.image} alt={data.origin.title} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            ) : (
              <motion.div
                className="relative aspect-video rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(var(--brand-primary-hsl, var(--primary)) / 0.1) 0%, 
                    hsl(var(--brand-primary-hsl, var(--primary)) / 0.03) 100%)`,
                  border: "1px solid var(--brand-border, hsl(var(--border)))",
                }}
                whileHover={{ y: -4 }}
              >
                <FloatingOrb size={200} x="50%" y="50%" opacity={0.1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-7xl font-black opacity-10"
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    est.
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {(data.mission || data.vision) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-8 mb-24"
          >
            {data.mission && (
              <motion.div
                className="p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden"
                style={{
                  backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                  border: "1px solid var(--brand-border, hsl(var(--border)))",
                }}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))))` }} />
                <h3 className="text-xl font-bold mb-4"
                  style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                  {data.mission.title || "Our Mission"}
                </h3>
                <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }} className="leading-relaxed">
                  {data.mission.content}
                </p>
              </motion.div>
            )}
            {data.vision && (
              <motion.div
                className="p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden"
                style={{
                  backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                  border: "1px solid var(--brand-border, hsl(var(--border)))",
                }}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, var(--brand-accent, hsl(var(--primary))), var(--brand-secondary, hsl(var(--primary))))` }} />
                <h3 className="text-xl font-bold mb-4"
                  style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                  {data.vision.title || "Our Vision"}
                </h3>
                <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }} className="leading-relaxed">
                  {data.vision.content}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {data.values && data.values.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow, delay: 0.2 }}
            className="mb-24"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12"
              style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
              Our Values
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: themeMotion.duration, delay: 0.1 * index }}
                  className="text-center p-8 rounded-2xl backdrop-blur-sm"
                  style={{
                    backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                    border: "1px solid var(--brand-border, hsl(var(--border)))",
                  }}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--brand-primary-hsl, var(--primary)) / 0.15), hsl(var(--brand-primary-hsl, var(--primary)) / 0.05))`,
                      color: "var(--brand-primary, hsl(var(--primary)))",
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {value.icon || (index + 1).toString().padStart(2, '0')}
                  </motion.div>
                  <h4 className="text-xl font-bold mb-3"
                    style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                    {value.name}
                  </h4>
                  <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {data.founderQuote && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow, delay: 0.3 }}
            className="relative rounded-3xl p-8 sm:p-12 mb-24 backdrop-blur-sm overflow-hidden"
            style={{
              backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
              border: "1px solid var(--brand-border, hsl(var(--border)))",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))), var(--brand-secondary, hsl(var(--primary))))` }} />

            <Quote className="absolute top-6 left-6 w-16 h-16 opacity-5"
              style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {data.founderQuote.image && (
                <div className="relative shrink-0">
                  <motion.div
                    className="absolute -inset-1 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))))`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <img
                    src={data.founderQuote.image}
                    alt={data.founderQuote.author}
                    className="relative w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              <div>
                <blockquote className="text-xl sm:text-2xl italic mb-6 leading-relaxed"
                  style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                  "{data.founderQuote.quote}"
                </blockquote>
                <div>
                  <p className="font-bold text-lg"
                    style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                    {data.founderQuote.author}
                  </p>
                  <p style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                    {data.founderQuote.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {data.milestones && data.milestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.durationSlow, delay: 0.4 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12"
              style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
              Our Journey
            </h3>
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2"
                style={{
                  background: `linear-gradient(to bottom, transparent, var(--brand-primary, hsl(var(--primary))), transparent)`,
                  opacity: 0.3,
                }} />
              
              <div className="space-y-8">
                {data.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: themeMotion.duration, delay: 0.1 * index }}
                    className={`relative md:flex md:items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                      <motion.div
                        className="w-4 h-4 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))), var(--brand-accent, hsl(var(--primary))))`,
                          boxShadow: "0 0 20px hsl(var(--brand-primary-hsl, var(--primary)) / 0.3)",
                        }}
                        whileInView={{ scale: [0, 1.3, 1] }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index + 0.2 }}
                      />
                    </div>
                    
                    <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                      <motion.div
                        className="p-6 rounded-xl inline-block backdrop-blur-sm"
                        style={{
                          backgroundColor: "var(--brand-card-bg, hsl(var(--card)))",
                          border: "1px solid var(--brand-border, hsl(var(--border)))",
                        }}
                        whileHover={{ y: -4, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                      >
                        <span className="text-sm font-bold"
                          style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}>
                          {milestone.year}
                        </span>
                        <h4 className="text-lg font-bold mt-2"
                          style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="mt-2 text-sm"
                            style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                            {milestone.description}
                          </p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
