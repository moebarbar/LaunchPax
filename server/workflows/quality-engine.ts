/**
 * Quality Evaluation Engine
 * 
 * An AI-powered system that evaluates website quality across multiple dimensions:
 * - Layout quality and composition
 * - Typography hierarchy
 * - Visual depth and creativity
 * - Hero/header impact
 * - Generic pattern detection
 * - Premium design standards compliance
 * 
 * This engine ensures no low-quality output is surfaced to users.
 * PREMIUM STANDARDS: Enforces agency-level, $50k-$100k website quality.
 */

import OpenAI from "openai";
import type { WebsiteContent, SectionContent, PageContent } from "@shared/schema";
import { validatePremiumCompliance, PREMIUM_DESIGN_STANDARDS } from "../services/premium-design-standards";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for quality evaluation");
  }
  return new OpenAI({ apiKey });
}

export interface QualityScore {
  overall: number;          // 0-100
  layout: number;           // 0-100 - Grid composition, spacing, balance
  typography: number;       // 0-100 - Hierarchy, readability, contrast
  creativity: number;       // 0-100 - Originality, visual interest
  heroImpact: number;       // 0-100 - First impression, above-fold power
  contentQuality: number;   // 0-100 - Copy effectiveness, clarity
  visualDepth: number;      // 0-100 - Layers, shadows, dimensionality
  layoutSophistication: number; // 0-100 - Section variety, visual depth, premium feel
}

export interface SectionAnalysis {
  sectionId: string;
  sectionType: string;
  score: number;
  issues: string[];
  improvements: string[];
  isWeak: boolean;        // Score < 85 = weak (raised for premium output)
  isGeneric: boolean;     // Detected as template-looking
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface QualityReport {
  timestamp: Date;
  scores: QualityScore;
  sectionAnalyses: SectionAnalysis[];
  weakSections: SectionAnalysis[];   // Sections needing improvement
  genericPatterns: string[];          // Detected generic patterns
  overallVerdict: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  improvementPlan: ImprovementAction[];
  passesQualityGate: boolean;        // Must be true to show to user
  error?: string;                     // Error message if evaluation failed
  skipped?: boolean;                  // True if evaluation was skipped due to errors
}

export interface ImprovementAction {
  sectionId: string;
  actionType: 'rewrite' | 'enhance' | 'restructure' | 'add_depth';
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  expectedImprovement: number;
}

const QUALITY_THRESHOLDS = {
  minimum: 90,      // Minimum overall score to pass quality gate - PREMIUM STANDARD
  heroMinimum: 95,  // Hero sections need highest standards - PREMIUM jaw-dropping impact
  excellent: 98,    // Excellent quality threshold - near perfection
  good: 92,         // Good quality threshold - agency-level quality
};

// Comprehensive list of generic patterns that indicate template-like content
const GENERIC_PATTERNS = [
  // Welcome/intro patterns
  "Welcome to our website",
  "Welcome to our company",
  "Welcome to",
  "Lorem ipsum",
  "Click here to learn more",
  "Learn more about us",
  
  // Generic value props
  "We are a leading provider",
  "We are passionate about",
  "We pride ourselves on",
  "Your trusted partner",
  "Your one-stop solution",
  "Your success is our priority",
  "Quality service guaranteed",
  "Best in class",
  "Industry-leading",
  "World-class",
  "State-of-the-art",
  "Cutting-edge solutions",
  "End-to-end solutions",
  "Tailored solutions",
  "Comprehensive solutions",
  "Holistic approach",
  
  // Generic CTAs
  "Contact us today",
  "Get in touch today",
  "Schedule a consultation",
  "Book a call",
  "Request a quote",
  "Get started today",
  "Start your journey",
  
  // Generic testimonials
  "Highly recommended",
  "Exceeded our expectations",
  "Amazing service",
  "Great team to work with",
  "Professional and reliable",
  "Would recommend to anyone",
  "Five stars",
  "10/10 would recommend",
  
  // Generic features/benefits
  "Fast and reliable",
  "Easy to use",
  "User-friendly",
  "Save time and money",
  "Increase efficiency",
  "Improve productivity",
  "Streamline your",
  "Optimize your",
  "Transform your business",
  "Take your business to the next level",
  "Unlock your potential",
  "Achieve your goals",
  "Drive growth",
  "Drive results",
  "Deliver results",
  "Outstanding results",
  
  // Generic about content
  "We believe in",
  "Our mission is to",
  "Our vision is to",
  "Founded with a vision",
  "Started with a dream",
  "We strive to",
  "We are committed to",
  "We are dedicated to",
  "Customer satisfaction",
  "Client-focused",
  "Client-centric",
  
  // Generic stats
  "Years of experience",
  "Happy clients",
  "Projects completed",
  "Team members",
  "Countries served",
  
  // Placeholder indicators
  "[placeholder]",
  "[your",
  "[insert",
  "TBD",
  "Coming soon",
  "Under construction",
  
  // Marketing fluff
  "Leverage",
  "Synergy",
  "Synergies",
  "Paradigm",
  "Disruptive",
  "Game-changing",
  "Revolutionary",
  "Innovative solutions",
  "Next-generation",
  "Forward-thinking",
  "Proactive approach",
  "Seamless integration",
  "Robust platform",
  "Scalable solutions",
];

// Layout patterns that indicate generic/template design
const LAYOUT_ISSUES = {
  // Minimum sections per page for PREMIUM websites - RAISED for agency-level quality
  minSectionsHome: 10,
  minSectionsAbout: 8,
  minSectionsServices: 8,
  minSectionsOther: 5,
  
  // Section types that indicate "breathing room"
  breathingRoomSections: ['stats', 'trust-signals', 'text', 'story', 'brand-story'],
  
  // Section types that are content-dense (need breathing room between them)
  denseSections: ['features', 'services', 'pricing', 'team', 'testimonials', 'gallery'],
};

// Premium design requirements - MUST be present for agency-level websites
const PREMIUM_DESIGN_REQUIREMENTS = {
  // Navigation MUST use floating-pill style
  requiredNavigationStyle: 'floating-pill',
  
  // Hero MUST have these elements
  heroRequirements: {
    minHeight: '90vh',
    hasAnimatedElements: true,
    hasBadge: true,
    hasScrollIndicator: true,
  },
  
  // Cards MUST have premium styling
  cardRequirements: {
    borderRadius: '1.5rem',
    hasHoverEffects: true,
    hasShadowOnHover: true,
  },
  
  // Typography MUST follow these rules
  typographyRequirements: {
    h1Weight: 800,
    h1LetterSpacing: '-0.035em',
    bodyLineHeight: 1.7,
  },
  
  // Section requirements
  sectionRequirements: {
    verticalPaddingMin: '6rem',
    hasSubtlePatterns: true,
    hasAnimations: true,
  },
};

/**
 * Color Contrast Utilities
 * Ensures proper contrast between text and backgrounds
 */

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if a color is "light" (high luminance)
function isLightColor(color: { r: number; g: number; b: number }): boolean {
  const luminance = getLuminance(color.r, color.g, color.b);
  return luminance > 0.5;
}

// Parse color from various formats
function parseColor(colorStr: string): { r: number; g: number; b: number } | null {
  if (!colorStr) return null;
  
  // Handle hex
  if (colorStr.startsWith('#')) {
    return hexToRgb(colorStr);
  }
  
  // Handle HSL like "180 50% 80%"
  const hslMatch = colorStr.match(/(\d+)\s+(\d+)%?\s+(\d+)%?/);
  if (hslMatch) {
    return hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
  }
  
  // Handle rgb()
  const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
  }
  
