/**
 * Layer Configuration Hook
 * 
 * Provides React context and utilities for accessing layer configurations.
 * This enables strong separation of concerns in the website renderer.
 */

import { useMemo } from "react";
import type { 
  ProjectLayers, 
  StylingLayer, 
  MotionLayer, 
  LayoutLayer,
  AnimationPreset,
  MotionIntensity,
  getMotionConfig 
} from "@shared/layer-config";
import type { SiteSettings, WebsiteContent } from "@shared/schema";

/**
 * Convert SiteSettings to StylingLayer
 */
export function siteSettingsToStylingLayer(settings?: SiteSettings): StylingLayer {
  const colors = {
    mode: (settings?.colorScheme || 'light') as 'light' | 'dark' | 'auto',
    primary: settings?.primaryColor || '#3b82f6',
    secondary: settings?.secondaryColor || '#6366f1',
    accent: settings?.accentColor || '#10b981',
    background: settings?.backgroundColor || '#ffffff',
    surface: settings?.surfaceColor || '#f8fafc',
    text: settings?.textColor || '#1e293b',
    textMuted: settings?.mutedTextColor || '#64748b',
    border: settings?.borderColor || '#e2e8f0',
  };
  
  return {
    colors,
    typography: {
      headingFont: settings?.headingFont || 'Inter',
      bodyFont: settings?.fontFamily || 'Inter',
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

/**
 * Generate CSS variables from StylingLayer
 */
export function stylingLayerToCssVars(styling: StylingLayer): Record<string, string> {
  const { colors, typography, borders, surfaces } = styling;
  
  const radiusMap = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  };
  
  const shadowMap = {
    none: 'none',
    subtle: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    dramatic: '0 10px 25px rgba(0,0,0,0.15)',
  };
  
  return {
    '--brand-primary': colors.primary,
    '--brand-secondary': colors.secondary,
    '--brand-accent': colors.accent,
    '--brand-bg': colors.background,
    '--brand-surface': colors.surface,
    '--brand-text': colors.text,
    '--brand-muted': colors.textMuted,
    '--brand-border': colors.border,
    '--font-heading': typography.headingFont,
    '--font-body': typography.bodyFont,
    '--heading-weight': typography.headingWeight,
    '--body-weight': typography.bodyWeight,
    '--card-radius': radiusMap[surfaces.cardRadius],
    '--border-radius': radiusMap[borders.radius],
    '--card-shadow': shadowMap[surfaces.shadowIntensity],
  };
}

/**
 * Hook to get layer configuration from website content
 */
export function useLayerConfig(websiteContent?: WebsiteContent | null) {
  const stylingLayer = useMemo(() => {
    return siteSettingsToStylingLayer(websiteContent?.siteSettings || undefined);
  }, [websiteContent?.siteSettings]);
  
  const cssVars = useMemo(() => {
    return stylingLayerToCssVars(stylingLayer);
  }, [stylingLayer]);
  
  const motionLayer: MotionLayer = useMemo(() => ({
    enabled: true,
    intensity: 'moderate' as MotionIntensity,
    respectReducedMotion: true,
    pageTransitions: {
      type: 'fade',
      duration: 300,
      easing: 'ease-out',
    },
    sectionAnimations: [],
  }), []);
  
  const layoutLayer: LayoutLayer = useMemo(() => ({
    containerWidth: 'default' as const,
    defaultSpacing: 'default' as const,
    sections: [],
  }), []);
  
  return {
    stylingLayer,
    motionLayer,
    layoutLayer,
    cssVars,
    getAnimation: (preset: AnimationPreset) => getMotionConfigLocal(preset, motionLayer.intensity),
  };
}

/**
 * Get animation config for a preset
 */
function getMotionConfigLocal(preset: AnimationPreset, intensity: MotionIntensity): {
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
      initial: { opacity: 0, y: 60 * durationMultiplier },
      animate: { opacity: 1, y: 0 },
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

/**
 * CSS class utilities based on layer configuration
 */
export function getLayerClasses(styling: StylingLayer): {
  container: string;
  card: string;
  button: string;
  text: string;
  heading: string;
} {
  const { surfaces, borders } = styling;
  
  const cardClasses = {
    flat: 'bg-[var(--brand-surface)]',
    elevated: 'bg-[var(--brand-surface)] shadow-md',
    bordered: 'bg-[var(--brand-surface)] border border-[var(--brand-border)]',
    glassmorphism: 'bg-[var(--brand-surface)]/80 backdrop-blur-lg',
  };
  
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  return {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    card: `${cardClasses[surfaces.cardStyle]} ${radiusClasses[surfaces.cardRadius]}`,
    button: `${radiusClasses[borders.radius]} font-medium transition-all`,
    text: 'text-[var(--brand-text)]',
    heading: 'text-[var(--brand-text)] font-[var(--heading-weight)]',
  };
}
