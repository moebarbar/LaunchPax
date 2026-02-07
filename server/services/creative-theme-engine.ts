/**
 * Creative Theme Engine v4.0.0 - World-Class Design System
 * 
 * The most sophisticated theme engine for AI-generated websites.
 * Applies agency-level design principles, advanced color theory,
 * motion design, and intelligent theme selection.
 * 
 * Features:
 * - 24 distinctive creative themes with complete design systems
 * - Advanced color harmonies with accessibility compliance
 * - Motion design with micro-interactions and animations
 * - Responsive typography scales with optical sizing
 * - Industry-intelligent theme selection with 150+ industry mappings
 * - Brand personality profiling
 * - Visual rhythm and layout intelligence
 * 
 * New v4.0.0 Themes:
 * - startup-velocity: Dynamic startup/tech theme
 * - saas-aurora: Modern SaaS product theme
 * - fintech-precision: Financial/banking theme
 * - healthcare-trust: Medical/wellness theme
 * - cyber-matrix: Cybersecurity/dev tools theme
 * - creative-studio: Creative agency theme
 * - luxury-noir: High-end luxury theme
 * - eco-sustainable: Environmental/organic theme
 * - indie-maker: Indie hacker/solo founder theme
 * - enterprise-power: Enterprise B2B theme
 * - retro-future: Synthwave/gaming theme
 * - zen-minimal: Ultra-minimal Japanese aesthetic
 */

export const CREATIVE_THEME_ENGINE_VERSION = "4.0.0";

// ============================================
// TYPE DEFINITIONS
// ============================================

export type CreativeThemeId = 
  | "dark-neon"
  | "editorial-luxury"
  | "soft-gradient"
  | "bold-modern"
  | "minimal-clean"
  | "urban-gritty"
  | "vibrant-pop"
  | "classic-elegant"
  | "nature-organic"
  | "tech-futuristic"
  | "warm-artisan"
  | "crisp-corporate"
  // NEW THEMES v4.0 - Expanded Creative Coverage
  | "startup-velocity"
  | "saas-aurora"
  | "fintech-precision"
  | "healthcare-trust"
  | "cyber-matrix"
  | "creative-studio"
  | "luxury-noir"
  | "eco-sustainable"
  | "indie-maker"
  | "enterprise-power"
  | "retro-future"
  | "zen-minimal";

export type VisualPersonality = 
  | "bold-confident"
  | "elegant-refined"
  | "friendly-approachable"
  | "innovative-cutting-edge"
  | "trustworthy-established"
  | "creative-artistic"
  | "luxurious-exclusive"
  | "playful-energetic";

export type MotionStyle = 
  | "subtle-sophisticated"
  | "dynamic-energetic"
  | "smooth-flowing"
  | "sharp-precise"
  | "organic-natural"
  | "minimal-refined";

export type LayoutDensity = "spacious" | "balanced" | "compact";

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentAlt: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  cardHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  heading: string;
  border: string;
  borderSubtle: string;
  success: string;
  warning: string;
  error: string;
}

export interface GradientDefinition {
  name: string;
  css: string;
  angle: number;
  stops: { color: string; position: number }[];
}

export interface ShadowSystem {
  subtle: string;
  soft: string;
  medium: string;
  strong: string;
  dramatic: string;
  glow: string;
  inset: string;
}

export interface TypographyScale {
  fontSizeBase: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  fontSize5xl: string;
  fontSize6xl: string;
  fontSizeDisplay: string;
  lineHeightTight: number;
  lineHeightSnug: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  section: string;
  sectionMobile: string;
}

export interface BorderRadiusScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
  pill: string;
}

export interface MotionTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  durationVerySlow: string;
  easingDefault: string;
  easingIn: string;
  easingOut: string;
  easingBounce: string;
  easingSmooth: string;
  hoverScale: number;
  hoverLift: string;
  clickScale: number;
  pageTransition: string;
  scrollReveal: string;
}

export interface VisualEffects {
  glassMorphism: boolean;
  glassMorphismStrength: "light" | "medium" | "strong";
  gradientOverlays: boolean;
  animatedGradients: boolean;
  particleEffects: boolean;
  parallaxScrolling: boolean;
  cursorEffects: boolean;
  noiseTexture: boolean;
  grainOverlay: boolean;
  subtlePatterns: boolean;
}

export interface HeroConfiguration {
  archetype: "split" | "bold" | "minimal" | "editorial" | "cinematic" | "immersive" | "asymmetric" | "layered";
  minHeight: string;
  contentAlignment: "left" | "center" | "right";
  overlayStyle: "gradient" | "solid" | "mesh" | "none";
  overlayOpacity: number;
  animatedElements: boolean;
  scrollIndicator: boolean;
  floatingElements: boolean;
  textShadow: boolean;
  badgeStyle: "pill" | "angular" | "underline" | "none";
}

export interface NavigationConfiguration {
  style: "floating-pill" | "transparent" | "solid" | "minimal" | "sidebar";
  glassMorphism: boolean;
  scrollTransform: boolean;
  hoverStyle: "pill" | "underline" | "dot" | "highlight" | "none";
  ctaStyle: "gradient" | "solid" | "outline" | "pill";
  mobileStyle: "slide" | "fade" | "fullscreen";
  stickyBehavior: "always" | "scroll-up" | "threshold";
}

export interface CardConfiguration {
  borderRadius: string;
  shadow: string;
  hoverLift: string;
  hoverShadow: string;
  borderWidth: string;
  padding: string;
  glassMorphism: boolean;
}

export interface PhotographyDirection {
  style: string;
  mood: string;
  lighting: string;
  composition: string;
  colorTreatment: string;
  keywords: string[];
}

export interface CreativeThemeConfig {
  id: CreativeThemeId;
  name: string;
  version: string;
  mode: "dark" | "light";
  personality: VisualPersonality;
  motionStyle: MotionStyle;
  layoutDensity: LayoutDensity;
  
  // LEGACY: Top-level properties for backward compatibility
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: number | string;
  headingStyle?: string;
  style?: string;
  colorScheme?: "light" | "dark";
  heroArchetype?: string;
  
  colors: ColorPalette;
  gradients: {
    hero: GradientDefinition;
    accent: GradientDefinition;
    surface?: GradientDefinition;
    card?: GradientDefinition;
    overlay?: GradientDefinition;
  };
  shadows: ShadowSystem;
  
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont: string;
    headingWeight: number | string;
    bodyWeight: number | string;
    headingStyle: string;
    scale?: TypographyScale;
  };
  typographyScale?: TypographyScale;
  
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  motion: MotionTokens;
  effects: VisualEffects;
  
  hero: HeroConfiguration;
  navigation: NavigationConfiguration;
  cards: CardConfiguration;
  photography: PhotographyDirection;
  
  preferredLayouts: string[];
  sectionTransitions: string[];
  
  meta: {
    sophisticationScore: number;
    accessibilityScore: number;
    uniquenessScore: number;
    bestFor: string[];
    avoidFor: string[];
  };
}

// ============================================
// SHARED DESIGN TOKENS
// ============================================

const baseTypographyScale: TypographyScale = {
  fontSizeBase: "1rem",
  fontSizeXs: "0.75rem",
  fontSizeSm: "0.875rem",
  fontSizeMd: "1rem",
  fontSizeLg: "1.125rem",
  fontSizeXl: "1.25rem",
  fontSize2xl: "1.5rem",
  fontSize3xl: "1.875rem",
  fontSize4xl: "2.25rem",
  fontSize5xl: "3rem",
  fontSize6xl: "3.75rem",
  fontSizeDisplay: "clamp(2.5rem, 8vw, 6rem)",
  lineHeightTight: 1.1,
  lineHeightSnug: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  letterSpacingTight: "-0.035em",
  letterSpacingNormal: "0",
  letterSpacingWide: "0.05em",
};

const baseSpacing: SpacingScale = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
  section: "6rem",
  sectionMobile: "3rem",
};

const baseBorderRadius: BorderRadiusScale = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
  pill: "9999px",
};

// ============================================
// THEME DEFINITIONS - 12 WORLD-CLASS THEMES
// ============================================

