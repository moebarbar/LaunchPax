/**
 * Creative Theme Engine - Server Side
 * 
 * Selects and applies creative themes to generated websites
 * based on business type, industry, and tone preferences.
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

export interface CreativeThemeConfig {
  id: CreativeThemeId;
  name: string;
  mode: "dark" | "light";
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  cardBackground: string;
  textColor: string;
  headingColor: string;
  mutedTextColor: string;
  
  // Typography
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  headingStyle: "uppercase" | "capitalize" | "none";
  
  // Visual style
  style: "modern" | "classic" | "bold" | "elegant" | "minimal" | "edgy";
  colorScheme: "light" | "dark";
  
  // Hero preferences
  heroArchetype: "split" | "bold" | "minimal" | "editorial" | "cinematic" | "immersive";
  
  // Layout
  preferredLayouts: string[];
  
  // Photography direction
  photographyStyle: string;
  photographyMood: string;
  photographyKeywords: string[];
}

// ============================================
// THEME DEFINITIONS
// ============================================

const themes: Record<CreativeThemeId, CreativeThemeConfig> = {
  "dark-neon": {
    id: "dark-neon",
    name: "Dark Neon",
    mode: "dark",
    primaryColor: "#39FF14",
    secondaryColor: "#00D4FF",
    accentColor: "#FF00FF",
    backgroundColor: "#0a0a0a",
    surfaceColor: "#111111",
    cardBackground: "#161616",
    textColor: "#ffffff",
    headingColor: "#ffffff",
    mutedTextColor: "#a1a1a1",
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    headingWeight: 700,
    headingStyle: "uppercase",
    style: "bold",
    colorScheme: "dark",
    heroArchetype: "bold",
    preferredLayouts: ["asymmetric", "bento", "editorial"],
    photographyStyle: "cinematic dark moody",
    photographyMood: "futuristic cyberpunk urban",
    photographyKeywords: ["dark", "neon", "urban", "night", "technology"],
  },
  
  "editorial-luxury": {
    id: "editorial-luxury",
    name: "Editorial Luxury",
    mode: "light",
    primaryColor: "#1a1a1a",
    secondaryColor: "#8B7355",
    accentColor: "#C9A86C",
    backgroundColor: "#FAF9F6",
    surfaceColor: "#FFFFFF",
    cardBackground: "#FFFFFF",
    textColor: "#1a1a1a",
    headingColor: "#1a1a1a",
    mutedTextColor: "#888888",
    headingFont: "Playfair Display",
    bodyFont: "Source Serif 4",
    headingWeight: 500,
    headingStyle: "none",
    style: "elegant",
    colorScheme: "light",
    heroArchetype: "editorial",
    preferredLayouts: ["editorial", "alternating", "stacked"],
    photographyStyle: "editorial magazine high fashion",
    photographyMood: "elegant sophisticated refined",
    photographyKeywords: ["luxury", "elegant", "refined", "minimal", "premium"],
  },
  
  "soft-gradient": {
    id: "soft-gradient",
    name: "Soft Gradient",
    mode: "light",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    accentColor: "#06B6D4",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#FAFBFF",
    cardBackground: "#FFFFFF",
    textColor: "#1e1b4b",
    headingColor: "#1e1b4b",
    mutedTextColor: "#9ca3af",
    headingFont: "DM Sans",
    bodyFont: "Inter",
    headingWeight: 700,
    headingStyle: "none",
    style: "modern",
    colorScheme: "light",
    heroArchetype: "split",
    preferredLayouts: ["grid", "bento", "alternating"],
    photographyStyle: "clean modern bright",
    photographyMood: "friendly approachable optimistic",
    photographyKeywords: ["modern", "clean", "bright", "professional", "tech"],
  },
  
  "bold-modern": {
    id: "bold-modern",
    name: "Bold Modern",
    mode: "light",
    primaryColor: "#000000",
    secondaryColor: "#FF4500",
    accentColor: "#FFD700",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F8F8F8",
    cardBackground: "#FFFFFF",
    textColor: "#000000",
    headingColor: "#000000",
    mutedTextColor: "#666666",
    headingFont: "Syne",
    bodyFont: "Work Sans",
    headingWeight: 800,
    headingStyle: "uppercase",
    style: "bold",
    colorScheme: "light",
    heroArchetype: "bold",
    preferredLayouts: ["asymmetric", "editorial", "bento"],
    photographyStyle: "bold graphic high contrast",
    photographyMood: "energetic powerful confident",
    photographyKeywords: ["bold", "modern", "graphic", "striking", "powerful"],
  },
  
  "minimal-clean": {
    id: "minimal-clean",
    name: "Minimal Clean",
    mode: "light",
    primaryColor: "#111111",
    secondaryColor: "#555555",
    accentColor: "#0066FF",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#FFFFFF",
    cardBackground: "#FAFAFA",
    textColor: "#111111",
    headingColor: "#111111",
    mutedTextColor: "#999999",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    headingWeight: 600,
    headingStyle: "none",
    style: "minimal",
    colorScheme: "light",
    heroArchetype: "minimal",
    preferredLayouts: ["stacked", "grid", "alternating"],
    photographyStyle: "minimal clean product",
    photographyMood: "calm serene quiet",
    photographyKeywords: ["minimal", "clean", "simple", "pure", "refined"],
  },
  
  "urban-gritty": {
    id: "urban-gritty",
    name: "Urban Gritty",
    mode: "dark",
    primaryColor: "#DC2626",
    secondaryColor: "#F59E0B",
    accentColor: "#FBBF24",
    backgroundColor: "#1a1a1a",
    surfaceColor: "#242424",
    cardBackground: "#2d2d2d",
    textColor: "#ffffff",
    headingColor: "#ffffff",
    mutedTextColor: "#737373",
    headingFont: "Oswald",
    bodyFont: "Source Sans 3",
    headingWeight: 700,
    headingStyle: "uppercase",
    style: "edgy",
    colorScheme: "dark",
    heroArchetype: "cinematic",
    preferredLayouts: ["asymmetric", "masonry", "editorial"],
    photographyStyle: "gritty urban authentic",
    photographyMood: "raw edgy industrial",
    photographyKeywords: ["urban", "gritty", "authentic", "raw", "street"],
  },
  
  "vibrant-pop": {
    id: "vibrant-pop",
    name: "Vibrant Pop",
    mode: "light",
    primaryColor: "#7C3AED",
    secondaryColor: "#F97316",
    accentColor: "#06B6D4",
    backgroundColor: "#FFF7ED",
    surfaceColor: "#FFFFFF",
    cardBackground: "#FFFFFF",
    textColor: "#1e1b4b",
    headingColor: "#1e1b4b",
    mutedTextColor: "#6b7280",
    headingFont: "Poppins",
    bodyFont: "Nunito",
    headingWeight: 700,
    headingStyle: "none",
    style: "modern",
    colorScheme: "light",
    heroArchetype: "split",
    preferredLayouts: ["bento", "grid", "masonry"],
    photographyStyle: "colorful vibrant playful",
    photographyMood: "fun energetic joyful",
    photographyKeywords: ["colorful", "vibrant", "fun", "playful", "energetic"],
  },
  
  "classic-elegant": {
    id: "classic-elegant",
    name: "Classic Elegant",
    mode: "light",
    primaryColor: "#0C4A6E",
    secondaryColor: "#155E75",
    accentColor: "#047857",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F8F9FA",
    cardBackground: "#FFFFFF",
    textColor: "#1e293b",
    headingColor: "#1e293b",
    mutedTextColor: "#94a3b8",
    headingFont: "Merriweather",
    bodyFont: "Open Sans",
    headingWeight: 700,
    headingStyle: "none",
    style: "classic",
    colorScheme: "light",
    heroArchetype: "split",
    preferredLayouts: ["grid", "alternating", "stacked"],
    photographyStyle: "professional corporate",
    photographyMood: "trustworthy reliable established",
    photographyKeywords: ["professional", "corporate", "trust", "established", "reliable"],
  },
};

// ============================================
// INDUSTRY MAPPING
// ============================================

const industryThemeMap: Record<string, CreativeThemeId[]> = {
  // Technology & SaaS
  technology: ["soft-gradient", "dark-neon", "bold-modern"],
  saas: ["soft-gradient", "minimal-clean", "bold-modern"],
  software: ["soft-gradient", "dark-neon", "minimal-clean"],
  startup: ["bold-modern", "soft-gradient", "dark-neon"],
  gaming: ["dark-neon", "vibrant-pop", "urban-gritty"],
  ai: ["dark-neon", "soft-gradient", "bold-modern"],
  fintech: ["soft-gradient", "minimal-clean", "classic-elegant"],
  
  // Food & Hospitality
  restaurant: ["urban-gritty", "editorial-luxury", "classic-elegant"],
  food: ["urban-gritty", "vibrant-pop", "editorial-luxury"],
  pizza: ["urban-gritty", "bold-modern", "vibrant-pop"],
  bakery: ["editorial-luxury", "vibrant-pop", "classic-elegant"],
  cafe: ["editorial-luxury", "urban-gritty", "minimal-clean"],
  coffee: ["editorial-luxury", "urban-gritty", "minimal-clean"],
  bar: ["urban-gritty", "dark-neon", "bold-modern"],
  brewery: ["urban-gritty", "bold-modern", "classic-elegant"],
  
  // Professional Services
  healthcare: ["classic-elegant", "minimal-clean", "soft-gradient"],
  dental: ["classic-elegant", "soft-gradient", "minimal-clean"],
  medical: ["classic-elegant", "minimal-clean", "soft-gradient"],
  legal: ["classic-elegant", "minimal-clean", "editorial-luxury"],
  law: ["classic-elegant", "minimal-clean", "editorial-luxury"],
  finance: ["classic-elegant", "minimal-clean", "bold-modern"],
  accounting: ["classic-elegant", "minimal-clean", "soft-gradient"],
  consulting: ["minimal-clean", "classic-elegant", "bold-modern"],
  insurance: ["classic-elegant", "minimal-clean", "soft-gradient"],
  
  // Creative
  agency: ["bold-modern", "dark-neon", "editorial-luxury"],
  creative: ["bold-modern", "dark-neon", "vibrant-pop"],
  design: ["minimal-clean", "bold-modern", "editorial-luxury"],
  photography: ["editorial-luxury", "minimal-clean", "dark-neon"],
  art: ["editorial-luxury", "bold-modern", "minimal-clean"],
  music: ["dark-neon", "bold-modern", "urban-gritty"],
  film: ["dark-neon", "editorial-luxury", "bold-modern"],
  marketing: ["bold-modern", "soft-gradient", "vibrant-pop"],
  
  // Lifestyle
  beauty: ["editorial-luxury", "soft-gradient", "vibrant-pop"],
  salon: ["editorial-luxury", "soft-gradient", "vibrant-pop"],
  fashion: ["editorial-luxury", "bold-modern", "minimal-clean"],
  fitness: ["bold-modern", "dark-neon", "vibrant-pop"],
  gym: ["bold-modern", "dark-neon", "urban-gritty"],
  wellness: ["soft-gradient", "minimal-clean", "classic-elegant"],
  spa: ["editorial-luxury", "minimal-clean", "soft-gradient"],
  yoga: ["minimal-clean", "soft-gradient", "editorial-luxury"],
  
  // Retail
  ecommerce: ["soft-gradient", "minimal-clean", "bold-modern"],
  retail: ["vibrant-pop", "minimal-clean", "classic-elegant"],
  luxury: ["editorial-luxury", "minimal-clean", "classic-elegant"],
  jewelry: ["editorial-luxury", "minimal-clean", "classic-elegant"],
  
  // Entertainment
  entertainment: ["dark-neon", "vibrant-pop", "bold-modern"],
  events: ["vibrant-pop", "bold-modern", "dark-neon"],
  wedding: ["editorial-luxury", "classic-elegant", "soft-gradient"],
  party: ["vibrant-pop", "dark-neon", "bold-modern"],
  
  // Construction & Real Estate
  construction: ["bold-modern", "classic-elegant", "urban-gritty"],
  contractor: ["bold-modern", "classic-elegant", "minimal-clean"],
  real_estate: ["classic-elegant", "minimal-clean", "editorial-luxury"],
  architecture: ["minimal-clean", "bold-modern", "editorial-luxury"],
  interior: ["editorial-luxury", "minimal-clean", "soft-gradient"],
  
  // Education
  education: ["soft-gradient", "classic-elegant", "vibrant-pop"],
  school: ["soft-gradient", "classic-elegant", "vibrant-pop"],
  coaching: ["bold-modern", "soft-gradient", "classic-elegant"],
  
  // Automotive
  automotive: ["bold-modern", "dark-neon", "classic-elegant"],
  car: ["bold-modern", "dark-neon", "urban-gritty"],
  
  // Non-profit
  nonprofit: ["soft-gradient", "classic-elegant", "minimal-clean"],
  charity: ["soft-gradient", "classic-elegant", "vibrant-pop"],
  
  // Default
  default: ["minimal-clean", "classic-elegant", "soft-gradient"],
};

// Tone adjustments
const toneAdjustments: Record<string, CreativeThemeId[]> = {
  professional: ["classic-elegant", "minimal-clean"],
  playful: ["vibrant-pop", "soft-gradient"],
  luxurious: ["editorial-luxury", "dark-neon"],
  luxury: ["editorial-luxury", "minimal-clean"],
  bold: ["bold-modern", "dark-neon"],
  friendly: ["soft-gradient", "vibrant-pop"],
  modern: ["bold-modern", "dark-neon", "minimal-clean"],
  traditional: ["classic-elegant", "editorial-luxury"],
  edgy: ["dark-neon", "urban-gritty", "bold-modern"],
  warm: ["editorial-luxury", "urban-gritty", "classic-elegant"],
  cool: ["minimal-clean", "soft-gradient", "dark-neon"],
  energetic: ["vibrant-pop", "bold-modern", "dark-neon"],
  calm: ["minimal-clean", "soft-gradient", "editorial-luxury"],
  sophisticated: ["editorial-luxury", "minimal-clean", "classic-elegant"],
  fun: ["vibrant-pop", "soft-gradient", "bold-modern"],
};

// ============================================
// THEME SELECTION ENGINE
// ============================================

export function selectCreativeTheme(
  industry: string,
  tone?: string,
  preferDark?: boolean
): CreativeThemeConfig {
  const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, "_");
  const normalizedTone = tone?.toLowerCase() || "";
  
  // Get industry-based themes
  let candidates: CreativeThemeId[] = industryThemeMap.default;
  
  for (const [key, themeIds] of Object.entries(industryThemeMap)) {
    if (normalizedIndustry.includes(key)) {
      candidates = themeIds;
      break;
    }
  }
  
  // Filter by tone if specified
  if (normalizedTone) {
    for (const [key, themeIds] of Object.entries(toneAdjustments)) {
      if (normalizedTone.includes(key)) {
        const intersection = candidates.filter(t => themeIds.includes(t));
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
      const theme = themes[id];
      return preferDark ? theme.mode === "dark" : theme.mode === "light";
    });
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }
  
  // Return the top candidate
  const selectedId = candidates[0] || "minimal-clean";
  console.log(`[CreativeThemeEngine] Selected theme "${selectedId}" for industry="${industry}", tone="${tone}"`);
  return themes[selectedId];
}

/**
 * Get all available themes
 */