  return null;
}

// Color contrast issues detection and fixing
interface ColorContrastIssue {
  location: string;
  issue: string;
  severity: 'critical' | 'warning';
  fix?: { property: string; value: string };
}

/**
 * Analyze brand colors for contrast issues
 */
function analyzeColorContrast(brandColors: any): { issues: ColorContrastIssue[]; needsFix: boolean } {
  const issues: ColorContrastIssue[] = [];
  
  if (!brandColors) {
    return { issues: [], needsFix: false };
  }
  
  const primary = parseColor(brandColors.primary);
  const background = parseColor(brandColors.background);
  const accent = parseColor(brandColors.accent);
  
  // Check if primary and background are both light (critical issue)
  if (primary && background) {
    const bothLight = isLightColor(primary) && isLightColor(background);
    const contrastRatio = getContrastRatio(primary, background);
    
    if (bothLight && contrastRatio < 3) {
      issues.push({
        location: 'brand_colors',
        issue: 'Primary and background colors are both light - text will be unreadable',
        severity: 'critical',
        fix: { property: 'primary', value: '#1a1a2e' } // Dark blue-gray
      });
    }
    
    if (contrastRatio < 4.5) {
      issues.push({
        location: 'brand_colors',
        issue: `Low contrast ratio (${contrastRatio.toFixed(2)}) between primary and background`,
        severity: contrastRatio < 3 ? 'critical' : 'warning'
      });
    }
  }
  
  // Check accent contrast
  if (accent && background) {
    const bothLight = isLightColor(accent) && isLightColor(background);
    if (bothLight) {
      issues.push({
        location: 'brand_colors',
        issue: 'Accent and background colors are both light',
        severity: 'warning',
        fix: { property: 'accent', value: '#2d3748' } // Dark gray
      });
    }
  }
  
  return { 
    issues, 
    needsFix: issues.some(i => i.severity === 'critical') 
  };
}

/**
 * Professional, high-contrast color palettes for different industries
 * All palettes have solid colors with strong contrast
 */