const themes: Record<CreativeThemeId, CreativeThemeConfig> = {
  "dark-neon": {
    id: "dark-neon",
    name: "Dark Neon",
    version: "3.0.0",
    mode: "dark",
    personality: "innovative-cutting-edge",
    motionStyle: "dynamic-energetic",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#39FF14",
      primaryLight: "#6FFF4F",
      primaryDark: "#2ACC0F",
      secondary: "#00D4FF",
      secondaryLight: "#4DE4FF",
      accent: "#FF00FF",
      accentAlt: "#FF6B00",
      background: "#0a0a0a",
      backgroundAlt: "#050505",
      surface: "#111111",
      surfaceElevated: "#1a1a1a",
      card: "#161616",
      cardHover: "#1f1f1f",
      text: "#ffffff",
      textSecondary: "#e5e5e5",
      textMuted: "#a1a1a1",
      heading: "#ffffff",
      border: "#333333",
      borderSubtle: "#222222",
      success: "#39FF14",
      warning: "#FFD700",
      error: "#FF4444",
    },
    
    gradients: {
      hero: {
        name: "Neon Glow",
        css: "linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(255, 0, 255, 0.15) 50%, rgba(0, 212, 255, 0.15) 100%)",
        angle: 135,
        stops: [
          { color: "rgba(57, 255, 20, 0.15)", position: 0 },
          { color: "rgba(255, 0, 255, 0.15)", position: 50 },
          { color: "rgba(0, 212, 255, 0.15)", position: 100 },
        ],
      },
      accent: {
        name: "Electric",
        css: "linear-gradient(90deg, #39FF14 0%, #00D4FF 100%)",
        angle: 90,
        stops: [
          { color: "#39FF14", position: 0 },
          { color: "#00D4FF", position: 100 },
        ],
      },
      surface: {
        name: "Dark Depth",
        css: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)",
        angle: 180,
        stops: [
          { color: "#111111", position: 0 },
          { color: "#0a0a0a", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 2px 4px rgba(0, 0, 0, 0.3)",
      soft: "0 4px 12px rgba(0, 0, 0, 0.4)",
      medium: "0 8px 24px rgba(0, 0, 0, 0.5)",
      strong: "0 16px 48px rgba(0, 0, 0, 0.6)",
      dramatic: "0 24px 64px rgba(0, 0, 0, 0.7)",
      glow: "0 0 40px rgba(57, 255, 20, 0.4)",
      inset: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "Inter",
      accentFont: "JetBrains Mono",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "uppercase",
      scale: { ...baseTypographyScale },
    },
    
    spacing: { ...baseSpacing },
    borderRadius: { ...baseBorderRadius, xl: "1.25rem" },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "500ms",
      durationVerySlow: "800ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      hoverScale: 1.02,
      hoverLift: "-4px",
      clickScale: 0.98,
      pageTransition: "fade-slide",
      scrollReveal: "slide-up-fade",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "medium",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: true,
      parallaxScrolling: true,
      cursorEffects: true,
      noiseTexture: true,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "bold",
      minHeight: "100vh",
      contentAlignment: "left",
      overlayStyle: "mesh",
      overlayOpacity: 0.8,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: true,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.5rem",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      hoverLift: "-8px",
      hoverShadow: "0 20px 60px rgba(57, 255, 20, 0.15)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "cinematic dark moody",
      mood: "futuristic cyberpunk urban",
      lighting: "neon rim lights, high contrast, dramatic shadows",
      composition: "dynamic angles, urban environments, tech elements",
      colorTreatment: "desaturated with neon accents, teal and orange",
      keywords: ["dark", "neon", "urban", "night", "technology", "cyberpunk", "futuristic"],
    },
    
    preferredLayouts: ["asymmetric", "bento", "editorial", "masonry"],
    sectionTransitions: ["fade-slide", "parallax", "reveal"],
    
    meta: {
      sophisticationScore: 92,
      accessibilityScore: 85,
      uniquenessScore: 95,
      bestFor: ["tech startups", "gaming", "nightlife", "creative agencies", "music", "innovation"],
      avoidFor: ["healthcare", "children", "traditional businesses", "elderly services"],
    },
  },

  "editorial-luxury": {
    id: "editorial-luxury",
    name: "Editorial Luxury",
    version: "3.0.0",
    mode: "light",
    personality: "elegant-refined",
    motionStyle: "subtle-sophisticated",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#1a1a1a",
      primaryLight: "#333333",
      primaryDark: "#0a0a0a",
      secondary: "#8B7355",
      secondaryLight: "#A89078",
      accent: "#C9A86C",
      accentAlt: "#D4B88A",
      background: "#FAF9F6",
      backgroundAlt: "#F5F3EF",
      surface: "#FFFFFF",
      surfaceElevated: "#FFFFFF",
      card: "#FFFFFF",
      cardHover: "#FAFAFA",
      text: "#1a1a1a",
      textSecondary: "#4a4a4a",
      textMuted: "#888888",
      heading: "#1a1a1a",
      border: "#E8E4DE",
      borderSubtle: "#F0ECE6",
      success: "#4A7C59",
      warning: "#C9A86C",
      error: "#9B4444",
    },
    
    gradients: {
      hero: {
        name: "Cream Fade",
        css: "linear-gradient(180deg, #FAF9F6 0%, #F5F3EF 100%)",
        angle: 180,
        stops: [
          { color: "#FAF9F6", position: 0 },
          { color: "#F5F3EF", position: 100 },
        ],
      },
      accent: {
        name: "Gold Shimmer",
        css: "linear-gradient(135deg, #C9A86C 0%, #D4B88A 50%, #C9A86C 100%)",
        angle: 135,
        stops: [
          { color: "#C9A86C", position: 0 },
          { color: "#D4B88A", position: 50 },
          { color: "#C9A86C", position: 100 },
        ],
      },
      surface: {
        name: "Warm White",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FAF9F6 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FAF9F6", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 2px rgba(0, 0, 0, 0.04)",
      soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
      medium: "0 4px 16px rgba(0, 0, 0, 0.08)",
      strong: "0 8px 32px rgba(0, 0, 0, 0.1)",
      dramatic: "0 16px 48px rgba(0, 0, 0, 0.12)",
      glow: "0 0 40px rgba(201, 168, 108, 0.2)",
      inset: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
    },
    
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Source Serif 4",
      accentFont: "Cormorant Garamond",
      headingWeight: 500,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        letterSpacingTight: "-0.02em",
        lineHeightSnug: 1.3,
      },
    },
    
    spacing: { ...baseSpacing, section: "8rem", sectionMobile: "4rem" },
    borderRadius: { ...baseBorderRadius, md: "0.25rem", lg: "0.5rem", xl: "0.75rem" },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "400ms",
      durationSlow: "600ms",
      durationVerySlow: "1000ms",
      easingDefault: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.2, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.45, 0, 0.55, 1)",
      hoverScale: 1.01,
      hoverLift: "-2px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: true,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "editorial",
      minHeight: "90vh",
      contentAlignment: "center",
      overlayStyle: "gradient",
      overlayOpacity: 0.3,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "underline",
    },
    
    navigation: {
      style: "transparent",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "outline",
      mobileStyle: "slide",
      stickyBehavior: "threshold",
    },
    
    cards: {
      borderRadius: "0.5rem",
      shadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
      hoverLift: "-4px",
      hoverShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
      borderWidth: "1px",
      padding: "2.5rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "editorial magazine high fashion",
      mood: "elegant sophisticated refined",
      lighting: "soft natural light, golden hour, studio",
      composition: "rule of thirds, negative space, fashion poses",
      colorTreatment: "warm tones, muted palette, film-like",
      keywords: ["luxury", "elegant", "refined", "minimal", "premium", "fashion", "editorial"],
    },
    
    preferredLayouts: ["editorial", "alternating", "stacked", "asymmetric"],
    sectionTransitions: ["fade", "slide", "reveal"],
    
    meta: {
      sophisticationScore: 98,
      accessibilityScore: 92,
      uniquenessScore: 88,
      bestFor: ["luxury brands", "fashion", "jewelry", "high-end hospitality", "art galleries", "premium services"],
      avoidFor: ["budget services", "children", "tech startups", "casual dining"],
    },
  },

  "soft-gradient": {
    id: "soft-gradient",
    name: "Soft Gradient",
    version: "3.0.0",
    mode: "light",
    personality: "friendly-approachable",
    motionStyle: "smooth-flowing",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#8B5CF6",
      primaryLight: "#A78BFA",
      primaryDark: "#7C3AED",
      secondary: "#EC4899",
      secondaryLight: "#F472B6",
      accent: "#06B6D4",
      accentAlt: "#22D3EE",
      background: "#FFFFFF",
      backgroundAlt: "#FAFBFF",
      surface: "#FFFFFF",
      surfaceElevated: "#F8FAFF",
      card: "#FFFFFF",
      cardHover: "#FAFBFF",
      text: "#1e1b4b",
      textSecondary: "#4338ca",
      textMuted: "#9ca3af",
      heading: "#1e1b4b",
      border: "#E5E7EB",
      borderSubtle: "#F3F4F6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Aurora",
        css: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)",
        angle: 135,
        stops: [
          { color: "rgba(139, 92, 246, 0.1)", position: 0 },
          { color: "rgba(236, 72, 153, 0.1)", position: 50 },
          { color: "rgba(6, 182, 212, 0.1)", position: 100 },
        ],
      },
      accent: {
        name: "Sunrise",
        css: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)",
        angle: 90,
        stops: [
          { color: "#8B5CF6", position: 0 },
          { color: "#EC4899", position: 100 },
        ],
      },
      surface: {
        name: "Soft Cloud",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFF 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FAFBFF", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(0, 0, 0, 0.06)",
      soft: "0 4px 12px rgba(139, 92, 246, 0.08)",
      medium: "0 8px 24px rgba(139, 92, 246, 0.12)",
      strong: "0 16px 40px rgba(139, 92, 246, 0.15)",
      dramatic: "0 24px 60px rgba(139, 92, 246, 0.18)",
      glow: "0 0 40px rgba(139, 92, 246, 0.25)",
      inset: "inset 0 2px 4px rgba(139, 92, 246, 0.06)",
    },
    
    typography: {
      headingFont: "DM Sans",
      bodyFont: "Inter",
      accentFont: "DM Sans",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "none",
      scale: { ...baseTypographyScale },
    },
    
    spacing: { ...baseSpacing },
    borderRadius: { ...baseBorderRadius, lg: "1rem", xl: "1.5rem", "2xl": "2rem" },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "500ms",
      durationVerySlow: "800ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      hoverScale: 1.02,
      hoverLift: "-6px",
      clickScale: 0.98,
      pageTransition: "fade-scale",
      scrollReveal: "slide-up",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.4,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.5rem",
      shadow: "0 8px 24px rgba(139, 92, 246, 0.1)",
      hoverLift: "-8px",
      hoverShadow: "0 20px 50px rgba(139, 92, 246, 0.18)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "clean modern bright",
      mood: "friendly approachable optimistic",
      lighting: "bright natural, soft diffused, airy",
      composition: "clean backgrounds, centered subjects, lifestyle",
      colorTreatment: "vibrant but soft, pastel accents",
      keywords: ["modern", "clean", "bright", "professional", "tech", "friendly", "optimistic"],
    },
    
    preferredLayouts: ["grid", "bento", "alternating", "cards"],
    sectionTransitions: ["fade-slide", "slide-up", "scale"],
    
    meta: {
      sophisticationScore: 85,
      accessibilityScore: 95,
      uniquenessScore: 80,
      bestFor: ["SaaS", "tech startups", "mobile apps", "fintech", "education", "productivity tools"],
      avoidFor: ["luxury brands", "traditional industries", "formal services"],
    },
  },

  "bold-modern": {
    id: "bold-modern",
    name: "Bold Modern",
    version: "3.0.0",
    mode: "light",
    personality: "bold-confident",
    motionStyle: "sharp-precise",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#000000",
      primaryLight: "#333333",
      primaryDark: "#000000",
      secondary: "#FF4500",
      secondaryLight: "#FF6B35",
      accent: "#FFD700",
      accentAlt: "#FFC107",
      background: "#FFFFFF",
      backgroundAlt: "#F8F8F8",
      surface: "#FFFFFF",
      surfaceElevated: "#FAFAFA",
      card: "#FFFFFF",
      cardHover: "#F5F5F5",
      text: "#000000",
      textSecondary: "#333333",
      textMuted: "#666666",
      heading: "#000000",
      border: "#E5E5E5",
      borderSubtle: "#F0F0F0",
      success: "#22C55E",
      warning: "#FFD700",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Bold Strike",
        css: "linear-gradient(135deg, #FF4500 0%, #FFD700 100%)",
        angle: 135,
        stops: [
          { color: "#FF4500", position: 0 },
          { color: "#FFD700", position: 100 },
        ],
      },
      accent: {
        name: "Fire",
        css: "linear-gradient(90deg, #FF4500 0%, #FF6B35 100%)",
        angle: 90,
        stops: [
          { color: "#FF4500", position: 0 },
          { color: "#FF6B35", position: 100 },
        ],
      },
      surface: {
        name: "Clean White",
        css: "linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#F8F8F8", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 2px 4px rgba(0, 0, 0, 0.08)",
      soft: "0 4px 12px rgba(0, 0, 0, 0.1)",
      medium: "0 8px 24px rgba(0, 0, 0, 0.12)",
      strong: "0 16px 40px rgba(0, 0, 0, 0.15)",
      dramatic: "0 24px 60px rgba(0, 0, 0, 0.2)",
      glow: "0 0 40px rgba(255, 69, 0, 0.3)",
      inset: "inset 0 2px 4px rgba(0, 0, 0, 0.08)",
    },
    
    typography: {
      headingFont: "Syne",
      bodyFont: "Work Sans",
      accentFont: "Space Grotesk",
      headingWeight: 800,
      bodyWeight: 400,
      headingStyle: "uppercase",
      scale: {
        ...baseTypographyScale,
        letterSpacingTight: "-0.04em",
        letterSpacingWide: "0.1em",
      },
    },
    
    spacing: { ...baseSpacing },
    borderRadius: { ...baseBorderRadius, md: "0.375rem", lg: "0.5rem" },
    
    motion: {
      durationFast: "100ms",
      durationNormal: "200ms",
      durationSlow: "400ms",
      durationVerySlow: "600ms",
      easingDefault: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
      easingOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      hoverScale: 1.03,
      hoverLift: "-4px",
      clickScale: 0.97,
      pageTransition: "slide",
      scrollReveal: "slide-scale",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "bold",
      minHeight: "100vh",
      contentAlignment: "left",
      overlayStyle: "solid",
      overlayOpacity: 0.9,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "angular",
    },
    
    navigation: {
      style: "solid",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "highlight",
      ctaStyle: "solid",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.5rem",
      shadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      hoverLift: "-6px",
      hoverShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
      borderWidth: "2px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "bold graphic high contrast",
      mood: "energetic powerful confident",
      lighting: "high contrast, dramatic shadows, rim lighting",
      composition: "bold angles, asymmetric, action shots",
      colorTreatment: "high contrast, bold colors, graphic",
      keywords: ["bold", "modern", "graphic", "striking", "powerful", "energetic", "dynamic"],
    },
    
    preferredLayouts: ["asymmetric", "editorial", "bento", "full-bleed"],
    sectionTransitions: ["slide", "wipe", "scale"],
    
    meta: {
      sophisticationScore: 88,
      accessibilityScore: 90,
      uniquenessScore: 85,
      bestFor: ["creative agencies", "sports brands", "marketing", "startups", "media", "entertainment"],
      avoidFor: ["healthcare", "legal", "traditional finance", "elderly services"],
    },
  },

  "minimal-clean": {
    id: "minimal-clean",
    name: "Minimal Clean",
    version: "3.0.0",
    mode: "light",
    personality: "elegant-refined",
    motionStyle: "minimal-refined",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#111111",
      primaryLight: "#333333",
      primaryDark: "#000000",
      secondary: "#555555",
      secondaryLight: "#777777",
      accent: "#0066FF",
      accentAlt: "#0052CC",
      background: "#FFFFFF",
      backgroundAlt: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceElevated: "#FFFFFF",
      card: "#FAFAFA",
      cardHover: "#F5F5F5",
      text: "#111111",
      textSecondary: "#444444",
      textMuted: "#999999",
      heading: "#111111",
      border: "#EEEEEE",
      borderSubtle: "#F5F5F5",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Pure White",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FAFAFA", position: 100 },
        ],
      },
      accent: {
        name: "Blue Shift",
        css: "linear-gradient(90deg, #0066FF 0%, #0052CC 100%)",
        angle: 90,
        stops: [
          { color: "#0066FF", position: 0 },
          { color: "#0052CC", position: 100 },
        ],
      },
      surface: {
        name: "Subtle Gray",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FAFAFA", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 2px rgba(0, 0, 0, 0.04)",
      soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
      medium: "0 4px 16px rgba(0, 0, 0, 0.08)",
      strong: "0 8px 32px rgba(0, 0, 0, 0.1)",
      dramatic: "0 16px 48px rgba(0, 0, 0, 0.12)",
      glow: "0 0 40px rgba(0, 102, 255, 0.15)",
      inset: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
    },
    
    typography: {
      headingFont: "DM Sans",
      bodyFont: "DM Sans",
      accentFont: "DM Mono",
      headingWeight: 600,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        letterSpacingTight: "-0.025em",
      },
    },
    
    spacing: { ...baseSpacing, section: "7rem", sectionMobile: "4rem" },
    borderRadius: { ...baseBorderRadius },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      durationVerySlow: "600ms",
      easingDefault: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.2, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.45, 0, 0.55, 1)",
      hoverScale: 1.01,
      hoverLift: "-2px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "minimal",
      minHeight: "85vh",
      contentAlignment: "center",
      overlayStyle: "none",
      overlayOpacity: 0,
      animatedElements: false,
      scrollIndicator: false,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "none",
    },
    
    navigation: {
      style: "minimal",
      glassMorphism: false,
      scrollTransform: false,
      hoverStyle: "underline",
      ctaStyle: "solid",
      mobileStyle: "slide",
      stickyBehavior: "scroll-up",
    },
    
    cards: {
      borderRadius: "0.75rem",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      hoverLift: "-2px",
      hoverShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "minimal clean product",
      mood: "calm serene quiet",
      lighting: "soft flat, even, studio",
      composition: "clean backgrounds, centered, product focus",
      colorTreatment: "neutral, muted, minimal color",
      keywords: ["minimal", "clean", "simple", "pure", "refined", "quiet", "serene"],
    },
    
    preferredLayouts: ["stacked", "grid", "alternating", "centered"],
    sectionTransitions: ["fade", "none", "slide"],
    
    meta: {
      sophisticationScore: 90,
      accessibilityScore: 98,
      uniquenessScore: 75,
      bestFor: ["design studios", "architecture", "portfolios", "SaaS", "professional services", "photography"],
      avoidFor: ["entertainment", "children", "gaming", "nightlife"],
    },
  },

  "urban-gritty": {
    id: "urban-gritty",
    name: "Urban Gritty",
    version: "3.0.0",
    mode: "dark",
    personality: "bold-confident",
    motionStyle: "sharp-precise",
    layoutDensity: "compact",
    
    colors: {
      primary: "#DC2626",
      primaryLight: "#EF4444",
      primaryDark: "#B91C1C",
      secondary: "#F59E0B",
      secondaryLight: "#FBBF24",
      accent: "#FBBF24",
      accentAlt: "#FCD34D",
      background: "#1a1a1a",
      backgroundAlt: "#141414",
      surface: "#242424",
      surfaceElevated: "#2d2d2d",
      card: "#2d2d2d",
      cardHover: "#363636",
      text: "#ffffff",
      textSecondary: "#e5e5e5",
      textMuted: "#737373",
      heading: "#ffffff",
      border: "#404040",
      borderSubtle: "#333333",
      success: "#22C55E",
      warning: "#FBBF24",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Industrial",
        css: "linear-gradient(180deg, rgba(220, 38, 38, 0.2) 0%, rgba(26, 26, 26, 1) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(220, 38, 38, 0.2)", position: 0 },
          { color: "rgba(26, 26, 26, 1)", position: 100 },
        ],
      },
      accent: {
        name: "Warning",
        css: "linear-gradient(90deg, #DC2626 0%, #F59E0B 100%)",
        angle: 90,
        stops: [
          { color: "#DC2626", position: 0 },
          { color: "#F59E0B", position: 100 },
        ],
      },
      surface: {
        name: "Dark Steel",
        css: "linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)",
        angle: 180,
        stops: [
          { color: "#2d2d2d", position: 0 },
          { color: "#1a1a1a", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 2px 4px rgba(0, 0, 0, 0.4)",
      soft: "0 4px 12px rgba(0, 0, 0, 0.5)",
      medium: "0 8px 24px rgba(0, 0, 0, 0.6)",
      strong: "0 16px 40px rgba(0, 0, 0, 0.7)",
      dramatic: "0 24px 60px rgba(0, 0, 0, 0.8)",
      glow: "0 0 40px rgba(220, 38, 38, 0.3)",
      inset: "inset 0 2px 4px rgba(0, 0, 0, 0.4)",
    },
    
    typography: {
      headingFont: "Oswald",
      bodyFont: "Source Sans 3",
      accentFont: "Bebas Neue",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "uppercase",
      scale: {
        ...baseTypographyScale,
        letterSpacingWide: "0.08em",
      },
    },
    
    spacing: { ...baseSpacing, section: "5rem", sectionMobile: "3rem" },
    borderRadius: { ...baseBorderRadius, sm: "0.125rem", md: "0.25rem", lg: "0.375rem" },
    
    motion: {
      durationFast: "100ms",
      durationNormal: "200ms",
      durationSlow: "350ms",
      durationVerySlow: "500ms",
      easingDefault: "cubic-bezier(0.16, 1, 0.3, 1)",
      easingIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
      easingOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      easingBounce: "cubic-bezier(0.34, 1.4, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      hoverScale: 1.02,
      hoverLift: "-3px",
      clickScale: 0.98,
      pageTransition: "wipe",
      scrollReveal: "slide-scale",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: true,
      grainOverlay: true,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "cinematic",
      minHeight: "100vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.7,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: true,
      badgeStyle: "angular",
    },
    
    navigation: {
      style: "solid",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "highlight",
      ctaStyle: "solid",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.375rem",
      shadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
      hoverLift: "-4px",
      hoverShadow: "0 16px 40px rgba(220, 38, 38, 0.2)",
      borderWidth: "1px",
      padding: "1.5rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "gritty urban authentic",
      mood: "raw edgy industrial",
      lighting: "harsh, high contrast, dramatic shadows",
      composition: "street photography, documentary, action",
      colorTreatment: "desaturated, gritty, film grain",
      keywords: ["urban", "gritty", "authentic", "raw", "street", "industrial", "edgy"],
    },
    
    preferredLayouts: ["asymmetric", "masonry", "editorial", "full-bleed"],
    sectionTransitions: ["wipe", "slide", "reveal"],
    
    meta: {
      sophisticationScore: 82,
      accessibilityScore: 85,
      uniquenessScore: 90,
      bestFor: ["restaurants", "bars", "breweries", "fitness", "automotive", "music venues", "street food"],
      avoidFor: ["healthcare", "children", "luxury brands", "professional services"],
    },
  },

  "vibrant-pop": {
    id: "vibrant-pop",
    name: "Vibrant Pop",
    version: "3.0.0",
    mode: "light",
    personality: "playful-energetic",
    motionStyle: "dynamic-energetic",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#7C3AED",
      primaryLight: "#8B5CF6",
      primaryDark: "#6D28D9",
      secondary: "#F97316",
      secondaryLight: "#FB923C",
      accent: "#06B6D4",
      accentAlt: "#22D3EE",
      background: "#FFF7ED",
      backgroundAlt: "#FFFBF5",
      surface: "#FFFFFF",
      surfaceElevated: "#FFFFFF",
      card: "#FFFFFF",
      cardHover: "#FFFBF5",
      text: "#1e1b4b",
      textSecondary: "#3730a3",
      textMuted: "#6b7280",
      heading: "#1e1b4b",
      border: "#FED7AA",
      borderSubtle: "#FFEDD5",
      success: "#22C55E",
      warning: "#F97316",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Sunset Pop",
        css: "linear-gradient(135deg, #7C3AED 0%, #F97316 50%, #06B6D4 100%)",
        angle: 135,
        stops: [
          { color: "#7C3AED", position: 0 },
          { color: "#F97316", position: 50 },
          { color: "#06B6D4", position: 100 },
        ],
      },
      accent: {
        name: "Tropical",
        css: "linear-gradient(90deg, #7C3AED 0%, #F97316 100%)",
        angle: 90,
        stops: [
          { color: "#7C3AED", position: 0 },
          { color: "#F97316", position: 100 },
        ],
      },
      surface: {
        name: "Warm Glow",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FFF7ED", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 2px 4px rgba(124, 58, 237, 0.08)",
      soft: "0 4px 12px rgba(124, 58, 237, 0.1)",
      medium: "0 8px 24px rgba(124, 58, 237, 0.12)",
      strong: "0 16px 40px rgba(124, 58, 237, 0.15)",
      dramatic: "0 24px 60px rgba(124, 58, 237, 0.2)",
      glow: "0 0 40px rgba(124, 58, 237, 0.3)",
      inset: "inset 0 2px 4px rgba(124, 58, 237, 0.08)",
    },
    
    typography: {
      headingFont: "Poppins",
      bodyFont: "Nunito",
      accentFont: "Fredoka",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "none",
      scale: { ...baseTypographyScale },
    },
    
    spacing: { ...baseSpacing },
    borderRadius: { ...baseBorderRadius, lg: "1.25rem", xl: "1.75rem", "2xl": "2.5rem" },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "500ms",
      durationVerySlow: "800ms",
      easingDefault: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.8, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      hoverScale: 1.05,
      hoverLift: "-8px",
      clickScale: 0.95,
      pageTransition: "bounce",
      scrollReveal: "pop",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: true,
      parallaxScrolling: true,
      cursorEffects: true,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.6,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.75rem",
      shadow: "0 8px 24px rgba(124, 58, 237, 0.12)",
      hoverLift: "-10px",
      hoverShadow: "0 24px 60px rgba(124, 58, 237, 0.2)",
      borderWidth: "0",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "colorful vibrant playful",
      mood: "fun energetic joyful",
      lighting: "bright, colorful, playful",
      composition: "dynamic, lifestyle, candid",
      colorTreatment: "saturated, vibrant, colorful",
      keywords: ["colorful", "vibrant", "fun", "playful", "energetic", "joyful", "happy"],
    },
    
    preferredLayouts: ["bento", "grid", "masonry", "cards"],
    sectionTransitions: ["bounce", "pop", "slide"],
    
    meta: {
      sophisticationScore: 75,
      accessibilityScore: 88,
      uniquenessScore: 85,
      bestFor: ["children", "education", "events", "food", "retail", "entertainment", "apps"],
      avoidFor: ["luxury brands", "legal", "healthcare", "finance", "corporate"],
    },
  },

  "classic-elegant": {
    id: "classic-elegant",
    name: "Classic Elegant",
    version: "3.0.0",
    mode: "light",
    personality: "trustworthy-established",
    motionStyle: "subtle-sophisticated",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#0C4A6E",
      primaryLight: "#0369A1",
      primaryDark: "#083344",
      secondary: "#155E75",
      secondaryLight: "#0E7490",
      accent: "#047857",
      accentAlt: "#059669",
      background: "#FFFFFF",
      backgroundAlt: "#F8F9FA",
      surface: "#FFFFFF",
      surfaceElevated: "#F8F9FA",
      card: "#FFFFFF",
      cardHover: "#F8F9FA",
      text: "#1e293b",
      textSecondary: "#334155",
      textMuted: "#94a3b8",
      heading: "#1e293b",
      border: "#E2E8F0",
      borderSubtle: "#F1F5F9",
      success: "#047857",
      warning: "#D97706",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Ocean Deep",
        css: "linear-gradient(180deg, #0C4A6E 0%, #083344 100%)",
        angle: 180,
        stops: [
          { color: "#0C4A6E", position: 0 },
          { color: "#083344", position: 100 },
        ],
      },
      accent: {
        name: "Forest",
        css: "linear-gradient(90deg, #047857 0%, #059669 100%)",
        angle: 90,
        stops: [
          { color: "#047857", position: 0 },
          { color: "#059669", position: 100 },
        ],
      },
      surface: {
        name: "Clean Gray",
        css: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#F8F9FA", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(0, 0, 0, 0.06)",
      soft: "0 4px 12px rgba(0, 0, 0, 0.08)",
      medium: "0 8px 24px rgba(0, 0, 0, 0.1)",
      strong: "0 16px 40px rgba(0, 0, 0, 0.12)",
      dramatic: "0 24px 60px rgba(0, 0, 0, 0.15)",
      glow: "0 0 40px rgba(12, 74, 110, 0.15)",
      inset: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
    },
    
    typography: {
      headingFont: "Merriweather",
      bodyFont: "Open Sans",
      accentFont: "Lora",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        letterSpacingTight: "-0.02em",
        lineHeightRelaxed: 1.8,
      },
    },
    
    spacing: { ...baseSpacing, section: "6rem", sectionMobile: "4rem" },
    borderRadius: { ...baseBorderRadius, md: "0.375rem", lg: "0.5rem", xl: "0.75rem" },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "350ms",
      durationSlow: "500ms",
      durationVerySlow: "750ms",
      easingDefault: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.2, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.45, 0, 0.55, 1)",
      hoverScale: 1.01,
      hoverLift: "-3px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "85vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.5,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "none",
    },
    
    navigation: {
      style: "solid",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "solid",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.5rem",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
      hoverLift: "-4px",
      hoverShadow: "0 12px 32px rgba(0, 0, 0, 0.1)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "professional corporate",
      mood: "trustworthy reliable established",
      lighting: "professional, even, studio",
      composition: "traditional, balanced, corporate",
      colorTreatment: "natural, professional, clean",
      keywords: ["professional", "corporate", "trust", "established", "reliable", "traditional", "clean"],
    },
    
    preferredLayouts: ["grid", "alternating", "stacked", "centered"],
    sectionTransitions: ["fade", "slide", "none"],
    
    meta: {
      sophisticationScore: 85,
      accessibilityScore: 95,
      uniquenessScore: 70,
      bestFor: ["finance", "legal", "healthcare", "consulting", "insurance", "professional services", "B2B"],
      avoidFor: ["creative agencies", "nightlife", "gaming", "youth brands"],
    },
  },

  "nature-organic": {
    id: "nature-organic",
    name: "Nature Organic",
    version: "3.0.0",
    mode: "light",
    personality: "friendly-approachable",
    motionStyle: "organic-natural",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#166534",
      primaryLight: "#22C55E",
      primaryDark: "#14532D",
      secondary: "#854D0E",
      secondaryLight: "#A16207",
      accent: "#0D9488",
      accentAlt: "#14B8A6",
      background: "#FEFDF8",
      backgroundAlt: "#FBF9F1",
      surface: "#FFFFFF",
      surfaceElevated: "#FEFDF8",
      card: "#FFFFFF",
      cardHover: "#FEFDF8",
      text: "#1C1917",
      textSecondary: "#44403C",
      textMuted: "#78716C",
      heading: "#1C1917",
      border: "#E7E5E4",
      borderSubtle: "#F5F5F4",
      success: "#166534",
      warning: "#854D0E",
      error: "#B91C1C",
    },
    
    gradients: {
      hero: {
        name: "Forest Mist",
        css: "linear-gradient(180deg, rgba(22, 101, 52, 0.1) 0%, #FEFDF8 100%)",
        angle: 180,
        stops: [
          { color: "rgba(22, 101, 52, 0.1)", position: 0 },
          { color: "#FEFDF8", position: 100 },
        ],
      },
      accent: {
        name: "Earth",
        css: "linear-gradient(90deg, #166534 0%, #0D9488 100%)",
        angle: 90,
        stops: [
          { color: "#166534", position: 0 },
          { color: "#0D9488", position: 100 },
        ],
      },
      surface: {
        name: "Natural",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FEFDF8 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FEFDF8", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(28, 25, 23, 0.06)",
      soft: "0 4px 12px rgba(28, 25, 23, 0.08)",
      medium: "0 8px 24px rgba(28, 25, 23, 0.1)",
      strong: "0 16px 40px rgba(28, 25, 23, 0.12)",
      dramatic: "0 24px 60px rgba(28, 25, 23, 0.15)",
      glow: "0 0 40px rgba(22, 101, 52, 0.15)",
      inset: "inset 0 2px 4px rgba(28, 25, 23, 0.06)",
    },
    
    typography: {
      headingFont: "Fraunces",
      bodyFont: "Outfit",
      accentFont: "Caveat",
      headingWeight: 600,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        lineHeightRelaxed: 1.8,
      },
    },
    
    spacing: { ...baseSpacing, section: "7rem", sectionMobile: "4rem" },
    borderRadius: { ...baseBorderRadius, lg: "1rem", xl: "1.5rem" },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "400ms",
      durationSlow: "600ms",
      durationVerySlow: "1000ms",
      easingDefault: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.3, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.45, 0, 0.55, 1)",
      hoverScale: 1.02,
      hoverLift: "-4px",
      clickScale: 0.98,
      pageTransition: "fade",
      scrollReveal: "grow",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.4,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "transparent",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "solid",
      mobileStyle: "slide",
      stickyBehavior: "threshold",
    },
    
    cards: {
      borderRadius: "1rem",
      shadow: "0 4px 16px rgba(28, 25, 23, 0.08)",
      hoverLift: "-6px",
      hoverShadow: "0 16px 40px rgba(22, 101, 52, 0.12)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "natural organic authentic",
      mood: "warm earthy sustainable",
      lighting: "natural daylight, golden hour",
      composition: "lifestyle, nature, sustainable",
      colorTreatment: "warm earthy tones, natural colors",
      keywords: ["natural", "organic", "sustainable", "eco", "green", "earthy", "authentic"],
    },
    
    preferredLayouts: ["alternating", "grid", "stacked", "editorial"],
    sectionTransitions: ["fade", "grow", "slide"],
    
    meta: {
      sophisticationScore: 82,
      accessibilityScore: 94,
      uniquenessScore: 80,
      bestFor: ["organic products", "wellness", "sustainability", "agriculture", "eco-friendly", "spa", "yoga"],
      avoidFor: ["tech startups", "gaming", "nightlife", "automotive"],
    },
  },

  "tech-futuristic": {
    id: "tech-futuristic",
    name: "Tech Futuristic",
    version: "3.0.0",
    mode: "dark",
    personality: "innovative-cutting-edge",
    motionStyle: "smooth-flowing",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#3B82F6",
      primaryLight: "#60A5FA",
      primaryDark: "#2563EB",
      secondary: "#8B5CF6",
      secondaryLight: "#A78BFA",
      accent: "#06B6D4",
      accentAlt: "#22D3EE",
      background: "#0F172A",
      backgroundAlt: "#0B1120",
      surface: "#1E293B",
      surfaceElevated: "#334155",
      card: "#1E293B",
      cardHover: "#334155",
      text: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textMuted: "#64748B",
      heading: "#F8FAFC",
      border: "#334155",
      borderSubtle: "#1E293B",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Cosmic",
        css: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(6, 182, 212, 0.2) 100%)",
        angle: 135,
        stops: [
          { color: "rgba(59, 130, 246, 0.2)", position: 0 },
          { color: "rgba(139, 92, 246, 0.2)", position: 50 },
          { color: "rgba(6, 182, 212, 0.2)", position: 100 },
        ],
      },
      accent: {
        name: "Tech Blue",
        css: "linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)",
        angle: 90,
        stops: [
          { color: "#3B82F6", position: 0 },
          { color: "#06B6D4", position: 100 },
        ],
      },
      surface: {
        name: "Deep Space",
        css: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
        angle: 180,
        stops: [
          { color: "#1E293B", position: 0 },
          { color: "#0F172A", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 2px 4px rgba(0, 0, 0, 0.3)",
      soft: "0 4px 12px rgba(0, 0, 0, 0.4)",
      medium: "0 8px 24px rgba(0, 0, 0, 0.5)",
      strong: "0 16px 40px rgba(0, 0, 0, 0.6)",
      dramatic: "0 24px 60px rgba(0, 0, 0, 0.7)",
      glow: "0 0 60px rgba(59, 130, 246, 0.3)",
      inset: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
    },
    
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      accentFont: "JetBrains Mono",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        letterSpacingTight: "-0.03em",
      },
    },
    
    spacing: { ...baseSpacing },
    borderRadius: { ...baseBorderRadius, lg: "1rem", xl: "1.25rem" },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "500ms",
      durationVerySlow: "800ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.4, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      hoverScale: 1.02,
      hoverLift: "-6px",
      clickScale: 0.98,
      pageTransition: "fade-slide",
      scrollReveal: "slide-up",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "medium",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: true,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "immersive",
      minHeight: "100vh",
      contentAlignment: "center",
      overlayStyle: "mesh",
      overlayOpacity: 0.7,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: true,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.25rem",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      hoverLift: "-8px",
      hoverShadow: "0 24px 60px rgba(59, 130, 246, 0.2)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "tech modern futuristic",
      mood: "innovative forward-thinking digital",
      lighting: "cool tones, backlit, rim lighting",
      composition: "clean tech products, abstract, data visualization",
      colorTreatment: "cool blues, teals, gradients",
      keywords: ["technology", "futuristic", "digital", "innovation", "AI", "data", "modern"],
    },
    
    preferredLayouts: ["bento", "asymmetric", "grid", "editorial"],
    sectionTransitions: ["fade-slide", "parallax", "reveal"],
    
    meta: {
      sophisticationScore: 90,
      accessibilityScore: 88,
      uniquenessScore: 88,
      bestFor: ["AI companies", "SaaS", "fintech", "data platforms", "dev tools", "cloud services"],
      avoidFor: ["traditional businesses", "children", "organic products", "craft businesses"],
    },
  },

  "warm-artisan": {
    id: "warm-artisan",
    name: "Warm Artisan",
    version: "3.0.0",
    mode: "light",
    personality: "friendly-approachable",
    motionStyle: "organic-natural",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#B45309",
      primaryLight: "#D97706",
      primaryDark: "#92400E",
      secondary: "#7C2D12",
      secondaryLight: "#9A3412",
      accent: "#1D4ED8",
      accentAlt: "#2563EB",
      background: "#FFFBEB",
      backgroundAlt: "#FEF3C7",
      surface: "#FFFFFF",
      surfaceElevated: "#FFFBEB",
      card: "#FFFFFF",
      cardHover: "#FFFBEB",
      text: "#1C1917",
      textSecondary: "#44403C",
      textMuted: "#78716C",
      heading: "#1C1917",
      border: "#FDE68A",
      borderSubtle: "#FEF3C7",
      success: "#16A34A",
      warning: "#D97706",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Honey",
        css: "linear-gradient(180deg, rgba(180, 83, 9, 0.1) 0%, #FFFBEB 100%)",
        angle: 180,
        stops: [
          { color: "rgba(180, 83, 9, 0.1)", position: 0 },
          { color: "#FFFBEB", position: 100 },
        ],
      },
      accent: {
        name: "Terracotta",
        css: "linear-gradient(90deg, #B45309 0%, #7C2D12 100%)",
        angle: 90,
        stops: [
          { color: "#B45309", position: 0 },
          { color: "#7C2D12", position: 100 },
        ],
      },
      surface: {
        name: "Cream",
        css: "linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#FFFBEB", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(28, 25, 23, 0.08)",
      soft: "0 4px 12px rgba(28, 25, 23, 0.1)",
      medium: "0 8px 24px rgba(28, 25, 23, 0.12)",
      strong: "0 16px 40px rgba(28, 25, 23, 0.15)",
      dramatic: "0 24px 60px rgba(28, 25, 23, 0.18)",
      glow: "0 0 40px rgba(180, 83, 9, 0.2)",
      inset: "inset 0 2px 4px rgba(28, 25, 23, 0.08)",
    },
    
    typography: {
      headingFont: "Libre Baskerville",
      bodyFont: "Lato",
      accentFont: "Satisfy",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        lineHeightRelaxed: 1.75,
      },
    },
    
    spacing: { ...baseSpacing, section: "6rem", sectionMobile: "4rem" },
    borderRadius: { ...baseBorderRadius, lg: "0.75rem", xl: "1rem" },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "350ms",
      durationSlow: "550ms",
      durationVerySlow: "850ms",
      easingDefault: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.3, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.45, 0, 0.55, 1)",
      hoverScale: 1.02,
      hoverLift: "-4px",
      clickScale: 0.98,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: true,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "editorial",
      minHeight: "85vh",
      contentAlignment: "center",
      overlayStyle: "gradient",
      overlayOpacity: 0.3,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "underline",
    },
    
    navigation: {
      style: "transparent",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "solid",
      mobileStyle: "slide",
      stickyBehavior: "threshold",
    },
    
    cards: {
      borderRadius: "0.75rem",
      shadow: "0 4px 16px rgba(28, 25, 23, 0.1)",
      hoverLift: "-4px",
      hoverShadow: "0 16px 40px rgba(180, 83, 9, 0.15)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "warm rustic handmade",
      mood: "artisan crafted authentic",
      lighting: "warm golden, natural window light",
      composition: "close-up details, textures, handcraft",
      colorTreatment: "warm tones, vintage film, analog feel",
      keywords: ["artisan", "handmade", "craft", "warm", "rustic", "authentic", "traditional"],
    },
    
    preferredLayouts: ["editorial", "alternating", "grid", "stacked"],
    sectionTransitions: ["fade", "slide", "reveal"],
    
    meta: {
      sophisticationScore: 80,
      accessibilityScore: 92,
      uniquenessScore: 82,
      bestFor: ["bakeries", "cafes", "artisan products", "craft businesses", "restaurants", "home goods"],
      avoidFor: ["tech startups", "corporate", "gaming", "finance"],
    },
  },

  "crisp-corporate": {
    id: "crisp-corporate",
    name: "Crisp Corporate",
    version: "3.0.0",
    mode: "light",
    personality: "trustworthy-established",
    motionStyle: "minimal-refined",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#1E3A5F",
      primaryLight: "#2D5A87",
      primaryDark: "#122436",
      secondary: "#3B82F6",
      secondaryLight: "#60A5FA",
      accent: "#10B981",
      accentAlt: "#34D399",
      background: "#FFFFFF",
      backgroundAlt: "#F8FAFC",
      surface: "#FFFFFF",
      surfaceElevated: "#F8FAFC",
      card: "#FFFFFF",
      cardHover: "#F8FAFC",
      text: "#1E293B",
      textSecondary: "#475569",
      textMuted: "#94A3B8",
      heading: "#0F172A",
      border: "#E2E8F0",
      borderSubtle: "#F1F5F9",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Corporate Blue",
        css: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)",
        angle: 135,
        stops: [
          { color: "#1E3A5F", position: 0 },
          { color: "#3B82F6", position: 100 },
        ],
      },
      accent: {
        name: "Success",
        css: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
        angle: 90,
        stops: [
          { color: "#10B981", position: 0 },
          { color: "#34D399", position: 100 },
        ],
      },
      surface: {
        name: "Clean Slate",
        css: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        angle: 180,
        stops: [
          { color: "#FFFFFF", position: 0 },
          { color: "#F8FAFC", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 2px rgba(0, 0, 0, 0.05)",
      soft: "0 4px 8px rgba(0, 0, 0, 0.06)",
      medium: "0 8px 16px rgba(0, 0, 0, 0.08)",
      strong: "0 16px 32px rgba(0, 0, 0, 0.1)",
      dramatic: "0 24px 48px rgba(0, 0, 0, 0.12)",
      glow: "0 0 40px rgba(30, 58, 95, 0.15)",
      inset: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      accentFont: "IBM Plex Sans",
      headingWeight: 700,
      bodyWeight: 400,
      headingStyle: "none",
      scale: {
        ...baseTypographyScale,
        letterSpacingTight: "-0.025em",
      },
    },
    
    spacing: { ...baseSpacing, section: "6rem", sectionMobile: "3.5rem" },
    borderRadius: { ...baseBorderRadius, md: "0.5rem", lg: "0.75rem", xl: "1rem" },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      durationVerySlow: "600ms",
      easingDefault: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.15, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.45, 0, 0.55, 1)",
      hoverScale: 1.01,
      hoverLift: "-2px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "split",
      minHeight: "85vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.4,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "solid",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "solid",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.75rem",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      hoverLift: "-3px",
      hoverShadow: "0 12px 28px rgba(30, 58, 95, 0.1)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "clean corporate professional",
      mood: "confident modern trustworthy",
      lighting: "studio, professional, bright",
      composition: "business lifestyle, teamwork, modern office",
      colorTreatment: "clean, professional, slight cool tones",
      keywords: ["corporate", "professional", "business", "modern", "team", "office", "enterprise"],
    },
    
    preferredLayouts: ["grid", "alternating", "stacked", "centered"],
    sectionTransitions: ["fade", "slide", "none"],
    
    meta: {
      sophisticationScore: 88,
      accessibilityScore: 96,
      uniquenessScore: 72,
      bestFor: ["B2B", "enterprise software", "consulting", "professional services", "finance", "insurance"],
      avoidFor: ["creative agencies", "nightlife", "children", "entertainment"],
    },
  },

  // ============================================
  // NEW THEMES v4.0 - 12 Additional Creative Themes
  // ============================================

  "startup-velocity": {
    id: "startup-velocity",
    name: "Startup Velocity",
    version: "4.0.0",
    mode: "dark",
    personality: "bold-confident",
    motionStyle: "dynamic-energetic",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#7C3AED",
      primaryLight: "#A78BFA",
      primaryDark: "#5B21B6",
      secondary: "#06B6D4",
      secondaryLight: "#22D3EE",
      accent: "#F59E0B",
      accentAlt: "#FBBF24",
      background: "#0F0F23",
      backgroundAlt: "#1A1A35",
      surface: "#1E1E3F",
      surfaceElevated: "#252550",
      card: "#1E1E3F",
      cardHover: "#2A2A55",
      text: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textMuted: "#94A3B8",
      heading: "#FFFFFF",
      border: "#374191",
      borderSubtle: "#2A2A55",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Velocity Flow",
        css: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 50%, #F59E0B 100%)",
        angle: 135,
        stops: [
          { color: "#7C3AED", position: 0 },
          { color: "#06B6D4", position: 50 },
          { color: "#F59E0B", position: 100 },
        ],
      },
      accent: {
        name: "Startup Spark",
        css: "linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)",
        angle: 90,
        stops: [
          { color: "#7C3AED", position: 0 },
          { color: "#06B6D4", position: 100 },
        ],
      },
      card: {
        name: "Ambient Purple",
        css: "linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(124, 58, 237, 0.1)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Dark Depth",
        css: "linear-gradient(180deg, rgba(15, 15, 35, 0.8) 0%, rgba(15, 15, 35, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(15, 15, 35, 0.8)", position: 0 },
          { color: "rgba(15, 15, 35, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(124, 58, 237, 0.08)",
      soft: "0 4px 12px rgba(124, 58, 237, 0.15)",
      medium: "0 8px 24px rgba(124, 58, 237, 0.2)",
      strong: "0 16px 48px rgba(124, 58, 237, 0.25)",
      dramatic: "0 24px 64px rgba(124, 58, 237, 0.3)",
      glow: "0 0 32px rgba(124, 58, 237, 0.4)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
    },
    
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "Inter",
      accentFont: "Space Mono",
      headingWeight: "700",
      bodyWeight: "400",
      headingStyle: "uppercase tracking-wide",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3.5rem",
      fontSize6xl: "4.5rem",
      fontSizeDisplay: "6rem",
      lineHeightTight: 1.1,
      lineHeightSnug: 1.25,
      lineHeightNormal: 1.5,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "-0.03em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.1em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
      section: "7rem",
      sectionMobile: "4rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.375rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "500ms",
      durationVerySlow: "800ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.05,
      hoverLift: "-6px",
      clickScale: 0.97,
      pageTransition: "slide-up",
      scrollReveal: "fade-slide",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "medium",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: true,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "95vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.7,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: true,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.25rem",
      shadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
      hoverLift: "-8px",
      hoverShadow: "0 20px 48px rgba(124, 58, 237, 0.25)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "dynamic startup tech team",
      mood: "ambitious energetic innovative",
      lighting: "dramatic, dynamic, high contrast",
      composition: "action shots, teamwork, innovation",
      colorTreatment: "vibrant, energetic, purple/cyan tones",
      keywords: ["startup", "innovation", "velocity", "growth", "team", "hustle", "success"],
    },
    
    preferredLayouts: ["split", "bento", "asymmetric", "grid"],
    sectionTransitions: ["fade-slide", "parallax", "reveal"],
    
    meta: {
      sophisticationScore: 92,
      accessibilityScore: 88,
      uniquenessScore: 94,
      bestFor: ["startups", "SaaS", "tech companies", "accelerators", "innovation labs", "venture capital"],
      avoidFor: ["traditional businesses", "government", "children"],
    },
  },

  "saas-aurora": {
    id: "saas-aurora",
    name: "SaaS Aurora",
    version: "4.0.0",
    mode: "light",
    personality: "innovative-cutting-edge",
    motionStyle: "smooth-flowing",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#6366F1",
      primaryLight: "#818CF8",
      primaryDark: "#4F46E5",
      secondary: "#EC4899",
      secondaryLight: "#F472B6",
      accent: "#14B8A6",
      accentAlt: "#2DD4BF",
      background: "#FAFBFF",
      backgroundAlt: "#F1F5FF",
      surface: "#FFFFFF",
      surfaceElevated: "#F8FAFF",
      card: "#FFFFFF",
      cardHover: "#F8FAFF",
      text: "#1E293B",
      textSecondary: "#475569",
      textMuted: "#64748B",
      heading: "#0F172A",
      border: "#E2E8F0",
      borderSubtle: "#F1F5F9",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Aurora Glow",
        css: "linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #14B8A6 100%)",
        angle: 135,
        stops: [
          { color: "#6366F1", position: 0 },
          { color: "#EC4899", position: 50 },
          { color: "#14B8A6", position: 100 },
        ],
      },
      accent: {
        name: "Soft Aurora",
        css: "linear-gradient(90deg, #6366F1 0%, #EC4899 100%)",
        angle: 90,
        stops: [
          { color: "#6366F1", position: 0 },
          { color: "#EC4899", position: 100 },
        ],
      },
      card: {
        name: "Light Shimmer",
        css: "linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(99, 102, 241, 0.05)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Soft Veil",
        css: "linear-gradient(180deg, rgba(250, 251, 255, 0.9) 0%, rgba(250, 251, 255, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(250, 251, 255, 0.9)", position: 0 },
          { color: "rgba(250, 251, 255, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(99, 102, 241, 0.06)",
      soft: "0 4px 16px rgba(99, 102, 241, 0.08)",
      medium: "0 8px 30px rgba(99, 102, 241, 0.12)",
      strong: "0 16px 50px rgba(99, 102, 241, 0.16)",
      dramatic: "0 24px 60px rgba(99, 102, 241, 0.2)",
      glow: "0 0 40px rgba(99, 102, 241, 0.25)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
    },
    
    typography: {
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
      accentFont: "JetBrains Mono",
      headingWeight: "700",
      bodyWeight: "400",
      headingStyle: "modern rounded",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3.5rem",
      fontSize6xl: "4.5rem",
      fontSizeDisplay: "5.5rem",
      lineHeightTight: 1.15,
      lineHeightSnug: 1.3,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.8,
      letterSpacingTight: "-0.02em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.05em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
      section: "8rem",
      sectionMobile: "4rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      durationVerySlow: "600ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.02,
      hoverLift: "-4px",
      clickScale: 0.98,
      pageTransition: "fade",
      scrollReveal: "slide-up",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.1,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.25rem",
      shadow: "0 8px 30px rgba(99, 102, 241, 0.1)",
      hoverLift: "-6px",
      hoverShadow: "0 20px 50px rgba(99, 102, 241, 0.15)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "clean modern SaaS interface screenshots",
      mood: "productive efficient modern",
      lighting: "bright, natural, soft shadows",
      composition: "UI mockups, dashboard views, team collaboration",
      colorTreatment: "vibrant, clean, gradient accents",
      keywords: ["SaaS", "software", "dashboard", "productivity", "cloud", "platform", "app"],
    },
    
    preferredLayouts: ["split", "bento", "grid", "alternating"],
    sectionTransitions: ["fade", "slide-up", "reveal"],
    
    meta: {
      sophisticationScore: 94,
      accessibilityScore: 95,
      uniquenessScore: 90,
      bestFor: ["SaaS products", "B2B software", "productivity tools", "analytics platforms", "cloud services"],
      avoidFor: ["restaurants", "nightlife", "traditional businesses"],
    },
  },

  "fintech-precision": {
    id: "fintech-precision",
    name: "Fintech Precision",
    version: "4.0.0",
    mode: "dark",
    personality: "trustworthy-established",
    motionStyle: "subtle-sophisticated",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#0EA5E9",
      primaryLight: "#38BDF8",
      primaryDark: "#0284C7",
      secondary: "#10B981",
      secondaryLight: "#34D399",
      accent: "#8B5CF6",
      accentAlt: "#A78BFA",
      background: "#0A0E14",
      backgroundAlt: "#0F1419",
      surface: "#151B23",
      surfaceElevated: "#1B222D",
      card: "#151B23",
      cardHover: "#1B222D",
      text: "#E2E8F0",
      textSecondary: "#94A3B8",
      textMuted: "#64748B",
      heading: "#F8FAFC",
      border: "#1E293B",
      borderSubtle: "#1B222D",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Financial Trust",
        css: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
        angle: 135,
        stops: [
          { color: "#0EA5E9", position: 0 },
          { color: "#10B981", position: 100 },
        ],
      },
      accent: {
        name: "Precision Blue",
        css: "linear-gradient(90deg, #0EA5E9 0%, #8B5CF6 100%)",
        angle: 90,
        stops: [
          { color: "#0EA5E9", position: 0 },
          { color: "#8B5CF6", position: 100 },
        ],
      },
      card: {
        name: "Subtle Glow",
        css: "linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(14, 165, 233, 0.08)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Dark Trust",
        css: "linear-gradient(180deg, rgba(10, 14, 20, 0.85) 0%, rgba(10, 14, 20, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(10, 14, 20, 0.85)", position: 0 },
          { color: "rgba(10, 14, 20, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(14, 165, 233, 0.05)",
      soft: "0 4px 12px rgba(14, 165, 233, 0.08)",
      medium: "0 8px 24px rgba(14, 165, 233, 0.12)",
      strong: "0 16px 40px rgba(14, 165, 233, 0.16)",
      dramatic: "0 24px 56px rgba(14, 165, 233, 0.2)",
      glow: "0 0 24px rgba(14, 165, 233, 0.25)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
    },
    
    typography: {
      headingFont: "Satoshi",
      bodyFont: "Inter",
      accentFont: "IBM Plex Mono",
      headingWeight: "700",
      bodyWeight: "400",
      headingStyle: "sharp precise",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3rem",
      fontSize6xl: "4rem",
      fontSizeDisplay: "5rem",
      lineHeightTight: 1.15,
      lineHeightSnug: 1.3,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "-0.02em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.05em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
      section: "7rem",
      sectionMobile: "4rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "120ms",
      durationNormal: "200ms",
      durationSlow: "350ms",
      durationVerySlow: "500ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.01,
      hoverLift: "-2px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.6,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.75rem",
      shadow: "0 4px 16px rgba(14, 165, 233, 0.08)",
      hoverLift: "-4px",
      hoverShadow: "0 12px 32px rgba(14, 165, 233, 0.12)",
      borderWidth: "1px",
      padding: "1.75rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "professional fintech financial charts",
      mood: "trustworthy secure modern",
      lighting: "clean, professional, tech-forward",
      composition: "data visualization, charts, professional portraits",
      colorTreatment: "cool blues, greens, high contrast",
      keywords: ["fintech", "finance", "banking", "security", "crypto", "trading", "investment"],
    },
    
    preferredLayouts: ["grid", "bento", "alternating", "stacked"],
    sectionTransitions: ["fade", "slide", "none"],
    
    meta: {
      sophisticationScore: 95,
      accessibilityScore: 93,
      uniquenessScore: 88,
      bestFor: ["fintech", "banking apps", "crypto platforms", "trading software", "investment tools"],
      avoidFor: ["restaurants", "fashion", "entertainment"],
    },
  },

  "healthcare-trust": {
    id: "healthcare-trust",
    name: "Healthcare Trust",
    version: "4.0.0",
    mode: "light",
    personality: "trustworthy-established",
    motionStyle: "smooth-flowing",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#0891B2",
      primaryLight: "#06B6D4",
      primaryDark: "#0E7490",
      secondary: "#059669",
      secondaryLight: "#10B981",
      accent: "#6366F1",
      accentAlt: "#818CF8",
      background: "#F8FDFF",
      backgroundAlt: "#ECFEFF",
      surface: "#FFFFFF",
      surfaceElevated: "#F0FDFF",
      card: "#FFFFFF",
      cardHover: "#F0FDFF",
      text: "#0F172A",
      textSecondary: "#334155",
      textMuted: "#64748B",
      heading: "#0F172A",
      border: "#E0F2FE",
      borderSubtle: "#ECFEFF",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Healing Blue",
        css: "linear-gradient(135deg, #0891B2 0%, #059669 100%)",
        angle: 135,
        stops: [
          { color: "#0891B2", position: 0 },
          { color: "#059669", position: 100 },
        ],
      },
      accent: {
        name: "Trust Gradient",
        css: "linear-gradient(90deg, #0891B2 0%, #6366F1 100%)",
        angle: 90,
        stops: [
          { color: "#0891B2", position: 0 },
          { color: "#6366F1", position: 100 },
        ],
      },
      card: {
        name: "Soft Care",
        css: "linear-gradient(180deg, rgba(8, 145, 178, 0.05) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(8, 145, 178, 0.05)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Clean Overlay",
        css: "linear-gradient(180deg, rgba(248, 253, 255, 0.9) 0%, rgba(248, 253, 255, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(248, 253, 255, 0.9)", position: 0 },
          { color: "rgba(248, 253, 255, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(8, 145, 178, 0.05)",
      soft: "0 4px 12px rgba(8, 145, 178, 0.08)",
      medium: "0 8px 24px rgba(8, 145, 178, 0.1)",
      strong: "0 16px 40px rgba(8, 145, 178, 0.12)",
      dramatic: "0 24px 56px rgba(8, 145, 178, 0.15)",
      glow: "0 0 24px rgba(8, 145, 178, 0.2)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
    },
    
    typography: {
      headingFont: "DM Sans",
      bodyFont: "Inter",
      accentFont: "DM Sans",
      headingWeight: "600",
      bodyWeight: "400",
      headingStyle: "rounded friendly",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3rem",
      fontSize6xl: "3.75rem",
      fontSizeDisplay: "4.5rem",
      lineHeightTight: 1.2,
      lineHeightSnug: 1.35,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.8,
      letterSpacingTight: "-0.015em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.025em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
      section: "8rem",
      sectionMobile: "5rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "250ms",
      durationSlow: "400ms",
      durationVerySlow: "600ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.01,
      hoverLift: "-3px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "split",
      minHeight: "85vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.1,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1rem",
      shadow: "0 4px 16px rgba(8, 145, 178, 0.08)",
      hoverLift: "-4px",
      hoverShadow: "0 12px 32px rgba(8, 145, 178, 0.12)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "warm healthcare professional caring",
      mood: "reassuring trusted compassionate",
      lighting: "bright, warm, natural",
      composition: "doctors, patients, medical facilities, care moments",
      colorTreatment: "warm, calming, cyan/green accents",
      keywords: ["healthcare", "medical", "wellness", "care", "hospital", "doctor", "patient"],
    },
    
    preferredLayouts: ["grid", "alternating", "stacked", "centered"],
    sectionTransitions: ["fade", "slide-up", "none"],
    
    meta: {
      sophisticationScore: 90,
      accessibilityScore: 98,
      uniquenessScore: 82,
      bestFor: ["healthcare", "medical practices", "telehealth", "wellness apps", "health tech"],
      avoidFor: ["nightlife", "gaming", "extreme sports"],
    },
  },

  "cyber-matrix": {
    id: "cyber-matrix",
    name: "Cyber Matrix",
    version: "4.0.0",
    mode: "dark",
    personality: "innovative-cutting-edge",
    motionStyle: "sharp-precise",
    layoutDensity: "compact",
    
    colors: {
      primary: "#22C55E",
      primaryLight: "#4ADE80",
      primaryDark: "#16A34A",
      secondary: "#06B6D4",
      secondaryLight: "#22D3EE",
      accent: "#F43F5E",
      accentAlt: "#FB7185",
      background: "#000000",
      backgroundAlt: "#0A0A0A",
      surface: "#0F0F0F",
      surfaceElevated: "#171717",
      card: "#0F0F0F",
      cardHover: "#171717",
      text: "#E4E4E7",
      textSecondary: "#A1A1AA",
      textMuted: "#71717A",
      heading: "#FAFAFA",
      border: "#27272A",
      borderSubtle: "#1C1C1E",
      success: "#22C55E",
      warning: "#FBBF24",
      error: "#F43F5E",
    },
    
    gradients: {
      hero: {
        name: "Matrix Code",
        css: "linear-gradient(180deg, rgba(34, 197, 94, 0.15) 0%, transparent 50%, rgba(6, 182, 212, 0.1) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(34, 197, 94, 0.15)", position: 0 },
          { color: "transparent", position: 50 },
          { color: "rgba(6, 182, 212, 0.1)", position: 100 },
        ],
      },
      accent: {
        name: "Cyber Green",
        css: "linear-gradient(90deg, #22C55E 0%, #06B6D4 100%)",
        angle: 90,
        stops: [
          { color: "#22C55E", position: 0 },
          { color: "#06B6D4", position: 100 },
        ],
      },
      card: {
        name: "Terminal Glow",
        css: "linear-gradient(180deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(34, 197, 94, 0.05)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Dark Void",
        css: "linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.98) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(0, 0, 0, 0.9)", position: 0 },
          { color: "rgba(0, 0, 0, 0.98)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(34, 197, 94, 0.1)",
      soft: "0 4px 12px rgba(34, 197, 94, 0.15)",
      medium: "0 8px 24px rgba(34, 197, 94, 0.2)",
      strong: "0 16px 40px rgba(34, 197, 94, 0.25)",
      dramatic: "0 24px 56px rgba(34, 197, 94, 0.3)",
      glow: "0 0 30px rgba(34, 197, 94, 0.5)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.5)",
    },
    
    typography: {
      headingFont: "Fira Code",
      bodyFont: "JetBrains Mono",
      accentFont: "Fira Code",
      headingWeight: "600",
      bodyWeight: "400",
      headingStyle: "monospace technical",
    },
    
    typographyScale: {
      fontSizeBase: "0.9375rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.8125rem",
      fontSizeMd: "0.9375rem",
      fontSizeLg: "1rem",
      fontSizeXl: "1.125rem",
      fontSize2xl: "1.375rem",
      fontSize3xl: "1.75rem",
      fontSize4xl: "2.25rem",
      fontSize5xl: "3rem",
      fontSize6xl: "4rem",
      fontSizeDisplay: "5rem",
      lineHeightTight: 1.2,
      lineHeightSnug: 1.35,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "0",
      letterSpacingNormal: "0.02em",
      letterSpacingWide: "0.1em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "5rem",
      section: "6rem",
      sectionMobile: "3.5rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.375rem",
      xl: "0.5rem",
      "2xl": "0.75rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "100ms",
      durationNormal: "200ms",
      durationSlow: "300ms",
      durationVerySlow: "500ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.02,
      hoverLift: "-2px",
      clickScale: 0.98,
      pageTransition: "fade",
      scrollReveal: "fade",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: true,
      parallaxScrolling: false,
      cursorEffects: true,
      noiseTexture: true,
      grainOverlay: true,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "minimal",
      minHeight: "100vh",
      contentAlignment: "center",
      overlayStyle: "none",
      overlayOpacity: 0,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: true,
      badgeStyle: "angular",
    },
    
    navigation: {
      style: "minimal",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "outline",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.25rem",
      shadow: "0 0 20px rgba(34, 197, 94, 0.1)",
      hoverLift: "-2px",
      hoverShadow: "0 0 30px rgba(34, 197, 94, 0.2)",
      borderWidth: "1px",
      padding: "1.5rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "abstract tech cyberpunk digital",
      mood: "mysterious technical hacker",
      lighting: "low-key, neon accents, dramatic",
      composition: "code, terminals, networks, abstract data",
      colorTreatment: "green monochrome, matrix style",
      keywords: ["cybersecurity", "hacker", "code", "terminal", "network", "privacy", "encryption"],
    },
    
    preferredLayouts: ["grid", "stacked", "centered"],
    sectionTransitions: ["fade", "none"],
    
    meta: {
      sophisticationScore: 88,
      accessibilityScore: 82,
      uniquenessScore: 96,
      bestFor: ["cybersecurity", "dev tools", "hacker spaces", "security companies", "privacy tools"],
      avoidFor: ["healthcare", "children", "weddings", "organic"],
    },
  },

  "creative-studio": {
    id: "creative-studio",
    name: "Creative Studio",
    version: "4.0.0",
    mode: "light",
    personality: "creative-artistic",
    motionStyle: "organic-natural",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#FF6B35",
      primaryLight: "#FF8C61",
      primaryDark: "#E55A2B",
      secondary: "#3B82F6",
      secondaryLight: "#60A5FA",
      accent: "#8B5CF6",
      accentAlt: "#A78BFA",
      background: "#FFFDF7",
      backgroundAlt: "#FFF9ED",
      surface: "#FFFFFF",
      surfaceElevated: "#FFFBF5",
      card: "#FFFFFF",
      cardHover: "#FFFBF5",
      text: "#1E1B18",
      textSecondary: "#4A453E",
      textMuted: "#7A7570",
      heading: "#1E1B18",
      border: "#EDE8E0",
      borderSubtle: "#F5F0E8",
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Creative Burst",
        css: "linear-gradient(135deg, #FF6B35 0%, #8B5CF6 50%, #3B82F6 100%)",
        angle: 135,
        stops: [
          { color: "#FF6B35", position: 0 },
          { color: "#8B5CF6", position: 50 },
          { color: "#3B82F6", position: 100 },
        ],
      },
      accent: {
        name: "Studio Warm",
        css: "linear-gradient(90deg, #FF6B35 0%, #FF8C61 100%)",
        angle: 90,
        stops: [
          { color: "#FF6B35", position: 0 },
          { color: "#FF8C61", position: 100 },
        ],
      },
      card: {
        name: "Warm Canvas",
        css: "linear-gradient(180deg, rgba(255, 107, 53, 0.05) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(255, 107, 53, 0.05)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Cream Wash",
        css: "linear-gradient(180deg, rgba(255, 253, 247, 0.9) 0%, rgba(255, 253, 247, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(255, 253, 247, 0.9)", position: 0 },
          { color: "rgba(255, 253, 247, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(255, 107, 53, 0.06)",
      soft: "0 4px 16px rgba(255, 107, 53, 0.1)",
      medium: "0 8px 30px rgba(255, 107, 53, 0.14)",
      strong: "0 16px 48px rgba(255, 107, 53, 0.18)",
      dramatic: "0 24px 64px rgba(255, 107, 53, 0.22)",
      glow: "0 0 40px rgba(255, 107, 53, 0.3)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
    },
    
    typography: {
      headingFont: "Clash Display",
      bodyFont: "Cabinet Grotesk",
      accentFont: "Clash Display",
      headingWeight: "600",
      bodyWeight: "400",
      headingStyle: "expressive bold",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.75rem",
      fontSize5xl: "3.75rem",
      fontSize6xl: "5rem",
      fontSizeDisplay: "7rem",
      lineHeightTight: 1.1,
      lineHeightSnug: 1.25,
      lineHeightNormal: 1.5,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "-0.03em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.05em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "5rem",
      "4xl": "7rem",
      section: "9rem",
      sectionMobile: "5rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "350ms",
      durationSlow: "500ms",
      durationVerySlow: "800ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.03,
      hoverLift: "-8px",
      clickScale: 0.97,
      pageTransition: "slide-up",
      scrollReveal: "reveal",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: true,
      noiseTexture: true,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "editorial",
      minHeight: "100vh",
      contentAlignment: "left",
      overlayStyle: "none",
      overlayOpacity: 0,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: false,
      badgeStyle: "underline",
    },
    
    navigation: {
      style: "minimal",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "solid",
      mobileStyle: "fullscreen",
      stickyBehavior: "scroll-up",
    },
    
    cards: {
      borderRadius: "1.5rem",
      shadow: "0 8px 32px rgba(255, 107, 53, 0.12)",
      hoverLift: "-10px",
      hoverShadow: "0 24px 56px rgba(255, 107, 53, 0.18)",
      borderWidth: "0",
      padding: "2.5rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "artistic creative portfolio work",
      mood: "expressive bold innovative",
      lighting: "natural, dramatic, studio",
      composition: "portfolio pieces, creative process, abstract art",
      colorTreatment: "vibrant, saturated, artistic",
      keywords: ["creative", "agency", "design", "portfolio", "art", "studio", "branding"],
    },
    
    preferredLayouts: ["asymmetric", "editorial", "masonry", "bento"],
    sectionTransitions: ["parallax", "reveal", "fade-slide"],
    
    meta: {
      sophisticationScore: 93,
      accessibilityScore: 88,
      uniquenessScore: 95,
      bestFor: ["creative agencies", "design studios", "portfolios", "art galleries", "branding agencies"],
      avoidFor: ["corporate", "healthcare", "finance", "government"],
    },
  },

  "luxury-noir": {
    id: "luxury-noir",
    name: "Luxury Noir",
    version: "4.0.0",
    mode: "dark",
    personality: "luxurious-exclusive",
    motionStyle: "subtle-sophisticated",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#C9A962",
      primaryLight: "#D4BC7B",
      primaryDark: "#B8944B",
      secondary: "#8B7355",
      secondaryLight: "#A38B6D",
      accent: "#E5E5E5",
      accentAlt: "#FFFFFF",
      background: "#0D0D0D",
      backgroundAlt: "#141414",
      surface: "#1A1A1A",
      surfaceElevated: "#212121",
      card: "#1A1A1A",
      cardHover: "#212121",
      text: "#E5E5E5",
      textSecondary: "#A3A3A3",
      textMuted: "#737373",
      heading: "#FFFFFF",
      border: "#2D2D2D",
      borderSubtle: "#252525",
      success: "#22C55E",
      warning: "#C9A962",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Golden Noir",
        css: "linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, transparent 50%, rgba(201, 169, 98, 0.1) 100%)",
        angle: 135,
        stops: [
          { color: "rgba(201, 169, 98, 0.15)", position: 0 },
          { color: "transparent", position: 50 },
          { color: "rgba(201, 169, 98, 0.1)", position: 100 },
        ],
      },
      accent: {
        name: "Gold Shimmer",
        css: "linear-gradient(90deg, #B8944B 0%, #D4BC7B 50%, #B8944B 100%)",
        angle: 90,
        stops: [
          { color: "#B8944B", position: 0 },
          { color: "#D4BC7B", position: 50 },
          { color: "#B8944B", position: 100 },
        ],
      },
      card: {
        name: "Dark Velvet",
        css: "linear-gradient(180deg, rgba(201, 169, 98, 0.03) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(201, 169, 98, 0.03)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Noir Depth",
        css: "linear-gradient(180deg, rgba(13, 13, 13, 0.85) 0%, rgba(13, 13, 13, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(13, 13, 13, 0.85)", position: 0 },
          { color: "rgba(13, 13, 13, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(0, 0, 0, 0.3)",
      soft: "0 4px 16px rgba(0, 0, 0, 0.4)",
      medium: "0 8px 30px rgba(0, 0, 0, 0.5)",
      strong: "0 16px 50px rgba(0, 0, 0, 0.6)",
      dramatic: "0 24px 70px rgba(0, 0, 0, 0.7)",
      glow: "0 0 40px rgba(201, 169, 98, 0.2)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.5)",
    },
    
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Cormorant Garamond",
      accentFont: "Cinzel",
      headingWeight: "500",
      bodyWeight: "400",
      headingStyle: "editorial serif luxury",
    },
    
    typographyScale: {
      fontSizeBase: "1.0625rem",
      fontSizeXs: "0.8125rem",
      fontSizeSm: "0.9375rem",
      fontSizeMd: "1.0625rem",
      fontSizeLg: "1.1875rem",
      fontSizeXl: "1.3125rem",
      fontSize2xl: "1.625rem",
      fontSize3xl: "2.125rem",
      fontSize4xl: "2.75rem",
      fontSize5xl: "3.5rem",
      fontSize6xl: "4.5rem",
      fontSizeDisplay: "6rem",
      lineHeightTight: 1.1,
      lineHeightSnug: 1.2,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.8,
      letterSpacingTight: "-0.02em",
      letterSpacingNormal: "0.02em",
      letterSpacingWide: "0.15em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.75rem",
      xl: "2.5rem",
      "2xl": "4rem",
      "3xl": "6rem",
      "4xl": "8rem",
      section: "10rem",
      sectionMobile: "6rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.375rem",
      xl: "0.5rem",
      "2xl": "0.75rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "400ms",
      durationSlow: "600ms",
      durationVerySlow: "1000ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.01,
      hoverLift: "-3px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: true,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "cinematic",
      minHeight: "100vh",
      contentAlignment: "center",
      overlayStyle: "gradient",
      overlayOpacity: 0.7,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: true,
      badgeStyle: "underline",
    },
    
    navigation: {
      style: "transparent",
      glassMorphism: false,
      scrollTransform: true,
      hoverStyle: "underline",
      ctaStyle: "outline",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.25rem",
      shadow: "0 8px 40px rgba(0, 0, 0, 0.5)",
      hoverLift: "-4px",
      hoverShadow: "0 16px 60px rgba(0, 0, 0, 0.6)",
      borderWidth: "1px",
      padding: "3rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "cinematic luxury editorial black white gold",
      mood: "exclusive elegant sophisticated",
      lighting: "dramatic, low-key, golden hour",
      composition: "fashion, luxury products, architecture, lifestyle",
      colorTreatment: "muted, gold accents, high contrast",
      keywords: ["luxury", "exclusive", "premium", "fashion", "haute", "elegant", "noir"],
    },
    
    preferredLayouts: ["editorial", "centered", "asymmetric"],
    sectionTransitions: ["fade", "parallax"],
    
    meta: {
      sophisticationScore: 98,
      accessibilityScore: 78,
      uniquenessScore: 94,
      bestFor: ["luxury brands", "high-end fashion", "fine jewelry", "premium hotels", "exclusive clubs"],
      avoidFor: ["children", "casual dining", "budget services", "playful brands"],
    },
  },

  "eco-sustainable": {
    id: "eco-sustainable",
    name: "Eco Sustainable",
    version: "4.0.0",
    mode: "light",
    personality: "friendly-approachable",
    motionStyle: "organic-natural",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#059669",
      primaryLight: "#10B981",
      primaryDark: "#047857",
      secondary: "#0D9488",
      secondaryLight: "#14B8A6",
      accent: "#CA8A04",
      accentAlt: "#EAB308",
      background: "#F7FBF5",
      backgroundAlt: "#ECFDF5",
      surface: "#FFFFFF",
      surfaceElevated: "#F0FDF4",
      card: "#FFFFFF",
      cardHover: "#F0FDF4",
      text: "#14532D",
      textSecondary: "#166534",
      textMuted: "#22863A",
      heading: "#14532D",
      border: "#BBF7D0",
      borderSubtle: "#DCFCE7",
      success: "#059669",
      warning: "#CA8A04",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Nature Blend",
        css: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
        angle: 135,
        stops: [
          { color: "#059669", position: 0 },
          { color: "#0D9488", position: 100 },
        ],
      },
      accent: {
        name: "Earth Tone",
        css: "linear-gradient(90deg, #059669 0%, #CA8A04 100%)",
        angle: 90,
        stops: [
          { color: "#059669", position: 0 },
          { color: "#CA8A04", position: 100 },
        ],
      },
      card: {
        name: "Leaf Shadow",
        css: "linear-gradient(180deg, rgba(5, 150, 105, 0.05) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(5, 150, 105, 0.05)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Soft Green",
        css: "linear-gradient(180deg, rgba(247, 251, 245, 0.9) 0%, rgba(247, 251, 245, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(247, 251, 245, 0.9)", position: 0 },
          { color: "rgba(247, 251, 245, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(5, 150, 105, 0.05)",
      soft: "0 4px 16px rgba(5, 150, 105, 0.08)",
      medium: "0 8px 28px rgba(5, 150, 105, 0.1)",
      strong: "0 16px 44px rgba(5, 150, 105, 0.12)",
      dramatic: "0 24px 56px rgba(5, 150, 105, 0.15)",
      glow: "0 0 36px rgba(5, 150, 105, 0.2)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.04)",
    },
    
    typography: {
      headingFont: "Fraunces",
      bodyFont: "Source Sans Pro",
      accentFont: "Fraunces",
      headingWeight: "600",
      bodyWeight: "400",
      headingStyle: "organic friendly",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3.25rem",
      fontSize6xl: "4rem",
      fontSizeDisplay: "5rem",
      lineHeightTight: 1.2,
      lineHeightSnug: 1.35,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.8,
      letterSpacingTight: "-0.015em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.03em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "5rem",
      "4xl": "7rem",
      section: "9rem",
      sectionMobile: "5rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "200ms",
      durationNormal: "350ms",
      durationSlow: "500ms",
      durationVerySlow: "750ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.02,
      hoverLift: "-5px",
      clickScale: 0.98,
      pageTransition: "fade",
      scrollReveal: "slide-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: true,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.15,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "solid",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1.5rem",
      shadow: "0 8px 28px rgba(5, 150, 105, 0.1)",
      hoverLift: "-6px",
      hoverShadow: "0 16px 44px rgba(5, 150, 105, 0.15)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "natural organic sustainable green",
      mood: "eco-friendly authentic earthy",
      lighting: "natural, outdoor, soft",
      composition: "nature, sustainable products, eco practices",
      colorTreatment: "natural greens, earth tones",
      keywords: ["sustainable", "eco", "green", "organic", "nature", "environmental", "earth"],
    },
    
    preferredLayouts: ["alternating", "grid", "split", "centered"],
    sectionTransitions: ["fade", "slide-up", "parallax"],
    
    meta: {
      sophisticationScore: 88,
      accessibilityScore: 94,
      uniquenessScore: 86,
      bestFor: ["eco brands", "sustainable products", "organic food", "environmental nonprofits", "green tech"],
      avoidFor: ["nightlife", "gaming", "fast food", "luxury"],
    },
  },

  "indie-maker": {
    id: "indie-maker",
    name: "Indie Maker",
    version: "4.0.0",
    mode: "dark",
    personality: "playful-energetic",
    motionStyle: "dynamic-energetic",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#F97316",
      primaryLight: "#FB923C",
      primaryDark: "#EA580C",
      secondary: "#8B5CF6",
      secondaryLight: "#A78BFA",
      accent: "#14B8A6",
      accentAlt: "#2DD4BF",
      background: "#18181B",
      backgroundAlt: "#1F1F23",
      surface: "#27272A",
      surfaceElevated: "#2E2E32",
      card: "#27272A",
      cardHover: "#2E2E32",
      text: "#FAFAFA",
      textSecondary: "#D4D4D8",
      textMuted: "#A1A1AA",
      heading: "#FFFFFF",
      border: "#3F3F46",
      borderSubtle: "#2E2E32",
      success: "#22C55E",
      warning: "#F97316",
      error: "#EF4444",
    },
    
    gradients: {
      hero: {
        name: "Maker Magic",
        css: "linear-gradient(135deg, #F97316 0%, #8B5CF6 50%, #14B8A6 100%)",
        angle: 135,
        stops: [
          { color: "#F97316", position: 0 },
          { color: "#8B5CF6", position: 50 },
          { color: "#14B8A6", position: 100 },
        ],
      },
      accent: {
        name: "Indie Fire",
        css: "linear-gradient(90deg, #F97316 0%, #FB923C 100%)",
        angle: 90,
        stops: [
          { color: "#F97316", position: 0 },
          { color: "#FB923C", position: 100 },
        ],
      },
      card: {
        name: "Warm Glow",
        css: "linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(249, 115, 22, 0.08)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Dark Canvas",
        css: "linear-gradient(180deg, rgba(24, 24, 27, 0.9) 0%, rgba(24, 24, 27, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(24, 24, 27, 0.9)", position: 0 },
          { color: "rgba(24, 24, 27, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(249, 115, 22, 0.08)",
      soft: "0 4px 16px rgba(249, 115, 22, 0.12)",
      medium: "0 8px 28px rgba(249, 115, 22, 0.16)",
      strong: "0 16px 44px rgba(249, 115, 22, 0.2)",
      dramatic: "0 24px 60px rgba(249, 115, 22, 0.24)",
      glow: "0 0 32px rgba(249, 115, 22, 0.35)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
    },
    
    typography: {
      headingFont: "General Sans",
      bodyFont: "Inter",
      accentFont: "Azeret Mono",
      headingWeight: "600",
      bodyWeight: "400",
      headingStyle: "friendly bold",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3.25rem",
      fontSize6xl: "4.25rem",
      fontSizeDisplay: "5.5rem",
      lineHeightTight: 1.15,
      lineHeightSnug: 1.3,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "-0.02em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.05em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
      section: "7rem",
      sectionMobile: "4rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "450ms",
      durationVerySlow: "700ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.04,
      hoverLift: "-6px",
      clickScale: 0.96,
      pageTransition: "slide-up",
      scrollReveal: "fade-slide",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "medium",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "split",
      minHeight: "90vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.5,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: true,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1rem",
      shadow: "0 8px 28px rgba(249, 115, 22, 0.12)",
      hoverLift: "-8px",
      hoverShadow: "0 20px 48px rgba(249, 115, 22, 0.2)",
      borderWidth: "1px",
      padding: "1.75rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "authentic indie maker workspace",
      mood: "hustling creative entrepreneurial",
      lighting: "natural, cozy, warm",
      composition: "workspace, products, behind-the-scenes",
      colorTreatment: "warm, vibrant, energetic",
      keywords: ["indie", "maker", "startup", "bootstrap", "entrepreneur", "product", "launch"],
    },
    
    preferredLayouts: ["split", "bento", "grid", "stacked"],
    sectionTransitions: ["fade-slide", "reveal", "slide-up"],
    
    meta: {
      sophisticationScore: 86,
      accessibilityScore: 90,
      uniquenessScore: 92,
      bestFor: ["indie hackers", "solo founders", "bootstrapped startups", "side projects", "creator economy"],
      avoidFor: ["enterprise", "government", "luxury", "corporate"],
    },
  },

  "enterprise-power": {
    id: "enterprise-power",
    name: "Enterprise Power",
    version: "4.0.0",
    mode: "light",
    personality: "trustworthy-established",
    motionStyle: "subtle-sophisticated",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#1E40AF",
      primaryLight: "#3B82F6",
      primaryDark: "#1E3A8A",
      secondary: "#0891B2",
      secondaryLight: "#06B6D4",
      accent: "#7C3AED",
      accentAlt: "#8B5CF6",
      background: "#F8FAFC",
      backgroundAlt: "#F1F5F9",
      surface: "#FFFFFF",
      surfaceElevated: "#F8FAFC",
      card: "#FFFFFF",
      cardHover: "#F8FAFC",
      text: "#0F172A",
      textSecondary: "#334155",
      textMuted: "#64748B",
      heading: "#0F172A",
      border: "#E2E8F0",
      borderSubtle: "#F1F5F9",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Corporate Blue",
        css: "linear-gradient(135deg, #1E40AF 0%, #0891B2 100%)",
        angle: 135,
        stops: [
          { color: "#1E40AF", position: 0 },
          { color: "#0891B2", position: 100 },
        ],
      },
      accent: {
        name: "Power Gradient",
        css: "linear-gradient(90deg, #1E40AF 0%, #7C3AED 100%)",
        angle: 90,
        stops: [
          { color: "#1E40AF", position: 0 },
          { color: "#7C3AED", position: 100 },
        ],
      },
      card: {
        name: "Subtle Pro",
        css: "linear-gradient(180deg, rgba(30, 64, 175, 0.03) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(30, 64, 175, 0.03)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Clean White",
        css: "linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(248, 250, 252, 0.9)", position: 0 },
          { color: "rgba(248, 250, 252, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(30, 64, 175, 0.04)",
      soft: "0 4px 14px rgba(30, 64, 175, 0.06)",
      medium: "0 8px 26px rgba(30, 64, 175, 0.08)",
      strong: "0 16px 42px rgba(30, 64, 175, 0.1)",
      dramatic: "0 24px 56px rgba(30, 64, 175, 0.12)",
      glow: "0 0 28px rgba(30, 64, 175, 0.15)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.04)",
    },
    
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      accentFont: "Inter",
      headingWeight: "700",
      bodyWeight: "400",
      headingStyle: "professional clean",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "1.875rem",
      fontSize4xl: "2.25rem",
      fontSize5xl: "3rem",
      fontSize6xl: "3.75rem",
      fontSizeDisplay: "4.5rem",
      lineHeightTight: 1.2,
      lineHeightSnug: 1.35,
      lineHeightNormal: 1.6,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "-0.02em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.025em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "6rem",
      section: "7rem",
      sectionMobile: "4rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.25rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "120ms",
      durationNormal: "200ms",
      durationSlow: "300ms",
      durationVerySlow: "450ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.01,
      hoverLift: "-2px",
      clickScale: 0.99,
      pageTransition: "fade",
      scrollReveal: "fade-up",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: true,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "split",
      minHeight: "85vh",
      contentAlignment: "left",
      overlayStyle: "gradient",
      overlayOpacity: 0.1,
      animatedElements: false,
      scrollIndicator: true,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "pill",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "slide",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "0.75rem",
      shadow: "0 4px 14px rgba(30, 64, 175, 0.06)",
      hoverLift: "-3px",
      hoverShadow: "0 10px 28px rgba(30, 64, 175, 0.1)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "professional enterprise corporate",
      mood: "authoritative trustworthy scalable",
      lighting: "professional studio, bright",
      composition: "office, teamwork, data centers, enterprise",
      colorTreatment: "clean, professional blue tones",
      keywords: ["enterprise", "corporate", "B2B", "scalable", "Fortune 500", "global", "solutions"],
    },
    
    preferredLayouts: ["grid", "alternating", "stacked", "centered"],
    sectionTransitions: ["fade", "slide", "none"],
    
    meta: {
      sophisticationScore: 92,
      accessibilityScore: 96,
      uniquenessScore: 74,
      bestFor: ["enterprise software", "B2B SaaS", "corporate services", "Fortune 500", "consulting"],
      avoidFor: ["creative agencies", "nightlife", "youth brands", "indie"],
    },
  },

  "retro-future": {
    id: "retro-future",
    name: "Retro Future",
    version: "4.0.0",
    mode: "dark",
    personality: "creative-artistic",
    motionStyle: "dynamic-energetic",
    layoutDensity: "balanced",
    
    colors: {
      primary: "#FF6B9D",
      primaryLight: "#FF8FB6",
      primaryDark: "#E55A87",
      secondary: "#00D4FF",
      secondaryLight: "#33DDFF",
      accent: "#FFE156",
      accentAlt: "#FFE87A",
      background: "#1A0A2E",
      backgroundAlt: "#251342",
      surface: "#2D1B4E",
      surfaceElevated: "#3A2563",
      card: "#2D1B4E",
      cardHover: "#3A2563",
      text: "#F8F0FF",
      textSecondary: "#C9B4E3",
      textMuted: "#9A82BE",
      heading: "#FFFFFF",
      border: "#4A3670",
      borderSubtle: "#3A2563",
      success: "#22C55E",
      warning: "#FFE156",
      error: "#FF6B6B",
    },
    
    gradients: {
      hero: {
        name: "Synthwave",
        css: "linear-gradient(135deg, #FF6B9D 0%, #00D4FF 50%, #FFE156 100%)",
        angle: 135,
        stops: [
          { color: "#FF6B9D", position: 0 },
          { color: "#00D4FF", position: 50 },
          { color: "#FFE156", position: 100 },
        ],
      },
      accent: {
        name: "Neon Dreams",
        css: "linear-gradient(90deg, #FF6B9D 0%, #00D4FF 100%)",
        angle: 90,
        stops: [
          { color: "#FF6B9D", position: 0 },
          { color: "#00D4FF", position: 100 },
        ],
      },
      card: {
        name: "Purple Haze",
        css: "linear-gradient(180deg, rgba(255, 107, 157, 0.1) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(255, 107, 157, 0.1)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Deep Violet",
        css: "linear-gradient(180deg, rgba(26, 10, 46, 0.85) 0%, rgba(26, 10, 46, 0.95) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(26, 10, 46, 0.85)", position: 0 },
          { color: "rgba(26, 10, 46, 0.95)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 3px rgba(255, 107, 157, 0.1)",
      soft: "0 4px 16px rgba(255, 107, 157, 0.15)",
      medium: "0 8px 28px rgba(255, 107, 157, 0.2)",
      strong: "0 16px 44px rgba(255, 107, 157, 0.25)",
      dramatic: "0 24px 60px rgba(255, 107, 157, 0.3)",
      glow: "0 0 40px rgba(255, 107, 157, 0.5)",
      inset: "inset 0 1px 3px rgba(0, 0, 0, 0.4)",
    },
    
    typography: {
      headingFont: "Orbitron",
      bodyFont: "Outfit",
      accentFont: "Press Start 2P",
      headingWeight: "700",
      bodyWeight: "400",
      headingStyle: "futuristic retro",
    },
    
    typographyScale: {
      fontSizeBase: "1rem",
      fontSizeXs: "0.75rem",
      fontSizeSm: "0.875rem",
      fontSizeMd: "1rem",
      fontSizeLg: "1.125rem",
      fontSizeXl: "1.25rem",
      fontSize2xl: "1.5rem",
      fontSize3xl: "2rem",
      fontSize4xl: "2.5rem",
      fontSize5xl: "3.5rem",
      fontSize6xl: "4.5rem",
      fontSizeDisplay: "6rem",
      lineHeightTight: 1.1,
      lineHeightSnug: 1.25,
      lineHeightNormal: 1.5,
      lineHeightRelaxed: 1.75,
      letterSpacingTight: "0",
      letterSpacingNormal: "0.05em",
      letterSpacingWide: "0.15em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4.5rem",
      "4xl": "6rem",
      section: "8rem",
      sectionMobile: "5rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "150ms",
      durationNormal: "300ms",
      durationSlow: "450ms",
      durationVerySlow: "700ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1.05,
      hoverLift: "-6px",
      clickScale: 0.95,
      pageTransition: "slide-up",
      scrollReveal: "reveal",
    },
    
    effects: {
      glassMorphism: true,
      glassMorphismStrength: "strong",
      gradientOverlays: true,
      animatedGradients: true,
      particleEffects: true,
      parallaxScrolling: true,
      cursorEffects: true,
      noiseTexture: true,
      grainOverlay: true,
      subtlePatterns: true,
    },
    
    hero: {
      archetype: "immersive",
      minHeight: "100vh",
      contentAlignment: "center",
      overlayStyle: "mesh",
      overlayOpacity: 0.6,
      animatedElements: true,
      scrollIndicator: true,
      floatingElements: true,
      textShadow: true,
      badgeStyle: "angular",
    },
    
    navigation: {
      style: "floating-pill",
      glassMorphism: true,
      scrollTransform: true,
      hoverStyle: "pill",
      ctaStyle: "gradient",
      mobileStyle: "fullscreen",
      stickyBehavior: "always",
    },
    
    cards: {
      borderRadius: "1rem",
      shadow: "0 8px 32px rgba(255, 107, 157, 0.2)",
      hoverLift: "-8px",
      hoverShadow: "0 20px 48px rgba(255, 107, 157, 0.3)",
      borderWidth: "1px",
      padding: "2rem",
      glassMorphism: true,
    },
    
    photography: {
      style: "retro futuristic synthwave neon",
      mood: "nostalgic futuristic vibrant",
      lighting: "neon, dramatic, colorful",
      composition: "retro tech, neon signs, abstract",
      colorTreatment: "vivid, neon, pink/cyan/yellow",
      keywords: ["retro", "synthwave", "80s", "neon", "vaporwave", "arcade", "future"],
    },
    
    preferredLayouts: ["bento", "asymmetric", "grid", "centered"],
    sectionTransitions: ["parallax", "reveal", "fade-slide"],
    
    meta: {
      sophisticationScore: 85,
      accessibilityScore: 80,
      uniquenessScore: 98,
      bestFor: ["gaming", "music", "entertainment", "creative projects", "indie games", "retro products"],
      avoidFor: ["healthcare", "finance", "corporate", "government"],
    },
  },

  "zen-minimal": {
    id: "zen-minimal",
    name: "Zen Minimal",
    version: "4.0.0",
    mode: "light",
    personality: "elegant-refined",
    motionStyle: "minimal-refined",
    layoutDensity: "spacious",
    
    colors: {
      primary: "#374151",
      primaryLight: "#4B5563",
      primaryDark: "#1F2937",
      secondary: "#92400E",
      secondaryLight: "#B45309",
      accent: "#0D9488",
      accentAlt: "#14B8A6",
      background: "#FCFCFA",
      backgroundAlt: "#F5F5F0",
      surface: "#FFFFFF",
      surfaceElevated: "#FAFAF8",
      card: "#FFFFFF",
      cardHover: "#FAFAF8",
      text: "#1F2937",
      textSecondary: "#4B5563",
      textMuted: "#6B7280",
      heading: "#111827",
      border: "#E5E5E0",
      borderSubtle: "#F0F0EB",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
    },
    
    gradients: {
      hero: {
        name: "Stone Gradient",
        css: "linear-gradient(180deg, #374151 0%, #1F2937 100%)",
        angle: 180,
        stops: [
          { color: "#374151", position: 0 },
          { color: "#1F2937", position: 100 },
        ],
      },
      accent: {
        name: "Earth Tone",
        css: "linear-gradient(90deg, #92400E 0%, #B45309 100%)",
        angle: 90,
        stops: [
          { color: "#92400E", position: 0 },
          { color: "#B45309", position: 100 },
        ],
      },
      card: {
        name: "Subtle Warmth",
        css: "linear-gradient(180deg, rgba(146, 64, 14, 0.02) 0%, transparent 100%)",
        angle: 180,
        stops: [
          { color: "rgba(146, 64, 14, 0.02)", position: 0 },
          { color: "transparent", position: 100 },
        ],
      },
      overlay: {
        name: "Paper White",
        css: "linear-gradient(180deg, rgba(252, 252, 250, 0.95) 0%, rgba(252, 252, 250, 0.98) 100%)",
        angle: 180,
        stops: [
          { color: "rgba(252, 252, 250, 0.95)", position: 0 },
          { color: "rgba(252, 252, 250, 0.98)", position: 100 },
        ],
      },
    },
    
    shadows: {
      subtle: "0 1px 2px rgba(0, 0, 0, 0.03)",
      soft: "0 4px 12px rgba(0, 0, 0, 0.04)",
      medium: "0 8px 24px rgba(0, 0, 0, 0.05)",
      strong: "0 16px 40px rgba(0, 0, 0, 0.06)",
      dramatic: "0 24px 56px rgba(0, 0, 0, 0.08)",
      glow: "0 0 24px rgba(55, 65, 81, 0.08)",
      inset: "inset 0 1px 2px rgba(0, 0, 0, 0.03)",
    },
    
    typography: {
      headingFont: "Newsreader",
      bodyFont: "Libre Franklin",
      accentFont: "Newsreader",
      headingWeight: "500",
      bodyWeight: "400",
      headingStyle: "editorial refined",
    },
    
    typographyScale: {
      fontSizeBase: "1.0625rem",
      fontSizeXs: "0.8125rem",
      fontSizeSm: "0.9375rem",
      fontSizeMd: "1.0625rem",
      fontSizeLg: "1.1875rem",
      fontSizeXl: "1.3125rem",
      fontSize2xl: "1.625rem",
      fontSize3xl: "2.125rem",
      fontSize4xl: "2.75rem",
      fontSize5xl: "3.5rem",
      fontSize6xl: "4.5rem",
      fontSizeDisplay: "5.5rem",
      lineHeightTight: 1.15,
      lineHeightSnug: 1.3,
      lineHeightNormal: 1.7,
      lineHeightRelaxed: 1.9,
      letterSpacingTight: "-0.02em",
      letterSpacingNormal: "0",
      letterSpacingWide: "0.05em",
    },
    
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem",
      "3xl": "6rem",
      "4xl": "8rem",
      section: "12rem",
      sectionMobile: "6rem",
    },
    
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.375rem",
      xl: "0.5rem",
      "2xl": "0.75rem",
      full: "9999px",
      pill: "9999px",
    },
    
    motion: {
      durationFast: "250ms",
      durationNormal: "450ms",
      durationSlow: "700ms",
      durationVerySlow: "1000ms",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingIn: "cubic-bezier(0.4, 0, 1, 1)",
      easingOut: "cubic-bezier(0, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      easingSmooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: 1,
      hoverLift: "0",
      clickScale: 1,
      pageTransition: "fade",
      scrollReveal: "fade",
    },
    
    effects: {
      glassMorphism: false,
      glassMorphismStrength: "light",
      gradientOverlays: false,
      animatedGradients: false,
      particleEffects: false,
      parallaxScrolling: false,
      cursorEffects: false,
      noiseTexture: false,
      grainOverlay: false,
      subtlePatterns: false,
    },
    
    hero: {
      archetype: "minimal",
      minHeight: "80vh",
      contentAlignment: "center",
      overlayStyle: "none",
      overlayOpacity: 0,
      animatedElements: false,
      scrollIndicator: false,
      floatingElements: false,
      textShadow: false,
      badgeStyle: "none",
    },
    
    navigation: {
      style: "minimal",
      glassMorphism: false,
      scrollTransform: false,
      hoverStyle: "underline",
      ctaStyle: "outline",
      mobileStyle: "slide",
      stickyBehavior: "threshold",
    },
    
    cards: {
      borderRadius: "0.25rem",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
      hoverLift: "0",
      hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      borderWidth: "1px",
      padding: "2.5rem",
      glassMorphism: false,
    },
    
    photography: {
      style: "minimal zen peaceful monochrome",
      mood: "serene calm meditative",
      lighting: "soft, natural, diffused",
      composition: "negative space, simple, elegant",
      colorTreatment: "muted, desaturated, natural",
      keywords: ["minimal", "zen", "calm", "peace", "simple", "elegant", "serene"],
    },
    
    preferredLayouts: ["centered", "stacked", "editorial"],
    sectionTransitions: ["fade", "none"],
    
    meta: {
      sophisticationScore: 96,
      accessibilityScore: 98,
      uniquenessScore: 88,
      bestFor: ["meditation apps", "luxury minimalism", "architecture", "high-end portfolios", "Japanese aesthetics"],
      avoidFor: ["gaming", "nightlife", "youth brands", "fast food"],
    },
  },
};

