import type { SectionContent } from "@shared/schema";
import { Quote, Star } from "lucide-react";

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
  
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-headline">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-testimonials-subheadline">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 relative group" data-testid={`card-testimonial-${index}`}>
              <div 
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-20"
                style={{ backgroundColor: "var(--brand-primary, hsl(var(--primary)))" }}
              >
                <Quote className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-4 h-4" 
                    style={{ 
                      fill: "var(--brand-accent, hsl(var(--primary)))",
                      color: "var(--brand-accent, hsl(var(--primary)))"
                    }}
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed text-base">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  style={{ 
                    background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)`
                  }}
                >
                  {item.author?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-semibold">{item.author}</p>
                  {(item.role || item.company) && (
                    <p className="text-sm text-muted-foreground">
                      {item.role}{item.role && item.company && " at "}{item.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
