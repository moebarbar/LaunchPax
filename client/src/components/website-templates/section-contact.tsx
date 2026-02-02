import type { SectionContent } from "@shared/schema";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
  
  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/50" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10" 
          style={{ background: "var(--brand-primary, hsl(var(--primary)))" }} 
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
            Get in Touch
          </motion.span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            data-testid="text-contact-headline"
          >
            {data.headline || "Contact Us"}
          </h2>
          {data.subheadline && (
            <p 
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-testid="text-contact-subheadline"
            >
              {data.subheadline}
            </p>
          )}
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {data.email && (
              <div 
                className="group flex items-start gap-5 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.05) 100%)`
                  }}
                >
                  <Mail 
                    className="w-6 h-6" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Email</p>
                  <a 
                    href={`mailto:${data.email}`} 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link"
                    data-testid="link-contact-email"
                  >
                    {data.email}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>
            )}

            {data.phone && (
              <div 
                className="group flex items-start gap-5 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.05) 100%)`
                  }}
                >
                  <Phone 
                    className="w-6 h-6" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Phone</p>
                  <a 
                    href={`tel:${data.phone}`} 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link"
                    data-testid="link-contact-phone"
                  >
                    {data.phone}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>
            )}

            {data.address && (
              <div 
                className="group flex items-start gap-5 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--card)) 0%, 
                    hsl(var(--muted) / 0.3) 100%)`,
                  borderColor: "hsl(var(--border) / 0.5)"
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.15) 0%, 
                      hsl(var(--brand-primary-hsl, var(--primary)) / 0.05) 100%)`
                  }}
                >
                  <MapPin 
                    className="w-6 h-6" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">Address</p>
                  <p className="text-muted-foreground" data-testid="text-contact-address">{data.address}</p>
                </div>
              </div>
            )}
          </motion.div>
          
          {data.showForm !== false && (
            <motion.form 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 sm:p-10 rounded-3xl border backdrop-blur-sm space-y-6"
              style={{
                background: `linear-gradient(180deg, 
                  hsl(var(--card)) 0%, 
                  hsl(var(--muted) / 0.3) 100%)`,
                borderColor: "hsl(var(--border) / 0.5)"
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-sm font-medium">Your Name</Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="John Doe"
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50"
                  data-testid="input-contact-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sm font-medium">Your Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50"
                  data-testid="input-contact-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm font-medium">Your Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help you?"
                  rows={5}
                  className="resize-none rounded-xl bg-muted/30 border-border/50 focus:border-primary/50"
                  data-testid="input-contact-message"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                data-testid="button-contact-submit"
                style={{ 
                  background: `linear-gradient(135deg, 
                    var(--brand-primary, hsl(var(--primary))) 0%, 
                    var(--brand-secondary, hsl(var(--primary))) 100%)`
                }}
              >
                Send Message
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