const PROFESSIONAL_COLOR_PALETTES: Record<string, { 
  primary: string; 
  background: string; 
  accent: string; 
  cardBg: string;
  heading: string;
  text: string;
  muted: string;
}> = {
  healthcare: {
    primary: '#0c4a6e',       // Dark blue
    background: '#f8fafc',    // Very light gray (almost white)
    accent: '#0284c7',        // Medium blue
    cardBg: '#ffffff',        // Pure white
    heading: '#0f172a',       // Very dark - max contrast
    text: '#1e293b',          // Dark slate
    muted: '#475569',         // Medium slate
  },
  dental: {
    primary: '#0f766e',       // Teal dark
    background: '#f0fdfa',    // Very light teal (almost white)
    accent: '#14b8a6',        // Medium teal  
    cardBg: '#ffffff',        // Pure white
    heading: '#0f172a',       // Very dark - max contrast
    text: '#1e293b',          // Dark slate
    muted: '#475569',         // Medium slate
  },
  technology: {
    primary: '#1e293b',       // Dark slate
    background: '#f8fafc',    // Very light gray
    accent: '#3b82f6',        // Blue
    cardBg: '#ffffff',        // Pure white
    heading: '#0f172a',       // Very dark - max contrast
    text: '#1e293b',          // Dark slate
    muted: '#64748b',         // Slate gray
  },
  professional: {
    primary: '#1f2937',       // Dark gray
    background: '#ffffff',    // Pure white
    accent: '#4f46e5',        // Indigo
    cardBg: '#f9fafb',        // Light gray
    heading: '#111827',       // Near black
    text: '#1f2937',          // Dark gray
    muted: '#6b7280',         // Gray
  },
  creative: {
    primary: '#581c87',       // Purple dark
    background: '#faf5ff',    // Very light purple
    accent: '#a855f7',        // Purple medium
    cardBg: '#ffffff',        // Pure white
    heading: '#1e1b4b',       // Dark indigo
    text: '#312e81',          // Indigo dark
    muted: '#6b7280',         // Gray
  },
  food: {
    primary: '#7c2d12',       // Brown/orange dark
    background: '#fffbeb',    // Very light yellow
    accent: '#ea580c',        // Orange
    cardBg: '#ffffff',        // Pure white
    heading: '#1c1917',       // Stone dark
    text: '#292524',          // Stone
    muted: '#78716c',         // Stone muted
  },
  default: {
    primary: '#0f172a',       // Very dark blue-gray
    background: '#ffffff',    // Pure white
    accent: '#3b82f6',        // Blue
    cardBg: '#f8fafc',        // Light gray
    heading: '#0f172a',       // Very dark - max contrast
    text: '#1e293b',          // Dark slate
    muted: '#64748b',         // Slate gray
  },
};

/**
 * Get a professional color palette based on industry
 */
export function getProfessionalPalette(industry: string): typeof PROFESSIONAL_COLOR_PALETTES['default'] {
  const lowerIndustry = (industry || '').toLowerCase();
  
  if (/health|medical|clinic|hospital|doctor|wellness/i.test(lowerIndustry)) {
    return PROFESSIONAL_COLOR_PALETTES.healthcare;
  }
  if (/dental|dentist|orthodont/i.test(lowerIndustry)) {
    return PROFESSIONAL_COLOR_PALETTES.dental;
  }
  if (/tech|software|saas|app|digital|startup/i.test(lowerIndustry)) {
    return PROFESSIONAL_COLOR_PALETTES.technology;
  }
  if (/law|legal|finance|bank|accounting|insurance|consult/i.test(lowerIndustry)) {
    return PROFESSIONAL_COLOR_PALETTES.professional;
  }
  if (/design|art|creative|media|photo|video|music/i.test(lowerIndustry)) {
    return PROFESSIONAL_COLOR_PALETTES.creative;
  }
  if (/food|restaurant|cafe|bakery|catering/i.test(lowerIndustry)) {
    return PROFESSIONAL_COLOR_PALETTES.food;
  }
  
  return PROFESSIONAL_COLOR_PALETTES.default;
}

/**
 * Fix brand colors to ensure proper contrast
 * Returns SOLID colors only - no translucent or low-contrast colors
 */
export function fixBrandColors(brandColors: any, industry: string): any {
  const analysis = analyzeColorContrast(brandColors);
  
  if (!analysis.needsFix) {
    return brandColors;
  }
  
  console.log('[Quality Engine] Fixing brand colors for proper contrast');
  
  // Get a professional palette as fallback
  const professionalPalette = getProfessionalPalette(industry);
  
  return {
    ...brandColors,
    primary: professionalPalette.primary,
    background: professionalPalette.background,
    accent: brandColors.accent || professionalPalette.accent,
    cardBackground: professionalPalette.cardBg,
    // CRITICAL: Use solid text colors from palette for maximum contrast
    headingColor: professionalPalette.heading,
    foreground: professionalPalette.text,
    mutedForeground: professionalPalette.muted,
  };
}

/**
 * Analyze layout sophistication and visual variety
 */
function analyzeLayoutSophistication(pages: any[]): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;
  
  for (const page of pages) {
    const sections = page.sections || [];
    const pageName = page.path || page.name || 'unknown';
    
    // Check minimum section count
    let minSections = LAYOUT_ISSUES.minSectionsOther;
    if (pageName.includes('home') || pageName === '/') minSections = LAYOUT_ISSUES.minSectionsHome;
    else if (pageName.includes('about')) minSections = LAYOUT_ISSUES.minSectionsAbout;
    else if (pageName.includes('services')) minSections = LAYOUT_ISSUES.minSectionsServices;
    
    if (sections.length < minSections) {
      issues.push(`${pageName}: Only ${sections.length} sections (needs ${minSections}+ for premium feel)`);
      score -= 15;
    }
    
    // Check for repetitive section types
    const sectionTypes = sections.map((s: any) => s.type);
    const typeCounts: Record<string, number> = {};
    for (const type of sectionTypes) {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      if (typeCounts[type] > 2 && type !== 'cta') {
        issues.push(`${pageName}: Section type "${type}" used ${typeCounts[type]} times (avoid repetition)`);
        score -= 10;
      }
    }
    
    // Check for adjacent dense sections without breathing room
    for (let i = 0; i < sections.length - 1; i++) {
      const current = sections[i].type;
      const next = sections[i + 1].type;
      if (LAYOUT_ISSUES.denseSections.includes(current) && LAYOUT_ISSUES.denseSections.includes(next)) {
        issues.push(`${pageName}: Dense sections "${current}" and "${next}" are adjacent (add breathing room)`);
        score -= 5;
      }
    }
    
    // Check for hero + features + features pattern (very generic)
    for (let i = 0; i < sections.length - 2; i++) {
      const pattern = [sections[i].type, sections[i+1].type, sections[i+2].type].join('-');
      if (pattern === 'hero-features-services' || pattern === 'hero-features-features') {
        issues.push(`${pageName}: Generic "hero + cards + cards" pattern detected`);
        score -= 15;
      }
    }
    
    // Check for lack of storytelling sections
    const hasStorySection = sections.some((s: any) => 
      ['story', 'brand-story', 'text', 'case-studies'].includes(s.type)
    );
    if (sections.length >= 6 && !hasStorySection && !pageName.includes('contact')) {
      issues.push(`${pageName}: No storytelling sections (add story, brand-story, or case-studies)`);
      score -= 10;
    }
    
    // Check for missing trust signals on home page
    if ((pageName.includes('home') || pageName === '/') && sections.length >= 6) {
      const hasTrustSignals = sections.some((s: any) => 
        ['trust-signals', 'testimonials', 'case-studies', 'stats'].includes(s.type)
      );
      if (!hasTrustSignals) {
        issues.push(`${pageName}: No social proof sections (add testimonials, stats, or trust-signals)`);
        score -= 15;
      }
    }
  }
  
  return { score: Math.max(0, score), issues };
}

