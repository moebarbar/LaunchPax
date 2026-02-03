/**
 * Layer Separation Architecture
 * 
 * Following Replit's project generation principles, this module provides
 * strong separation of concerns between:
 * - Content Layer: Text, copy, messaging
 * - Layout Layer: Structure, grids, composition
 * - Styling Layer: Colors, typography, spacing
 * - Motion Layer: Animations, transitions
 * - Assets Layer: Images, logos, icons
 */

// ============================================================================
// CONTENT LAYER - Pure text and messaging
// ============================================================================

export interface ContentLayer {
  siteName: string;
  tagline?: string;
  pages: PageContentLayer[];
}

export interface PageContentLayer {
  slug: string;
  title: string;
  metaDescription?: string;
  sections: SectionContentLayer[];
}

export interface SectionContentLayer {
  id: string;
  type: string;
  content: {
    headline?: string;
    subheadline?: string;
    body?: string;
    items?: ContentItem[];
    ctas?: CallToAction[];
    [key: string]: unknown;
  };
}

export interface ContentItem {
  id: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface CallToAction {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

// ============================================================================
// LAYOUT LAYER - Structure and composition
// ============================================================================

export type LayoutPattern = 
  | 'full-width'      // Edge to edge
  | 'contained'       // Max-width container
  | 'split'           // Two column split
  | 'asymmetric'      // Unequal columns
  | 'grid-2'          // 2 column grid
  | 'grid-3'          // 3 column grid
  | 'grid-4'          // 4 column grid
  | 'bento'           // Bento box layout
  | 'masonry'         // Masonry grid
  | 'editorial'       // Editorial with sidebar
  | 'centered'        // Centered content
  | 'stacked';        // Vertically stacked

export type SectionHeight = 
  | 'auto'            // Content-based height
  | 'screen'          // Full viewport height
  | 'screen-90'       // 90vh
  | 'half-screen'     // 50vh
  | 'compact'         // Minimal padding
  | 'spacious';       // Extra padding

export interface LayoutLayer {
  containerWidth: 'narrow' | 'default' | 'wide' | 'full';
  defaultSpacing: 'compact' | 'default' | 'spacious' | 'dramatic';
  sections: SectionLayoutLayer[];
}

export interface SectionLayoutLayer {
  id: string;
  pattern: LayoutPattern;
  height: SectionHeight;
  alignment: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
  order: number;
  padding?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  gridConfig?: {
    columns: number;
    gap: string;
    itemOrder?: number[];
  };
}

// ============================================================================
// STYLING LAYER - Visual appearance
// ============================================================================

export interface StylingLayer {
  colors: ColorScheme;
  typography: TypographyConfig;
  surfaces: SurfaceConfig;
  borders: BorderConfig;
}

export interface ColorScheme {
  mode: 'light' | 'dark' | 'auto';
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success?: string;
  warning?: string;
  error?: string;
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  scale: 'compact' | 'default' | 'expanded' | 'dramatic';
  headingWeight: '400' | '500' | '600' | '700' | '800' | '900';
  bodyWeight: '300' | '400' | '500';
  letterSpacing: 'tight' | 'normal' | 'wide';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface SurfaceConfig {
  cardStyle: 'flat' | 'elevated' | 'bordered' | 'glassmorphism';
  cardRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'dramatic';
}

export interface BorderConfig {
  style: 'none' | 'subtle' | 'visible' | 'prominent';
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  width: '0' | '1' | '2';
}

// ============================================================================
// MOTION LAYER - Animations and transitions
// ============================================================================

export type MotionIntensity = 'none' | 'subtle' | 'moderate' | 'dramatic';
export type AnimationTrigger = 'load' | 'scroll' | 'hover' | 'click';

export interface MotionLayer {
  enabled: boolean;
  intensity: MotionIntensity;
  respectReducedMotion: boolean;
  pageTransitions: PageTransitionConfig;
  sectionAnimations: SectionAnimationConfig[];
}

export interface PageTransitionConfig {
  type: 'none' | 'fade' | 'slide' | 'scale';
  duration: number;
  easing: string;
}

export interface SectionAnimationConfig {
  id: string;
  trigger: AnimationTrigger;
  animation: AnimationPreset;
  delay?: number;
  stagger?: number;  // Delay between child elements
}

export type AnimationPreset =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'slideIn'
  | 'staggerChildren'
  | 'parallax'
  | 'reveal'
  | 'typewriter'
  | 'none';

// ============================================================================
// ASSETS LAYER - Images, logos, and media
// ============================================================================

export interface AssetsLayer {
  logo?: LogoAsset;
  favicon?: string;
  ogImage?: string;
  sectionAssets: SectionAssetsLayer[];
}

export interface LogoAsset {
  type: 'image' | 'svg' | 'text';
  url?: string;
  b64?: string;
  text?: string;
  width?: number;
  height?: number;
}

export interface SectionAssetsLayer {
  id: string;
  backgroundImage?: ImageAsset;
  images?: ImageAsset[];
  icons?: IconConfig[];
  decorative?: DecorativeElement[];
}

export interface ImageAsset {
  url?: string;
  b64?: string;
  alt: string;
  width?: number;
  height?: number;
  position?: 'cover' | 'contain' | 'center' | 'top' | 'bottom';
  overlay?: {
    type: 'gradient' | 'solid' | 'none';
    color?: string;
    opacity?: number;
  };
}

export interface IconConfig {
  name: string;
  library: 'lucide' | 'heroicons' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export interface DecorativeElement {
  type: 'gradient-orb' | 'pattern' | 'shape' | 'line' | 'dots';
  position: { x: string; y: string };
  size: string;
  color?: string;
  opacity?: number;
  blur?: number;
  animation?: AnimationPreset;
}

// ============================================================================
// COMPLETE PROJECT CONFIGURATION
// ============================================================================

export interface ProjectLayers {
  version: number;
  content: ContentLayer;
  layout: LayoutLayer;
  styling: StylingLayer;
  motion: MotionLayer;
  assets: AssetsLayer;
}

// ============================================================================
// LAYER UTILITIES
// ============================================================================

export function getDefaultMotionLayer(): MotionLayer {
  return {
    enabled: true,
    intensity: 'moderate',
    respectReducedMotion: true,
    pageTransitions: {
      type: 'fade',
      duration: 300,
      easing: 'ease-out',
    },
    sectionAnimations: [],
  };
}

export function getDefaultStylingLayer(colorScheme: Partial<ColorScheme> = {}): StylingLayer {
  return {
    colors: {
      mode: 'light',
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      ...colorScheme,
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      scale: 'default',
      headingWeight: '700',
      bodyWeight: '400',
      letterSpacing: 'normal',
      lineHeight: 'relaxed',
    },
    surfaces: {
      cardStyle: 'elevated',
      cardRadius: 'lg',
      shadowIntensity: 'subtle',
    },
    borders: {
      style: 'subtle',
      radius: 'lg',
      width: '1',
    },
  };
}

export function getDefaultLayoutLayer(): LayoutLayer {
  return {
    containerWidth: 'default',
    defaultSpacing: 'default',
    sections: [],
  };
}

export function mergeLayerStyles(base: StylingLayer, override: Partial<StylingLayer>): StylingLayer {
  return {
    colors: { ...base.colors, ...override.colors },
    typography: { ...base.typography, ...override.typography },
    surfaces: { ...base.surfaces, ...override.surfaces },
    borders: { ...base.borders, ...override.borders },
  };
}

export function getMotionConfig(preset: AnimationPreset, intensity: MotionIntensity): {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  transition: Record<string, unknown>;
} {
  const durationMultiplier = intensity === 'subtle' ? 0.5 : intensity === 'dramatic' ? 1.5 : 1;
  const baseDuration = 0.6 * durationMultiplier;
  
  const presets: Record<AnimationPreset, {
    initial: Record<string, unknown>;
    animate: Record<string, unknown>;
    transition: Record<string, unknown>;
  }> = {
    none: {
      initial: {},
      animate: {},
      transition: {},
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: baseDuration },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 * durationMultiplier },
      animate: { opacity: 1, y: 0 },
      transition: { duration: baseDuration },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 * durationMultiplier },
      animate: { opacity: 1, y: 0 },
      transition: { duration: baseDuration },
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 * durationMultiplier },
      animate: { opacity: 1, x: 0 },
      transition: { duration: baseDuration },
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 * durationMultiplier },
      animate: { opacity: 1, x: 0 },
      transition: { duration: baseDuration },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: baseDuration },
    },
    slideIn: {
      initial: { opacity: 0, y: 40 * durationMultiplier },
      animate: { opacity: 1, y: 0 },
      transition: { duration: baseDuration, ease: [0.25, 0.4, 0.25, 1] },
    },
    staggerChildren: {
      initial: {},
      animate: {},
      transition: { staggerChildren: 0.1 * durationMultiplier },
    },
    parallax: {
      initial: {},
      animate: {},
      transition: { type: 'spring', stiffness: 100, damping: 30 },
    },
    reveal: {
      initial: { opacity: 0, y: 60 * durationMultiplier, rotateX: -10 },
      animate: { opacity: 1, y: 0, rotateX: 0 },
      transition: { duration: baseDuration * 1.2, ease: [0.25, 0.4, 0.25, 1] },
    },
    typewriter: {
      initial: { width: 0 },
      animate: { width: '100%' },
      transition: { duration: baseDuration * 2, ease: 'linear' },
    },
  };
  
  return presets[preset] || presets.fadeIn;
}
