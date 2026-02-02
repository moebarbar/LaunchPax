import type { WebsiteContent, PageContent, SectionContent, GlobalContent, SeoMeta } from "@shared/schema";
import SectionHero from "./section-hero";
import SectionFeatures from "./section-features";
import SectionCta from "./section-cta";
import SectionContact from "./section-contact";
import SectionText from "./section-text";
import SectionTestimonials from "./section-testimonials";
import SectionPricing from "./section-pricing";
import SectionTeam from "./section-team";
import SectionFaq from "./section-faq";
import SectionStats from "./section-stats";
import SectionServices from "./section-services";
import SectionGallery from "./section-gallery";
import SectionStory from "./section-story";
import { SectionProcess } from "./section-process";
import { SectionCaseStudies } from "./section-case-studies";
import { SectionTrustSignals } from "./section-trust-signals";
import { SectionBenefits } from "./section-benefits";
import { SectionComparison } from "./section-comparison";
import { SectionBrandStory } from "./section-brand-story";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

function useSeoMeta(
  siteName?: string, 
  pageTitle?: string, 
  seo?: SeoMeta,
  siteSettings?: WebsiteContent["siteSettings"]
) {
  useEffect(() => {
    const fullTitle = pageTitle 
      ? `${pageTitle} | ${siteName || "Website"}` 
      : (siteName || "Website");
    
    document.title = seo?.title || fullTitle;
    
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    
    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    
    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };
    
    if (seo?.description) {
      updateMeta("description", seo.description);
      updateProperty("og:description", seo.description);
      updateMeta("twitter:description", seo.description);
    }
    
    if (seo?.keywords?.length) {
      updateMeta("keywords", seo.keywords.join(", "));
    }
    
    updateProperty("og:title", seo?.title || fullTitle);
    updateProperty("og:type", seo?.ogType || "website");
    
    if (siteName) {
      updateProperty("og:site_name", siteName);
    }
    
    if (seo?.ogUrl) {
      updateProperty("og:url", seo.ogUrl);
    }
    
    if (seo?.canonicalUrl) {
      updateLink("canonical", seo.canonicalUrl);
    }
    
    if (seo?.ogImage) {
      updateProperty("og:image", seo.ogImage);
      updateMeta("twitter:image", seo.ogImage);
    }
    
    updateMeta("twitter:card", seo?.twitterCard || "summary_large_image");
    updateMeta("twitter:title", seo?.title || fullTitle);
    
    if (siteSettings?.primaryColor) {
      updateMeta("theme-color", siteSettings.primaryColor);
    }
    
    updateMeta("robots", "index, follow");
    updateMeta("viewport", "width=device-width, initial-scale=1");
    
    const existingJsonLd = document.querySelector('script[data-structured-data]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName || "Website",
      "description": seo?.description || "",
      "url": seo?.ogUrl || window.location.origin,
      ...(seo?.ogImage && { "logo": seo.ogImage }),
    };
    
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-structured-data", "true");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.querySelector('script[data-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [siteName, pageTitle, seo, siteSettings]);
}

const popularFontPairings: Record<string, { heading: string; body: string }> = {
  modern: { heading: "Inter", body: "Inter" },
  classic: { heading: "Playfair Display", body: "Lora" },
  elegant: { heading: "Cormorant Garamond", body: "Proza Libre" },
  tech: { heading: "Space Grotesk", body: "Work Sans" },
  bold: { heading: "Oswald", body: "Open Sans" },
  minimal: { heading: "DM Sans", body: "DM Sans" },
  creative: { heading: "Poppins", body: "Nunito" },
  professional: { heading: "Montserrat", body: "Source Sans 3" },
};

function useGoogleFonts(headingFont?: string, bodyFont?: string) {
  useEffect(() => {
    const fonts: string[] = [];
    
    if (headingFont) {
      fonts.push(`family=${headingFont.replace(/ /g, "+")}:wght@400;500;600;700;800`);
    }
    if (bodyFont && bodyFont !== headingFont) {
      fonts.push(`family=${bodyFont.replace(/ /g, "+")}:wght@300;400;500;600`);
    }
    
    if (fonts.length === 0) return;
    
    const existingLink = document.querySelector('link[data-google-fonts]');
    if (existingLink) {
      existingLink.remove();
    }
    
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap`;
    link.setAttribute("data-google-fonts", "true");
    document.head.appendChild(link);
    
    return () => {
      const linkToRemove = document.querySelector('link[data-google-fonts]');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [headingFont, bodyFont]);
}

interface WebsiteRendererProps {
  content: WebsiteContent;
  pageSlug?: string;
  isPreview?: boolean;
  onNavigate?: (pageSlug: string) => void;
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
    case "testimonials":
      return <SectionTestimonials section={section} />;
    case "pricing":
      return <SectionPricing section={section} />;
    case "team":
      return <SectionTeam section={section} />;
    case "faq":
      return <SectionFaq section={section} />;
    case "stats":
      return <SectionStats section={section} />;
    case "services":
      return <SectionServices section={section} />;
    case "gallery":
      return <SectionGallery section={section} />;
    case "story":
      return <SectionStory section={section} />;
    case "process":
      return <SectionProcess section={section} />;
    case "case_studies":
      return <SectionCaseStudies section={section} />;
    case "trust_signals":
      return <SectionTrustSignals section={section} />;
    case "benefits":
      return <SectionBenefits section={section} />;
    case "comparison":
      return <SectionComparison section={section} />;
    case "brand_story":
      return <SectionBrandStory section={section} />;
    default:
      return null;
  }
}

function WebsiteHeader({ globalContent, onNavigate, siteSettings }: { globalContent?: GlobalContent; onNavigate?: (pageSlug: string) => void; siteSettings?: WebsiteContent["siteSettings"] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigation = globalContent?.navigation || [];
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate && href.startsWith("/")) {
      e.preventDefault();
      const slug = href === "/" ? "home" : href.substring(1);
      onNavigate(slug);
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            className="font-bold text-xl flex items-center gap-3 group"
            onClick={(e) => handleNavClick(e, "/")}
          >
            {(globalContent as any)?.logoB64 ? (
              <div className="relative">
                <div 
                  className="absolute inset-0 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"
                  style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                />
                <img 
                  src={`data:image/png;base64,${(globalContent as any).logoB64}`}
                  alt={`${globalContent?.siteName || "Website"} logo`}
                  className="h-10 w-10 object-contain relative"
                />
              </div>
            ) : globalContent?.logo ? (
              <img 
                src={globalContent.logo}
                alt={`${globalContent?.siteName || "Website"} logo`}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ 
                  background: `linear-gradient(135deg, 
                    var(--brand-primary, hsl(var(--primary))) 0%, 
                    var(--brand-secondary, hsl(var(--primary))) 100%)`
                }}
              >
                {(globalContent?.siteName || "W").charAt(0)}
              </div>
            )}
            <span className="hidden sm:inline-block tracking-tight">
              {globalContent?.siteName || "Website"}
            </span>
          </a>
          
          {navigation.length > 0 && (
            <>
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item, index) => (
                  <a
                    key={index}
                    href={sanitizeHref(item.href)}
                    className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="ml-2 px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, 
                      var(--brand-primary, hsl(var(--primary))) 0%, 
                      var(--brand-secondary, hsl(var(--primary))) 100%)`
                  }}
                >
                  Get Started
                </a>
              </div>
              
              <button
                className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
        
        {mobileMenuOpen && navigation.length > 0 && (
          <div className="md:hidden pt-4 pb-4 space-y-1 border-t mt-4">
            {navigation.map((item, index) => (
              <a
                key={index}
                href={sanitizeHref(item.href)}
                className="block py-3 px-4 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block py-3 px-4 rounded-xl text-center text-white font-medium mt-2"
              style={{ 
                background: `linear-gradient(135deg, 
                  var(--brand-primary, hsl(var(--primary))) 0%, 
                  var(--brand-secondary, hsl(var(--primary))) 100%)`
              }}
            >
              Get Started
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}

function WebsiteFooter({ globalContent, siteSettings }: { globalContent?: GlobalContent; siteSettings?: WebsiteContent["siteSettings"] }) {
  const footer = globalContent?.footer;
  const navigation = globalContent?.navigation || [];
  
  return (
    <footer className="relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(var(--muted) / 0.5) 0%, 
            hsl(var(--muted)) 50%,
            hsl(var(--muted)) 100%)`
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ 
                  background: `linear-gradient(135deg, 
                    var(--brand-primary, hsl(var(--primary))) 0%, 
                    var(--brand-secondary, hsl(var(--primary))) 100%)`
                }}
              >
                {(globalContent?.siteName || "W").charAt(0)}
              </div>
              <span className="font-bold text-xl tracking-tight">
                {globalContent?.siteName || "Website"}
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-6">
              {globalContent?.tagline || "Building the future, one step at a time."}
            </p>
            {footer?.socialLinks && footer.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {footer.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={sanitizeHref(social.url)}
                    className="w-10 h-10 rounded-full bg-muted-foreground/10 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{social.platform}</span>
                    {social.platform === "twitter" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    )}
                    {social.platform === "linkedin" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    )}
                    {social.platform === "facebook" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    )}
                    {social.platform === "instagram" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {navigation.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">Navigation</h4>
              <ul className="space-y-3">
                {navigation.map((item, index) => (
                  <li key={index}>
                    <a
                      href={sanitizeHref(item.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {footer?.links && footer.links.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">Legal</h4>
              <ul className="space-y-3">
                {footer.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={sanitizeHref(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {footer?.copyright || `© ${new Date().getFullYear()} ${globalContent?.siteName || "Website"}. All rights reserved.`}
            </p>
            <p className="text-muted-foreground/60 text-xs">
              Built with care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function hexToHSL(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 0%";
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function generateBrandStyles(siteSettings: WebsiteContent["siteSettings"]): React.CSSProperties {
  if (!siteSettings) return {};
  
  const { primaryColor, secondaryColor, accentColor, fontFamily, headingFont, style } = siteSettings;
  
  const styles: Record<string, string> = {};
  
  if (primaryColor) {
    styles["--brand-primary"] = primaryColor;
    styles["--brand-primary-hsl"] = hexToHSL(primaryColor);
  }
  if (secondaryColor) {
    styles["--brand-secondary"] = secondaryColor;
    styles["--brand-secondary-hsl"] = hexToHSL(secondaryColor);
  }
  if (accentColor) {
    styles["--brand-accent"] = accentColor;
    styles["--brand-accent-hsl"] = hexToHSL(accentColor);
  }
  
  const pairing = style && popularFontPairings[style];
  const resolvedHeadingFont = headingFont || pairing?.heading || "Inter";
  const resolvedBodyFont = fontFamily || pairing?.body || "Inter";
  
  styles["--font-heading"] = `"${resolvedHeadingFont}", sans-serif`;
  styles["--font-body"] = `"${resolvedBodyFont}", sans-serif`;
  
  return styles as React.CSSProperties;
}

function getFontsFromSettings(siteSettings?: WebsiteContent["siteSettings"]): { heading: string; body: string } {
  if (!siteSettings) return { heading: "Inter", body: "Inter" };
  
  const { fontFamily, headingFont, style } = siteSettings;
  const pairing = style && popularFontPairings[style];
  
  return {
    heading: headingFont || pairing?.heading || "Inter",
    body: fontFamily || pairing?.body || "Inter"
  };
}

export default function WebsiteRenderer({ content, pageSlug = "home", isPreview = false, onNavigate }: WebsiteRendererProps) {
  const pages = content.pages || [];
  const currentPage = pages.find(p => p.slug === pageSlug) || pages[0];
  const globalContent = content.globalContent;
  const siteSettings = content.siteSettings;
  
  const fonts = getFontsFromSettings(siteSettings);
  useGoogleFonts(fonts.heading, fonts.body);
  
  const baseSeo: SeoMeta = content.seo || {
    title: globalContent?.siteName,
    description: `Welcome to ${globalContent?.siteName || "our website"}`,
  };
  
  const pageSeo: SeoMeta = {
    ...baseSeo,
    description: (currentPage as any)?.metaDescription || baseSeo.description,
  };
  
  useSeoMeta(
    globalContent?.siteName,
    currentPage?.title,
    pageSeo,
    siteSettings
  );
  
  const brandStyles = generateBrandStyles(siteSettings);
  
  if (!currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" style={brandStyles}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">404 Page Not Found</h1>
          <p className="text-muted-foreground">The page "{pageSlug}" doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  const combinedStyles: React.CSSProperties = {
    ...brandStyles,
    fontFamily: `var(--font-body, "Inter", sans-serif)`,
  };

  return (
    <div className={`min-h-screen bg-background ${isPreview ? "preview-mode" : ""}`} style={combinedStyles}>
      <style>{`
        .preview-mode h1, .preview-mode h2, .preview-mode h3, .preview-mode h4, .preview-mode h5, .preview-mode h6 {
          font-family: var(--font-heading, "Inter", sans-serif);
        }
      `}</style>
      <WebsiteHeader globalContent={globalContent} onNavigate={onNavigate} siteSettings={siteSettings} />
      
      <main>
        {currentPage.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} globalContent={globalContent} />
        ))}
      </main>
      
      <WebsiteFooter globalContent={globalContent} siteSettings={siteSettings} />
    </div>
  );
}
