import type { SectionContent } from "@shared/schema";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactData {
  headline?: string;
  subheadline?: string;
  email?: string;
  phone?: string;
  address?: string;
  showForm?: boolean;
}

export default function SectionContact({ section }: { section: SectionContent }) {
  const data = section.data as ContactData;
  
  return (
    <section id="contact" className="py-16 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {data.headline || "Contact Us"}
          </h2>
          {data.subheadline && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{data.subheadline}</p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {data.email && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${data.email}`} className="text-muted-foreground hover:text-foreground">
                    {data.email}
                  </a>
                </div>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href={`tel:${data.phone}`} className="text-muted-foreground hover:text-foreground">
                    {data.phone}
                  </a>
                </div>
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{data.address}</p>
                </div>
              </div>
            )}
          </div>
          
          {data.showForm !== false && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2 transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
