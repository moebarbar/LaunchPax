import type { SectionContent } from "@shared/schema";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function SectionTestimonials({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as TestimonialsData;
  const items = data.items || [];
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10" 
          style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} 
        />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10" 
          style={{ background: "var(--brand-accent, hsl(var(--primary)))" }} 
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-testimonials-subheadline">
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group relative"
              data-testid={`card-testimonial-${index}`}
            >
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ 
                  background: `linear-gradient(135deg, 
                    hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, 
                    transparent 70%)`
                }}
              />
              
              <div 
                className="relative h-full p-8 sm:p-10 rounded-3xl border backdrop-blur-sm transition-all duration-500 group-hover:border-primary/20 group-hover:shadow-xl"
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                      style={{ 
                        fill: "#facc15",
                        color: "#facc15"
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative mb-8">
                  <Quote 
                    className="absolute -top-2 -left-2 w-10 h-10 opacity-10"
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                  <p className="text-base sm:text-lg leading-relaxed relative z-10 pl-4">
                    "{item.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        var(--brand-primary, hsl(var(--primary))) 0%, 
                        var(--brand-secondary, hsl(var(--primary))) 100%)`
                    }}
                  >
                    {item.author?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{item.author}</p>
                    {(item.role || item.company) && (
                      <p className="text-sm text-muted-foreground">
                        {item.role}{item.role && item.company && " at "}{item.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
