import { createContext, useContext, useMemo } from "react";

export type ButtonStyle = "gradient-border" | "solid" | "outlined" | "pill" | "sharp" | "ghost" | "minimal";
export type DecorationStyle = "geometric" | "organic" | "angular" | "dots" | "minimal" | "none";
export type EffectIntensity = "high" | "medium" | "low" | "minimal";
export type CardStyle = "elevated" | "flat" | "bordered" | "glass";
export type AnimationStyle = "dynamic" | "smooth" | "subtle" | "minimal";

export interface DesignPersonality {
  buttonStyle: ButtonStyle;
  ctaButtonStyle: ButtonStyle;
  decorationStyle: DecorationStyle;
  effectIntensity: EffectIntensity;
  cardStyle: CardStyle;
  animationStyle: AnimationStyle;
  showFloatingOrbs: boolean;
  showDotGrid: boolean;
  showGlowLines: boolean;
  showNoiseTexture: boolean;
  showParallax: boolean;
  showHoverTilt: boolean;
  showMagneticButtons: boolean;
  showCountUpAnimation: boolean;
  showDecorativeSvgs: boolean;
  decorativeSvgType: "circles" | "blobs" | "patterns" | "lines" | "none";
  heroVisualDensity: "rich" | "balanced" | "clean" | "minimal";
}

const defaultPersonality: DesignPersonality = {
  buttonStyle: "solid",
  ctaButtonStyle: "solid",
  decorationStyle: "minimal",
  effectIntensity: "medium",
  cardStyle: "elevated",
  animationStyle: "smooth",
  showFloatingOrbs: true,
  showDotGrid: false,
  showGlowLines: false,
  showNoiseTexture: false,
  showParallax: false,
  showHoverTilt: true,
  showMagneticButtons: false,
  showCountUpAnimation: true,
  showDecorativeSvgs: false,
  decorativeSvgType: "none",
  heroVisualDensity: "balanced",
};