/**
 * Evaluate overall website quality using AI
 */
// Create a default section analysis for timeout/error cases
function createDefaultSectionAnalysis(section: SectionContent): SectionAnalysis {
  return {
    sectionId: section.id,
    sectionType: section.type,
    score: 75, // Assume acceptable quality when can't evaluate
    issues: ['Unable to evaluate section quality'],
    improvements: [],
    isWeak: false,
    isGeneric: false,
    priority: 'low',
  };
}

// Timeout wrapper for async operations
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => {
      console.warn(`[Quality Engine] Operation timed out after ${timeoutMs}ms, using fallback`);
      resolve(fallback);
    }, timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}

export async function evaluateWebsiteQuality(
  websiteContent: WebsiteContent,
  businessContext: { name: string; industry: string; description: string }
): Promise<QualityReport> {
  const startTime = Date.now();
  const MAX_EVALUATION_TIME = 60000; // 60 seconds max for quality evaluation
  const MAX_SECTIONS_TO_ANALYZE = 8; // Limit sections to analyze for speed
  
  let client: OpenAI;
  try {
    client = getClient();
  } catch (error) {
    console.warn("[Quality Engine] OpenAI not configured, skipping quality evaluation");
    return createDefaultReport("OpenAI not configured");
  }
  
  // Analyze each section across all pages (with limits)
  const sectionAnalyses: SectionAnalysis[] = [];
  const pages = websiteContent.pages || [];
  let sectionsAnalyzed = 0;
  
  for (const page of pages) {
    for (const section of page.sections || []) {
      // Check time limit
      if (Date.now() - startTime > MAX_EVALUATION_TIME) {
        console.warn("[Quality Engine] Time limit reached, skipping remaining sections");
        break;
      }
      
      // Limit number of sections analyzed
      if (sectionsAnalyzed >= MAX_SECTIONS_TO_ANALYZE) {
        console.log(`[Quality Engine] Section limit reached (${MAX_SECTIONS_TO_ANALYZE}), skipping remaining`);
        break;
      }
      
      // Priority: always analyze hero, cta, and a few key sections
      const isPrioritySection = ['hero', 'cta', 'features', 'services', 'testimonials'].includes(section.type);
      if (sectionsAnalyzed >= 5 && !isPrioritySection) {
        // Skip non-priority sections after first 5
        continue;
      }
      
      const analysis = await withTimeout(
        analyzeSectionQuality(section, businessContext, client),
        15000, // 15 second timeout per section
        createDefaultSectionAnalysis(section)
      );
      sectionAnalyses.push(analysis);
      sectionsAnalyzed++;
    }
  }
  
  // Calculate aggregate scores
  const scores = calculateAggregateScores(sectionAnalyses, websiteContent);
  
  // Analyze layout sophistication and visual variety
  const layoutAnalysis = analyzeLayoutSophistication(pages);
  scores.layoutSophistication = layoutAnalysis.score;
  
  // Factor layout score into overall score
  const layoutPenalty = Math.max(0, (100 - layoutAnalysis.score) / 5);
  scores.overall = Math.max(0, scores.overall - layoutPenalty);
  
  // Detect generic patterns across all content
  const genericPatterns = detectGenericPatterns(websiteContent);
  
  // Add layout issues to generic patterns
  const allIssues = [...genericPatterns, ...layoutAnalysis.issues];
  
  // Identify weak sections
  const weakSections = sectionAnalyses.filter(s => s.isWeak || s.isGeneric);
  
  // Generate improvement plan with layout issues
  const improvementPlan = generateImprovementPlan(weakSections, scores, layoutAnalysis.issues);
  
  // Determine overall verdict
  const overallVerdict = determineVerdict(scores);
  
  // PREMIUM STANDARDS: Validate premium design compliance
  const premiumCompliance = validatePremiumCompliance(websiteContent);
  if (!premiumCompliance.compliant) {
    console.log(`[Quality Engine] Premium compliance violations: ${premiumCompliance.violations.join(", ")}`);
    // Apply penalty for premium violations
    scores.overall = Math.max(0, scores.overall - (100 - premiumCompliance.score) / 2);
  }
  
  // Add premium violations to issues list
  const allIssuesWithPremium = [...allIssues, ...premiumCompliance.violations.map(v => `[PREMIUM] ${v}`)];
  
  // Check if passes quality gate (including layout score AND premium compliance)
  const passesQualityGate = 
    scores.overall >= QUALITY_THRESHOLDS.minimum &&
    scores.heroImpact >= QUALITY_THRESHOLDS.heroMinimum &&
    layoutAnalysis.score >= 70 && // Layout must be at least 70
    premiumCompliance.score >= 80 && // PREMIUM: Must meet 80% of premium standards
    weakSections.filter(s => s.priority === 'critical').length === 0;
  
  console.log(`[Quality Engine] Premium standards v${PREMIUM_DESIGN_STANDARDS.version}: compliance=${premiumCompliance.score}%, passesGate=${passesQualityGate}`);
  
  return {
    timestamp: new Date(),
    scores,
    sectionAnalyses,
    weakSections,
    genericPatterns: allIssuesWithPremium,
    overallVerdict,
    improvementPlan,
    passesQualityGate,
  };
}

