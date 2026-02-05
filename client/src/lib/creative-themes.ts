/**
 * Creative Theme Engine
 * 
 * Award-winning, 2026-level website themes that transform
 * every generated website into a unique piece of art.
 */

export type CreativeThemeId = 
  | "dark-neon"
  | "editorial-luxury"
  | "soft-gradient"
  | "bold-modern"
  | "minimal-clean"
  | "urban-gritty"
  | "vibrant-pop"
  | "classic-elegant";

export interface CreativeTheme {
  id: CreativeThemeId;
  name: string;
  description: string;
  
  // Base mode
  mode: "dark" | "light";
  
  // Color System
  colors: {
    background: string;
    backgroundHsl: string;
    surface: string;
    surfaceHsl: string;
    card: string;
    cardHsl: string;
    
    primary: string;
    primaryHsl: string;
    secondary: string;
    secondaryHsl: string;
    accent: string;
    accentHsl: string;
    
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    
    border: string;
    borderHsl: string;
    
    // Special effects
    glow?: string;
    gradientStart?: string;
    gradientEnd?: string;
    overlayColor?: string;
  };
  
  // Typography
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont?: string;
    
    headingWeight: number;
    bodyWeight: number;
    
    headingStyle: "uppercase" | "capitalize" | "none";
    letterSpacing: {
      heading: string;
      body: string;
      accent: string;
    };
    
    // Size multiplier for dramatic effect
    sizeMultiplier: number;
  };
  
  // Visual Style
  visual: {
    borderRadius: "none" | "subtle" | "rounded" | "pill";
    shadows: "none" | "subtle" | "medium" | "dramatic" | "glow";
    
    // Background treatments
    hasGradientBackground: boolean;
    hasTextureOverlay: boolean;
    hasNoiseTexture: boolean;
    hasGlowEffects: boolean;
    
    // Image treatments
    imageStyle: "sharp" | "soft" | "dramatic" | "vintage" | "high-contrast";
    imageOverlay: "none" | "dark" | "gradient" | "color-wash";
    
    // Animations
    animationIntensity: "subtle" | "medium" | "dramatic";
    
    // Decorative elements
    hasAccentShapes: boolean;
    hasFloatingElements: boolean;
    hasDividers: boolean;
  };
  
  // Layout preferences
  layout: {
    heroStyle: "split" | "full-bleed" | "minimal" | "editorial" | "cinematic" | "bold";
    sectionSpacing: "compact" | "default" | "generous" | "dramatic";
    containerWidth: "narrow" | "default" | "wide" | "full";
    
    preferredPatterns: ("asymmetric" | "grid" | "masonry" | "bento" | "alternating" | "stacked" | "editorial")[];
  };
  
  // Photography direction for stock image searches
  photography: {
    style: string;
    mood: string;
    lighting: string;
    keywords: string[];
  };
}

// ============================================
// THEME DEFINITIONS
// ============================================

export const darkNeonTheme: CreativeTheme = {
  id: "dark-neon",
  name: "Dark Neon",
  description: "Futuristic dark theme with electric neon accents. Perfect for tech, gaming, and creative agencies.",
  mode: "dark",
  
  colors: {
    background: "#0a0a0a",
    backgroundHsl: "0 0% 4%",
    surface: "#111111",
    surfaceHsl: "0 0% 7%",
    card: "#161616",
    cardHsl: "0 0% 9%",
    
    primary: "#39FF14",
    primaryHsl: "110 100% 54%",
    secondary: "#00D4FF",
    secondaryHsl: "190 100% 50%",
    accent: "#FF00FF",
    accentHsl: "300 100% 50%",
    
    text: {
      primary: "#ffffff",
      secondary: "#a1a1a1",
      muted: "#6b6b6b",
      inverse: "#000000",
    },
    
    border: "#2a2a2a",
    borderHsl: "0 0% 16%",
    
    glow: "rgba(57, 255, 20, 0.4)",
    gradientStart: "#39FF14",
    gradientEnd: "#00D4FF",
    overlayColor: "rgba(0, 0, 0, 0.85)",
  },
  
  typography: {
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    accentFont: "JetBrains Mono",
    headingWeight: 700,
    bodyWeight: 400,
    headingStyle: "uppercase",
    letterSpacing: {
      heading: "-0.02em",
      body: "0",
      accent: "0.1em",
    },
    sizeMultiplier: 1.2,
  },
  
  visual: {
    borderRadius: "subtle",
    shadows: "glow",
    hasGradientBackground: true,
    hasTextureOverlay: true,
    hasNoiseTexture: true,
    hasGlowEffects: true,
    imageStyle: "high-contrast",
    imageOverlay: "dark",
    animationIntensity: "dramatic",
    hasAccentShapes: true,
    hasFloatingElements: true,
    hasDividers: false,
  },
  
  layout: {
    heroStyle: "bold",
    sectionSpacing: "generous",
    containerWidth: "wide",
    preferredPatterns: ["asymmetric", "bento", "editorial"],
  },
  
  photography: {
    style: "cinematic dark moody",
    mood: "futuristic cyberpunk urban",
    lighting: "neon lights dramatic shadows",
    keywords: ["dark", "neon", "urban", "night", "technology", "futuristic"],
  },
};