const personalityProfiles: Record<string, Partial<DesignPersonality>> = {
  bold: {
    buttonStyle: "gradient-border",
    ctaButtonStyle: "gradient-border",
    decorationStyle: "geometric",
    effectIntensity: "high",
    cardStyle: "elevated",
    animationStyle: "dynamic",
    showFloatingOrbs: true,
    showDotGrid: true,
    showGlowLines: true,
    showNoiseTexture: false,
    showParallax: true,
    showHoverTilt: true,
    showMagneticButtons: true,
    showDecorativeSvgs: true,
    decorativeSvgType: "patterns",
    heroVisualDensity: "rich",
  },

  elegant: {
    buttonStyle: "outlined",
    ctaButtonStyle: "outlined",
    decorationStyle: "minimal",
    effectIntensity: "low",
    cardStyle: "bordered",
    animationStyle: "subtle",
    showFloatingOrbs: false,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: false,
    decorativeSvgType: "none",
    heroVisualDensity: "clean",
  },

  playful: {
    buttonStyle: "pill",
    ctaButtonStyle: "pill",
    decorationStyle: "organic",
    effectIntensity: "medium",
    cardStyle: "elevated",
    animationStyle: "dynamic",
    showFloatingOrbs: true,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: true,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "blobs",
    heroVisualDensity: "balanced",
  },

  minimal: {
    buttonStyle: "minimal",
    ctaButtonStyle: "minimal",
    decorationStyle: "none",
    effectIntensity: "minimal",
    cardStyle: "flat",
    animationStyle: "minimal",
    showFloatingOrbs: false,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: false,
    decorativeSvgType: "none",
    heroVisualDensity: "minimal",
  },

  tech: {
    buttonStyle: "sharp",
    ctaButtonStyle: "sharp",
    decorationStyle: "angular",
    effectIntensity: "medium",
    cardStyle: "bordered",
    animationStyle: "smooth",
    showFloatingOrbs: false,
    showDotGrid: true,
    showGlowLines: true,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: true,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "lines",
    heroVisualDensity: "balanced",
  },

  luxury: {
    buttonStyle: "outlined",
    ctaButtonStyle: "ghost",
    decorationStyle: "minimal",
    effectIntensity: "low",
    cardStyle: "glass",
    animationStyle: "subtle",
    showFloatingOrbs: false,
    showDotGrid: false,
    showGlowLines: true,
    showNoiseTexture: true,
    showParallax: true,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: false,
    decorativeSvgType: "none",
    heroVisualDensity: "clean",
  },

  creative: {
    buttonStyle: "gradient-border",
    ctaButtonStyle: "gradient-border",
    decorationStyle: "organic",
    effectIntensity: "high",
    cardStyle: "elevated",
    animationStyle: "dynamic",
    showFloatingOrbs: true,
    showDotGrid: false,
    showGlowLines: true,
    showNoiseTexture: true,
    showParallax: true,
    showHoverTilt: true,
    showMagneticButtons: true,
    showDecorativeSvgs: true,
    decorativeSvgType: "blobs",
    heroVisualDensity: "rich",
  },

  professional: {
    buttonStyle: "solid",
    ctaButtonStyle: "solid",
    decorationStyle: "dots",
    effectIntensity: "low",
    cardStyle: "bordered",
    animationStyle: "subtle",
    showFloatingOrbs: false,
    showDotGrid: true,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: false,
    decorativeSvgType: "none",
    heroVisualDensity: "clean",
  },

  editorial: {
    buttonStyle: "outlined",
    ctaButtonStyle: "solid",
    decorationStyle: "minimal",
    effectIntensity: "low",
    cardStyle: "flat",
    animationStyle: "smooth",
    showFloatingOrbs: false,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: true,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: false,
    decorativeSvgType: "none",
    heroVisualDensity: "clean",
  },

  startup: {
    buttonStyle: "pill",
    ctaButtonStyle: "gradient-border",
    decorationStyle: "geometric",
    effectIntensity: "medium",
    cardStyle: "elevated",
    animationStyle: "dynamic",
    showFloatingOrbs: true,
    showDotGrid: true,
    showGlowLines: true,
    showNoiseTexture: false,
    showParallax: true,
    showHoverTilt: true,
    showMagneticButtons: true,
    showDecorativeSvgs: true,
    decorativeSvgType: "patterns",
    heroVisualDensity: "rich",
  },

  saas: {
    buttonStyle: "pill",
    ctaButtonStyle: "solid",
    decorationStyle: "geometric",
    effectIntensity: "medium",
    cardStyle: "elevated",
    animationStyle: "smooth",
    showFloatingOrbs: true,
    showDotGrid: true,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: true,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "circles",
    heroVisualDensity: "balanced",
  },

  fintech: {
    buttonStyle: "sharp",
    ctaButtonStyle: "solid",
    decorationStyle: "angular",
    effectIntensity: "low",
    cardStyle: "bordered",
    animationStyle: "subtle",
    showFloatingOrbs: false,
    showDotGrid: true,
    showGlowLines: true,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "lines",
    heroVisualDensity: "clean",
  },

  healthcare: {
    buttonStyle: "pill",
    ctaButtonStyle: "solid",
    decorationStyle: "organic",
    effectIntensity: "low",
    cardStyle: "elevated",
    animationStyle: "subtle",
    showFloatingOrbs: false,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "blobs",
    heroVisualDensity: "clean",
  },

  eco: {
    buttonStyle: "pill",
    ctaButtonStyle: "pill",
    decorationStyle: "organic",
    effectIntensity: "medium",
    cardStyle: "flat",
    animationStyle: "smooth",
    showFloatingOrbs: true,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: true,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "blobs",
    heroVisualDensity: "balanced",
  },

  indie: {
    buttonStyle: "pill",
    ctaButtonStyle: "pill",
    decorationStyle: "organic",
    effectIntensity: "medium",
    cardStyle: "elevated",
    animationStyle: "dynamic",
    showFloatingOrbs: true,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: true,
    showParallax: false,
    showHoverTilt: true,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "blobs",
    heroVisualDensity: "balanced",
  },

  enterprise: {
    buttonStyle: "solid",
    ctaButtonStyle: "solid",
    decorationStyle: "dots",
    effectIntensity: "low",
    cardStyle: "bordered",
    animationStyle: "subtle",
    showFloatingOrbs: false,
    showDotGrid: true,
    showGlowLines: false,
    showNoiseTexture: false,
    showParallax: false,
    showHoverTilt: false,
    showMagneticButtons: false,
    showDecorativeSvgs: false,
    decorativeSvgType: "none",
    heroVisualDensity: "clean",
  },

  retro: {
    buttonStyle: "sharp",
    ctaButtonStyle: "sharp",
    decorationStyle: "geometric",
    effectIntensity: "medium",
    cardStyle: "bordered",
    animationStyle: "smooth",
    showFloatingOrbs: false,
    showDotGrid: false,
    showGlowLines: false,
    showNoiseTexture: true,
    showParallax: false,
    showHoverTilt: true,
    showMagneticButtons: false,
    showDecorativeSvgs: true,
    decorativeSvgType: "patterns",
    heroVisualDensity: "balanced",
  },
};

