export type SectionRhythm = "dense" | "balanced" | "airy" | "dramatic";

export interface SectionLayoutConfig {
  rhythm: SectionRhythm;
  paddingY: string;
  backgroundVariant: "default" | "alt" | "accent-subtle" | "gradient-subtle";
  showDivider: boolean;
  dividerStyle: "line" | "gradient" | "glow" | "none";
  entranceAnimation: "fade-up" | "fade-left" | "fade-right" | "scale" | "blur" | "slide-up";
  hasFloatingDecor: boolean;
  decorVariant: number;
}

export interface EntranceConfig {
  initial: { opacity: number; y?: number; x?: number; scale?: number; filter?: string };
  animate: { opacity: number; y?: number; x?: number; scale?: number; filter?: string };
  transition: { duration: number; ease: number[]; delay?: number };
}

export interface DividerConfig {
  show: boolean;
  style: "line" | "gradient" | "glow" | "none";
  color: string;
  opacity: number;
}

export type ContentAlignment = "left" | "center" | "right" | "alternating";
export type GridPattern = "standard" | "bento" | "masonry-like" | "asymmetric" | "featured-first";

export interface ContentLayoutVariation {
  alignment: ContentAlignment;
  gridPattern: GridPattern;
  cardStyle: "flat" | "elevated" | "glass" | "bordered";
  imagePosition: "left" | "right" | "top" | "background";
  hasAccentDecor: boolean;
}

export interface SpacingConfig {
  paddingTop: string;
  paddingBottom: string;
  paddingX: string;
  maxWidth: string;
  innerGap: string;
}

const ENTRANCE_ANIMATIONS: SectionLayoutConfig["entranceAnimation"][] = [
  "fade-up",
  "fade-left",
  "fade-right",
  "scale",
  "blur",
  "slide-up",
];

const ACCENT_SECTION_TYPES = new Set([
  "stats",
  "pricing",
  "testimonials",
]);

const DIVIDER_STYLES: DividerConfig["style"][] = ["line", "gradient", "glow", "none"];

const ALIGNMENTS: ContentAlignment[] = ["left", "center", "right", "alternating"];

const GRID_PATTERNS: GridPattern[] = ["standard", "bento", "masonry-like", "asymmetric", "featured-first"];

const CARD_STYLES: ContentLayoutVariation["cardStyle"][] = ["flat", "elevated", "glass", "bordered"];

const IMAGE_POSITIONS: ContentLayoutVariation["imagePosition"][] = ["left", "right", "top", "background"];

function resolveRhythm(
  sectionIndex: number,
  sectionType: string,
  themeStyle?: string
): SectionRhythm {
  if (sectionIndex === 0 || sectionType === "hero") {
    return "dramatic";
  }

  const isMinimal = themeStyle === "minimal" || themeStyle === "minimal-clean";
  const isBold = themeStyle === "bold" || themeStyle === "bold-modern";

  const base: SectionRhythm = sectionIndex % 2 === 1 ? "balanced" : "airy";

  if (isMinimal && base === "balanced") return "airy";
  if (isBold && base === "airy") return "dense";

  return base;
}

function resolveBackground(
  sectionIndex: number,
  sectionType: string
): SectionLayoutConfig["backgroundVariant"] {
  if (ACCENT_SECTION_TYPES.has(sectionType)) {
    return sectionIndex % 2 === 0 ? "accent-subtle" : "gradient-subtle";
  }

  return sectionIndex % 2 === 0 ? "default" : "alt";
}

export function getSectionLayoutConfig(
  sectionIndex: number,
  totalSections: number,
  sectionType: string,
  themeStyle?: string
): SectionLayoutConfig {
  const rhythm = resolveRhythm(sectionIndex, sectionType, themeStyle);

  const backgroundVariant = resolveBackground(sectionIndex, sectionType);

  const isFirst = sectionIndex === 0;
  const isLast = sectionIndex === totalSections - 1;
  const extraPad = isFirst || isLast;

  const paddingMap: Record<SectionRhythm, string> = {
    dense: extraPad ? "py-20 sm:py-24" : "py-16 sm:py-20",
    balanced: extraPad ? "py-24 sm:py-32" : "py-20 sm:py-28",
    airy: extraPad ? "py-32 sm:py-40" : "py-28 sm:py-36",
    dramatic: extraPad ? "py-36 sm:py-48" : "py-32 sm:py-44",
  };

  const entranceAnimation = ENTRANCE_ANIMATIONS[sectionIndex % ENTRANCE_ANIMATIONS.length];

  const hasFloatingDecor = sectionIndex % 3 === 0 && sectionIndex !== 0;

  const showDivider = sectionIndex > 0 && backgroundVariant === "default";
  const dividerStyle: SectionLayoutConfig["dividerStyle"] = showDivider
    ? DIVIDER_STYLES[sectionIndex % 3]
    : "none";

  const decorVariant = sectionIndex % 6;

  return {
    rhythm,
    paddingY: paddingMap[rhythm],
    backgroundVariant,
    showDivider,
    dividerStyle,
    entranceAnimation,
    hasFloatingDecor,
    decorVariant,
  };
}