// ============================================
// ENHANCED INDUSTRY MAPPING (100+ industries)
// ============================================

const industryThemeMap: Record<string, CreativeThemeId[]> = {
  // Technology & SaaS (Enhanced with new themes)
  technology: ["tech-futuristic", "startup-velocity", "saas-aurora", "dark-neon", "bold-modern"],
  saas: ["saas-aurora", "soft-gradient", "tech-futuristic", "enterprise-power", "minimal-clean"],
  software: ["tech-futuristic", "saas-aurora", "soft-gradient", "minimal-clean"],
  startup: ["startup-velocity", "bold-modern", "saas-aurora", "indie-maker", "dark-neon"],
  gaming: ["dark-neon", "retro-future", "vibrant-pop", "cyber-matrix", "bold-modern"],
  ai: ["tech-futuristic", "dark-neon", "cyber-matrix", "saas-aurora"],
  fintech: ["fintech-precision", "soft-gradient", "enterprise-power", "crisp-corporate"],
  devtools: ["tech-futuristic", "cyber-matrix", "dark-neon", "minimal-clean"],
  cloud: ["tech-futuristic", "saas-aurora", "enterprise-power", "crisp-corporate"],
  cybersecurity: ["cyber-matrix", "dark-neon", "fintech-precision", "tech-futuristic"],
  blockchain: ["dark-neon", "cyber-matrix", "tech-futuristic", "bold-modern"],
  crypto: ["dark-neon", "cyber-matrix", "fintech-precision", "bold-modern"],
  indiehacker: ["indie-maker", "startup-velocity", "bold-modern", "dark-neon"],
  bootstrap: ["indie-maker", "startup-velocity", "saas-aurora"],
  
  // Food & Hospitality
  restaurant: ["warm-artisan", "urban-gritty", "editorial-luxury"],
  food: ["warm-artisan", "vibrant-pop", "urban-gritty"],
  pizza: ["urban-gritty", "bold-modern", "vibrant-pop"],
  bakery: ["warm-artisan", "editorial-luxury", "soft-gradient"],
  cafe: ["warm-artisan", "editorial-luxury", "zen-minimal"],
  coffee: ["warm-artisan", "urban-gritty", "editorial-luxury"],
  bar: ["urban-gritty", "dark-neon", "bold-modern"],
  brewery: ["urban-gritty", "bold-modern", "warm-artisan"],
  finedining: ["editorial-luxury", "luxury-noir", "classic-elegant"],
  fastfood: ["vibrant-pop", "bold-modern", "urban-gritty"],
  catering: ["warm-artisan", "classic-elegant", "editorial-luxury"],
  hotel: ["editorial-luxury", "luxury-noir", "classic-elegant"],
  resort: ["editorial-luxury", "nature-organic", "luxury-noir"],
  
  // Professional Services (Enhanced)
  healthcare: ["healthcare-trust", "classic-elegant", "minimal-clean", "soft-gradient"],
  dental: ["healthcare-trust", "classic-elegant", "soft-gradient"],
  medical: ["healthcare-trust", "classic-elegant", "crisp-corporate"],
  telehealth: ["healthcare-trust", "saas-aurora", "tech-futuristic"],
  legal: ["classic-elegant", "crisp-corporate", "enterprise-power"],
  law: ["classic-elegant", "crisp-corporate", "editorial-luxury"],
  finance: ["fintech-precision", "crisp-corporate", "enterprise-power"],
  accounting: ["crisp-corporate", "enterprise-power", "classic-elegant"],
  consulting: ["enterprise-power", "crisp-corporate", "bold-modern"],
  insurance: ["crisp-corporate", "enterprise-power", "classic-elegant"],
  banking: ["fintech-precision", "crisp-corporate", "enterprise-power"],
  investment: ["fintech-precision", "crisp-corporate", "luxury-noir"],
  realestate: ["classic-elegant", "luxury-noir", "editorial-luxury"],
  
  // Creative (Enhanced)
  agency: ["creative-studio", "bold-modern", "dark-neon", "editorial-luxury"],
  creative: ["creative-studio", "bold-modern", "dark-neon", "vibrant-pop"],
  design: ["creative-studio", "minimal-clean", "bold-modern", "zen-minimal"],
  photography: ["editorial-luxury", "zen-minimal", "luxury-noir", "minimal-clean"],
  art: ["editorial-luxury", "creative-studio", "zen-minimal", "bold-modern"],
  music: ["dark-neon", "retro-future", "bold-modern", "urban-gritty"],
  film: ["luxury-noir", "dark-neon", "editorial-luxury"],
  video: ["dark-neon", "creative-studio", "bold-modern"],
  marketing: ["bold-modern", "saas-aurora", "vibrant-pop"],
  advertising: ["bold-modern", "creative-studio", "dark-neon"],
  branding: ["creative-studio", "bold-modern", "minimal-clean"],
  
  // Lifestyle (Enhanced)
  beauty: ["editorial-luxury", "luxury-noir", "soft-gradient"],
  salon: ["editorial-luxury", "soft-gradient", "vibrant-pop"],
  fashion: ["editorial-luxury", "luxury-noir", "bold-modern"],
  fitness: ["bold-modern", "dark-neon", "vibrant-pop"],
  gym: ["bold-modern", "dark-neon", "urban-gritty"],
  wellness: ["nature-organic", "eco-sustainable", "zen-minimal"],
  spa: ["editorial-luxury", "zen-minimal", "nature-organic"],
  yoga: ["zen-minimal", "nature-organic", "eco-sustainable"],
  meditation: ["zen-minimal", "nature-organic", "eco-sustainable"],
  skincare: ["editorial-luxury", "soft-gradient", "minimal-clean"],
  cosmetics: ["editorial-luxury", "vibrant-pop", "luxury-noir"],
  
  // Retail & E-commerce (Enhanced)
  ecommerce: ["saas-aurora", "soft-gradient", "minimal-clean", "vibrant-pop"],
  retail: ["vibrant-pop", "minimal-clean", "soft-gradient"],
  luxury: ["luxury-noir", "editorial-luxury", "classic-elegant"],
  jewelry: ["luxury-noir", "editorial-luxury", "classic-elegant"],
  watches: ["luxury-noir", "editorial-luxury", "dark-neon"],
  furniture: ["zen-minimal", "minimal-clean", "editorial-luxury"],
  homegoods: ["warm-artisan", "eco-sustainable", "nature-organic"],
  
  // Entertainment (Enhanced)
  entertainment: ["dark-neon", "retro-future", "vibrant-pop"],
  events: ["vibrant-pop", "bold-modern", "dark-neon"],
  wedding: ["editorial-luxury", "classic-elegant", "soft-gradient"],
  party: ["vibrant-pop", "retro-future", "dark-neon"],
  nightclub: ["dark-neon", "retro-future", "urban-gritty"],
  concert: ["dark-neon", "retro-future", "bold-modern"],
  theater: ["editorial-luxury", "luxury-noir", "classic-elegant"],
  arcade: ["retro-future", "vibrant-pop", "dark-neon"],
  
  // Construction & Real Estate
  construction: ["bold-modern", "urban-gritty", "classic-elegant"],
  contractor: ["bold-modern", "classic-elegant", "enterprise-power"],
  architecture: ["zen-minimal", "minimal-clean", "editorial-luxury"],
  interior: ["editorial-luxury", "zen-minimal", "soft-gradient"],
  landscaping: ["nature-organic", "eco-sustainable", "warm-artisan"],
  
  // Education (Enhanced)
  education: ["soft-gradient", "saas-aurora", "classic-elegant"],
  school: ["soft-gradient", "vibrant-pop", "classic-elegant"],
  university: ["classic-elegant", "enterprise-power", "minimal-clean"],
  coaching: ["startup-velocity", "bold-modern", "indie-maker"],
  training: ["enterprise-power", "saas-aurora", "bold-modern"],
  tutoring: ["soft-gradient", "vibrant-pop", "classic-elegant"],
  elearning: ["saas-aurora", "tech-futuristic", "vibrant-pop"],
  onlinecourse: ["saas-aurora", "indie-maker", "soft-gradient"],
  
  // Automotive
  automotive: ["bold-modern", "dark-neon", "urban-gritty"],
  car: ["bold-modern", "dark-neon", "luxury-noir"],
  electricvehicle: ["tech-futuristic", "eco-sustainable", "dark-neon"],
  motorcycle: ["urban-gritty", "bold-modern", "dark-neon"],
  
  // Non-profit & Social (Enhanced)
  nonprofit: ["eco-sustainable", "soft-gradient", "nature-organic"],
  charity: ["soft-gradient", "eco-sustainable", "classic-elegant"],
  social: ["soft-gradient", "vibrant-pop", "eco-sustainable"],
  environmental: ["eco-sustainable", "nature-organic", "soft-gradient"],
  sustainability: ["eco-sustainable", "nature-organic", "minimal-clean"],
  
  // Specialty
  pet: ["vibrant-pop", "soft-gradient", "eco-sustainable"],
  veterinary: ["healthcare-trust", "nature-organic", "soft-gradient"],
  sports: ["bold-modern", "dark-neon", "vibrant-pop"],
  outdoor: ["nature-organic", "eco-sustainable", "bold-modern"],
  travel: ["editorial-luxury", "eco-sustainable", "nature-organic"],
  tourism: ["editorial-luxury", "nature-organic", "vibrant-pop"],
  
  // Enterprise & B2B (New category)
  enterprise: ["enterprise-power", "crisp-corporate", "saas-aurora"],
  b2b: ["enterprise-power", "crisp-corporate", "saas-aurora"],
  corporate: ["enterprise-power", "crisp-corporate", "classic-elegant"],
  government: ["enterprise-power", "crisp-corporate", "classic-elegant"],
  
  // Maker & Creator Economy (New category)
  creator: ["indie-maker", "creative-studio", "bold-modern"],
  influencer: ["vibrant-pop", "creative-studio", "bold-modern"],
  podcast: ["dark-neon", "indie-maker", "bold-modern"],
  newsletter: ["minimal-clean", "indie-maker", "editorial-luxury"],
  
  // Default
  default: ["minimal-clean", "soft-gradient", "saas-aurora", "classic-elegant"],
};

