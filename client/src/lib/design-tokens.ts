export const typography = {
  scale: {
    xs: "0.75rem",     // 12px
    sm: "0.875rem",    // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.5rem",   // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
    "6xl": "3.75rem",  // 60px
    "7xl": "4.5rem",   // 72px
    "8xl": "6rem",     // 96px
    "9xl": "8rem",     // 128px
    "display": "10rem", // 160px - for hero headlines
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
} as const;

export const sectionSpacing = {
  compact: { py: "py-16 sm:py-20", px: "px-4 sm:px-6 lg:px-8" },
  default: { py: "py-20 sm:py-28", px: "px-4 sm:px-6 lg:px-8" },
  generous: { py: "py-24 sm:py-32 lg:py-40", px: "px-4 sm:px-6 lg:px-8" },
  immersive: { py: "py-32 sm:py-40 lg:py-48", px: "px-4 sm:px-6 lg:px-8" },
} as const;

export const radius = {
  none: "0",
  sm: "0.125rem",
  default: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  "4xl": "2rem",
  full: "9999px",
} as const;

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  glow: "0 0 40px -10px",
  premium: "0 25px 80px -20px rgb(0 0 0 / 0.15), 0 10px 30px -10px rgb(0 0 0 / 0.1)",
  elevated: "0 40px 100px -30px rgb(0 0 0 / 0.2)",
} as const;

export type BrandPersonality = "bold" | "elegant" | "playful" | "minimal" | "tech" | "luxury" | "creative" | "professional";
export type BusinessType = "saas" | "local" | "creator" | "agency" | "ecommerce" | "startup" | "personal" | "enterprise";

export interface FontPairing {
  heading: string;
  body: string;
  accent?: string;
  headingWeight: number;
  bodyWeight: number;
  letterSpacing: {
    heading: string;
    body: string;
  };
}

export const fontPairings: Record<BrandPersonality, FontPairing> = {
  bold: {
    heading: "Space Grotesk",
    body: "Inter",
    headingWeight: 700,
    bodyWeight: 400,
    letterSpacing: { heading: "-0.02em", body: "0" },
  },
  elegant: {
    heading: "Cormorant Garamond",
    body: "Lora",
    accent: "Cormorant",
    headingWeight: 500,
    bodyWeight: 400,
    letterSpacing: { heading: "0.02em", body: "0.01em" },
  },
  playful: {
    heading: "Poppins",
    body: "Nunito",
    headingWeight: 700,
    bodyWeight: 400,
    letterSpacing: { heading: "-0.01em", body: "0" },
  },
  minimal: {
    heading: "DM Sans",
    body: "DM Sans",
    headingWeight: 600,
    bodyWeight: 400,
    letterSpacing: { heading: "-0.015em", body: "0" },
  },
  tech: {
    heading: "JetBrains Mono",
    body: "Inter",
    headingWeight: 700,
    bodyWeight: 400,
    letterSpacing: { heading: "-0.03em", body: "0" },
  },
  luxury: {
    heading: "Playfair Display",
    body: "Source Serif 4",
    headingWeight: 500,
    bodyWeight: 400,
    letterSpacing: { heading: "0.03em", body: "0.01em" },
  },
  creative: {
    heading: "Syne",
    body: "Work Sans",
    headingWeight: 800,
    bodyWeight: 400,
    letterSpacing: { heading: "-0.02em", body: "0" },
  },
  professional: {
    heading: "Montserrat",
    body: "Source Sans 3",
    headingWeight: 700,
    bodyWeight: 400,
    letterSpacing: { heading: "-0.01em", body: "0" },
  },
};