export function getAllThemes(): CreativeThemeConfig[] {
  return Object.values(themes);
}

/**
 * Get a specific theme by ID
 */
export function getThemeById(id: CreativeThemeId): CreativeThemeConfig | undefined {
  return themes[id];
}

/**
 * Apply theme to site settings
 */
export function applyThemeToSiteSettings(
  theme: CreativeThemeConfig
): Record<string, string> {
  return {
    style: theme.style,
    colorScheme: theme.colorScheme,
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    accentColor: theme.accentColor,
    backgroundColor: theme.backgroundColor,
    surfaceColor: theme.surfaceColor,
    cardBackground: theme.cardBackground,
    textColor: theme.textColor,
    headingColor: theme.headingColor,
    mutedTextColor: theme.mutedTextColor,
    headingFont: theme.headingFont,
    fontFamily: theme.bodyFont,
  };
}

/**
 * Get Google Fonts URL for a theme
 */
export function getThemeFontsUrl(theme: CreativeThemeConfig): string {
  const fonts: string[] = [];
  
  const headingEncoded = theme.headingFont.replace(/ /g, "+");
  fonts.push(`family=${headingEncoded}:wght@400;500;600;700;800`);
  
  if (theme.bodyFont !== theme.headingFont) {
    const bodyEncoded = theme.bodyFont.replace(/ /g, "+");
    fonts.push(`family=${bodyEncoded}:wght@400;500;600;700`);
  }
  
  return `https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap`;
}

export { themes };