export const editorialLuxuryTheme: CreativeTheme = {
  id: "editorial-luxury",
  name: "Editorial Luxury",
  description: "Sophisticated editorial design with elegant serif typography. Perfect for luxury brands, fashion, and high-end services.",
  mode: "light",
  
  colors: {
    background: "#FAF9F6",
    backgroundHsl: "45 20% 97%",
    surface: "#FFFFFF",
    surfaceHsl: "0 0% 100%",
    card: "#FFFFFF",
    cardHsl: "0 0% 100%",
    
    primary: "#1a1a1a",
    primaryHsl: "0 0% 10%",
    secondary: "#8B7355",
    secondaryHsl: "30 25% 44%",
    accent: "#C9A86C",
    accentHsl: "40 45% 60%",
    
    text: {
      primary: "#1a1a1a",
      secondary: "#4a4a4a",
      muted: "#888888",
      inverse: "#ffffff",
    },
    
    border: "#e8e4df",
    borderHsl: "35 15% 89%",
    
    gradientStart: "#FAF9F6",
    gradientEnd: "#F0EDE8",
    overlayColor: "rgba(26, 26, 26, 0.6)",
  },
  
  typography: {
    headingFont: "Playfair Display",
    bodyFont: "Source Serif 4",
    accentFont: "Cormorant",
    headingWeight: 500,
    bodyWeight: 400,
    headingStyle: "none",
    letterSpacing: {
      heading: "0.02em",
      body: "0.01em",
      accent: "0.15em",
    },
    sizeMultiplier: 1.15,
  },
  
  visual: {
    borderRadius: "none",
    shadows: "subtle",
    hasGradientBackground: false,
    hasTextureOverlay: false,
    hasNoiseTexture: false,
    hasGlowEffects: false,
    imageStyle: "soft",
    imageOverlay: "none",
    animationIntensity: "subtle",
    hasAccentShapes: false,
    hasFloatingElements: false,
    hasDividers: true,
  },
  
  layout: {
    heroStyle: "editorial",
    sectionSpacing: "dramatic",
    containerWidth: "narrow",
    preferredPatterns: ["editorial", "alternating", "stacked"],
  },
  
  photography: {
    style: "editorial magazine high fashion",
    mood: "elegant sophisticated refined",
    lighting: "natural soft golden hour",
    keywords: ["luxury", "elegant", "refined", "minimal", "premium", "artisan"],
  },
};

