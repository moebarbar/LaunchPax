import type { SectionContent } from "@shared/schema";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            data-testid="text-contact-headline"
          >
            {data.headline || "Contact Us"}
          </h2>
          {data.subheadline && (
            <p 
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              data-testid="text-contact-subheadline"
            >
              {data.subheadline}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
            {data.email && (
              <div className="flex items-start gap-4 sm:gap-5">
                <div 
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                >
                  <Mail 
                    className="w-5 sm:w-6 h-5 sm:h-6" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-lg mb-1">Email</p>
                  <a 
                    href={`mailto:${data.email}`} 
                    className="text-muted-foreground hover:underline underline-offset-4 transition-colors"
                    data-testid="link-contact-email"
                  >
                    {data.email}
                  </a>
                </div>
              </div>
            )}
            {data.phone && (
              <div className="flex items-start gap-4 sm:gap-5">
                <div 
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                >
                  <Phone 
                    className="w-5 sm:w-6 h-5 sm:h-6" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-lg mb-1">Phone</p>
                  <a 
                    href={`tel:${data.phone}`} 
                    className="text-muted-foreground hover:underline underline-offset-4 transition-colors"
                    data-testid="link-contact-phone"
                  >
                    {data.phone}
                  </a>
                </div>
              </div>
            )}
            {data.address && (
              <div className="flex items-start gap-4 sm:gap-5">
                <div 
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "hsl(var(--brand-primary-hsl, var(--primary)) / 0.1)" }}
                >
                  <MapPin 
                    className="w-5 sm:w-6 h-5 sm:h-6" 
                    style={{ color: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-lg mb-1">Address</p>
                  <p className="text-muted-foreground" data-testid="text-contact-address">{data.address}</p>
                </div>
              </div>
            )}
          </div>
          
          {data.showForm !== false && (
            <form className="bg-card p-6 sm:p-8 rounded-2xl border shadow-sm space-y-4 sm:space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="contact-name">Your Name</Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="John Doe"
                  data-testid="input-contact-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Your Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  data-testid="input-contact-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Your Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help you?"
                  rows={4}
                  className="resize-none"
                  data-testid="input-contact-message"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                data-testid="button-contact-submit"
                style={{ 
                  backgroundColor: "var(--brand-primary, hsl(var(--primary)))",
                  borderColor: "var(--brand-primary, hsl(var(--primary)))"
                }}
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
