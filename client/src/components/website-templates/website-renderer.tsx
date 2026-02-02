import type { WebsiteContent, PageContent, SectionContent, GlobalContent } from "@shared/schema";
import SectionHero from "./section-hero";
import SectionFeatures from "./section-features";
import SectionCta from "./section-cta";
import SectionContact from "./section-contact";
import SectionText from "./section-text";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface WebsiteRendererProps {
  content: WebsiteContent;
  pageSlug?: string;
  isPreview?: boolean;
}

function sanitizeHref(href: string): string {
  if (!href) return "#";
  
  const trimmed = href.trim().toLowerCase();
  
  if (trimmed.startsWith("javascript:") || 
      trimmed.startsWith("data:") || 
      trimmed.startsWith("vbscript:")) {
    return "#";
  }
  
  if (href.startsWith("/") || 
      href.startsWith("#") ||
      href.startsWith("http://") || 
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")) {
    return href;
  }
  
  return "#" + href;
}

function SectionRenderer({ section, globalContent }: { section: SectionContent; globalContent?: GlobalContent }) {
  switch (section.type) {
    case "hero":
      return <SectionHero section={section} siteName={globalContent?.siteName} />;
    case "features":
      return <SectionFeatures section={section} />;
    case "cta":
      return <SectionCta section={section} />;
    case "contact":
      return <SectionContact section={section} />;
    case "text":
      return <SectionText section={section} />;
    default:
      return null;
  }
}

function WebsiteHeader({ globalContent }: { globalContent?: GlobalContent }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = globalContent?.navigation || [];
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="font-bold text-xl">
            {globalContent?.siteName || "Website"}
          </a>
          
          {navigation.length > 0 && (
            <>
              <div className="hidden md:flex items-center gap-6">
                {navigation.map((item, index) => (
                  <a
                    key={index}
                    href={sanitizeHref(item.href)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
        
        {mobileMenuOpen && navigation.length > 0 && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            {navigation.map((item, index) => (
              <a
                key={index}
                href={sanitizeHref(item.href)}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

function WebsiteFooter({ globalContent }: { globalContent?: GlobalContent }) {
  const footer = globalContent?.footer;
  
  return (
    <footer className="bg-muted py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-bold text-lg mb-2">{globalContent?.siteName || "Website"}</p>
            <p className="text-muted-foreground text-sm">
              {footer?.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
            </p>
          </div>
          
          {footer?.links && footer.links.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {footer.links.map((link, index) => (
                <a
                  key={index}
                  href={sanitizeHref(link.href)}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default function WebsiteRenderer({ content, pageSlug = "home", isPreview = false }: WebsiteRendererProps) {
  const pages = content.pages || [];
  const currentPage = pages.find(p => p.slug === pageSlug) || pages[0];
  const globalContent = content.globalContent;
  
  if (!currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Content Yet</h1>
          <p className="text-muted-foreground">Generate website content to see your preview.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-background ${isPreview ? "preview-mode" : ""}`}>
      <WebsiteHeader globalContent={globalContent} />
      
      <main>
        {currentPage.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} globalContent={globalContent} />
        ))}
      </main>
      
      <WebsiteFooter globalContent={globalContent} />
    </div>
  );
}
