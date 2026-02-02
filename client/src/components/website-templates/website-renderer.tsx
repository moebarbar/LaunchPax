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
    default:
      return null;
  }
}

function WebsiteHeader({ globalContent, onNavigate, siteSettings }: { globalContent?: GlobalContent; onNavigate?: (pageSlug: string) => void; siteSettings?: WebsiteContent["siteSettings"] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = globalContent?.navigation || [];
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate && href.startsWith("/")) {
      e.preventDefault();
      const slug = href === "/" ? "home" : href.substring(1);
      onNavigate(slug);
      setMobileMenuOpen(false);
    }
  };
  
  const logoStyle = siteSettings?.primaryColor ? { color: siteSettings.primaryColor } : {};
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            className="font-bold text-xl flex items-center gap-2"
            onClick={(e) => handleNavClick(e, "/")}
            style={logoStyle}
          >
            {(globalContent as any)?.logoB64 ? (
              <img 
                src={`data:image/png;base64,${(globalContent as any).logoB64}`}
                alt={`${globalContent?.siteName || "Website"} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : globalContent?.logo ? (
              <img 
                src={globalContent.logo}
                alt={`${globalContent?.siteName || "Website"} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : null}
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
                    onClick={(e) => handleNavClick(e, item.href)}
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
                onClick={(e) => handleNavClick(e, item.href)}
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
      
      <WebsiteFooter globalContent={globalContent} />
    </div>
  );
}
