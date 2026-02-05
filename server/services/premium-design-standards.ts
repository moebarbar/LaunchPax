/**
 * Premium Design Standards
 * 
 * These standards are applied to ALL generated websites automatically.
 * They define the minimum quality bar for agency-level, $50k-$100k websites.
 * 
 * No generic, template-looking websites allowed - every site must be distinctive.
 */

export interface PremiumTypographySettings {
  headingFontWeight: number;
  h1LetterSpacing: string;
  h2LetterSpacing: string;
  bodyLineHeight: number;
  headingLineHeight: number;
}

export interface PremiumNavigationSettings {
  style: 'floating-pill' | 'glass-morphism' | 'editorial';
  hasScrollTransformation: boolean;
  hasHoverAnimations: boolean;
  ctaStyle: 'gradient' | 'solid' | 'outline';
  mobileStyle: 'fullscreen-overlay' | 'slide-in';
}

export interface PremiumHeroSettings {
  minHeight: string;
  hasAnimatedBackground: boolean;
  badgeStyle: 'pill-glassmorphism' | 'minimal' | 'editorial';
  hasScrollIndicator: boolean;
  ctaStyle: 'gradient-shadow' | 'solid' | 'outline-blur';
}

export interface PremiumCardSettings {
  borderRadius: string;
  hoverLiftAmount: number;
  hoverShadow: string;
  hasGradientAccents: boolean;
}

export interface PremiumSectionSettings {
  verticalPadding: { mobile: string; desktop: string };
  headingSize: { mobile: string; desktop: string };
  hasSubtlePatterns: boolean;
  hasAnimatedElements: boolean;
}

export interface PremiumDesignStandards {
  version: string;
  typography: PremiumTypographySettings;
  navigation: PremiumNavigationSettings;
  hero: PremiumHeroSettings;
  cards: PremiumCardSettings;
  sections: PremiumSectionSettings;
  globalEffects: {
    fontSmoothing: boolean;
    smoothScrolling: boolean;
    customScrollbar: boolean;
    premiumFocusStates: boolean;
    selectionColor: boolean;
  };
  colorContrast: {
    headingColor: string;
    bodyTextColor: string;
    mutedTextColor: string;
    cardBackground: string;
    minContrastRatio: number;
  };
}

export const PREMIUM_DESIGN_STANDARDS: PremiumDesignStandards = {
  version: "2.0.0",
  
  typography: {
    headingFontWeight: 800,
    h1LetterSpacing: "-0.035em",
    h2LetterSpacing: "-0.03em",
    bodyLineHeight: 1.7,
    headingLineHeight: 1.1,
  },
  
  navigation: {
    style: "floating-pill",
    hasScrollTransformation: true,
    hasHoverAnimations: true,
    ctaStyle: "gradient",
    mobileStyle: "fullscreen-overlay",
  },
  
  hero: {
    minHeight: "90vh",
    hasAnimatedBackground: true,
    badgeStyle: "pill-glassmorphism",
    hasScrollIndicator: true,
    ctaStyle: "gradient-shadow",
  },
  
  cards: {
    borderRadius: "1.5rem",
    hoverLiftAmount: 8,
    hoverShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
    hasGradientAccents: true,
  },
  
  sections: {
    verticalPadding: { mobile: "6rem", desktop: "8rem" },
    headingSize: { mobile: "2.5rem", desktop: "3.75rem" },
    hasSubtlePatterns: true,
    hasAnimatedElements: true,
  },
  
  globalEffects: {
    fontSmoothing: true,
    smoothScrolling: true,
    customScrollbar: true,
    premiumFocusStates: true,
    selectionColor: true,
  },
  
  colorContrast: {
    headingColor: "#0f172a",
    bodyTextColor: "#64748b",
    mutedTextColor: "#94a3b8",
    cardBackground: "#ffffff",
    minContrastRatio: 4.5,
  },
};

