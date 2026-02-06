import type { SectionContent } from "@shared/schema";
import { Mail, Phone, MapPin, Send, ArrowRight, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useThemeMotion } from "./motion-wrapper";
import { FloatingOrb, DotGrid, ShineEffect } from "./visuals/floating-elements";

interface ContactData {
  headline?: string;
  subheadline?: string;
  email?: string;
  phone?: string;
  address?: string;
  showForm?: boolean;
}

export default function SectionContact({ section }: { section: SectionContent }) {
  const data = (section.data || {}) as ContactData;
  const themeMotion = useThemeMotion();
  
  const contactItems = [
    { icon: Mail, label: "Email", value: data.email, href: data.email ? `mailto:${data.email}` : undefined, testId: "link-contact-email" },
    { icon: Phone, label: "Phone", value: data.phone, href: data.phone ? `tel:${data.phone}` : undefined, testId: "link-contact-phone" },
    { icon: MapPin, label: "Address", value: data.address, testId: "text-contact-address" },
  ].filter(item => item.value);

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/50" />
      <FloatingOrb color="var(--brand-primary, hsl(var(--primary)))" size={400} x="80%" y="60%" opacity={0.06} blur={120} />
      <DotGrid opacity={0.015} spacing={50} />

      <div className="max-w-6xl mx-auto relative z-10">
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
            <MessageCircle className="w-4 h-4" />
            Get in Touch
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight" data-testid="text-contact-headline"
            style={{ color: "var(--brand-heading, var(--brand-text, hsl(var(--foreground))))" }}>
            {data.headline || "Contact Us"}
          </h2>
          {data.subheadline && (
            <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-subheadline"
              style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: themeMotion.duration, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                className="group flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300"
                style={{
                  background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.08 }}
                whileHover={{ y: -3, boxShadow: "0 15px 30px rgba(0,0,0,0.08)" }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                >
                  <item.icon className="w-5 h-5" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                </div>
                <div>
                  <p className="font-semibold text-base mb-1" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm flex items-center gap-1 group/link"
                      style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}
                      data-testid={item.testId}>
                      {item.value}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                    </a>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }} data-testid={item.testId}>{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              className="p-5 rounded-2xl border backdrop-blur-sm"
              style={{
                background: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.04)",
                borderColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)"
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: "var(--brand-primary, hsl(var(--primary)))" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--brand-text, hsl(var(--foreground)))" }}>Quick Response</p>
                  <p className="text-xs" style={{ color: "var(--brand-muted-text, hsl(var(--muted-foreground)))" }}>We typically respond within 24 hours</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {data.showForm !== false && (
            <motion.form 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: themeMotion.duration, delay: 0.2 }}
              className="lg:col-span-3 p-8 sm:p-10 rounded-3xl border backdrop-blur-sm space-y-6"
              style={{
                background: `linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)`,
                borderColor: "hsl(var(--border) / 0.5)"
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-sm font-medium">Your Name</Label>
                  <Input id="contact-name" type="text" placeholder="John Doe"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50" data-testid="input-contact-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-sm font-medium">Your Email</Label>
                  <Input id="contact-email" type="email" placeholder="john@example.com"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50" data-testid="input-contact-email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subject" className="text-sm font-medium">Subject</Label>
                <Input id="contact-subject" type="text" placeholder="How can we help?"
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50" data-testid="input-contact-subject" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm font-medium">Your Message</Label>
                <Textarea id="contact-message" placeholder="Tell us more about your project..."
                  rows={5} className="resize-none rounded-xl bg-muted/30 border-border/50 focus:border-primary/50" data-testid="input-contact-message" />
              </div>
              <ShineEffect>
                <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg group" data-testid="button-contact-submit"
                  style={{ background: `linear-gradient(135deg, var(--brand-primary, hsl(var(--primary))) 0%, var(--brand-secondary, hsl(var(--primary))) 100%)` }}>
                  Send Message
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </ShineEffect>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