export const softGradientTheme: CreativeTheme = {
  id: "soft-gradient",
  name: "Soft Gradient",
  description: "Light, airy design with beautiful gradient accents. Perfect for SaaS, apps, and modern startups.",
  mode: "light",
  
  colors: {
    background: "#FFFFFF",
    backgroundHsl: "0 0% 100%",
    surface: "#FAFBFF",
    surfaceHsl: "230 100% 99%",
    card: "#FFFFFF",
    cardHsl: "0 0% 100%",
    
    primary: "#8B5CF6",
    primaryHsl: "262 83% 66%",
    secondary: "#EC4899",
    secondaryHsl: "330 81% 60%",
    accent: "#06B6D4",
    accentHsl: "188 94% 43%",
    
    text: {
      primary: "#1e1b4b",
      secondary: "#4c4669",
      muted: "#9ca3af",
      inverse: "#ffffff",
    },
    
    border: "#e5e7eb",
    borderHsl: "220 13% 91%",
    
    gradientStart: "#8B5CF6",
    gradientEnd: "#EC4899",
    overlayColor: "rgba(139, 92, 246, 0.1)",
  },
  
  typography: {
    headingFont: "DM Sans",
    bodyFont: "Inter",
    headingWeight: 700,
    bodyWeight: 400,
    headingStyle: "none",
    letterSpacing: {
      heading: "-0.02em",
      body: "0",
      accent: "0.05em",
    },
    sizeMultiplier: 1.0,
  },
  
  visual: {
    borderRadius: "rounded",
    shadows: "medium",
    hasGradientBackground: true,
    hasTextureOverlay: false,
    hasNoiseTexture: false,
    hasGlowEffects: true,
    imageStyle: "soft",
    imageOverlay: "gradient",
    animationIntensity: "medium",
    hasAccentShapes: true,
    hasFloatingElements: true,
    hasDividers: false,
  },
  
  layout: {
    heroStyle: "split",
    sectionSpacing: "generous",
    containerWidth: "default",
    preferredPatterns: ["grid", "bento", "alternating"],
  },
  
  photography: {
    style: "clean modern bright",
    mood: "friendly approachable optimistic",
    lighting: "bright airy natural",
    keywords: ["modern", "clean", "bright", "professional", "friendly", "tech"],
  },
};

export const boldModernTheme: CreativeTheme = {
  id: "bold-modern",
  name: "Bold Modern",
  description: "High-impact design with oversized typography and strong colors. Perfect for startups and agencies.",
  mode: "light",
  
  colors: {
    background: "#FFFFFF",
    backgroundHsl: "0 0% 100%",
    surface: "#F8F8F8",
    surfaceHsl: "0 0% 97%",
    card: "#FFFFFF",
    cardHsl: "0 0% 100%",
    
    primary: "#000000",
    primaryHsl: "0 0% 0%",
    secondary: "#FF4500",
    secondaryHsl: "16 100% 50%",
    accent: "#FFD700",
    accentHsl: "51 100% 50%",
    
    text: {
      primary: "#000000",
      secondary: "#333333",
      muted: "#666666",
      inverse: "#ffffff",
    },
    
    border: "#000000",
    borderHsl: "0 0% 0%",
    
    gradientStart: "#FF4500",
    gradientEnd: "#FFD700",
    overlayColor: "rgba(0, 0, 0, 0.7)",
  },
  
  typography: {
    headingFont: "Syne",
    bodyFont: "Work Sans",
    accentFont: "Space Grotesk",
    headingWeight: 800,
    bodyWeight: 400,
    headingStyle: "uppercase",
    letterSpacing: {
      heading: "-0.03em",
      body: "0",
      accent: "0.1em",
    },
    sizeMultiplier: 1.4,
  },
  
  visual: {
    borderRadius: "none",
    shadows: "none",
    hasGradientBackground: false,
    hasTextureOverlay: false,
    hasNoiseTexture: false,
    hasGlowEffects: false,
    imageStyle: "high-contrast",
    imageOverlay: "none",
    animationIntensity: "dramatic",
    hasAccentShapes: true,
    hasFloatingElements: true,
    hasDividers: true,
  },
  
  layout: {
    heroStyle: "bold",
    sectionSpacing: "dramatic",
    containerWidth: "full",
    preferredPatterns: ["asymmetric", "editorial", "bento"],
  },
  
  photography: {
    style: "bold graphic high contrast",
    mood: "energetic powerful confident",
    lighting: "dramatic hard shadows",
    keywords: ["bold", "modern", "graphic", "striking", "powerful", "dynamic"],
  },
};

