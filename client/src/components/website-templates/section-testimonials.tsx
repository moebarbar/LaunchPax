import type { SectionContent } from "@shared/schema";
import { Quote } from "lucide-react";

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
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
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="bg-card p-8 rounded-lg border relative">
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              <p className="text-muted-foreground mb-6 relative z-10 italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
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