export interface ColorPalette {
  primary: string;
  primaryHsl: string;
  secondary: string;
  secondaryHsl: string;
  accent: string;
  accentHsl: string;
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

export const colorPalettes: Record<string, Partial<ColorPalette>> = {
  ocean: {
    primary: "#0066FF",
    primaryHsl: "220 100% 50%",
    secondary: "#00D4FF",
    secondaryHsl: "190 100% 50%",
    accent: "#FF6B35",
    accentHsl: "18 100% 60%",
  },
  forest: {
    primary: "#10B981",
    primaryHsl: "160 84% 39%",
    secondary: "#059669",
    secondaryHsl: "161 94% 30%",
    accent: "#F59E0B",
    accentHsl: "38 92% 50%",
  },
  sunset: {
    primary: "#F97316",
    primaryHsl: "25 95% 53%",
    secondary: "#EA580C",
    secondaryHsl: "21 90% 48%",
    accent: "#8B5CF6",
    accentHsl: "262 83% 66%",
  },
  midnight: {
    primary: "#6366F1",
    primaryHsl: "239 84% 67%",
    secondary: "#4F46E5",
    secondaryHsl: "243 75% 59%",
    accent: "#EC4899",
    accentHsl: "330 81% 60%",
  },
  earth: {
    primary: "#78716C",
    primaryHsl: "30 5% 45%",
    secondary: "#57534E",
    secondaryHsl: "25 5% 32%",
    accent: "#D97706",
    accentHsl: "38 92% 44%",
  },
  royal: {
    primary: "#7C3AED",
    primaryHsl: "263 70% 58%",
    secondary: "#5B21B6",
    secondaryHsl: "263 78% 42%",
    accent: "#F472B6",
    accentHsl: "330 86% 70%",
  },
};

export type HeroArchetype = "editorial" | "split" | "immersive" | "cinematic" | "minimal" | "bold" | "centered";

export interface HeroConfig {
  archetype: HeroArchetype;
  height: string;
  hasOverlay: boolean;
  overlayOpacity: number;
  textAlignment: "left" | "center" | "right";
  headlineSize: string;
  hasFloatingElements: boolean;
  hasGradientBackground: boolean;
  hasMediaBackground: boolean;
  layoutDirection: "normal" | "reverse";
}

export const heroArchetypes: Record<HeroArchetype, HeroConfig> = {
  editorial: {
    archetype: "editorial",
    height: "min-h-[85vh]",
    hasOverlay: false,
    overlayOpacity: 0,
    textAlignment: "left",
    headlineSize: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
    hasFloatingElements: true,
    hasGradientBackground: true,
    hasMediaBackground: false,
    layoutDirection: "normal",
  },
  split: {
    archetype: "split",
    height: "min-h-[90vh]",
    hasOverlay: false,
    overlayOpacity: 0,
    textAlignment: "left",
    headlineSize: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    hasFloatingElements: false,
    hasGradientBackground: false,
    hasMediaBackground: true,
    layoutDirection: "normal",
  },
  immersive: {
    archetype: "immersive",
    height: "min-h-screen",
    hasOverlay: true,
    overlayOpacity: 0.5,
    textAlignment: "center",
    headlineSize: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl",
    hasFloatingElements: true,
    hasGradientBackground: false,
    hasMediaBackground: true,
    layoutDirection: "normal",
  },
  cinematic: {
    archetype: "cinematic",
    height: "min-h-screen",
    hasOverlay: true,
    overlayOpacity: 0.6,
    textAlignment: "center",
    headlineSize: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
    hasFloatingElements: false,
    hasGradientBackground: false,
    hasMediaBackground: true,
    layoutDirection: "normal",
  },
  minimal: {
    archetype: "minimal",
    height: "min-h-[70vh]",
    hasOverlay: false,
    overlayOpacity: 0,
    textAlignment: "center",
    headlineSize: "text-4xl sm:text-5xl md:text-6xl",
    hasFloatingElements: false,
    hasGradientBackground: false,
    hasMediaBackground: false,
    layoutDirection: "normal",
  },
  bold: {
    archetype: "bold",
    height: "min-h-[90vh]",
    hasOverlay: false,
    overlayOpacity: 0,
    textAlignment: "left",
    headlineSize: "text-6xl sm:text-7xl md:text-8xl lg:text-[10rem]",
    hasFloatingElements: true,
    hasGradientBackground: true,
    hasMediaBackground: false,
    layoutDirection: "normal",
  },
  centered: {
    archetype: "centered",
    height: "min-h-[80vh]",
    hasOverlay: false,
    overlayOpacity: 0,
    textAlignment: "center",
    headlineSize: "text-5xl sm:text-6xl md:text-7xl",
    hasFloatingElements: false,
    hasGradientBackground: true,
    hasMediaBackground: false,
    layoutDirection: "normal",
  },
};

export function selectHeroArchetype(businessType: BusinessType, personality: BrandPersonality): HeroArchetype {
  const mapping: Record<BusinessType, Record<BrandPersonality, HeroArchetype>> = {
    saas: {
      bold: "bold",
      elegant: "centered",
      playful: "editorial",
      minimal: "minimal",
      tech: "split",
      luxury: "immersive",
      creative: "bold",
      professional: "split",
    },
    local: {
      bold: "split",
      elegant: "immersive",
      playful: "editorial",
      minimal: "centered",
      tech: "split",
      luxury: "cinematic",
      creative: "editorial",
      professional: "centered",
    },
    creator: {
      bold: "bold",
      elegant: "editorial",
      playful: "editorial",
      minimal: "minimal",
      tech: "split",
      luxury: "cinematic",
      creative: "bold",
      professional: "centered",
    },
    agency: {
      bold: "bold",
      elegant: "cinematic",
      playful: "editorial",
      minimal: "minimal",
      tech: "split",
      luxury: "immersive",
      creative: "bold",
      professional: "split",
    },
    ecommerce: {
      bold: "split",
      elegant: "immersive",
      playful: "editorial",
      minimal: "centered",
      tech: "split",
      luxury: "cinematic",
      creative: "editorial",
      professional: "split",
    },
    startup: {
      bold: "bold",
      elegant: "centered",
      playful: "editorial",
      minimal: "minimal",
      tech: "bold",
      luxury: "immersive",
      creative: "bold",
      professional: "split",
    },
    personal: {
      bold: "bold",
      elegant: "editorial",
      playful: "editorial",
      minimal: "minimal",
      tech: "split",
      luxury: "cinematic",
      creative: "bold",
      professional: "centered",
    },
    enterprise: {
      bold: "split",
      elegant: "centered",
      playful: "editorial",
      minimal: "minimal",
      tech: "split",
      luxury: "immersive",
      creative: "editorial",
      professional: "split",
    },
  };

  return mapping[businessType]?.[personality] || "centered";
}

export type LayoutPattern = "asymmetric" | "grid" | "masonry" | "bento" | "alternating" | "stacked" | "editorial";

export interface SectionLayout {
  pattern: LayoutPattern;
  columns: number;
  gap: string;
  alignment: "start" | "center" | "end";
  hasAsymmetry: boolean;
  verticalRhythm: string;
}

export const layoutPatterns: Record<LayoutPattern, SectionLayout> = {
  asymmetric: {
    pattern: "asymmetric",
    columns: 2,
    gap: "gap-8 lg:gap-16",
    alignment: "start",
    hasAsymmetry: true,
    verticalRhythm: "space-y-24",
  },
  grid: {
    pattern: "grid",
    columns: 3,
    gap: "gap-6 lg:gap-8",
    alignment: "center",
    hasAsymmetry: false,
    verticalRhythm: "space-y-16",
  },
  masonry: {
    pattern: "masonry",
    columns: 3,
    gap: "gap-4 lg:gap-6",
    alignment: "start",
    hasAsymmetry: true,
    verticalRhythm: "space-y-12",
  },
  bento: {
    pattern: "bento",
    columns: 4,
    gap: "gap-4 lg:gap-6",
    alignment: "start",
    hasAsymmetry: true,
    verticalRhythm: "space-y-20",
  },
  alternating: {
    pattern: "alternating",
    columns: 2,
    gap: "gap-12 lg:gap-20",
    alignment: "center",
    hasAsymmetry: true,
    verticalRhythm: "space-y-32",
  },
  stacked: {
    pattern: "stacked",
    columns: 1,
    gap: "gap-16 lg:gap-24",
    alignment: "center",
    hasAsymmetry: false,
    verticalRhythm: "space-y-20",
  },
  editorial: {
    pattern: "editorial",
    columns: 12,
    gap: "gap-6",
    alignment: "start",
    hasAsymmetry: true,
    verticalRhythm: "space-y-24",
  },
};

export const motionPresets = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  slideInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
  staggerContainerSlow: {
    animate: { transition: { staggerChildren: 0.15 } },
  },
  staggerContainerFast: {
    animate: { transition: { staggerChildren: 0.05 } },
  },
} as const;

export const easings = {
  default: [0.25, 0.1, 0.25, 1],
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  snappy: [0.16, 1, 0.3, 1],
  gentle: [0.4, 0, 0.6, 1],
} as const;