const themeToStyleMap: Record<string, string> = {
  "dark-neon": "bold",
  "editorial-luxury": "elegant",
  "soft-gradient": "playful",
  "bold-modern": "bold",
  "minimal-clean": "minimal",
  "urban-gritty": "bold",
  "vibrant-pop": "creative",
  "classic-elegant": "elegant",
  "nature-organic": "eco",
  "tech-futuristic": "tech",
  "warm-artisan": "indie",
  "crisp-corporate": "professional",
  "startup-velocity": "startup",
  "saas-aurora": "saas",
  "fintech-precision": "fintech",
  "healthcare-trust": "healthcare",
  "cyber-matrix": "tech",
  "creative-studio": "creative",
  "luxury-noir": "luxury",
  "eco-sustainable": "eco",
  "indie-maker": "indie",
  "enterprise-power": "enterprise",
  "retro-future": "retro",
  "zen-minimal": "minimal",
};

const visualPersonalityMap: Record<string, string> = {
  "bold-confident": "bold",
  "elegant-refined": "elegant",
  "friendly-approachable": "playful",
  "innovative-cutting-edge": "tech",
  "trustworthy-stable": "professional",
  "playful-energetic": "playful",
  "luxurious-premium": "luxury",
  "warm-inviting": "indie",
  "clean-modern": "minimal",
  "edgy-rebellious": "bold",
  "organic-natural": "eco",
  "futuristic-digital": "tech",
  "handcrafted-artisan": "indie",
  "corporate-authoritative": "enterprise",
  "retro-nostalgic": "retro",
};

export function resolvePersonality(
  style?: string,
  creativeThemeId?: string,
  visualPersonality?: string
): DesignPersonality {
  let profileKey: string | undefined;

  if (style && personalityProfiles[style]) {
    profileKey = style;
  } else if (creativeThemeId && themeToStyleMap[creativeThemeId]) {
    profileKey = themeToStyleMap[creativeThemeId];
  } else if (visualPersonality && visualPersonalityMap[visualPersonality]) {
    profileKey = visualPersonalityMap[visualPersonality];
  } else if (style) {
    const normalized = style.toLowerCase().replace(/[-_\s]+/g, "-");
    for (const [key, value] of Object.entries(visualPersonalityMap)) {
      if (normalized.includes(key.split("-")[0])) {
        profileKey = value;
        break;
      }
    }
  }

  if (!profileKey) {
    profileKey = "professional";
  }

  const profile = personalityProfiles[profileKey] || {};
  return { ...defaultPersonality, ...profile };
}

const DesignPersonalityContext = createContext<DesignPersonality>(defaultPersonality);

export function DesignPersonalityProvider({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings?: Record<string, any>;
}) {
  const personality = useMemo(() => {
    if (!siteSettings) return defaultPersonality;
    return resolvePersonality(
      siteSettings.style,
      siteSettings.creativeThemeId,
      siteSettings.visualPersonality
    );
  }, [siteSettings?.style, siteSettings?.creativeThemeId, siteSettings?.visualPersonality]);

  return (
    <DesignPersonalityContext.Provider value={personality}>
      {children}
    </DesignPersonalityContext.Provider>
  );
}

export function useDesignPersonality(): DesignPersonality {
  return useContext(DesignPersonalityContext);
}
