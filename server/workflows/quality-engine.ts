/**
 * Quality Evaluation Engine
 * 
 * An AI-powered system that evaluates website quality across multiple dimensions:
 * - Layout quality and composition
 * - Typography hierarchy
 * - Visual depth and creativity
 * - Hero/header impact
 * - Generic pattern detection
 * 
 * This engine ensures no low-quality output is surfaced to users.
 */

import OpenAI from "openai";
import type { WebsiteContent, SectionContent, PageContent } from "@shared/schema";

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
}

export interface SectionAnalysis {
  sectionId: string;
  sectionType: string;
  score: number;
  issues: string[];
  improvements: string[];
  isWeak: boolean;        // Score < 70 = weak
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
  priority: number;
  estimatedImpact: number;
}

const QUALITY_THRESHOLDS = {
  minimum: 70,      // Minimum overall score to pass quality gate
  heroMinimum: 75,  // Hero sections need higher standards
  excellent: 90,    // Excellent quality threshold
  good: 80,         // Good quality threshold
};

const GENERIC_PATTERNS = [
  "Welcome to our website",
  "Lorem ipsum",
  "Click here to learn more",
  "We are a leading provider",
  "Your trusted partner",
  "Contact us today",
  "Quality service guaranteed",
  "Best in class",
  "One-stop solution",
  "Your success is our priority",
];

/**
 * Evaluate overall website quality using AI
 */
export async function evaluateWebsiteQuality(
  websiteContent: WebsiteContent,
  businessContext: { name: string; industry: string; description: string }
): Promise<QualityReport> {
  const client = getClient();
  
  // Analyze each section across all pages
  const sectionAnalyses: SectionAnalysis[] = [];
  const pages = websiteContent.pages || [];
  
  for (const page of pages) {
    for (const section of page.sections || []) {
      const analysis = await analyzeSectionQuality(section, businessContext, client);
      sectionAnalyses.push(analysis);
    }
  }
  
  // Calculate aggregate scores
  const scores = calculateAggregateScores(sectionAnalyses, websiteContent);
  
  // Detect generic patterns across all content
  const genericPatterns = detectGenericPatterns(websiteContent);
  
  // Identify weak sections
  const weakSections = sectionAnalyses.filter(s => s.isWeak || s.isGeneric);
  
  // Generate improvement plan
  const improvementPlan = generateImprovementPlan(weakSections, scores);
  
  // Determine overall verdict
  const overallVerdict = determineVerdict(scores);
  
  // Check if passes quality gate
  const passesQualityGate = 
    scores.overall >= QUALITY_THRESHOLDS.minimum &&
    scores.heroImpact >= QUALITY_THRESHOLDS.heroMinimum &&
    weakSections.filter(s => s.priority === 'critical').length === 0;
  
  return {
    timestamp: new Date(),
    scores,
    sectionAnalyses,
    weakSections,
    genericPatterns,
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
    const isWeak = score < 70;
    const isGeneric = result.isGeneric || hasGenericPatterns;
    
    // Determine priority based on section type and score
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (section.type === 'hero' && score < 75) priority = 'critical';
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
  scores: QualityScore
): ImprovementAction[] {
  const actions: ImprovementAction[] = [];
  
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
    
    const estimatedImpact = section.sectionType === 'hero' ? 15 : 
                           section.priority === 'high' ? 10 : 5;
    
    actions.push({
      sectionId: section.sectionId,
      actionType,
      description: section.improvements[0] || `Improve ${section.sectionType} section quality`,
      priority: priorityOrder[section.priority],
      estimatedImpact,
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
    
    // If hero is already excellent (>85), skip improvement
    if (beforeScore >= 85) {
      return { section, improved: false, beforeScore, afterScore: beforeScore };
    }
    
    console.log(`[Hero Enforcement] Hero score ${beforeScore} < 85, running specialized improvement...`);
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
          content: `You are an elite copywriter at a $50k-$100k agency. Your job is to transform generic, weak content into exceptional, conversion-focused copy.

Business: ${businessContext.name} (${businessContext.industry})
Description: ${businessContext.description}

CRITICAL RULES:
1. Never use generic phrases like "Welcome to", "Your trusted partner", "Best in class"
2. Be specific, concrete, and benefit-focused
3. Use power words that create urgency and emotion
4. Headlines should be bold, unexpected, and memorable
5. Every word must earn its place

The output must be DRAMATICALLY better than the input. If someone compared before/after, they should say "Wow, that's completely different."

Respond with the improved section data as valid JSON, maintaining the exact same structure but with transformed content.`
        },
        {
          role: "user",
          content: `Improve this ${section.type} section. Current issues: ${analysis.issues.join(', ')}

Current content:
${truncateForAI(JSON.stringify(section.data, null, 2), 4000)}

Return the improved section data as JSON (same structure, better content).`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
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
  maxPasses: number = 3
): Promise<{ content: WebsiteContent; report: QualityReport; passCount: number }> {
  let currentContent = { ...websiteContent };
  let report: QualityReport;
  let passCount = 0;
  
  try {
    for (let pass = 0; pass < maxPasses; pass++) {
      passCount = pass + 1;
      
      // Evaluate current quality
      try {
        report = await evaluateWebsiteQuality(currentContent, businessContext);
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
      
      // If passes quality gate, we're done
      if (report.passesQualityGate && report.overallVerdict !== 'poor') {
        console.log(`Quality gate passed on pass ${passCount} with score ${report.scores.overall}`);
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