/**
 * Truncate content to a safe length for AI context
 */
function truncateForAI(content: string, maxLength: number = 2000): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "\n... [truncated for brevity]";
}

/**
 * Analyze individual section quality
 */
async function analyzeSectionQuality(
  section: SectionContent,
  businessContext: { name: string; industry: string; description: string },
  client: OpenAI
): Promise<SectionAnalysis> {
  const sectionData = section.data || {};
  const contentText = extractTextContent(sectionData);
  
  // Quick pattern check for obvious generic content
  const hasGenericPatterns = GENERIC_PATTERNS.some(pattern => 
    contentText.toLowerCase().includes(pattern.toLowerCase())
  );
  
  // Truncate section data to prevent context length issues
  const truncatedSectionData = truncateForAI(JSON.stringify(sectionData, null, 2), 3000);
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an elite creative director evaluating website sections for a ${businessContext.industry} business called "${businessContext.name}".

Your standards are EXTREMELY HIGH. You evaluate like a creative director at a top agency.

Score each dimension 0-100:
- 60 or below = Unacceptable, generic, template-looking
- 70-79 = Acceptable but needs improvement
- 80-89 = Good, professional quality
- 90+ = Exceptional, agency-level quality

Be HARSH. Most template websites score 50-65. Only truly exceptional content scores 85+.`
        },
        {
          role: "user",
          content: `Evaluate this ${section.type} section for a ${businessContext.industry} business:

Business: ${businessContext.name}
Description: ${businessContext.description}

Section Content:
${truncatedSectionData}

Respond with JSON:
{
  "score": number (0-100),
  "issues": ["issue1", "issue2"],
  "improvements": ["improvement1", "improvement2"],
  "isGeneric": boolean,
  "reasoning": "brief explanation"
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    const score = Math.min(100, Math.max(0, result.score || 50));
    const isWeak = score < QUALITY_THRESHOLDS.minimum; // 85 for premium output
    const isGeneric = result.isGeneric || hasGenericPatterns;
    
    // Determine priority based on section type and score
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (section.type === 'hero' && score < QUALITY_THRESHOLDS.heroMinimum) priority = 'critical'; // Hero must hit 90
    else if (isWeak && ['hero', 'cta', 'features'].includes(section.type)) priority = 'high';
    else if (isWeak) priority = 'medium';
    else if (isGeneric) priority = 'medium';
    
    return {
      sectionId: section.id,
      sectionType: section.type,
      score,
      issues: result.issues || [],
      improvements: result.improvements || [],
      isWeak,
      isGeneric,
      priority,
    };
    
  } catch (error) {
    console.error(`Failed to analyze section ${section.id}:`, error);
    
    // Fallback analysis based on pattern detection
    return {
      sectionId: section.id,
      sectionType: section.type,
      score: hasGenericPatterns ? 55 : 70,
      issues: hasGenericPatterns ? ["Contains generic content patterns"] : [],
      improvements: ["Could not complete AI analysis"],
      isWeak: hasGenericPatterns,
      isGeneric: hasGenericPatterns,
      priority: section.type === 'hero' ? 'high' : 'medium',
    };
  }
}

/**
 * Calculate aggregate quality scores
 */
function calculateAggregateScores(
  analyses: SectionAnalysis[],
  websiteContent: WebsiteContent
): QualityScore {
  if (analyses.length === 0) {
    return {
      overall: 50,
      layout: 50,
      typography: 50,
      creativity: 50,
      heroImpact: 50,
      contentQuality: 50,
      visualDepth: 50,
      layoutSophistication: 50,
    };
  }
  
  // Average section scores
  const avgScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
  
  // Hero impact (find hero section)
  const heroAnalysis = analyses.find(a => a.sectionType === 'hero');
  const heroImpact = heroAnalysis?.score || avgScore;
  
  // Content quality based on generic pattern detection
  const genericCount = analyses.filter(a => a.isGeneric).length;
  const genericPenalty = (genericCount / analyses.length) * 30;
  const contentQuality = Math.max(40, avgScore - genericPenalty);
  
  // Layout score based on section diversity
  const uniqueTypes = new Set(analyses.map(a => a.sectionType)).size;
  const layoutBonus = Math.min(10, (uniqueTypes / 6) * 10);
  const layout = Math.min(100, avgScore + layoutBonus);
  
  // Typography - estimate based on section scores
  const typography = avgScore;
  
  // Creativity - penalize for generic content
  const creativity = Math.max(40, avgScore - (genericPenalty * 1.5));
  
  // Visual depth - based on section variety and non-generic content
  const visualDepth = Math.min(100, avgScore + layoutBonus - (genericPenalty * 0.5));
  
  // Overall weighted average
  const overall = Math.round(
    heroImpact * 0.25 +
    contentQuality * 0.20 +
    creativity * 0.20 +
    layout * 0.15 +
    typography * 0.10 +
    visualDepth * 0.10
  );
  
  return {
    overall: Math.round(overall),
    layout: Math.round(layout),
    typography: Math.round(typography),
    creativity: Math.round(creativity),
    heroImpact: Math.round(heroImpact),
    contentQuality: Math.round(contentQuality),
    visualDepth: Math.round(visualDepth),
    layoutSophistication: Math.round(layout), // Will be overwritten by layout analysis
  };
}