export const minimalCleanTheme: CreativeTheme = {
  id: "minimal-clean",
  name: "Minimal Clean",
  description: "Ultra-clean, whitespace-heavy design. Perfect for portfolios, designers, and premium products.",
  mode: "light",
  
  colors: {
    background: "#FFFFFF",
    backgroundHsl: "0 0% 100%",
    surface: "#FFFFFF",
    surfaceHsl: "0 0% 100%",
    card: "#FAFAFA",
    cardHsl: "0 0% 98%",
    
    primary: "#111111",
    primaryHsl: "0 0% 7%",
    secondary: "#555555",
    secondaryHsl: "0 0% 33%",
    accent: "#0066FF",
    accentHsl: "220 100% 50%",
    
    text: {
      primary: "#111111",
      secondary: "#555555",
      muted: "#999999",
      inverse: "#ffffff",
    },
    
    border: "#eeeeee",
    borderHsl: "0 0% 93%",
    
    overlayColor: "rgba(17, 17, 17, 0.5)",
  },
  
  typography: {
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingWeight: 600,
    bodyWeight: 400,
    headingStyle: "none",
    letterSpacing: {
      heading: "-0.02em",
      body: "0",
      accent: "0.05em",
    },
    sizeMultiplier: 1.0,
  },
  
  visual: {
    borderRadius: "subtle",
    shadows: "subtle",
    hasGradientBackground: false,
    hasTextureOverlay: false,
    hasNoiseTexture: false,
    hasGlowEffects: false,
    imageStyle: "sharp",
    imageOverlay: "none",
    animationIntensity: "subtle",
    hasAccentShapes: false,
    hasFloatingElements: false,
    hasDividers: true,
  },
  
  layout: {
    heroStyle: "minimal",
    sectionSpacing: "generous",
    containerWidth: "narrow",
    preferredPatterns: ["stacked", "grid", "alternating"],
  },
  
  photography: {
    style: "minimal clean product",
    mood: "calm serene quiet",
    lighting: "soft even natural",
    keywords: ["minimal", "clean", "simple", "pure", "quiet", "refined"],
  },
};

export const urbanGrittyTheme: CreativeTheme = {
  id: "urban-gritty",
  name: "Urban Gritty",
  description: "Raw, textured design with urban character. Perfect for restaurants, bars, and local businesses.",
  mode: "dark",
  
  colors: {
    background: "#1a1a1a",
    backgroundHsl: "0 0% 10%",
    surface: "#242424",
    surfaceHsl: "0 0% 14%",
    card: "#2d2d2d",
    cardHsl: "0 0% 18%",
    
    primary: "#DC2626",
    primaryHsl: "0 84% 50%",
    secondary: "#F59E0B",
    secondaryHsl: "38 92% 50%",
    accent: "#FBBF24",
    accentHsl: "45 93% 56%",
    
    text: {
      primary: "#ffffff",
      secondary: "#d4d4d4",
      muted: "#737373",
      inverse: "#000000",
    },
    
    border: "#404040",
    borderHsl: "0 0% 25%",
    
    gradientStart: "#DC2626",
    gradientEnd: "#F59E0B",
    overlayColor: "rgba(0, 0, 0, 0.75)",
  },
  
  typography: {
    headingFont: "Oswald",
    bodyFont: "Source Sans 3",
    accentFont: "Bebas Neue",
    headingWeight: 700,
    bodyWeight: 400,
    headingStyle: "uppercase",
    letterSpacing: {
      heading: "0.05em",
      body: "0",
      accent: "0.15em",
    },
    sizeMultiplier: 1.1,
  },
  
  visual: {
    borderRadius: "none",
    shadows: "none",
    hasGradientBackground: false,
    hasTextureOverlay: true,
    hasNoiseTexture: true,
    hasGlowEffects: false,
    imageStyle: "vintage",
    imageOverlay: "dark",
    animationIntensity: "medium",
    hasAccentShapes: false,
    hasFloatingElements: false,
    hasDividers: true,
  },
  
  layout: {
    heroStyle: "full-bleed",
    sectionSpacing: "default",
    containerWidth: "wide",
    preferredPatterns: ["asymmetric", "masonry", "editorial"],
  },
  
  photography: {
    style: "gritty urban authentic",
    mood: "raw edgy industrial",
    lighting: "moody atmospheric",
    keywords: ["urban", "gritty", "authentic", "raw", "street", "industrial"],
  },
};

