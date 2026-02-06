import type { SectionContent } from "@shared/schema";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare } from "lucide-react";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb } from "./visuals/floating-elements";

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
  const themeMotion = useThemeMotion();
  
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={350} x="90%" y="40%" opacity={0.05} blur={100} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {data.headline && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration }}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-faq-headline"
              style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}>
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" data-testid="text-faq-subheadline"
                style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {data.subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-3">
            <motion.div
              className="sticky top-24 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-5 rounded-2xl border"
                style={{
                  background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.04)",
                  borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)"
                }}>
                <MessageSquare className="w-8 h-8 mb-3" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>Still have questions?</p>
                <p className="text-xs" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                  We're here to help. Contact our support team.
                </p>
              </div>
              <div className="text-center text-xs font-medium" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                {items.length} questions answered
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-9">
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: themeMotion.duration, delay: index * 0.05 }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className="rounded-2xl border backdrop-blur-sm transition-all duration-300 data-[state=open]:shadow-lg overflow-hidden"
                    data-testid={`faq-item-${index}`}
                    style={{
                      background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)`,
                      borderColor: "hsl(var(--border) / 0.5)"
                    }}
                  >
                    <AccordionTrigger 
                      className="px-6 sm:px-8 py-5 sm:py-6 hover:no-underline text-left group"
                      data-testid={`button-faq-toggle-${index}`}
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="text-xs font-bold flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)",
                            color: "var(--brand-primary, hsl(var(--primary)))"
                          }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-semibold text-base sm:text-lg"
                          style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <div className="pl-9">
                        <p className="text-base leading-relaxed" data-testid={`text-faq-answer-${index}`}
                          style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
                          {item.answer}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