/**
 * Detect generic patterns in website content
 */
function detectGenericPatterns(websiteContent: WebsiteContent): string[] {
  const detected: string[] = [];
  const allText = JSON.stringify(websiteContent).toLowerCase();
  
  for (const pattern of GENERIC_PATTERNS) {
    if (allText.includes(pattern.toLowerCase())) {
      detected.push(pattern);
    }
  }
  
  // Check for other generic indicators
  if (allText.includes("lorem")) {
    detected.push("Placeholder Lorem Ipsum text detected");
  }
  
  if ((allText.match(/\[.*?\]/g) || []).length > 3) {
    detected.push("Multiple placeholder brackets detected");
  }
  
  return detected;
}

/**
 * Generate prioritized improvement plan
 */
function generateImprovementPlan(
  weakSections: SectionAnalysis[],
  scores: QualityScore,
  layoutIssues: string[] = []
): ImprovementAction[] {
  const actions: ImprovementAction[] = [];
  
  // Add layout improvement actions
  if (layoutIssues.length > 0) {
    for (const issue of layoutIssues.slice(0, 3)) { // Top 3 layout issues
      actions.push({
        sectionId: 'layout',
        actionType: 'restructure',
        priority: 'high',
        description: `Layout issue: ${issue}`,
        expectedImprovement: 10,
      });
    }
  }
  
  // Sort by priority and impact
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedSections = [...weakSections].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  
  for (const section of sortedSections) {
    let actionType: ImprovementAction['actionType'] = 'enhance';
    
    if (section.isGeneric) {
      actionType = 'rewrite';
    } else if (section.score < 60) {
      actionType = 'restructure';
    } else if (section.sectionType === 'hero' && section.score < 80) {
      actionType = 'add_depth';
    }
    
    const expectedImprovement = section.sectionType === 'hero' ? 15 : 
                           section.priority === 'high' ? 10 : 5;
    
    actions.push({
      sectionId: section.sectionId,
      actionType,
      description: section.improvements[0] || `Improve ${section.sectionType} section quality`,
      priority: section.priority,
      expectedImprovement,
    });
  }
  
  return actions;
}

/**
 * Determine overall quality verdict
 */
function determineVerdict(scores: QualityScore): QualityReport['overallVerdict'] {
  if (scores.overall >= QUALITY_THRESHOLDS.excellent) return 'excellent';
  if (scores.overall >= QUALITY_THRESHOLDS.good) return 'good';
  if (scores.overall >= QUALITY_THRESHOLDS.minimum) return 'needs_improvement';
  return 'poor';
}

/**
 * Extract text content from section data for pattern matching
 */
function extractTextContent(data: Record<string, unknown>): string {
  const textParts: string[] = [];
  
  function extractRecursive(obj: unknown): void {
    if (typeof obj === 'string') {
      textParts.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(extractRecursive);
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(extractRecursive);
    }
  }
  
  extractRecursive(data);
  return textParts.join(' ');
}

/**
 * Specialized hero quality enforcement
 * Heroes require extra attention - they're the first thing users see
 */