export const vibrantPopTheme: CreativeTheme = {
  id: "vibrant-pop",
  name: "Vibrant Pop",
  description: "Energetic, colorful design with playful elements. Perfect for creative brands and youth-focused businesses.",
  mode: "light",
  
  colors: {
    background: "#FFF7ED",
    backgroundHsl: "30 100% 96%",
    surface: "#FFFFFF",
    surfaceHsl: "0 0% 100%",
    card: "#FFFFFF",
    cardHsl: "0 0% 100%",
    
    primary: "#7C3AED",
    primaryHsl: "263 70% 58%",
    secondary: "#F97316",
    secondaryHsl: "25 95% 53%",
    accent: "#06B6D4",
    accentHsl: "188 94% 43%",
    
    text: {
      primary: "#1e1b4b",
      secondary: "#4338ca",
      muted: "#6b7280",
      inverse: "#ffffff",
    },
    
    border: "#fcd34d",
    borderHsl: "48 96% 65%",
    
    gradientStart: "#7C3AED",
    gradientEnd: "#F97316",
    overlayColor: "rgba(124, 58, 237, 0.2)",
  },
  
  typography: {
    headingFont: "Poppins",
    bodyFont: "Nunito",
    accentFont: "Fredoka",
    headingWeight: 700,
    bodyWeight: 400,
    headingStyle: "none",
    letterSpacing: {
      heading: "-0.01em",
      body: "0",
      accent: "0.02em",
    },
    sizeMultiplier: 1.05,
  },
  
  visual: {
    borderRadius: "pill",
    shadows: "dramatic",
    hasGradientBackground: true,
    hasTextureOverlay: false,
    hasNoiseTexture: false,
    hasGlowEffects: true,
    imageStyle: "soft",
    imageOverlay: "color-wash",
    animationIntensity: "dramatic",
    hasAccentShapes: true,
    hasFloatingElements: true,
    hasDividers: false,
  },
  
  layout: {
    heroStyle: "split",
    sectionSpacing: "generous",
    containerWidth: "default",
    preferredPatterns: ["bento", "grid", "masonry"],
  },
  
  photography: {
    style: "colorful vibrant playful",
    mood: "fun energetic joyful",
    lighting: "bright colorful saturated",
    keywords: ["colorful", "vibrant", "fun", "playful", "energetic", "happy"],
  },
};

export const classicElegantTheme: CreativeTheme = {
  id: "classic-elegant",
  name: "Classic Elegant",
  description: "Timeless, sophisticated design with classic proportions. Perfect for law firms, financial services, and healthcare.",
  mode: "light",
  
  colors: {
    background: "#FFFFFF",
    backgroundHsl: "0 0% 100%",
    surface: "#F8F9FA",
    surfaceHsl: "210 17% 98%",
    card: "#FFFFFF",
    cardHsl: "0 0% 100%",
    
    primary: "#0C4A6E",
    primaryHsl: "201 80% 24%",
    secondary: "#155E75",
    secondaryHsl: "190 67% 27%",
    accent: "#047857",
    accentHsl: "160 94% 18%",
    
    text: {
      primary: "#1e293b",
      secondary: "#475569",
      muted: "#94a3b8",
      inverse: "#ffffff",
    },
    
    border: "#e2e8f0",
    borderHsl: "214 32% 91%",
    
    gradientStart: "#0C4A6E",
    gradientEnd: "#155E75",
    overlayColor: "rgba(12, 74, 110, 0.8)",
  },
  
  typography: {
    headingFont: "Merriweather",
    bodyFont: "Open Sans",
    accentFont: "Lora",
    headingWeight: 700,
    bodyWeight: 400,
    headingStyle: "none",
    letterSpacing: {
      heading: "0",
      body: "0",
      accent: "0.02em",
    },
    sizeMultiplier: 1.0,
  },
  
  visual: {
    borderRadius: "subtle",
    shadows: "medium",
    hasGradientBackground: false,
    hasTextureOverlay: false,
    hasNoiseTexture: false,
    hasGlowEffects: false,
    imageStyle: "sharp",
    imageOverlay: "dark",
    animationIntensity: "subtle",
    hasAccentShapes: false,
    hasFloatingElements: false,
    hasDividers: true,
  },
  
  layout: {
    heroStyle: "split",
    sectionSpacing: "default",
    containerWidth: "default",
    preferredPatterns: ["grid", "alternating", "stacked"],
  },
  
  photography: {
    style: "professional corporate",
    mood: "trustworthy reliable established",
    lighting: "natural professional",
    keywords: ["professional", "corporate", "trust", "established", "reliable", "expert"],
  },
};

// ============================================
// THEME REGISTRY & UTILITIES
// ============================================

export const creativeThemes: Record<CreativeThemeId, CreativeTheme> = {
  "dark-neon": darkNeonTheme,
  "editorial-luxury": editorialLuxuryTheme,
  "soft-gradient": softGradientTheme,
  "bold-modern": boldModernTheme,
  "minimal-clean": minimalCleanTheme,
  "urban-gritty": urbanGrittyTheme,
  "vibrant-pop": vibrantPopTheme,
  "classic-elegant": classicElegantTheme,
};