// ============================================
// TONE & PERSONALITY MODIFIERS
// ============================================

const toneModifiers: Record<string, { boost: CreativeThemeId[]; suppress: CreativeThemeId[] }> = {
  professional: {
    boost: ["crisp-corporate", "enterprise-power", "classic-elegant", "minimal-clean"],
    suppress: ["vibrant-pop", "dark-neon", "urban-gritty", "retro-future"],
  },
  playful: {
    boost: ["vibrant-pop", "soft-gradient", "retro-future", "indie-maker"],
    suppress: ["crisp-corporate", "classic-elegant", "enterprise-power", "luxury-noir"],
  },
  luxurious: {
    boost: ["luxury-noir", "editorial-luxury", "dark-neon", "minimal-clean"],
    suppress: ["vibrant-pop", "urban-gritty", "indie-maker"],
  },
  luxury: {
    boost: ["luxury-noir", "editorial-luxury", "zen-minimal"],
    suppress: ["vibrant-pop", "urban-gritty", "indie-maker", "retro-future"],
  },
  bold: {
    boost: ["bold-modern", "dark-neon", "startup-velocity", "urban-gritty"],
    suppress: ["minimal-clean", "classic-elegant", "zen-minimal"],
  },
  friendly: {
    boost: ["soft-gradient", "vibrant-pop", "warm-artisan", "indie-maker"],
    suppress: ["dark-neon", "urban-gritty", "cyber-matrix"],
  },
  modern: {
    boost: ["tech-futuristic", "saas-aurora", "startup-velocity", "bold-modern"],
    suppress: ["warm-artisan", "classic-elegant", "retro-future"],
  },
  traditional: {
    boost: ["classic-elegant", "warm-artisan", "editorial-luxury"],
    suppress: ["dark-neon", "tech-futuristic", "cyber-matrix", "retro-future"],
  },
  edgy: {
    boost: ["dark-neon", "cyber-matrix", "urban-gritty", "retro-future"],
    suppress: ["classic-elegant", "soft-gradient", "warm-artisan", "healthcare-trust"],
  },
  warm: {
    boost: ["warm-artisan", "editorial-luxury", "nature-organic", "eco-sustainable"],
    suppress: ["dark-neon", "tech-futuristic", "cyber-matrix"],
  },
  cool: {
    boost: ["minimal-clean", "tech-futuristic", "fintech-precision", "zen-minimal"],
    suppress: ["warm-artisan", "urban-gritty", "retro-future"],
  },
  energetic: {
    boost: ["vibrant-pop", "startup-velocity", "bold-modern", "dark-neon"],
    suppress: ["minimal-clean", "zen-minimal", "classic-elegant"],
  },
  calm: {
    boost: ["zen-minimal", "minimal-clean", "nature-organic", "healthcare-trust"],
    suppress: ["dark-neon", "urban-gritty", "vibrant-pop", "retro-future"],
  },
  sophisticated: {
    boost: ["editorial-luxury", "luxury-noir", "zen-minimal", "classic-elegant"],
    suppress: ["vibrant-pop", "urban-gritty", "retro-future"],
  },
  fun: {
    boost: ["vibrant-pop", "retro-future", "indie-maker", "soft-gradient"],
    suppress: ["crisp-corporate", "enterprise-power", "classic-elegant"],
  },
  innovative: {
    boost: ["tech-futuristic", "startup-velocity", "cyber-matrix", "saas-aurora"],
    suppress: ["warm-artisan", "classic-elegant", "zen-minimal"],
  },
  sustainable: {
    boost: ["eco-sustainable", "nature-organic", "minimal-clean", "soft-gradient"],
    suppress: ["dark-neon", "urban-gritty", "cyber-matrix"],
  },
  premium: {
    boost: ["luxury-noir", "editorial-luxury", "zen-minimal", "classic-elegant"],
    suppress: ["vibrant-pop", "urban-gritty", "indie-maker"],
  },
  youthful: {
    boost: ["vibrant-pop", "startup-velocity", "retro-future", "indie-maker"],
    suppress: ["classic-elegant", "enterprise-power", "crisp-corporate"],
  },
  mature: {
    boost: ["classic-elegant", "enterprise-power", "luxury-noir", "editorial-luxury"],
    suppress: ["vibrant-pop", "retro-future", "indie-maker"],
  },
  startup: {
    boost: ["startup-velocity", "indie-maker", "saas-aurora", "bold-modern"],
    suppress: ["enterprise-power", "classic-elegant", "luxury-noir"],
  },
  enterprise: {
    boost: ["enterprise-power", "crisp-corporate", "fintech-precision"],
    suppress: ["indie-maker", "vibrant-pop", "retro-future"],
  },
  technical: {
    boost: ["tech-futuristic", "cyber-matrix", "fintech-precision", "saas-aurora"],
    suppress: ["warm-artisan", "classic-elegant", "retro-future"],
  },
  creative: {
    boost: ["creative-studio", "bold-modern", "dark-neon", "retro-future"],
    suppress: ["enterprise-power", "crisp-corporate", "fintech-precision"],
  },
  minimal: {
    boost: ["zen-minimal", "minimal-clean", "soft-gradient"],
    suppress: ["retro-future", "vibrant-pop", "urban-gritty"],
  },
  secure: {
    boost: ["fintech-precision", "cyber-matrix", "enterprise-power"],
    suppress: ["vibrant-pop", "retro-future", "indie-maker"],
  },
  trustworthy: {
    boost: ["healthcare-trust", "enterprise-power", "fintech-precision", "crisp-corporate"],
    suppress: ["dark-neon", "retro-future", "urban-gritty"],
  },
};

