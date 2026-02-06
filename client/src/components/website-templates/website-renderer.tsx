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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigation = globalContent?.navigation || [];
  
  const isDark = (siteSettings as any)?.colorScheme === "dark";
  const navStyle = (siteSettings as any)?.navigationStyle || "floating-pill";
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  const bgColor = siteSettings?.backgroundColor || (isDark ? '#0f172a' : '#ffffff');
  const textColor = siteSettings?.textColor || (isDark ? '#e2e8f0' : '#374151');
  const mutedColor = siteSettings?.mutedTextColor || (isDark ? '#94a3b8' : '#9ca3af');
  const borderClr = siteSettings?.borderColor || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)');
  const surfaceClr = siteSettings?.surfaceColor || bgColor;

  const navBgScrolled = `color-mix(in srgb, ${surfaceClr} 95%, transparent)`;
  const navBgUnscrolled = `color-mix(in srgb, ${surfaceClr} 88%, transparent)`;
  const navShadow = isDark 
    ? '0 8px 32px rgba(0,0,0,0.4)' 
    : '0 8px 32px rgba(0,0,0,0.12)';
  const textDefault = textColor;
  const textMuted = mutedColor;
  const pillBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
  const pillBgScrolled = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const hoverPillBg = isDark ? 'rgba(255,255,255,0.12)' : `color-mix(in srgb, ${surfaceClr} 100%, white)`;
  const hoverPillShadow = isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)';
  const mobileBg = `color-mix(in srgb, ${bgColor} 98%, transparent)`;
  const mobileHoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  
  const isTransparent = navStyle === "transparent";
  const isMinimal = navStyle === "minimal";
  const isSolid = navStyle === "solid";

  const getNavScrolledStyle = (): React.CSSProperties => {
    if (isTransparent) {
      return { background: navBgScrolled, backdropFilter: 'blur(24px)', borderRadius: '1rem', border: `1px solid ${borderClr}`, boxShadow: navShadow };
    }
    if (isSolid) {
      return { background: surfaceClr, borderRadius: '1rem', border: `1px solid ${borderClr}`, boxShadow: navShadow };
    }
    if (isMinimal) {
      return { borderBottom: `1px solid ${borderClr}` };
    }
    return { background: navBgScrolled, backdropFilter: 'blur(24px)', borderRadius: '1rem', border: `1px solid ${borderClr}`, boxShadow: navShadow };
  };

  const getNavUnscrolledStyle = (): React.CSSProperties => {
    if (isTransparent || isMinimal) return {};
    if (isSolid) {
      return { background: navBgUnscrolled, backdropFilter: 'blur(24px)', borderRadius: '9999px', border: `1px solid ${borderClr}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' };
    }
    return { background: navBgUnscrolled, backdropFilter: 'blur(24px)', borderRadius: '9999px', border: `1px solid ${borderClr}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' };
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50" data-testid="website-header">
      <div className={`transition-all duration-700 ease-out ${scrolled ? 'pt-3 px-4' : 'pt-6 px-6'}`}>
        <nav 
          className={`max-w-6xl mx-auto transition-all duration-500`}
          style={scrolled ? getNavScrolledStyle() : getNavUnscrolledStyle()}
        >
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'px-6 py-3' : 'px-2 py-4'}`}>
            <a 
              href="/" 
              className="font-bold text-xl flex items-center gap-3 group relative"
              onClick={(e) => handleNavClick(e, "/")}
              data-testid="link-logo"
            >
              {(globalContent as any)?.logoB64 ? (
                <div className="relative">
                  <div 
                    className="absolute inset-0 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-150"
                    style={{ background: "var(--brand-primary, hsl(var(--primary)))" }}
                  />
                  <img 
                    src={`data:image/png;base64,${(globalContent as any).logoB64}`}
                    alt={`${globalContent?.siteName || "Website"} logo`}
                    className="h-10 w-10 object-contain relative transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ) : globalContent?.logo ? (
                <img 
                  src={globalContent.logo}
                  alt={`${globalContent?.siteName || "Website"} logo`}
                  className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ 
                    background: `linear-gradient(135deg, 
                      var(--brand-primary, hsl(var(--primary))) 0%, 
                      var(--brand-secondary, hsl(var(--primary))) 100%)`,
                    boxShadow: '0 4px 20px -4px var(--brand-primary, rgba(59, 130, 246, 0.5))'
                  }}
                >
                  {(globalContent?.siteName || "W").charAt(0)}
                </div>
              )}
              <div className="hidden sm:flex flex-col">
                <span className="tracking-tight font-semibold text-lg leading-tight" style={{ color: textDefault }}>
                  {globalContent?.siteName || "Website"}
                </span>
              </div>
            </a>
            
            {navigation.length > 0 && (
              <>
                <div className="hidden lg:flex items-center">
                  <div 
                    className="flex items-center gap-1 p-1.5 rounded-full transition-all duration-500"
                    style={{ background: scrolled ? pillBgScrolled : pillBg }}
                  >
                    {navigation.map((item, index) => (
                      <a
                        key={index}
                        href={sanitizeHref(item.href)}
                        className="relative px-5 py-2.5 text-[14px] font-medium transition-all duration-300"
                        onClick={(e) => handleNavClick(e, item.href)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{ 
                          color: hoveredIndex === index ? 'var(--brand-primary, #3b82f6)' : textDefault
                        }}
                        data-testid={`link-nav-${index}`}
                      >
                        <span 
                          className={`absolute inset-0 rounded-full transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                          }`}
                          style={{ 
                            background: hoverPillBg,
                            boxShadow: hoveredIndex === index ? hoverPillShadow : 'none'
                          }}
                        />
                        <span className="relative z-10 flex items-center gap-1">
                          {item.label}
                          <span 
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${
                              hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            }`}
                            style={{ background: 'var(--brand-primary, #3b82f6)' }}
                          />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-3">
                  <a
                    href="#contact"
                    className="group relative px-7 py-3 rounded-full text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    style={{ 
                      background: `linear-gradient(135deg, 
                        var(--brand-primary, #3b82f6) 0%, 
                        var(--brand-secondary, var(--brand-primary, #1d4ed8)) 100%)`,
                      boxShadow: '0 4px 20px -4px var(--brand-primary, rgba(59, 130, 246, 0.5))'
                    }}
                    data-testid="button-nav-cta"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      Get Started
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </a>
                </div>
              
                <button
                  className="lg:hidden p-3 rounded-xl transition-colors"
                  style={{ background: pillBg, color: textDefault }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
      
      {mobileMenuOpen && navigation.length > 0 && (
        <div className="lg:hidden fixed inset-0 top-20 backdrop-blur-xl z-40" style={{ background: mobileBg }}>
          <div className="flex flex-col p-6 space-y-2">
            {navigation.map((item, index) => (
              <a
                key={index}
                href={sanitizeHref(item.href)}
                className="py-4 px-6 text-xl font-medium rounded-2xl transition-all flex items-center justify-between group"
                style={{ color: textDefault }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = mobileHoverBg; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                onClick={(e) => handleNavClick(e, item.href)}
                data-testid={`link-mobile-nav-${index}`}
              >
                {item.label}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-all" style={{ color: textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
            <div className="pt-4">
              <a
                href="#contact"
                className="flex items-center justify-center py-4 px-6 rounded-2xl text-lg text-white font-semibold"
                style={{ 
                  background: `linear-gradient(135deg, 
                    var(--brand-primary, hsl(var(--primary))) 0%, 
                    var(--brand-secondary, hsl(var(--primary))) 100%)`,
                  boxShadow: '0 8px 24px -8px var(--brand-primary, rgba(59, 130, 246, 0.5))'
                }}
                data-testid="button-mobile-cta"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
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
  
  const { 
    primaryColor, 
    secondaryColor, 
    accentColor, 
    backgroundColor,
    surfaceColor,
    textColor,
    mutedTextColor,
    borderColor,
    fontFamily, 
    headingFont, 
    style,
    colorScheme 
  } = siteSettings;
  
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
  
  const primaryColorLight = (siteSettings as any)?.primaryColorLight;
  if (primaryColorLight) {
    styles["--brand-primary-light"] = primaryColorLight;
    styles["--brand-primary-light-hsl"] = hexToHSL(primaryColorLight);
  }
  const primaryColorDark = (siteSettings as any)?.primaryColorDark;
  if (primaryColorDark) {
    styles["--brand-primary-dark"] = primaryColorDark;
    styles["--brand-primary-dark-hsl"] = hexToHSL(primaryColorDark);
  }
  
  if (backgroundColor) {
    styles["--brand-background"] = backgroundColor;
    styles["--brand-background-hsl"] = hexToHSL(backgroundColor);
    styles["backgroundColor"] = backgroundColor;
  }
  if (surfaceColor) {
    styles["--brand-surface"] = surfaceColor;
    styles["--brand-surface-hsl"] = hexToHSL(surfaceColor);
  }
  const backgroundAltColor = (siteSettings as any)?.backgroundAltColor;
  if (backgroundAltColor) {
    styles["--brand-background-alt"] = backgroundAltColor;
    styles["--brand-background-alt-hsl"] = hexToHSL(backgroundAltColor);
  }
  
  if (textColor) {
    styles["--brand-text"] = textColor;
    styles["--brand-text-hsl"] = hexToHSL(textColor);
    styles["color"] = textColor;
  }
  if (mutedTextColor) {
    styles["--brand-muted"] = mutedTextColor;
    styles["--brand-muted-hsl"] = hexToHSL(mutedTextColor);
  }
  const textSecondaryColor = (siteSettings as any)?.textSecondaryColor;
  if (textSecondaryColor) {
    styles["--brand-text-secondary"] = textSecondaryColor;
    styles["--brand-text-secondary-hsl"] = hexToHSL(textSecondaryColor);
  }
  
  const headingColor = siteSettings?.headingColor;
  if (headingColor) {
    styles["--brand-heading"] = headingColor;
    styles["--brand-heading-hsl"] = hexToHSL(headingColor);
  }
  
  const cardBackground = siteSettings?.cardBackground;
  if (cardBackground) {
    styles["--brand-card-bg"] = cardBackground;
    styles["--brand-card-bg-hsl"] = hexToHSL(cardBackground);
  }
  
  if (borderColor) {
    styles["--brand-border"] = borderColor;
    styles["--brand-border-hsl"] = hexToHSL(borderColor);
  }
  
  if (colorScheme) {
    styles["--color-scheme"] = colorScheme;
  }
  
  const heroGradient = (siteSettings as any)?.heroGradient;
  if (heroGradient) {
    styles["--brand-hero-gradient"] = heroGradient;
  }
  const accentGradient = (siteSettings as any)?.accentGradient;
  if (accentGradient) {
    styles["--brand-accent-gradient"] = accentGradient;
  }
  
  const cardBorderRadius = (siteSettings as any)?.cardBorderRadius;
  if (cardBorderRadius) {
    styles["--brand-card-radius"] = cardBorderRadius;
  }
  const cardShadow = (siteSettings as any)?.cardShadow;
  if (cardShadow) {
    styles["--brand-card-shadow"] = cardShadow;
  }
  const cardHoverLift = (siteSettings as any)?.cardHoverLift;
  if (cardHoverLift) {
    styles["--brand-card-hover-lift"] = cardHoverLift;
  }
  const cardHoverShadow = (siteSettings as any)?.cardHoverShadow;
  if (cardHoverShadow) {
    styles["--brand-card-hover-shadow"] = cardHoverShadow;
  }
  
  const navStyle = (siteSettings as any)?.navigationStyle;
  if (navStyle) {
    styles["--brand-nav-style"] = navStyle;
  }
  
  const motionDurationFast = (siteSettings as any)?.motionDurationFast;
  if (motionDurationFast) {
    styles["--brand-motion-fast"] = motionDurationFast;
  }
  const motionDuration = (siteSettings as any)?.motionDuration;
  if (motionDuration) {
    styles["--brand-motion-duration"] = motionDuration;
  }
  const motionDurationSlow = (siteSettings as any)?.motionDurationSlow;
  if (motionDurationSlow) {
    styles["--brand-motion-slow"] = motionDurationSlow;
  }
  const motionDurationVerySlow = (siteSettings as any)?.motionDurationVerySlow;
  if (motionDurationVerySlow) {
    styles["--brand-motion-very-slow"] = motionDurationVerySlow;
  }
  const motionEasing = (siteSettings as any)?.motionEasing;
  if (motionEasing) {
    styles["--brand-motion-easing"] = motionEasing;
  }
  const motionEasingOut = (siteSettings as any)?.motionEasingOut;
  if (motionEasingOut) {
    styles["--brand-motion-easing-out"] = motionEasingOut;
  }
  const motionEasingBounce = (siteSettings as any)?.motionEasingBounce;
  if (motionEasingBounce) {
    styles["--brand-motion-easing-bounce"] = motionEasingBounce;
  }
  const motionEasingSmooth = (siteSettings as any)?.motionEasingSmooth;
  if (motionEasingSmooth) {
    styles["--brand-motion-easing-smooth"] = motionEasingSmooth;
  }
  const hoverScale = (siteSettings as any)?.hoverScale;
  if (hoverScale) {
    styles["--brand-hover-scale"] = String(hoverScale);
  }
  const hoverLift = (siteSettings as any)?.hoverLift;
  if (hoverLift) {
    styles["--brand-hover-lift"] = hoverLift;
  }
  const clickScale = (siteSettings as any)?.clickScale;
  if (clickScale) {
    styles["--brand-click-scale"] = String(clickScale);
  }
  const scrollReveal = (siteSettings as any)?.scrollReveal;
  if (scrollReveal) {
    styles["--brand-scroll-reveal"] = scrollReveal;
  }
  
  const headingWeight = (siteSettings as any)?.headingWeight;
  if (headingWeight) {
    styles["--brand-heading-weight"] = String(headingWeight);
  }
  const headingStyle = (siteSettings as any)?.headingStyle;
  if (headingStyle) {
    styles["--brand-heading-style"] = headingStyle;
  }
  
  const pairing = style ? popularFontPairings[style] : undefined;
  const resolvedHeadingFont = headingFont || (pairing && typeof pairing === "object" ? pairing.heading : null) || "Inter";
  const resolvedBodyFont = fontFamily || (pairing && typeof pairing === "object" ? pairing.body : null) || "Inter";
  
  styles["--font-heading"] = `"${resolvedHeadingFont}", sans-serif`;
  styles["--font-body"] = `"${resolvedBodyFont}", sans-serif`;
  
  const accentFont = (siteSettings as any)?.accentFont;
  if (accentFont) {
    styles["--font-accent"] = `"${accentFont}", sans-serif`;
  }
  
  const enableGlassMorphism = (siteSettings as any)?.enableGlassMorphism;
  if (enableGlassMorphism) {
    styles["--brand-glass"] = "1";
    styles["--brand-glass-bg"] = "rgba(255,255,255,0.08)";
    styles["--brand-glass-border"] = "rgba(255,255,255,0.12)";
    styles["--brand-glass-blur"] = "blur(16px)";
    if ((siteSettings as any)?.navigationGlassMorphism) {
      const strength = (siteSettings as any)?.glassMorphismStrength || "medium";
      const blurMap: Record<string, string> = { light: "blur(8px)", medium: "blur(16px)", strong: "blur(24px)" };
      styles["--brand-glass-blur"] = blurMap[strength] || "blur(16px)";
    }
  }
  
  const enableGradientOverlays = (siteSettings as any)?.enableGradientOverlays;
  if (enableGradientOverlays) {
    styles["--brand-gradient-overlay"] = "1";
  }
  
  const enableAnimatedGradients = (siteSettings as any)?.enableAnimatedGradients;
  if (enableAnimatedGradients) {
    styles["--brand-animated-gradients"] = "1";
  }
  
  const enableParallax = (siteSettings as any)?.enableParallax;
  if (enableParallax) {
    styles["--brand-parallax"] = "1";
  }
  
  return styles as React.CSSProperties;
}

function getFontsFromSettings(siteSettings?: WebsiteContent["siteSettings"]): { heading: string; body: string } {
  if (!siteSettings) return { heading: "Inter", body: "Inter" };
  
  const { fontFamily, headingFont, style } = siteSettings;
  const pairing = style ? popularFontPairings[style] : undefined;
  
  return {
    heading: headingFont || (pairing && typeof pairing === "object" ? pairing.heading : null) || "Inter",
    body: fontFamily || (pairing && typeof pairing === "object" ? pairing.body : null) || "Inter"
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
    <div className="min-h-screen website-renderer" style={combinedStyles}>
      <style>{`
        .website-renderer {
          --background: var(--brand-background-hsl, var(--background));
          --foreground: var(--brand-text-hsl, var(--foreground));
          --card: var(--brand-card-bg-hsl, var(--brand-surface-hsl, var(--card)));
          --primary: var(--brand-primary-hsl, var(--primary));
          --secondary: var(--brand-secondary-hsl, var(--secondary));
          --muted-foreground: var(--brand-muted-hsl, var(--muted-foreground));
          --border: var(--brand-border-hsl, var(--border));
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          scroll-behavior: smooth;
        }
        
        .website-renderer h1, .website-renderer h2, .website-renderer h3, 
        .website-renderer h4, .website-renderer h5, .website-renderer h6 {
          font-family: var(--font-heading, "Inter", sans-serif);
          color: var(--brand-heading, var(--brand-text, hsl(var(--foreground)))) !important;
          font-weight: var(--brand-heading-weight, 700);
          letter-spacing: -0.02em;
          line-height: 1.1;
          text-transform: var(--brand-heading-style, none);
        }
        
        .website-renderer h1 {
          font-weight: calc(var(--brand-heading-weight, 700) + 100);
          letter-spacing: -0.035em;
        }
        
        .website-renderer p {
          color: var(--brand-text-secondary, var(--brand-muted, hsl(var(--muted-foreground)))) !important;
          line-height: 1.7;
          font-family: var(--font-body, "Inter", sans-serif);
        }
        
        .website-renderer .text-muted-foreground {
          color: var(--brand-muted, hsl(var(--muted-foreground))) !important;
        }
        
        .website-renderer .bg-card, .website-renderer [class*="bg-muted"] {
          background-color: var(--brand-card-bg, var(--brand-surface, hsl(var(--card)))) !important;
        }
        
        .website-renderer .themed-card {
          border-radius: var(--brand-card-radius, 1rem);
          box-shadow: var(--brand-card-shadow, 0 4px 16px rgba(0,0,0,0.08));
          transition: transform var(--brand-motion-duration, 0.3s) var(--brand-motion-easing, cubic-bezier(0.22, 1, 0.36, 1)),
                      box-shadow var(--brand-motion-duration, 0.3s) var(--brand-motion-easing, cubic-bezier(0.22, 1, 0.36, 1));
        }
        .website-renderer .themed-card:hover {
          transform: translateY(calc(-1 * var(--brand-card-hover-lift, 4px)));
          box-shadow: var(--brand-card-hover-shadow, 0 20px 40px rgba(0,0,0,0.12));
        }
        
        .website-renderer button, .website-renderer a[role="button"] {
          transition: all var(--brand-motion-duration, 0.3s) var(--brand-motion-easing, cubic-bezier(0.22, 1, 0.36, 1));
        }
        
        .website-renderer .hover-card {
          transition: transform var(--brand-motion-duration, 0.3s) var(--brand-motion-easing, cubic-bezier(0.22, 1, 0.36, 1)),
                      box-shadow var(--brand-motion-duration, 0.3s) var(--brand-motion-easing, cubic-bezier(0.22, 1, 0.36, 1)),
                      background var(--brand-motion-fast, 0.15s) var(--brand-motion-easing, ease);
        }
        .website-renderer .hover-card:hover {
          transform: translateY(var(--brand-hover-lift, -4px)) scale(var(--brand-hover-scale, 1));
        }
        
        .website-renderer section {
          transition: opacity var(--brand-motion-slow, 0.5s) var(--brand-motion-easing-out, ease-out);
        }
        
        .website-renderer .transition-theme {
          transition-duration: var(--brand-motion-duration, 0.3s);
          transition-timing-function: var(--brand-motion-easing, cubic-bezier(0.22, 1, 0.36, 1));
        }
        
        .website-renderer .glass-effect {
          background: var(--brand-glass-bg, rgba(255,255,255,0.06));
          backdrop-filter: var(--brand-glass-blur, blur(16px));
          -webkit-backdrop-filter: var(--brand-glass-blur, blur(16px));
          border: 1px solid var(--brand-glass-border, rgba(255,255,255,0.1));
        }
        
        .website-renderer .gradient-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--brand-hero-gradient, linear-gradient(135deg, var(--brand-primary, #3b82f6) 0%, var(--brand-secondary, #8b5cf6) 100%));
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .website-renderer .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
          animation-duration: calc(var(--brand-motion-very-slow, 800ms) * 10);
        }
        
        .website-renderer ::selection {
          background-color: var(--brand-primary, #3b82f6);
          color: white;
        }
        
        .website-renderer img {
          transition: opacity 0.4s ease;
        }
        
        .website-renderer :focus-visible {
          outline: 2px solid var(--brand-primary, #3b82f6);
          outline-offset: 2px;
        }
        
        .website-renderer::-webkit-scrollbar { width: 10px; }
        .website-renderer::-webkit-scrollbar-track { background: transparent; }
        .website-renderer::-webkit-scrollbar-thumb {
          background: var(--brand-border, rgba(0,0,0,0.15));
          border-radius: 5px;
        }
        .website-renderer::-webkit-scrollbar-thumb:hover {
          background: var(--brand-muted, rgba(0,0,0,0.25));
        }
      `}</style>
      <WebsiteHeader globalContent={globalContent || undefined} onNavigate={onNavigate} siteSettings={siteSettings} />
      
      <main>
        {currentPage.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} globalContent={globalContent || undefined} />
        ))}
      </main>
      
      <WebsiteFooter globalContent={globalContent || undefined} siteSettings={siteSettings} />
    </div>
  );
}