// Industry to theme mapping for automatic selection
export const industryThemeMap: Record<string, CreativeThemeId[]> = {
  // Technology & SaaS
  technology: ["soft-gradient", "dark-neon", "bold-modern"],
  saas: ["soft-gradient", "minimal-clean", "bold-modern"],
  software: ["soft-gradient", "dark-neon", "minimal-clean"],
  startup: ["bold-modern", "soft-gradient", "dark-neon"],
  gaming: ["dark-neon", "vibrant-pop", "urban-gritty"],
  
  // Food & Hospitality
  restaurant: ["urban-gritty", "editorial-luxury", "classic-elegant"],
  food: ["urban-gritty", "vibrant-pop", "editorial-luxury"],
  bakery: ["editorial-luxury", "vibrant-pop", "classic-elegant"],
  cafe: ["editorial-luxury", "urban-gritty", "minimal-clean"],
  coffee: ["editorial-luxury", "urban-gritty", "minimal-clean"],
  bar: ["urban-gritty", "dark-neon", "bold-modern"],
  
  // Professional Services
  healthcare: ["classic-elegant", "minimal-clean", "soft-gradient"],
  dental: ["classic-elegant", "soft-gradient", "minimal-clean"],
  medical: ["classic-elegant", "minimal-clean", "soft-gradient"],
  legal: ["classic-elegant", "minimal-clean", "editorial-luxury"],
  finance: ["classic-elegant", "minimal-clean", "bold-modern"],
  consulting: ["minimal-clean", "classic-elegant", "bold-modern"],
  
  // Creative
  agency: ["bold-modern", "dark-neon", "editorial-luxury"],
  creative: ["bold-modern", "dark-neon", "vibrant-pop"],
  design: ["minimal-clean", "bold-modern", "editorial-luxury"],
  photography: ["editorial-luxury", "minimal-clean", "dark-neon"],
  art: ["editorial-luxury", "bold-modern", "minimal-clean"],
  
  // Lifestyle
  beauty: ["editorial-luxury", "soft-gradient", "vibrant-pop"],
  fashion: ["editorial-luxury", "bold-modern", "minimal-clean"],
  fitness: ["bold-modern", "dark-neon", "vibrant-pop"],
  wellness: ["soft-gradient", "minimal-clean", "classic-elegant"],
  spa: ["editorial-luxury", "minimal-clean", "soft-gradient"],
  
  // Retail
  ecommerce: ["soft-gradient", "minimal-clean", "bold-modern"],
  retail: ["vibrant-pop", "minimal-clean", "classic-elegant"],
  luxury: ["editorial-luxury", "minimal-clean", "classic-elegant"],
  
  // Entertainment
  entertainment: ["dark-neon", "vibrant-pop", "bold-modern"],
  music: ["dark-neon", "bold-modern", "urban-gritty"],
  events: ["vibrant-pop", "bold-modern", "dark-neon"],
  
  // Construction & Real Estate
  construction: ["bold-modern", "classic-elegant", "urban-gritty"],
  real_estate: ["classic-elegant", "minimal-clean", "editorial-luxury"],
  architecture: ["minimal-clean", "bold-modern", "editorial-luxury"],
  
  // Education
  education: ["soft-gradient", "classic-elegant", "vibrant-pop"],
  
  // Default
  default: ["minimal-clean", "classic-elegant", "soft-gradient"],
};

// Tone to theme adjustments
export const toneThemeAdjustments: Record<string, CreativeThemeId[]> = {
  professional: ["classic-elegant", "minimal-clean"],
  playful: ["vibrant-pop", "soft-gradient"],
  luxurious: ["editorial-luxury", "dark-neon"],
  bold: ["bold-modern", "dark-neon"],
  friendly: ["soft-gradient", "vibrant-pop"],
  modern: ["bold-modern", "dark-neon", "minimal-clean"],
  traditional: ["classic-elegant", "editorial-luxury"],
  edgy: ["dark-neon", "urban-gritty", "bold-modern"],
};

/**
 * Select the best theme for a business based on industry and tone
 */
