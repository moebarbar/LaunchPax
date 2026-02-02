import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { SectionContent } from "@shared/schema";

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
  
  return (
    <section className="py-24 sm:py-32" data-testid="section-brand-story">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {data.headline && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        {data.origin && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">{data.origin.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {data.origin.content}
              </p>
            </div>
            {data.origin.image && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={data.origin.image}
                  alt={data.origin.title}
                  className="w-full h-auto"
                />
              </div>
            )}
          </motion.div>
        )}
        
        {(data.mission || data.vision) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {data.mission && (
              <div
                className="p-8 rounded-2xl"
                style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.05)" }}
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                >
                  {data.mission.title || "Our Mission"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {data.mission.content}
                </p>
              </div>
            )}
            {data.vision && (
              <div className="p-8 rounded-2xl bg-muted/50">
                <h3 className="text-xl font-bold mb-4">
                  {data.vision.title || "Our Vision"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {data.vision.content}
                </p>
              </div>
            )}
          </motion.div>
        )}
        
        {data.values && data.values.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-20"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">Our Values</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center p-6"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                  >
                    {value.icon || "✦"}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{value.name}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
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
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative bg-muted/30 rounded-3xl p-8 sm:p-12 mb-20"
          >
            <Quote
              className="absolute top-6 left-6 w-12 h-12 opacity-10"
              style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
            />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {data.founderQuote.image && (
                <img
                  src={data.founderQuote.image}
                  alt={data.founderQuote.author}
                  className="w-24 h-24 rounded-full object-cover shrink-0"
                />
              )}
              <div>
                <blockquote className="text-xl sm:text-2xl italic text-muted-foreground mb-6 leading-relaxed">
                  "{data.founderQuote.quote}"
                </blockquote>
                <div>
                  <p className="font-bold text-lg">{data.founderQuote.author}</p>
                  <p className="text-muted-foreground">{data.founderQuote.role}</p>
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
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">Our Journey</h3>
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2" />
              
              <div className="space-y-8">
                {data.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className={`relative md:flex md:items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div
                        className="w-4 h-4 rounded-full border-4 border-background"
                        style={{ backgroundColor: "var(--brand-primary, hsl(var(--primary)))" }}
                      />
                    </div>
                    
                    <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                      <div className="bg-card border border-border rounded-xl p-6 inline-block">
                        <span
                          className="text-sm font-bold"
                          style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                        >
                          {milestone.year}
                        </span>
                        <h4 className="text-lg font-bold mt-2">{milestone.title}</h4>
                        {milestone.description && (
                          <p className="text-muted-foreground mt-2 text-sm">{milestone.description}</p>
                        )}
                      </div>
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