// ============================================
// INTELLIGENT THEME SELECTION ENGINE
// ============================================

interface ThemeSelectionContext {
  industry: string;
  tone?: string;
  businessName?: string;
  description?: string;
  targetAudience?: string;
  preferDark?: boolean;
  sophisticationLevel?: "high" | "medium" | "casual";
}

interface ThemeScore {
  id: CreativeThemeId;
  score: number;
  reasons: string[];
}

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreThemeForContext(
  themeId: CreativeThemeId,
  context: ThemeSelectionContext
): ThemeScore {
  const theme = themes[themeId];
  let score = 50;
  const reasons: string[] = [];
  
  const normalizedIndustry = normalizeString(context.industry);
  const normalizedTone = context.tone ? normalizeString(context.tone) : "";
  const normalizedDesc = context.description ? normalizeString(context.description) : "";
  
  for (const [industry, themeIds] of Object.entries(industryThemeMap)) {
    if (normalizedIndustry.includes(industry) || industry.includes(normalizedIndustry)) {
      const index = themeIds.indexOf(themeId);
      if (index !== -1) {
        const industryBonus = 30 - (index * 8);
        score += industryBonus;
        reasons.push(`Industry match: +${industryBonus}`);
        break;
      }
    }
  }
  
  if (normalizedTone) {
    for (const [tone, modifier] of Object.entries(toneModifiers)) {
      if (normalizedTone.includes(tone)) {
        if (modifier.boost.includes(themeId)) {
          score += 20;
          reasons.push(`Tone boost (${tone}): +20`);
        }
        if (modifier.suppress.includes(themeId)) {
          score -= 15;
          reasons.push(`Tone suppress (${tone}): -15`);
        }
        break;
      }
    }
  }
  
  if (context.preferDark !== undefined) {
    if (context.preferDark && theme.mode === "dark") {
      score += 15;
      reasons.push("Dark mode preference: +15");
    } else if (!context.preferDark && theme.mode === "light") {
      score += 10;
      reasons.push("Light mode preference: +10");
    } else {
      score -= 10;
      reasons.push("Mode mismatch: -10");
    }
  }
  
  if (context.sophisticationLevel) {
    if (context.sophisticationLevel === "high" && theme.meta.sophisticationScore >= 88) {
      score += 15;
      reasons.push("High sophistication match: +15");
    } else if (context.sophisticationLevel === "casual" && theme.meta.sophisticationScore < 82) {
      score += 10;
      reasons.push("Casual sophistication match: +10");
    }
  }
  
  for (const keyword of theme.photography.keywords) {
    if (normalizedDesc.includes(keyword)) {
      score += 3;
      reasons.push(`Description keyword (${keyword}): +3`);
    }
  }
  
  return { id: themeId, score, reasons };
}

