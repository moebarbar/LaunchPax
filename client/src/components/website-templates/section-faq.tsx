import type { SectionContent } from "@shared/schema";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

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
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        {data.headline && (
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-faq-headline"
            >
              {data.headline}
            </h2>
            {data.subheadline && (
              <p 
                className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                data-testid="text-faq-subheadline"
              >
                {data.subheadline}
              </p>
            )}
          </div>
        )}
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="rounded-xl border bg-card shadow-sm data-[state=open]:shadow-md"
              data-testid={`faq-item-${index}`}
              style={{
                borderColor: undefined
              }}
            >
              <AccordionTrigger 
                className="px-4 sm:px-6 hover:no-underline text-left"
                data-testid={`button-faq-toggle-${index}`}
              >
                <span className="font-semibold text-base sm:text-lg pr-4">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6">
                <p 
                  className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                  data-testid={`text-faq-answer-${index}`}
                >
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