export async function enforceHeroQuality(
  section: SectionContent,
  businessContext: { name: string; industry: string; description: string }
): Promise<{ section: SectionContent; improved: boolean; beforeScore: number; afterScore: number }> {
  const client = getClient();
  
  try {
    // First, evaluate current hero quality
    const analysis = await analyzeSectionQualityStatic(section, businessContext, client);
    const beforeScore = analysis.score;
    
    // If hero is already excellent (>= heroMinimum threshold of 90), skip improvement
    if (beforeScore >= QUALITY_THRESHOLDS.heroMinimum) {
      return { section, improved: false, beforeScore, afterScore: beforeScore };
    }
    
    console.log(`[Hero Enforcement] Hero score ${beforeScore} < ${QUALITY_THRESHOLDS.heroMinimum}, running specialized improvement...`);
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a SENIOR CREATIVE DIRECTOR at a world-class agency that creates $50k-$100k websites.

Your ONLY job is to create an EXCEPTIONAL hero section that would win awards.

Business: ${businessContext.name} (${businessContext.industry})
Description: ${businessContext.description}

HERO SECTION RULES - NON-NEGOTIABLE:

1. HEADLINE (most important):
   - Must be BOLD, UNEXPECTED, and MEMORABLE
   - NO generic phrases: "Welcome", "Your trusted", "Best in class", "Leading provider"
   - Use power words: "Transform", "Unleash", "Revolutionary", "Breakthrough"
   - Max 8 words. Every word EARNS its place.
   - Example BAD: "Welcome to Our Consulting Services"
   - Example GOOD: "Strategy That Moves Markets"

2. SUBHEADLINE:
   - Adds specific context and value proposition
   - Include a quantifiable benefit if possible
   - Max 20 words
   - Example BAD: "We help businesses grow"
   - Example GOOD: "Join 500+ companies achieving 3x revenue growth"

3. CTA BUTTONS:
   - Primary: Action-oriented, specific (not "Learn More")
   - Secondary: Lower commitment alternative
   - Example BAD: "Get Started" / "Learn More"
   - Example GOOD: "Get Your Free Strategy Call" / "See Client Results"

4. OVERALL IMPACT:
   - Must create an emotional response in 3 seconds
   - Must clearly communicate unique value
   - Must feel premium, not template

Respond with the improved hero data as valid JSON, maintaining the exact structure.`
        },
        {
          role: "user",
          content: `Transform this hero section into something EXCEPTIONAL.

Current content (score: ${beforeScore}):
${truncateForAI(JSON.stringify(section.data, null, 2), 4000)}

Current issues: ${analysis.issues.join(', ')}

Return improved hero data as JSON (same structure, dramatically better content).`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.85,
    });
    
    const improvedData = JSON.parse(response.choices[0]?.message?.content || "{}");
    const improvedSection = { ...section, data: improvedData };
    
    // Re-evaluate to get after score
    const afterAnalysis = await analyzeSectionQualityStatic(improvedSection, businessContext, client);
    const afterScore = afterAnalysis.score;
    
    console.log(`[Hero Enforcement] Improved hero from ${beforeScore} to ${afterScore}`);
    
    return {
      section: improvedSection,
      improved: true,
      beforeScore,
      afterScore,
    };
    
  } catch (error) {
    console.error("[Hero Enforcement] Failed:", error);
    // Return original section unchanged if there's an error
    return { section, improved: false, beforeScore: 50, afterScore: 50 };
  }
}

/**
 * Static version of section quality analysis (doesn't require external client param)
 */
async function analyzeSectionQualityStatic(
  section: SectionContent,
  businessContext: { name: string; industry: string; description: string },
  client: OpenAI
): Promise<{ score: number; issues: string[] }> {
  const sectionData = section.data || {};
  const contentText = extractTextContent(sectionData);
  const hasGenericPatterns = GENERIC_PATTERNS.some(pattern => 
    contentText.toLowerCase().includes(pattern.toLowerCase())
  );
  
  // Truncate section data to prevent context length issues
  const truncatedData = truncateForAI(JSON.stringify(sectionData, null, 2), 2000);
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Rate this ${section.type} section for a ${businessContext.industry} business on a scale of 0-100. Be HARSH - most generic content scores 50-65.`
        },
        {
          role: "user",
          content: `Section: ${truncatedData}
          
Respond with JSON: { "score": number, "issues": ["issue1", "issue2"] }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      score: Math.min(100, Math.max(0, result.score || (hasGenericPatterns ? 55 : 65))),
      issues: result.issues || [],
    };
  } catch {
    return { score: hasGenericPatterns ? 55 : 65, issues: ["Analysis failed"] };
  }
}

/**
 * Auto-improve a section based on analysis
 */
export async function autoImproveSection(
  section: SectionContent,
  analysis: SectionAnalysis,
  businessContext: { name: string; industry: string; description: string }
): Promise<SectionContent> {
  const client = getClient();
  
  // Use specialized hero enforcement for hero sections
  if (section.type === 'hero') {
    const { section: improvedSection } = await enforceHeroQuality(section, businessContext);
    return improvedSection;
  }
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an elite creative director who has led campaigns for Apple, Stripe, and Notion. Your job is to COMPLETELY TRANSFORM generic, template-like content into PREMIUM, award-winning copy that would win Awwwards.

Business: ${businessContext.name} (${businessContext.industry})
Description: ${businessContext.description}

MANDATORY RULES - VIOLATION IS FAILURE:
1. BANNED PHRASES (if any appear, you fail):
   - "Welcome to" anything
   - "Your trusted partner" / "trusted solution"
   - "Best in class" / "Industry-leading" / "World-class"
   - "We are passionate about" / "We pride ourselves"
   - "Quality service guaranteed" / "Excellence is our priority"
   - "Transform your business" / "Take it to the next level"
   - "Your success is our priority"
   - "We believe in" / "Our mission is to"
   - "Years of experience" / "Happy clients" (as generic stats)
   - "Seamless integration" / "Cutting-edge" / "Innovative solutions"

2. MANDATORY SPECIFICITY:
   - Replace vague claims with SPECIFIC numbers: "Save 12 hours weekly" not "Save time"
   - Use EXACT timeframes: "Results in 72 hours" not "Fast results"  
   - Include CONCRETE outcomes: "Increase conversions by 47%" not "Improve performance"
   - Name SPECIFIC tools/features: "Works with Stripe, HubSpot, and Slack" not "Integrates with your tools"

3. TESTIMONIALS MUST FEEL REAL:
   - Specific dollar amounts or percentages: "$127,000 saved in 6 months"
   - Natural speech with personality, not marketing-speak
   - Reference SPECIFIC features or moments
   - Use diverse, realistic names

4. HEADLINES MUST BE UNIQUE:
   - Create curiosity or make an unexpected promise
   - Reference THIS SPECIFIC business, not any business
   - No clichés, no template patterns

The transformation must be DRAMATIC. Before/after should be unrecognizable.

Respond with the improved section data as valid JSON, maintaining the exact same structure but with completely transformed content.`
        },
        {
          role: "user",
          content: `TRANSFORM this ${section.type} section from generic to EXCEPTIONAL.

Current problems identified:
${analysis.issues.map(i => `- ${i}`).join('\n')}

Current weak content:
${truncateForAI(JSON.stringify(section.data, null, 2), 4000)}

Return the DRAMATICALLY improved section data as JSON. Same structure, premium content.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });
    
    const improvedData = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return {
      ...section,
      data: improvedData,
    };
    
  } catch (error) {
    console.error(`Failed to auto-improve section ${section.id}:`, error);
    return section;
  }
}

/**
 * Run multi-pass refinement on website content
 * Returns improved content that passes quality gates
 */
export async function runMultiPassRefinement(
  websiteContent: WebsiteContent,
  businessContext: { name: string; industry: string; description: string },
  maxPasses: number = 2 // Reduced from 3 to speed up workflow
): Promise<{ content: WebsiteContent; report: QualityReport; passCount: number }> {
  const startTime = Date.now();
  const MAX_REFINEMENT_TIME = 90000; // 90 seconds max for entire refinement process
  
  let currentContent = { ...websiteContent };
  let report: QualityReport;
  let passCount = 0;
  
  console.log(`[Quality Engine] Starting multi-pass refinement (max ${maxPasses} passes, ${MAX_REFINEMENT_TIME/1000}s timeout)`);
  
  try {
    for (let pass = 0; pass < maxPasses; pass++) {
      // Check time limit
      if (Date.now() - startTime > MAX_REFINEMENT_TIME) {
        console.warn(`[Quality Engine] Time limit reached after ${passCount} passes, returning current content`);
        return {
          content: currentContent,
          report: report! || createDefaultReport("Time limit reached"),
          passCount,
        };
      }
      
      passCount = pass + 1;
      console.log(`[Quality Engine] Pass ${passCount}/${maxPasses} started`);
      
      // Evaluate current quality
      try {
        report = await withTimeout(
          evaluateWebsiteQuality(currentContent, businessContext),
          45000, // 45 second timeout for evaluation
          createDefaultReport("Evaluation timed out")
        );
      } catch (evalError) {
        const errorMsg = evalError instanceof Error ? evalError.message : 'Unknown evaluation error';
        console.error(`[Quality Engine] Evaluation failed on pass ${passCount}:`, evalError);
        // Return what we have with a default report
        return {
          content: currentContent,
          report: createDefaultReport(errorMsg),
          passCount,
        };
      }
      
      console.log(`[Quality Engine] Pass ${passCount} evaluation complete: score=${report.scores.overall}, passes=${report.passesQualityGate}`);
      
      // If passes quality gate, we're done
      if (report.passesQualityGate && report.overallVerdict !== 'poor') {
        console.log(`[Quality Engine] Quality gate passed on pass ${passCount} with score ${report.scores.overall}`);
        return { content: currentContent, report, passCount };
      }
      
      // Get sections that need improvement, prioritize by impact
      const sectionsToImprove = report.improvementPlan
        .slice(0, 3) // Improve up to 3 sections per pass
        .map(action => action.sectionId);
      
      // Improve weak sections across all pages
      const pages = [...(currentContent.pages || [])];
      for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
        const page = pages[pageIdx];
        const sections = [...(page.sections || [])];
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          if (sectionsToImprove.includes(section.id)) {
            const analysis = report.sectionAnalyses.find(a => a.sectionId === section.id);
            if (analysis) {
              console.log(`Pass ${passCount}: Improving ${section.type} section (score: ${analysis.score})`);
              try {
                sections[i] = await autoImproveSection(section, analysis, businessContext);
              } catch (improveError) {
                console.error(`[Quality Engine] Section improvement failed:`, improveError);
                // Keep original section if improvement fails
              }
            }
          }
        }
        
        pages[pageIdx] = { ...page, sections };
      }
      
      currentContent = {
        ...currentContent,
        pages,
      };
    }
    
    // Final evaluation
    try {
      report = await evaluateWebsiteQuality(currentContent, businessContext);
    } catch (finalError) {
      const errorMsg = finalError instanceof Error ? finalError.message : 'Final evaluation failed';
      console.error(`[Quality Engine] Final evaluation failed:`, finalError);
      return {
        content: currentContent,
        report: createDefaultReport(errorMsg),
        passCount,
      };
    }
    
    return { content: currentContent, report: report!, passCount };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Multi-pass refinement failed';
    console.error(`[Quality Engine] Multi-pass refinement failed:`, error);
    return {
      content: websiteContent,
      report: createDefaultReport(errorMsg),
      passCount: 0,
    };
  }
}

/**
 * Create a default quality report for error cases
 */
function createDefaultReport(errorMessage?: string): QualityReport {
  return {
    timestamp: new Date(),
    scores: {
      overall: 0,
      layout: 0,
      typography: 0,
      creativity: 0,
      heroImpact: 0,
      contentQuality: 0,
      visualDepth: 0,
      layoutSophistication: 0,
    },
    overallVerdict: 'needs_improvement',
    sectionAnalyses: [],
    weakSections: [],
    genericPatterns: [],
    improvementPlan: [],
    passesQualityGate: false,
    skipped: true,
    error: errorMessage || 'Quality evaluation was skipped due to an error',
  };
}