/**
 * Intelligently select the best creative theme based on context
 */
export function selectCreativeTheme(
  industry: string,
  tone?: string,
  preferDark?: boolean,
  sophisticationLevel?: "high" | "medium" | "casual"
): CreativeThemeConfig {
  const context: ThemeSelectionContext = {
    industry,
    tone,
    preferDark,
    sophisticationLevel,
  };
  
  const scores: ThemeScore[] = Object.keys(themes).map((id) =>
    scoreThemeForContext(id as CreativeThemeId, context)
  );
  
  scores.sort((a, b) => b.score - a.score);
  
  const selectedId = scores[0].id;
  const topScore = scores[0];
  
  console.log(`[CreativeThemeEngine v${CREATIVE_THEME_ENGINE_VERSION}] Selected "${selectedId}" (score: ${topScore.score})`);
  console.log(`[CreativeThemeEngine] Reasons: ${topScore.reasons.join(", ")}`);
  console.log(`[CreativeThemeEngine] Runner-up: "${scores[1].id}" (score: ${scores[1].score})`);
  
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
 * Get theme recommendations for an industry
 */
export function getThemeRecommendations(
  industry: string,
  count: number = 3
): CreativeThemeConfig[] {
  const context: ThemeSelectionContext = { industry };
  
  const scores = Object.keys(themes).map((id) =>
    scoreThemeForContext(id as CreativeThemeId, context)
  );
  
  scores.sort((a, b) => b.score - a.score);
  
  return scores.slice(0, count).map((s) => themes[s.id]);
}

/**
 * Apply theme to site settings with full design tokens
 */
export function applyThemeToSiteSettings(
  theme: CreativeThemeConfig
): Record<string, any> {
  return {
    themeId: theme.id,
    themeName: theme.name,
    themeVersion: theme.version,
    style: theme.personality,
    colorScheme: theme.mode,
    
    primaryColor: theme.colors.primary,
    primaryColorLight: theme.colors.primaryLight,
    primaryColorDark: theme.colors.primaryDark,
    secondaryColor: theme.colors.secondary,
    accentColor: theme.colors.accent,
    backgroundColor: theme.colors.background,
    backgroundAltColor: theme.colors.backgroundAlt,
    surfaceColor: theme.colors.surface,
    cardBackground: theme.colors.card,
    textColor: theme.colors.text,
    textSecondaryColor: theme.colors.textSecondary,
    headingColor: theme.colors.heading,
    mutedTextColor: theme.colors.textMuted,
    borderColor: theme.colors.border,
    
    heroGradient: theme.gradients.hero.css,
    accentGradient: theme.gradients.accent.css,
    
    headingFont: theme.typography.headingFont,
    fontFamily: theme.typography.bodyFont,
    accentFont: theme.typography.accentFont,
    headingWeight: theme.typography.headingWeight,
    headingStyle: theme.typography.headingStyle,
    
    cardBorderRadius: theme.cards.borderRadius,
    cardShadow: theme.cards.shadow,
    cardHoverLift: theme.cards.hoverLift,
    cardHoverShadow: theme.cards.hoverShadow,
    
    navigationStyle: theme.navigation.style,
    navigationGlassMorphism: theme.navigation.glassMorphism,
    navigationHoverStyle: theme.navigation.hoverStyle,
    navigationCtaStyle: theme.navigation.ctaStyle,
    
    heroArchetype: theme.hero.archetype,
    heroMinHeight: theme.hero.minHeight,
    heroContentAlignment: theme.hero.contentAlignment,
    heroAnimatedElements: theme.hero.animatedElements,
    heroScrollIndicator: theme.hero.scrollIndicator,
    heroBadgeStyle: theme.hero.badgeStyle,
    
    motionDurationFast: theme.motion.durationFast,
    motionDuration: theme.motion.durationNormal,
    motionDurationSlow: theme.motion.durationSlow,
    motionDurationVerySlow: theme.motion.durationVerySlow,
    motionEasing: theme.motion.easingDefault,
    motionEasingOut: theme.motion.easingOut,
    motionEasingBounce: theme.motion.easingBounce,
    motionEasingSmooth: theme.motion.easingSmooth,
    hoverScale: theme.motion.hoverScale,
    hoverLift: theme.motion.hoverLift,
    clickScale: theme.motion.clickScale,
    pageTransition: theme.motion.pageTransition,
    scrollReveal: theme.motion.scrollReveal,
    
    enableGlassMorphism: theme.effects.glassMorphism,
    enableGradientOverlays: theme.effects.gradientOverlays,
    enableAnimatedGradients: theme.effects.animatedGradients,
    enableParallax: theme.effects.parallaxScrolling,
    
    photographyStyle: theme.photography.style,
    photographyMood: theme.photography.mood,
    photographyKeywords: theme.photography.keywords,
    
    preferredLayouts: theme.preferredLayouts,
    sectionTransitions: theme.sectionTransitions,
    
    sophisticationScore: theme.meta.sophisticationScore,
    accessibilityScore: theme.meta.accessibilityScore,
  };
}

/**
 * Get Google Fonts URL for a theme with all weights
 */
export function getThemeFontsUrl(theme: CreativeThemeConfig): string {
  const fonts: Set<string> = new Set();
  
  const headingEncoded = theme.typography.headingFont.replace(/ /g, "+");
  fonts.add(`family=${headingEncoded}:wght@400;500;600;700;800`);
  
  if (theme.typography.bodyFont !== theme.typography.headingFont) {
    const bodyEncoded = theme.typography.bodyFont.replace(/ /g, "+");
    fonts.add(`family=${bodyEncoded}:wght@400;500;600;700`);
  }
  
  if (theme.typography.accentFont !== theme.typography.headingFont && 
      theme.typography.accentFont !== theme.typography.bodyFont) {
    const accentEncoded = theme.typography.accentFont.replace(/ /g, "+");
    fonts.add(`family=${accentEncoded}:wght@400;500;600;700`);
  }
  
  return `https://fonts.googleapis.com/css2?${Array.from(fonts).join("&")}&display=swap`;
}

/**
 * Get CSS custom properties for a theme
 */
export function getThemeCSSVariables(theme: CreativeThemeConfig): string {
  return `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-primary-light: ${theme.colors.primaryLight};
  --color-primary-dark: ${theme.colors.primaryDark};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  --color-card: ${theme.colors.card};
  --color-text: ${theme.colors.text};
  --color-text-secondary: ${theme.colors.textSecondary};
  --color-text-muted: ${theme.colors.textMuted};
  --color-heading: ${theme.colors.heading};
  --color-border: ${theme.colors.border};
  
  /* Typography */
  --font-heading: "${theme.typography.headingFont}", sans-serif;
  --font-body: "${theme.typography.bodyFont}", sans-serif;
  --font-accent: "${theme.typography.accentFont}", sans-serif;
  --font-weight-heading: ${theme.typography.headingWeight};
  --font-weight-body: ${theme.typography.bodyWeight};
  
  /* Spacing */
  --spacing-section: ${theme.spacing.section};
  --spacing-section-mobile: ${theme.spacing.sectionMobile};
  
  /* Border Radius */
  --radius-sm: ${theme.borderRadius.sm};
  --radius-md: ${theme.borderRadius.md};
  --radius-lg: ${theme.borderRadius.lg};
  --radius-xl: ${theme.borderRadius.xl};
  --radius-pill: ${theme.borderRadius.pill};
  
  /* Shadows */
  --shadow-subtle: ${theme.shadows.subtle};
  --shadow-soft: ${theme.shadows.soft};
  --shadow-medium: ${theme.shadows.medium};
  --shadow-strong: ${theme.shadows.strong};
  --shadow-glow: ${theme.shadows.glow};
  
  /* Motion */
  --duration-fast: ${theme.motion.durationFast};
  --duration-normal: ${theme.motion.durationNormal};
  --duration-slow: ${theme.motion.durationSlow};
  --easing-default: ${theme.motion.easingDefault};
  --easing-bounce: ${theme.motion.easingBounce};
  
  /* Cards */
  --card-radius: ${theme.cards.borderRadius};
  --card-shadow: ${theme.cards.shadow};
  --card-hover-lift: ${theme.cards.hoverLift};
  --card-hover-shadow: ${theme.cards.hoverShadow};
  
  /* Gradients */
  --gradient-hero: ${theme.gradients.hero.css};
  --gradient-accent: ${theme.gradients.accent.css};
}
  `.trim();
}

// Add backward-compatible legacy properties to all themes
function addLegacyProperties(theme: Omit<CreativeThemeConfig, 'headingFont' | 'bodyFont' | 'headingWeight' | 'headingStyle' | 'style' | 'colorScheme' | 'heroArchetype'>): CreativeThemeConfig {
  return {
    ...theme,
    // Legacy top-level properties for backward compatibility
    headingFont: theme.typography.headingFont,
    bodyFont: theme.typography.bodyFont,
    headingWeight: theme.typography.headingWeight,
    headingStyle: theme.typography.headingStyle,
    style: theme.personality.split("-")[0], // Extract first part of personality
    colorScheme: theme.mode,
    // Legacy heroArchetype property for workflow engine compatibility
    heroArchetype: theme.hero.archetype,
  } as CreativeThemeConfig;
}

// Apply legacy properties to all themes
const themesWithLegacy: Record<CreativeThemeId, CreativeThemeConfig> = Object.fromEntries(
  Object.entries(themes).map(([id, theme]) => [id, addLegacyProperties(theme as any)])
) as Record<CreativeThemeId, CreativeThemeConfig>;

// Replace themes with version that has legacy properties
Object.assign(themes, themesWithLegacy);

console.log(`[Creative Theme Engine] v${CREATIVE_THEME_ENGINE_VERSION} loaded with ${Object.keys(themes).length} themes`);

export { themes };