const CUBIC_EASE: number[] = [0.22, 1, 0.36, 1];

export function getSectionEntrance(variant: string, delay?: number): EntranceConfig {
  const baseTransition = { duration: 0.7, ease: CUBIC_EASE, ...(delay != null && { delay }) };

  switch (variant) {
    case "fade-up":
      return {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: baseTransition,
      };

    case "fade-left":
      return {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
        transition: baseTransition,
      };

    case "fade-right":
      return {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        transition: baseTransition,
      };

    case "scale":
      return {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        transition: { ...baseTransition, duration: 0.6 },
      };

    case "blur":
      return {
        initial: { opacity: 0, filter: "blur(12px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        transition: { ...baseTransition, duration: 0.8 },
      };

    case "slide-up":
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { ...baseTransition, duration: 0.8 },
      };

    default:
      return {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: baseTransition,
      };
  }
}

export function getBackgroundClasses(variant: string): string {
  switch (variant) {
    case "default":
      return "";

    case "alt":
      return "bg-[hsl(var(--muted)/0.35)]";

    case "accent-subtle":
      return "bg-[hsl(var(--accent)/0.06)]";

    case "gradient-subtle":
      return "bg-gradient-to-b from-[hsl(var(--muted)/0.2)] to-transparent";

    default:
      return "";
  }
}

export function getSectionDividerConfig(
  sectionIndex: number,
  themeStyle?: string
): DividerConfig {
  if (sectionIndex === 0) {
    return { show: false, style: "none", color: "var(--border)", opacity: 0 };
  }

  const isMinimal = themeStyle === "minimal" || themeStyle === "minimal-clean";
  const isBold = themeStyle === "bold" || themeStyle === "bold-modern";

  if (isBold) {
    return { show: false, style: "none", color: "var(--border)", opacity: 0 };
  }

  const cycleIndex = sectionIndex % 3;

  if (isMinimal) {
    return {
      show: true,
      style: "line",
      color: "var(--border)",
      opacity: 0.4,
    };
  }

  const styles: DividerConfig["style"][] = ["line", "gradient", "glow"];
  const opacities = [0.5, 0.3, 0.2];

  return {
    show: true,
    style: styles[cycleIndex],
    color: "var(--border)",
    opacity: opacities[cycleIndex],
  };
}

const SECTION_TYPE_LAYOUT_HINTS: Record<string, Partial<ContentLayoutVariation>> = {
  features: { gridPattern: "bento", cardStyle: "elevated", alignment: "center" },
  pricing: { gridPattern: "standard", cardStyle: "bordered", alignment: "center" },
  testimonials: { gridPattern: "masonry-like", cardStyle: "glass", alignment: "center" },
  team: { gridPattern: "standard", cardStyle: "flat", alignment: "center" },
  stats: { gridPattern: "standard", cardStyle: "flat", alignment: "center" },
  services: { gridPattern: "bento", cardStyle: "elevated", alignment: "left" },
  gallery: { gridPattern: "masonry-like", cardStyle: "flat", alignment: "center" },
  faq: { gridPattern: "standard", cardStyle: "flat", alignment: "left" },
  process: { gridPattern: "standard", cardStyle: "elevated", alignment: "alternating" },
  case_studies: { gridPattern: "featured-first", cardStyle: "elevated", alignment: "left" },
  benefits: { gridPattern: "asymmetric", cardStyle: "glass", alignment: "alternating" },
  comparison: { gridPattern: "standard", cardStyle: "bordered", alignment: "center" },
  brand_story: { gridPattern: "asymmetric", cardStyle: "flat", alignment: "left" },
  story: { gridPattern: "asymmetric", cardStyle: "flat", alignment: "alternating" },
  contact: { gridPattern: "standard", cardStyle: "bordered", alignment: "center" },
  cta: { gridPattern: "standard", cardStyle: "flat", alignment: "center" },
  trust_signals: { gridPattern: "standard", cardStyle: "flat", alignment: "center" },
};