export function applyPremiumStandardsToSiteSettings(siteSettings: any): any {
  const standards = PREMIUM_DESIGN_STANDARDS;
  
  // Helper to check if a color has good contrast (not too light)
  const isGoodContrastColor = (color: string): boolean => {
    if (!color) return false;
    // Light colors to avoid for headings/text
    const lightPatterns = [/^#f[a-f0-9]{5}$/i, /^#e[a-f0-9]{5}$/i, /^#d[a-f0-9]{5}$/i];
    return !lightPatterns.some(p => p.test(color));
  };
  
  return {
    ...siteSettings,
    // PREMIUM: Always apply version and structural settings
    premiumDesignVersion: standards.version,
    navigationStyle: standards.navigation.style,
    heroMinHeight: standards.hero.minHeight,
    cardBorderRadius: standards.cards.borderRadius,
    cardHoverLift: standards.cards.hoverLiftAmount,
    sectionPaddingMobile: standards.sections.verticalPadding.mobile,
    sectionPaddingDesktop: standards.sections.verticalPadding.desktop,
    fontSmoothing: standards.globalEffects.fontSmoothing,
    smoothScrolling: standards.globalEffects.smoothScrolling,
    
    // COLORS: Use existing if valid, otherwise fallback to premium defaults
    headingColor: isGoodContrastColor(siteSettings.headingColor) 
      ? siteSettings.headingColor 
      : standards.colorContrast.headingColor,
    textColor: isGoodContrastColor(siteSettings.textColor) 
      ? siteSettings.textColor 
      : standards.colorContrast.bodyTextColor,
    mutedTextColor: siteSettings.mutedTextColor || standards.colorContrast.mutedTextColor,
    cardBackground: siteSettings.cardBackground || standards.colorContrast.cardBackground,
  };
}

export function validatePremiumCompliance(websiteContent: any): {
  compliant: boolean;
  violations: string[];
  score: number;
} {
  const violations: string[] = [];
  let score = 100;
  const standards = PREMIUM_DESIGN_STANDARDS;
  
  const siteSettings = websiteContent?.siteSettings || {};
  
  // Helper to check if a color has good contrast (dark enough for text/headings)
  const isGoodContrastColor = (color: string): boolean => {
    if (!color) return false;
    const lightPatterns = [/^#f[a-f0-9]{5}$/i, /^#e[a-f0-9]{5}$/i, /^#d[a-f0-9]{5}$/i, /^#c[a-f0-9]{5}$/i];
    return !lightPatterns.some(p => p.test(color));
  };
  
  // === STRUCTURAL STANDARDS (REQUIRED) ===
  
  // 1. Premium design version must be present
  if (!siteSettings.premiumDesignVersion) {
    violations.push("Premium design version not applied - workflow did not apply standards");
    score -= 15;
  }
  
  // 2. Navigation must use floating-pill style
  if (!siteSettings.navigationStyle) {
    violations.push("Navigation style not configured");
    score -= 10;
  } else if (siteSettings.navigationStyle !== standards.navigation.style) {
    violations.push(`Navigation style "${siteSettings.navigationStyle}" does not match premium standard "${standards.navigation.style}"`);
    score -= 8;
  }
  
  // 3. Hero minimum height must be 90vh
  if (!siteSettings.heroMinHeight) {
    violations.push("Hero minimum height not configured");
    score -= 5;
  } else if (!siteSettings.heroMinHeight.includes("90")) {
    violations.push(`Hero height "${siteSettings.heroMinHeight}" below premium 90vh minimum`);
    score -= 5;
  }
  
  // 4. Card border radius must be configured
  if (!siteSettings.cardBorderRadius) {
    violations.push("Card border radius not configured for premium rounded styling");
    score -= 5;
  }
  
  // 5. Card hover lift must be >= 6px for premium feel
  if (siteSettings.cardHoverLift === undefined || siteSettings.cardHoverLift === null) {
    violations.push("Card hover lift animation not configured");
    score -= 5;
  } else if (siteSettings.cardHoverLift < 6) {
    violations.push(`Card hover lift ${siteSettings.cardHoverLift}px too subtle (minimum 6px)`);
    score -= 3;
  }
  
  // 6. Section padding must be configured
  if (!siteSettings.sectionPaddingDesktop) {
    violations.push("Desktop section padding not configured");
    score -= 3;
  }
  if (!siteSettings.sectionPaddingMobile) {
    violations.push("Mobile section padding not configured");
    score -= 2;
  }
  
  // === COLOR STANDARDS ===
  
  // 7. Heading color must have good contrast
  if (!isGoodContrastColor(siteSettings.headingColor)) {
    violations.push("Heading color lacks sufficient contrast for readability");
    score -= 8;
  }
  
  // 8. Text color must have good contrast
  if (!isGoodContrastColor(siteSettings.textColor)) {
    violations.push("Body text color lacks sufficient contrast");
    score -= 5;
  }
  
  // === GLOBAL EFFECTS ===
  
  // 9. Font smoothing should be enabled (not explicitly disabled)
  if (siteSettings.fontSmoothing === false) {
    violations.push("Font smoothing disabled - reduces premium typography quality");
    score -= 3;
  }
  
  // 10. Smooth scrolling should be enabled
  if (siteSettings.smoothScrolling === false) {
    violations.push("Smooth scrolling disabled - reduces premium feel");
    score -= 2;
  }
  
  // === PAGE CONTENT STANDARDS ===
  const pages = websiteContent?.pages || [];
  
  // 11. All hero sections must have archetypes
  let heroCount = 0;
  let heroWithArchetype = 0;
  let heroWithAnimatedOrbs = 0;
  
  for (const page of pages) {
    const heroSection = page.sections?.find((s: any) => s.type === "hero");
    if (heroSection) {
      heroCount++;
      if (heroSection.data?.heroArchetype) heroWithArchetype++;
    }
  }
  
  if (heroCount > 0 && heroWithArchetype < heroCount) {
    violations.push(`${heroCount - heroWithArchetype} hero section(s) missing premium archetype`);
    score -= 5;
  }
  
  // 12. Home page must have 10+ sections for premium feel
  const homePage = pages.find((p: any) => 
    p.slug === "home" || p.path === "/" || p.name === "Home" || p.title?.toLowerCase() === "home"
  );
  if (homePage) {
    const sectionCount = homePage.sections?.length || 0;
    if (sectionCount < 10) {
      violations.push(`Home page has ${sectionCount} sections (premium minimum is 10)`);
      score -= Math.min(15, (10 - sectionCount) * 2);
    }
  }
  
  // 13. About and Services pages should have 8+ sections
  const aboutPage = pages.find((p: any) => p.slug === "about" || p.name?.toLowerCase() === "about");
  if (aboutPage) {
    const sectionCount = aboutPage.sections?.length || 0;
    if (sectionCount < 8) {
      violations.push(`About page has ${sectionCount} sections (premium minimum is 8)`);
      score -= 5;
    }
  }
  
  const servicesPage = pages.find((p: any) => p.slug === "services" || p.name?.toLowerCase() === "services");
  if (servicesPage) {
    const sectionCount = servicesPage.sections?.length || 0;
    if (sectionCount < 8) {
      violations.push(`Services page has ${sectionCount} sections (premium minimum is 8)`);
      score -= 5;
    }
  }
  
  return {
    compliant: violations.length === 0,
    violations,
    score: Math.max(0, score),
  };
}

export function getPremiumHeroConfig(industry: string): {
  archetype: string;
  hasAnimatedOrbs: boolean;
  hasScrollIndicator: boolean;
  badgeStyle: string;
} {
  const lowerIndustry = (industry || "").toLowerCase();
  
  if (/luxury|premium|real estate|hotel|hospitality|resort|spa|jewelry|automotive|fashion/i.test(lowerIndustry)) {
    return {
      archetype: "cinematic",
      hasAnimatedOrbs: true,
      hasScrollIndicator: true,
      badgeStyle: "pill-glassmorphism",
    };
  }
  
  if (/tech|software|saas|startup|app|platform/i.test(lowerIndustry)) {
    return {
      archetype: "bold",
      hasAnimatedOrbs: true,
      hasScrollIndicator: true,
      badgeStyle: "pill-glassmorphism",
    };
  }
  
  if (/healthcare|medical|dental|wellness|clinic/i.test(lowerIndustry)) {
    return {
      archetype: "split",
      hasAnimatedOrbs: false,
      hasScrollIndicator: true,
      badgeStyle: "minimal",
    };
  }
  
  if (/restaurant|food|dining|beverage|cafe/i.test(lowerIndustry)) {
    return {
      archetype: "immersive",
      hasAnimatedOrbs: true,
      hasScrollIndicator: true,
      badgeStyle: "pill-glassmorphism",
    };
  }
  
  return {
    archetype: "bold",
    hasAnimatedOrbs: true,
    hasScrollIndicator: true,
    badgeStyle: "pill-glassmorphism",
  };
}

export function getPremiumNavigationConfig(): {
  style: string;
  ctaGradient: boolean;
  hoverEffects: boolean;
  scrollTransformation: boolean;
} {
  return {
    style: "floating-pill",
    ctaGradient: true,
    hoverEffects: true,
    scrollTransformation: true,
  };
}

export function getPremiumCardConfig(): {
  borderRadius: string;
  hoverLift: number;
  shadowOnHover: string;
  iconGradient: boolean;
} {
  return {
    borderRadius: "1.5rem",
    hoverLift: 8,
    shadowOnHover: "0 20px 40px -12px rgba(0,0,0,0.12)",
    iconGradient: true,
  };
}

export const PREMIUM_QUALITY_THRESHOLDS = {
  minimumOverall: 90,
  heroMinimum: 95,
  excellent: 98,
  good: 92,
  maxGenericPatterns: 2,
  minSectionsHome: 10,
  minSectionsAbout: 8,
  minSectionsServices: 8,
};

console.log("[Premium Standards] Loaded v" + PREMIUM_DESIGN_STANDARDS.version);
