import type { SectionContent } from "@shared/schema";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

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
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      
      <div className="max-w-4xl mx-auto relative z-10">
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                color: "var(--brand-primary, hsl(var(--primary)))"
              }}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </motion.span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              data-testid="text-faq-headline"
            >
              {data.headline}
            </h2>
            {data.subheadline && (
              <p 
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                data-testid="text-faq-subheadline"
              >
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <AccordionItem 
                value={`item-${index}`}
                className="rounded-2xl border backdrop-blur-sm transition-all duration-300 data-[state=open]:shadow-lg overflow-hidden"
                data-testid={`faq-item-${index}`}
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <AccordionTrigger 
                  className="px-6 sm:px-8 py-5 sm:py-6 hover:no-underline text-left group"
                  data-testid={`button-faq-toggle-${index}`}
                >
                  <span className="font-semibold text-base sm:text-lg pr-4 group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <p 
                    className="text-base text-muted-foreground leading-relaxed"
                    data-testid={`text-faq-answer-${index}`}
                  >
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