function pickFromThemeLayouts(
  themePreferred: string[] | undefined,
  fallback: GridPattern
): GridPattern {
  if (!themePreferred || themePreferred.length === 0) return fallback;

  const mapping: Record<string, GridPattern> = {
    asymmetric: "asymmetric",
    grid: "standard",
    masonry: "masonry-like",
    bento: "bento",
    alternating: "standard",
    stacked: "standard",
    editorial: "featured-first",
  };

  for (const pref of themePreferred) {
    const mapped = mapping[pref];
    if (mapped) return mapped;
  }

  return fallback;
}

export function getLayoutVariation(
  sectionIndex: number,
  sectionType: string,
  totalSections: number,
  themePreferredLayouts?: string[]
): ContentLayoutVariation {
  const hints = SECTION_TYPE_LAYOUT_HINTS[sectionType] || {};

  const alignmentCycle = ALIGNMENTS[sectionIndex % ALIGNMENTS.length];
  const alignment = hints.alignment || alignmentCycle;

  const gridFallback = GRID_PATTERNS[sectionIndex % GRID_PATTERNS.length];
  const gridPattern = hints.gridPattern || pickFromThemeLayouts(themePreferredLayouts, gridFallback);

  const cardStyle = hints.cardStyle || CARD_STYLES[sectionIndex % CARD_STYLES.length];

  const imagePosition = IMAGE_POSITIONS[sectionIndex % IMAGE_POSITIONS.length];

  const hasAccentDecor = sectionIndex % 4 === 0 && sectionIndex !== 0;

  return {
    alignment,
    gridPattern,
    cardStyle,
    imagePosition,
    hasAccentDecor,
  };
}

const RHYTHM_PADDING: Record<SectionRhythm, { top: string; bottom: string }> = {
  dense: { top: "pt-16 sm:pt-20", bottom: "pb-16 sm:pb-20" },
  balanced: { top: "pt-20 sm:pt-28", bottom: "pb-20 sm:pb-28" },
  airy: { top: "pt-28 sm:pt-36", bottom: "pb-28 sm:pb-36" },
  dramatic: { top: "pt-32 sm:pt-44", bottom: "pb-32 sm:pb-44" },
};

const CONTAINER_WIDTHS: Record<string, string> = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

const RHYTHM_INNER_GAP: Record<SectionRhythm, string> = {
  dense: "gap-8 sm:gap-10",
  balanced: "gap-10 sm:gap-14",
  airy: "gap-14 sm:gap-20",
  dramatic: "gap-16 sm:gap-24",
};

export function computeSectionSpacing(
  sectionIndex: number,
  totalSections: number,
  rhythm: SectionRhythm,
  containerWidth?: "narrow" | "default" | "wide" | "full"
): SpacingConfig {
  const base = RHYTHM_PADDING[rhythm];

  const isFirstAfterHero = sectionIndex === 1;
  const isLast = sectionIndex === totalSections - 1;

  let paddingTop = base.top;
  let paddingBottom = base.bottom;

  if (isFirstAfterHero) {
    paddingTop = rhythm === "dense"
      ? "pt-20 sm:pt-28"
      : rhythm === "balanced"
        ? "pt-28 sm:pt-36"
        : rhythm === "airy"
          ? "pt-36 sm:pt-44"
          : "pt-40 sm:pt-52";
  }

  if (isLast) {
    paddingBottom = rhythm === "dense"
      ? "pb-24 sm:pb-32"
      : rhythm === "balanced"
        ? "pb-28 sm:pb-36"
        : rhythm === "airy"
          ? "pb-36 sm:pb-44"
          : "pb-44 sm:pb-56";
  }

  const width = containerWidth || "default";

  return {
    paddingTop,
    paddingBottom,
    paddingX: "px-4 sm:px-6 lg:px-8",
    maxWidth: CONTAINER_WIDTHS[width],
    innerGap: RHYTHM_INNER_GAP[rhythm],
  };
}