export function selectCreativeTheme(
  industry: string,
  tone?: string,
  preferDark?: boolean
): CreativeTheme {
  const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, "_");
  const normalizedTone = tone?.toLowerCase() || "";
  
  // Get industry-based themes
  let candidates: CreativeThemeId[] = industryThemeMap.default;
  
  for (const [key, themes] of Object.entries(industryThemeMap)) {
    if (normalizedIndustry.includes(key)) {
      candidates = themes;
      break;
    }
  }
  
  // Filter by tone if specified
  if (normalizedTone) {
    for (const [key, themes] of Object.entries(toneThemeAdjustments)) {
      if (normalizedTone.includes(key)) {
        const intersection = candidates.filter(t => themes.includes(t));
        if (intersection.length > 0) {
          candidates = intersection;
        }
        break;
      }
    }
  }
  
  // Filter by dark mode preference
  if (preferDark !== undefined) {
    const filtered = candidates.filter(id => {
      const theme = creativeThemes[id];
      return preferDark ? theme.mode === "dark" : theme.mode === "light";
    });
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }
  
  // Return the top candidate
  const selectedId = candidates[0] || "minimal-clean";
  return creativeThemes[selectedId];
}

/**
 * Generate CSS variables from a creative theme
 */
export function generateThemeCSS(theme: CreativeTheme): string {
  return `
    --theme-background: ${theme.colors.background};
    --theme-background-hsl: ${theme.colors.backgroundHsl};
    --theme-surface: ${theme.colors.surface};
    --theme-surface-hsl: ${theme.colors.surfaceHsl};
    --theme-card: ${theme.colors.card};
    --theme-card-hsl: ${theme.colors.cardHsl};
    
    --theme-primary: ${theme.colors.primary};
    --theme-primary-hsl: ${theme.colors.primaryHsl};
    --theme-secondary: ${theme.colors.secondary};
    --theme-secondary-hsl: ${theme.colors.secondaryHsl};
    --theme-accent: ${theme.colors.accent};
    --theme-accent-hsl: ${theme.colors.accentHsl};
    
    --theme-text-primary: ${theme.colors.text.primary};
    --theme-text-secondary: ${theme.colors.text.secondary};
    --theme-text-muted: ${theme.colors.text.muted};
    --theme-text-inverse: ${theme.colors.text.inverse};
    
    --theme-border: ${theme.colors.border};
    --theme-border-hsl: ${theme.colors.borderHsl};
    
    --theme-heading-font: "${theme.typography.headingFont}", sans-serif;
    --theme-body-font: "${theme.typography.bodyFont}", sans-serif;
    --theme-heading-weight: ${theme.typography.headingWeight};
    --theme-body-weight: ${theme.typography.bodyWeight};
    --theme-heading-spacing: ${theme.typography.letterSpacing.heading};
    --theme-body-spacing: ${theme.typography.letterSpacing.body};
    --theme-size-multiplier: ${theme.typography.sizeMultiplier};
    
    ${theme.colors.glow ? `--theme-glow: ${theme.colors.glow};` : ""}
    ${theme.colors.gradientStart ? `--theme-gradient-start: ${theme.colors.gradientStart};` : ""}
    ${theme.colors.gradientEnd ? `--theme-gradient-end: ${theme.colors.gradientEnd};` : ""}
    ${theme.colors.overlayColor ? `--theme-overlay: ${theme.colors.overlayColor};` : ""}
  `.trim();
}

/**
 * Get Google Fonts URL for a theme
 */
export function getThemeFontsUrl(theme: CreativeTheme): string {
  const fonts: string[] = [];
  
  // Add heading font
  const headingEncoded = theme.typography.headingFont.replace(/ /g, "+");
  fonts.push(`family=${headingEncoded}:wght@${theme.typography.headingWeight}`);
  
  // Add body font if different
  if (theme.typography.bodyFont !== theme.typography.headingFont) {
    const bodyEncoded = theme.typography.bodyFont.replace(/ /g, "+");
    fonts.push(`family=${bodyEncoded}:wght@${theme.typography.bodyWeight}`);
  }
  
  // Add accent font if specified
  if (theme.typography.accentFont && 
      theme.typography.accentFont !== theme.typography.headingFont && 
      theme.typography.accentFont !== theme.typography.bodyFont) {
    const accentEncoded = theme.typography.accentFont.replace(/ /g, "+");
    fonts.push(`family=${accentEncoded}:wght@400;700`);
  }
  
  return `https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap`;
}
