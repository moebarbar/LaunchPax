import type { SectionContent } from "@shared/schema";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqData {
  headline?: string;
  subheadline?: string;
  items?: FaqItem[];
}

export default function SectionFaq({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as FaqData;
  const items = data.items || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {data.headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            {data.subheadline && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-card rounded-lg border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover-elevate"
              >
                <span className="font-medium pr-4">{item.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
