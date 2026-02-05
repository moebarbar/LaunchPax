/**
 * Workflow Engine
 * 
 * Orchestrates multi-step workflows using the connector abstraction layer.
 * Workflows are provider-agnostic - they use capabilities, not specific APIs.
 * 
 * Optimizations:
 * - Smart AI routing for cost efficiency
 * - Content caching to reduce API calls
 * - Self-healing with automatic fallbacks
 * - Workflow recovery for stuck jobs
 * - Creativity checklist validation
 */

import { connectorRegistry } from "../connectors/registry";
import { storage } from "../storage";
import type { Project, ConnectorResult } from "@shared/schema";
import { evaluateWebsiteQuality, runMultiPassRefinement, type QualityReport } from "./quality-engine";
import { aiRouter } from "../services/ai-router";
import { contentCache } from "../services/content-cache";
import { workflowRecovery } from "../services/workflow-recovery";
import { runCreativityChecklist, consolidateFonts } from "../services/creativity-checklist";

/**
 * Get the correct hero archetype for an industry
 * This is server-side enforcement to override any AI mistakes
 */
function getCorrectHeroArchetype(industry: string): string {
  const lowerIndustry = (industry || "").toLowerCase();
  
  // Cinematic - luxury, premium, high-end
  if (/luxury|premium|real estate|hotel|hospitality|resort|spa|jewelry|automotive|fashion/i.test(lowerIndustry)) {
    return "cinematic";
  }
  
  // Immersive - experience-based, events, hospitality
  if (/event|wedding|photography|travel|tourism|restaurant|food|dining|entertainment|beverage/i.test(lowerIndustry)) {
    return "immersive";
  }
  
  // Bold - startups, creative agencies, modern brands
  if (/startup|agency|creative|design|marketing|advertising|media|studio|innovation/i.test(lowerIndustry)) {
    return "bold";
  }
  
  // Editorial - portfolios, personal brands, thought leaders
  if (/portfolio|personal|consulting|author|speaker|coach|influencer|creator/i.test(lowerIndustry)) {
    return "editorial";
  }
  
  // Split - SaaS, tech, B2B, software
  if (/saas|software|tech|technology|app|platform|b2b|enterprise/i.test(lowerIndustry)) {
    return "split";
  }
  
  // Minimal - professional services, finance, legal, healthcare
  if (/legal|law|finance|banking|accounting|healthcare|medical|insurance|professional/i.test(lowerIndustry)) {
    return "minimal";
  }
  
  // Default to bold for maximum impact
  return "bold";
}

/**
 * Enforce correct hero archetype on all pages
 * This overrides any AI mistakes
 */
function enforceHeroArchetype(pages: any[], industry: string): any[] {
  const correctArchetype = getCorrectHeroArchetype(industry);
  console.log(`[Workflow] Enforcing hero archetype: "${correctArchetype}" for industry "${industry}"`);
  
  return pages.map(page => ({
    ...page,
    sections: page.sections?.map((section: any) => {
      if (section.type === "hero" && section.data) {
        const currentArchetype = section.data.heroArchetype;
        if (currentArchetype !== correctArchetype) {
          console.log(`[Workflow] Correcting heroArchetype from "${currentArchetype}" to "${correctArchetype}" on ${page.slug}`);
        }
        return {
          ...section,
          data: {
            ...section.data,
            heroArchetype: correctArchetype,
          }
        };
      }
      return section;
    })
  }));
}

export interface WorkflowContext {
  projectId: number;
  project: Project;
  jobId: number;
}

export interface WorkflowStep {
  name: string;
  execute: (ctx: WorkflowContext, prevResult?: unknown) => Promise<unknown>;
}

/**
 * Execute a workflow with progress tracking, recovery, and self-healing
 */
async function executeWorkflow(
  ctx: WorkflowContext,
  steps: WorkflowStep[],
  workflowType: string
): Promise<void> {
  workflowRecovery.startWorkflow(ctx.jobId, ctx.projectId, workflowType, steps.length);
  
  try {
    let prevResult: unknown;
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = Math.round(((i + 1) / steps.length) * 100);
      
      workflowRecovery.updateProgress(ctx.jobId, i, step.name);
      
      await storage.updateWorkflowJob(ctx.jobId, {
        status: "running",
        progress,
      });
      
      await storage.createActivityLog({
        projectId: ctx.projectId,
        action: `${workflowType}: ${step.name}`,
        status: "running",
      });
      
      let stepResult: unknown;
      let stepError: Error | null = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          stepResult = await step.execute(ctx, prevResult);
          stepError = null;
          break;
        } catch (error) {
          stepError = error instanceof Error ? error : new Error(String(error));
          retryCount++;
          
          if (retryCount < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            console.log(`[Workflow] Step "${step.name}" failed, retry ${retryCount}/${maxRetries} in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (stepError) {
        workflowRecovery.markFailed(ctx.jobId, stepError.message);
        throw stepError;
      }
      
      workflowRecovery.updateProgress(ctx.jobId, i, step.name, stepResult);
      prevResult = stepResult;
    }
    
    workflowRecovery.markCompleted(ctx.jobId);
    
    await storage.updateWorkflowJob(ctx.jobId, {
      status: "completed",
      progress: 100,
    });
    
    await storage.createActivityLog({
      projectId: ctx.projectId,
      action: `${workflowType} completed`,
      status: "completed",
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    await storage.updateWorkflowJob(ctx.jobId, {
      status: "failed",
      error: errorMessage,
    });
    
    await storage.createActivityLog({
      projectId: ctx.projectId,
      action: `${workflowType} failed`,
      details: errorMessage,
      status: "failed",
    });
    
    throw error;
  }
}

/**
 * Naming + Domain Workflow
 * 
 * Steps:
 * 1. Generate business names using AI
 * 2. Generate domain suggestions
 * 3. Check domain availability
 */
export async function runNamingDomainWorkflow(ctx: WorkflowContext): Promise<void> {
  const steps: WorkflowStep[] = [
    {
      name: "Generating business names",
      execute: async (ctx) => {
        // Start with the project name as the primary suggestion
        const projectName = ctx.project.name;
        const cleanProjectName = projectName.replace(/[^a-zA-Z0-9\s]/g, "").trim();
        
        // Generate name variations based on project name
        const baseNames: string[] = [cleanProjectName];
        
        // Add common variations
        const words = cleanProjectName.split(/\s+/);
        if (words.length > 1) {
          // Combined version (no spaces)
          baseNames.push(words.join(""));
          // First word + "HQ", "App", "Hub"
          baseNames.push(`${words[0]}HQ`);
          baseNames.push(`${words[0]}App`);
          baseNames.push(`Get${words.join("")}`);
          baseNames.push(`Try${words.join("")}`);
        } else {
          baseNames.push(`${cleanProjectName}HQ`);
          baseNames.push(`${cleanProjectName}App`);
          baseNames.push(`Get${cleanProjectName}`);
          baseNames.push(`Try${cleanProjectName}`);
          baseNames.push(`${cleanProjectName}io`);
        }
        
        // Also get AI-generated creative alternatives
        const result = await connectorRegistry.execute<any, string[]>(
          "name_generation",
          "generate_names",
          {
            businessIdea: ctx.project.businessIdea || "A new business",
            industry: ctx.project.industry,
            tone: ctx.project.tone,
            baseName: cleanProjectName,
            count: 15,
          }
        );
        
        // Combine project-based names with AI suggestions
        let allNames = [...baseNames];
        if (result.success && Array.isArray(result.data)) {
          allNames = [...baseNames, ...result.data];
        }
        
        // Remove duplicates
        const uniqueNames = [...new Set(allNames.map(n => n.toLowerCase()))];
        
        return uniqueNames.slice(0, 25);
      },
    },
    {
      name: "Generating domain suggestions",
      execute: async (ctx, names) => {
        const result = await connectorRegistry.execute<any, Array<{ name: string; domain: string; tld: string }>>(
          "domain_check",
          "generate_domain_suggestions",
          {
            names: names as string[],
            tlds: [".com", ".io", ".co", ".ai", ".app"],
          }
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to generate domain suggestions");
        }
        
        return { names, domainSuggestions: result.data };
      },
    },
    {
      name: "Checking domain availability",
      execute: async (ctx, prevResult) => {
        const { names, domainSuggestions } = prevResult as {
          names: string[];
          domainSuggestions: Array<{ name: string; domain: string; tld: string }>;
        };
        
        const domains = domainSuggestions.map(s => s.domain);
        
        const result = await connectorRegistry.execute<any, any[]>(
          "domain_check",
          "check_domains",
          { domains }
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to check domains");
        }
        
        // Save results
        await storage.upsertNamingResult({
          projectId: ctx.projectId,
          candidates: names,
          domainCandidates: domainSuggestions,
          availableDomains: result.data,
          providerUsed: result.provider,
          status: "completed",
        });
        
        return result.data;
      },
    },
  ];
  
  await executeWorkflow(ctx, steps, "Naming & Domain");
}

/**
 * Brand Kit Generation Workflow
 */
export async function runBrandKitWorkflow(ctx: WorkflowContext): Promise<void> {
  const steps: WorkflowStep[] = [
    {
      name: "Generating brand identity",
      execute: async (ctx) => {
        // Get naming result if available
        const namingResult = await storage.getNamingResult(ctx.projectId);
        const businessName = namingResult?.selectedDomain?.replace(/\.[^.]+$/, "") || ctx.project.name;
        
        const result = await connectorRegistry.execute<any, any>(
          "brand_generation",
          "generate_brand_kit",
          {
            businessName,
            businessIdea: ctx.project.businessIdea || "A new business",
            industry: ctx.project.industry,
            tone: ctx.project.tone,
            targetAudience: ctx.project.targetAudience,
          }
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to generate brand kit");
        }
        
        // Save results
        await storage.upsertBrandKit({
          projectId: ctx.projectId,
          brandVoice: result.data.brandVoice,
          taglines: result.data.taglines,
          colorPalette: result.data.colorPalette,
          fontPairings: result.data.fontPairings,
          messagingPillars: result.data.messagingPillars,
          elevatorPitch: result.data.elevatorPitch,
          providerUsed: result.provider,
          status: "completed",
        });
        
        return result.data;
      },
    },
  ];
  
  await executeWorkflow(ctx, steps, "Brand Kit");
}

/**
 * Website Content Generation Workflow
 */
export async function runWebsitePlanWorkflow(ctx: WorkflowContext): Promise<void> {
  const steps: WorkflowStep[] = [
    {
      name: "Generating website content",
      execute: async (ctx) => {
        const namingResult = await storage.getNamingResult(ctx.projectId);
        const brandKit = await storage.getBrandKit(ctx.projectId);
        
        const businessName = namingResult?.selectedDomain?.replace(/\.[^.]+$/, "") || ctx.project.name;
        
        const result = await connectorRegistry.execute<any, any>(
          "content_generation",
          "generate_website_content",
          {
            businessName,
            businessIdea: ctx.project.businessIdea || "A new business",
            industry: ctx.project.industry,
            tone: ctx.project.tone,
            brandVoice: brandKit?.brandVoice,
            targetAudience: ctx.project.targetAudience,
            location: ctx.project.location,
            pages: ["home", "about", "services", "contact"],
            businessProfile: ctx.project.businessProfile,
          }
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to generate website content");
        }
        
        // Apply brand kit colors if available - map by usage role
        const palette = brandKit?.colorPalette || [];
        
        // Intelligently map colors based on their usage descriptions
        const findColorByUsage = (keywords: string[]): string | undefined => {
          for (const color of palette) {
            const usage = (color.usage || "").toLowerCase();
            if (keywords.some(k => usage.includes(k))) {
              return color.hex;
            }
          }
          return undefined;
        };
        
        // Map colors based on their intended usage
        const backgroundColor = findColorByUsage(["background", "subtle"]) || palette[0]?.hex;
        const primaryColor = findColorByUsage(["primary", "text color", "main"]) || palette[2]?.hex;
        const secondaryColor = findColorByUsage(["secondary", "highlight", "icon"]) || palette[1]?.hex;
        const accentColor = findColorByUsage(["accent", "attention", "cta", "button"]) || palette[3]?.hex;
        const surfaceColor = findColorByUsage(["surface", "card", "border"]) || palette[4]?.hex || palette[0]?.hex;
        
        // Determine if this is a light or dark color scheme based on background luminance
        const hexToLuminance = (hex: string): number => {
          const rgb = parseInt(hex.replace("#", ""), 16);
          const r = (rgb >> 16) & 255;
          const g = (rgb >> 8) & 255;
          const b = rgb & 255;
          return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        };
        
        const bgLuminance = backgroundColor ? hexToLuminance(backgroundColor) : 0.5;
        const colorScheme = bgLuminance > 0.5 ? "light" : "dark";
        
        const siteSettings = {
          ...result.data.siteSettings,
          backgroundColor,
          primaryColor,
          secondaryColor,
          accentColor,
          surfaceColor,
          textColor: colorScheme === "light" ? primaryColor : "#FFFFFF",
          colorScheme,
          fontFamily: brandKit?.fontPairings?.[0]?.body,
          headingFont: brandKit?.fontPairings?.[0]?.heading,
        };
        
        // Enforce correct hero archetype based on industry (server-side override)
        const enforcedPages = enforceHeroArchetype(result.data.pages, ctx.project.industry || "");
        
        // Build preliminary content for validation
        let websiteData = {
          pages: enforcedPages,
          globalContent: result.data.globalContent,
          siteSettings,
          seo: result.data.seo,
        };
        
        // Run creativity checklist with auto-fix enabled
        const checklistReport = runCreativityChecklist(websiteData, ctx.project.industry || "", true);
        console.log(`[Workflow] Creativity checklist: score=${checklistReport.score}%, passed=${checklistReport.passed}`);
        if (checklistReport.fixes.length > 0) {
          console.log(`[Workflow] Auto-fixes applied: ${checklistReport.fixes.join(", ")}`);
        }
        
        // Consolidate fonts to max 6 for performance
        const { content: fontOptimized, removed: removedFonts } = consolidateFonts(websiteData, 6);
        if (removedFonts.length > 0) {
          console.log(`[Workflow] Removed ${removedFonts.length} excess fonts for performance: ${removedFonts.join(", ")}`);
        }
        websiteData = fontOptimized;
        
        // Save results including SEO data
        await storage.upsertWebsiteContent({
          projectId: ctx.projectId,
          pages: websiteData.pages,
          globalContent: websiteData.globalContent,
          siteSettings: websiteData.siteSettings,
          seo: websiteData.seo,
          providerUsed: result.provider,
          status: "completed",
        });
        
        // Cache the result for future reference
        contentCache.setWebsiteContent(ctx.projectId, ctx.project, websiteData);
        
        return { ...result.data, pages: websiteData.pages, checklistReport };
      },
    },
    {
      name: "Generating hero image and logo",
      execute: async (ctx) => {
        const namingResult = await storage.getNamingResult(ctx.projectId);
        const brandKit = await storage.getBrandKit(ctx.projectId);
        const websiteContent = await storage.getWebsiteContent(ctx.projectId);
        
        const businessName = namingResult?.selectedDomain?.replace(/\.[^.]+$/, "") || ctx.project.name;
        const brandColors = brandKit?.colorPalette?.map(c => c.hex) || [];
        const primaryColor = brandColors[0] || websiteContent?.siteSettings?.primaryColor || "#4F46E5";
        
        // Generate hero image - prefer Google Studio for stunning AI graphics
        console.log("[Multi-AI] Using Google Studio for hero image generation");
        const heroResult = await connectorRegistry.execute<any, { b64_json?: string; url?: string }>(
          "image_generation",
          "generate_hero_image",
          {
            businessName,
            businessIdea: ctx.project.businessIdea || "A new business",
            industry: ctx.project.industry || "technology",
            style: "cinematic professional",
            brandColors: { primary: primaryColor },
          },
          { preferredConnector: "nanobanana" }
        );
        
        // Generate logo - prefer Google Studio for excellent text rendering
        console.log("[Multi-AI] Using Google Studio for logo generation");
        const logoResult = await connectorRegistry.execute<any, { b64_json?: string; url?: string }>(
          "image_generation",
          "generate_logo",
          {
            businessName,
            industry: ctx.project.industry || "technology",
            style: "minimal modern",
            brandColors: { primary: primaryColor },
          },
          { preferredConnector: "nanobanana" }
        );
        
        // Update website content with generated images
        let heroImageB64 = heroResult.success ? heroResult.data?.b64_json : undefined;
        let heroImageUrl: string | undefined = undefined;
        const logoImageB64 = logoResult.success ? logoResult.data?.b64_json : undefined;
        
        // Fallback to stock photos if AI generation failed
        if (!heroImageB64) {
          console.log(`[Workflow] AI hero image failed, falling back to stock photos for ${ctx.project.industry || "business"}`);
          const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
            "stock_photos",
            "get_photo_for_industry",
            {
              industry: ctx.project.industry || "business",
              type: "hero",
              businessIdea: ctx.project.businessIdea || "",
            }
          );
          
          if (stockResult.success && stockResult.data?.photos?.length > 0) {
            heroImageUrl = stockResult.data.photos[0].url;
            console.log(`[Workflow] Using stock photo for hero: ${heroImageUrl}`);
          }
        }
        
        if (websiteContent && (heroImageB64 || heroImageUrl || logoImageB64)) {
          const updatedPages = websiteContent.pages?.map((page: any) => {
            if (page.slug === "home") {
              return {
                ...page,
                sections: page.sections?.map((section: any) => {
                  if (section.type === "hero") {
                    if (heroImageB64) {
                      return {
                        ...section,
                        data: {
                          ...section.data,
                          backgroundImageB64: heroImageB64,
                        },
                      };
                    } else if (heroImageUrl) {
                      return {
                        ...section,
                        data: {
                          ...section.data,
                          backgroundImage: heroImageUrl,
                        },
                      };
                    }
                  }
                  return section;
                }),
              };
            }
            return page;
          });
          
          const updatedGlobalContent = {
            ...websiteContent.globalContent,
            ...(logoImageB64 && {
              logoB64: logoImageB64,
            }),
          };
          
          await storage.upsertWebsiteContent({
            projectId: ctx.projectId,
            pages: updatedPages,
            globalContent: updatedGlobalContent,
            siteSettings: websiteContent.siteSettings,
            seo: websiteContent.seo,
            providerUsed: heroResult.provider || logoResult.provider || "stock",
            status: "completed",
          });
        }
        
        return { 
          heroGenerated: heroResult.success, 
          heroStockPhoto: !!heroImageUrl, 
          logoGenerated: logoResult.success 
        };
      },
    },
    {
      name: "Enhancing content with Claude storytelling",
      execute: async (ctx) => {
        const websiteContent = await storage.getWebsiteContent(ctx.projectId);
        if (!websiteContent) {
          console.log("[Multi-AI] No website content to enhance");
          return { skipped: true };
        }
        
        const businessName = ctx.project.name;
        const industry = ctx.project.industry || "business";
        const businessIdea = ctx.project.businessIdea || "";
        
        // Try to use LaunchPax Engine for cost-effective About page storytelling
        console.log("[Multi-AI] Using LaunchPax Engine for rich About page storytelling");
        const claudeResult = await connectorRegistry.execute<any, { content: string; title: string; summary: string }>(
          "long_form_content",
          "generate_long_form_content",
          {
            topic: `The story of ${businessName}: ${businessIdea}`,
            businessName,
            industry,
            contentType: "about_page",
            wordCount: 400,
            tone: ctx.project.tone || "professional and engaging",
          },
          { preferredConnector: "launchpax" }
        );
        
        if (claudeResult.success && claudeResult.data) {
          console.log("[Multi-AI] LaunchPax Engine generated enhanced About page content");
          
          // Find and enhance the About page text section
          const updatedPages = websiteContent.pages?.map((page: any) => {
            if (page.slug === "about") {
              return {
                ...page,
                sections: page.sections?.map((section: any) => {
                  if (section.type === "text" || section.type === "story") {
                    return {
                      ...section,
                      data: {
                        ...section.data,
                        headline: claudeResult.data.title || section.data.headline,
                        content: claudeResult.data.content || section.data.content,
                        paragraphs: claudeResult.data.content?.split('\n\n').filter((p: string) => p.trim()) || section.data.paragraphs,
                      },
                    };
                  }
                  return section;
                }),
              };
            }
            return page;
          });
          
          // Save enhanced content
          await storage.upsertWebsiteContent({
            projectId: ctx.projectId,
            pages: updatedPages,
            globalContent: websiteContent.globalContent,
            siteSettings: websiteContent.siteSettings,
            seo: websiteContent.seo,
            providerUsed: "claude+openai",
            status: "completed",
          });
          
          return { enhanced: true, provider: "claude" };
        }
        
        console.log("[Multi-AI] Claude enhancement skipped, using GPT-4o content");
        return { enhanced: false, reason: claudeResult.error || "Claude not available" };
      },
    },
    {
      name: "Quality evaluation & refinement",
      execute: async (ctx) => {
        const websiteContent = await storage.getWebsiteContent(ctx.projectId);
        if (!websiteContent) {
          console.log("[Quality Engine] No website content to evaluate");
          return { skipped: true };
        }
        
        const businessContext = {
          name: ctx.project.name,
          industry: ctx.project.industry || "general",
          description: ctx.project.businessIdea || ctx.project.name,
        };
        
        try {
          // Run multi-pass refinement (up to 3 passes)
          console.log("[Quality Engine] Starting quality evaluation and refinement...");
          const { content: improvedContent, report, passCount } = await runMultiPassRefinement(
            websiteContent,
            businessContext,
            3 // Max 3 refinement passes
          );
          
          console.log(`[Quality Engine] Completed in ${passCount} passes. Overall score: ${report.scores.overall}`);
          console.log(`[Quality Engine] Verdict: ${report.overallVerdict}. Passes gate: ${report.passesQualityGate}`);
          
          // Save the improved content
          if (improvedContent.pages && improvedContent.pages !== websiteContent.pages) {
            await storage.upsertWebsiteContent({
              projectId: ctx.projectId,
              pages: improvedContent.pages,
              globalContent: improvedContent.globalContent,
              siteSettings: improvedContent.siteSettings,
              seo: improvedContent.seo,
              providerUsed: websiteContent.providerUsed,
              status: "completed",
            });
            console.log("[Quality Engine] Saved improved website content");
          }
          
          // Store quality report in activity log for transparency
          await storage.createActivityLog({
            projectId: ctx.projectId,
            action: "Quality evaluation completed",
            details: JSON.stringify({
              scores: report.scores,
              verdict: report.overallVerdict,
              passesGate: report.passesQualityGate,
              passCount,
              weakSectionsCount: report.weakSections.length,
              genericPatterns: report.genericPatterns,
            }),
            status: "completed",
          });
          
          return {
            scores: report.scores,
            verdict: report.overallVerdict,
            passesGate: report.passesQualityGate,
            passCount,
            sectionsImproved: report.improvementPlan.length,
          };
        } catch (error) {
          // Log error but don't fail the entire workflow - original content is still valid
          console.error("[Quality Engine] Error during quality evaluation:", error);
          
          await storage.createActivityLog({
            projectId: ctx.projectId,
            action: "Quality evaluation completed",
            details: JSON.stringify({
              scores: { overall: 0, layout: 0, typography: 0, creativity: 0, heroImpact: 0, contentQuality: 0, visualDepth: 0 },
              verdict: "needs_improvement",
              passesGate: false,
              passCount: 0,
              weakSectionsCount: 0,
              genericPatterns: [],
              skipped: true,
              error: error instanceof Error ? error.message : "Unknown error",
            }),
            status: "completed",
          });
          
          return {
            skipped: true,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    },
    {
      name: "Auto-filling ALL missing images with business-specific stock photos",
      execute: async (ctx) => {
        const websiteContent = await storage.getWebsiteContent(ctx.projectId);
        if (!websiteContent || !websiteContent.pages) {
          console.log("[Image Auto-Fill] No website content to process");
          return { skipped: true };
        }
        
        const industry = ctx.project.industry || "business";
        const businessIdea = ctx.project.businessIdea || "";
        const businessProfile = ctx.project.businessProfile;
        let imagesAdded = 0;
        let heroesUpdated = 0;
        let testimonialsUpdated = 0;
        let servicesUpdated = 0;
        let storyUpdated = 0;
        let processUpdated = 0;
        
        console.log(`[Image Auto-Fill] Processing ALL sections for ${industry} business...`);
        
        // Extract business-specific keywords for highly targeted image searches
        const extractBusinessKeywords = (): string[] => {
          const keywords: string[] = [];
          
          // Extract cuisine type from businessIdea
          const cuisinePatterns = [
            /mediterranean/i, /italian/i, /american/i, /mexican/i, /asian/i, /chinese/i,
            /japanese/i, /indian/i, /thai/i, /french/i, /greek/i, /middle eastern/i,
            /seafood/i, /barbecue/i, /bbq/i, /vegan/i, /vegetarian/i, /fusion/i,
            /sushi/i, /pizza/i, /burger/i, /steak/i, /cafe/i, /bakery/i, /pastry/i
          ];
          for (const pattern of cuisinePatterns) {
            const match = businessIdea.match(pattern);
            if (match) keywords.push(match[0].toLowerCase());
          }
          
          // Extract location for local context
          const locationMatch = businessIdea.match(/(?:in|at|located in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
          if (locationMatch) keywords.push(locationMatch[1].toLowerCase());
          
          // Extract key services/products
          const servicePatterns = [
            /dine-in/i, /takeout/i, /delivery/i, /catering/i, /brunch/i, /lunch/i, /dinner/i,
            /consultation/i, /training/i, /coaching/i, /therapy/i, /treatment/i
          ];
          for (const pattern of servicePatterns) {
            const match = businessIdea.match(pattern);
            if (match) keywords.push(match[0].toLowerCase());
          }
          
          // Add services from businessProfile
          if (businessProfile?.services) {
            businessProfile.services.slice(0, 3).forEach((s: any) => {
              if (s.name) keywords.push(s.name.toLowerCase().replace(/^\d+\.\s*/, ''));
            });
          }
          
          // Add USPs
          if (businessProfile?.uniqueSellingPoints) {
            businessProfile.uniqueSellingPoints.slice(0, 2).forEach((usp: string) => {
              const words = usp.toLowerCase().split(' ').filter(w => w.length > 4).slice(0, 2);
              keywords.push(...words);
            });
          }
          
          return [...new Set(keywords)].slice(0, 5); // Max 5 unique keywords
        };
        
        const businessKeywords = extractBusinessKeywords();
        console.log(`[Image Auto-Fill] Extracted business keywords: ${businessKeywords.join(", ")}`);
        
        // Build highly specific queries using business context
        const buildBusinessSpecificQuery = (baseQuery: string, sectionType: string): string => {
          // For restaurant/food businesses, use cuisine-specific terms
          if (businessKeywords.some(k => ["mediterranean", "italian", "american", "mexican", "asian", "fusion", "greek", "middle eastern"].includes(k))) {
            const cuisineKeyword = businessKeywords.find(k => 
              ["mediterranean", "italian", "american", "mexican", "asian", "fusion", "greek", "middle eastern"].includes(k)
            );
            if (cuisineKeyword && sectionType !== "team" && sectionType !== "testimonials") {
              return `${cuisineKeyword} ${baseQuery}`.trim();
            }
          }
          
          // Add first relevant keyword if available
          const relevantKeyword = businessKeywords.find(k => !["dine-in", "takeout", "delivery"].includes(k));
          if (relevantKeyword && sectionType !== "team" && sectionType !== "testimonials") {
            return `${relevantKeyword} ${baseQuery}`.trim();
          }
          
          return baseQuery;
        };
        
        // Section type to image query mapping with business-specific enhancements
        const sectionImageQueries: Record<string, (ind: string, keywords: string[]) => string[]> = {
          hero: (ind, keywords) => {
            const cuisineKeyword = keywords.find(k => 
              ["mediterranean", "italian", "american", "mexican", "asian", "fusion", "greek", "middle eastern", "seafood", "sushi", "pizza", "bakery"].includes(k)
            );
            
            const heroQueries: Record<string, string[]> = {
              restaurant: cuisineKeyword 
                ? [`${cuisineKeyword} cuisine plating professional`, `${cuisineKeyword} food presentation`, `${cuisineKeyword} restaurant dining`, `delicious ${cuisineKeyword} dishes`]
                : ["gourmet food plating professional", "restaurant dining ambiance elegant", "chef cooking kitchen", "delicious food presentation"],
              food: cuisineKeyword
                ? [`${cuisineKeyword} food photography`, `appetizing ${cuisineKeyword} dishes`, `professional ${cuisineKeyword} cuisine`]
                : ["appetizing food professional photography", "gourmet cuisine presentation", "chef cooking kitchen professional"],
              technology: ["modern tech office workspace", "software engineering team collaboration", "digital innovation startup", "technology workspace modern"],
              healthcare: ["healthcare professional caring patient", "modern medical facility clean", "wellness health clinic", "doctor patient consultation"],
              consulting: ["executive business strategy meeting", "corporate office professional", "business consulting team", "professional boardroom meeting"],
              fitness: ["fitness gym modern equipment", "personal training session", "active healthy lifestyle workout", "sports training athlete"],
              beauty: ["luxury spa treatment relaxation", "beauty salon professional", "skincare wellness", "beauty treatment professional"],
              realestate: ["luxury home interior design", "modern architecture house", "beautiful property exterior", "real estate staging professional"],
              ecommerce: ["product photography studio professional", "ecommerce packaging modern", "online shopping experience", "retail store design"],
              education: ["university classroom learning", "students studying campus", "education teaching professional", "academic library environment"],
              legal: ["law office interior professional", "legal meeting boardroom", "attorney professional portrait", "courthouse architecture"],
              creative: ["creative design studio modern", "artistic workspace colorful", "design team brainstorming", "photography studio professional"],
              marketing: ["marketing team meeting creative", "digital marketing agency", "brand strategy presentation", "advertising campaign"],
              finance: ["financial planning meeting", "banking professional office", "investment trading modern", "wealth management"],
            };
            return heroQueries[ind.toLowerCase()] || heroQueries.consulting;
          },
          
          services: (ind, keywords) => {
            const cuisineKeyword = keywords.find(k => ["mediterranean", "italian", "american", "mexican", "asian", "fusion"].includes(k));
            if (ind === "restaurant" && cuisineKeyword) {
              return [`${cuisineKeyword} food service`, `${cuisineKeyword} cuisine dish`, `${cuisineKeyword} meal presentation`, "restaurant service professional"];
            }
            return [`${ind} professional service`, `${ind} business offering`, "service delivery professional", "professional service team"];
          },
          
          testimonials: () => [
            "professional business portrait confident", 
            "diverse professional headshot", 
            "customer portrait smiling professional",
            "business person portrait friendly",
            "professional headshot diverse"
          ],
          
          team: () => [
            "professional team portrait business", 
            "corporate headshot professional diverse", 
            "business team diverse workplace",
            "professional portrait confident",
            "executive portrait professional"
          ],
          
          story: (ind, keywords) => {
            const cuisineKeyword = keywords.find(k => ["mediterranean", "italian", "american", "mexican"].includes(k));
            if (ind === "restaurant" && cuisineKeyword) {
              return [`${cuisineKeyword} cooking tradition`, `${cuisineKeyword} food preparation`, "restaurant kitchen professional", "chef cooking passion"];
            }
            return [`${ind} company story`, `${ind} business origin`, "founder entrepreneur vision", "company milestone achievement"];
          },
          
          "brand-story": () => [
            "entrepreneur founder portrait", 
            "business owner professional", 
            "company founder vision",
            "startup founder passionate"
          ],
          
          "case-studies": (ind) => [
            `${ind} success project`, 
            `${ind} completed work`, 
            `${ind} results achievement`,
            "business success results"
          ],
          
          gallery: (ind, keywords) => {
            const cuisineKeyword = keywords.find(k => ["mediterranean", "italian", "american", "mexican", "asian", "fusion", "seafood", "sushi", "pizza", "bakery"].includes(k));
            if (ind === "restaurant" && cuisineKeyword) {
              return [`${cuisineKeyword} food photography`, `${cuisineKeyword} dish presentation`, `${cuisineKeyword} cuisine plating`, `delicious ${cuisineKeyword} meal`];
            }
            return [`${ind} portfolio showcase`, `${ind} work professional`, `${ind} gallery images`, "professional portfolio work"];
          },
          
          process: (ind) => [
            `${ind} workflow process`, 
            "step by step professional", 
            "business process visualization",
            "workflow diagram professional"
          ],
          
          about: (ind) => [
            `${ind} team workplace`, 
            `${ind} company office`, 
            "professional team collaboration",
            "workplace environment modern"
          ],
          
          contact: () => [
            "customer service professional friendly", 
            "contact communication business", 
            "support team helpful",
            "business communication professional"
          ],
          
          stats: (ind) => [
            `${ind} success metrics`, 
            "business growth chart", 
            "achievement milestone professional"
          ],
          
          benefits: (ind) => [
            `${ind} benefits value`, 
            "customer satisfaction happy", 
            "business value professional"
          ],
          
          faq: () => [
            "customer support helpful", 
            "questions answers professional", 
            "help support friendly"
          ],
          
          cta: (ind) => [
            `${ind} call to action`, 
            "get started professional", 
            "contact us inviting"
          ],
          
          comparison: (ind) => [
            `${ind} comparison chart`, 
            "value proposition professional", 
            "competitive advantage"
          ],
          
          pricing: (ind) => [
            `${ind} pricing value`, 
            "investment value professional", 
            "premium service pricing"
          ],
          
          "trust-signals": () => [
            "business awards professional", 
            "certification achievement", 
            "trust credibility professional"
          ],
        };
        
        // Normalize industry for lookup
        const normalizedIndustry = industry.toLowerCase().includes("food") || 
                                    industry.toLowerCase().includes("restaurant") || 
                                    industry.toLowerCase().includes("beverage") ||
                                    industry.toLowerCase().includes("dining") ||
                                    industry.toLowerCase().includes("cafe") ||
                                    industry.toLowerCase().includes("bakery") ||
                                    industry.toLowerCase().includes("catering")
                                    ? "restaurant" 
                                    : industry.toLowerCase().replace(/[^a-z]/g, "");
        
        console.log(`[Image Auto-Fill] Normalized industry: ${normalizedIndustry}`);
        
        // Process each page and section
        const updatedPages = await Promise.all(websiteContent.pages.map(async (page: any) => {
          const updatedSections = await Promise.all(page.sections.map(async (section: any) => {
            // Check if section needs an image
            const sectionType = section.type;
            const hasImage = section.data?.backgroundImage || 
                             section.data?.backgroundImageB64 || 
                             section.data?.image || 
                             section.data?.imageUrl;
            
            // Helper to get a random query from a query function
            const getRandomQuery = (queryFn: (ind: string, keywords: string[]) => string[]): string => {
              const queries = queryFn(normalizedIndustry, businessKeywords);
              return queries[Math.floor(Math.random() * queries.length)];
            };
            
            // Hero sections MUST have an image
            if (sectionType === "hero" && !hasImage) {
              console.log(`[Image Auto-Fill] Hero section "${section.id}" on ${page.slug} needs image`);
              
              const query = getRandomQuery(sectionImageQueries.hero);
              console.log(`[Image Auto-Fill] Hero query: "${query}"`);
              
              const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                "stock_photos",
                "search_photos",
                {
                  query,
                  perPage: 3,
                  orientation: "landscape",
                  size: "large",
                }
              );
              
              if (stockResult.success && stockResult.data?.photos?.length > 0) {
                const photo = stockResult.data.photos[0];
                console.log(`[Image Auto-Fill] Added hero image: ${photo.url}`);
                heroesUpdated++;
                return {
                  ...section,
                  data: {
                    ...section.data,
                    backgroundImage: photo.url,
                  },
                };
              }
            }
            
            // Testimonials sections need avatar photos
            if (sectionType === "testimonials" && section.data?.items) {
              const updatedItems = await Promise.all(section.data.items.map(async (item: any, idx: number) => {
                if (!item.avatar && !item.image) {
                  const query = getRandomQuery(sectionImageQueries.testimonials);
                  
                  const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                    "stock_photos",
                    "search_photos",
                    { query, perPage: 1, page: idx + 1, orientation: "square" }
                  );
                  
                  if (stockResult.success && stockResult.data?.photos?.length > 0) {
                    imagesAdded++;
                    testimonialsUpdated++;
                    return { ...item, avatar: stockResult.data.photos[0].url };
                  }
                }
                return item;
              }));
              
              if (testimonialsUpdated > 0) {
                console.log(`[Image Auto-Fill] Added ${testimonialsUpdated} testimonial avatars`);
              }
              return { ...section, data: { ...section.data, items: updatedItems } };
            }
            
            // Services sections can have images
            if (sectionType === "services" && section.data?.items) {
              const updatedItems = await Promise.all(section.data.items.map(async (item: any, idx: number) => {
                if (!item.image && !item.imageUrl) {
                  const query = getRandomQuery(sectionImageQueries.services);
                  
                  const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                    "stock_photos",
                    "search_photos",
                    { query, perPage: 1, page: idx + 1, orientation: "square" }
                  );
                  
                  if (stockResult.success && stockResult.data?.photos?.length > 0) {
                    imagesAdded++;
                    servicesUpdated++;
                    return { ...item, image: stockResult.data.photos[0].url };
                  }
                }
                return item;
              }));
              
              if (servicesUpdated > 0) {
                console.log(`[Image Auto-Fill] Added ${servicesUpdated} service images`);
              }
              return { ...section, data: { ...section.data, items: updatedItems } };
            }
            
            // Story and brand-story sections need images
            if ((sectionType === "story" || sectionType === "brand-story") && !hasImage) {
              const queryFn = sectionType === "brand-story" ? sectionImageQueries["brand-story"] : sectionImageQueries.story;
              const query = getRandomQuery(queryFn);
              
              const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                "stock_photos",
                "search_photos",
                { query, perPage: 1, orientation: "landscape" }
              );
              
              if (stockResult.success && stockResult.data?.photos?.length > 0) {
                imagesAdded++;
                storyUpdated++;
                console.log(`[Image Auto-Fill] Added story section image`);
                return {
                  ...section,
                  data: {
                    ...section.data,
                    image: stockResult.data.photos[0].url,
                    founderImage: sectionType === "brand-story" ? stockResult.data.photos[0].url : section.data?.founderImage,
                  },
                };
              }
            }
            
            // About sections need images
            if (sectionType === "about" && !hasImage) {
              const query = getRandomQuery(sectionImageQueries.about);
              
              const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                "stock_photos",
                "search_photos",
                { query, perPage: 1, orientation: "landscape" }
              );
              
              if (stockResult.success && stockResult.data?.photos?.length > 0) {
                imagesAdded++;
                console.log(`[Image Auto-Fill] Added about section image`);
                return {
                  ...section,
                  data: { ...section.data, image: stockResult.data.photos[0].url },
                };
              }
            }
            
            // Gallery sections need images
            if (sectionType === "gallery" && section.data?.items) {
              const updatedItems = await Promise.all(section.data.items.map(async (item: any, idx: number) => {
                if (!item.image && !item.imageUrl) {
                  const query = getRandomQuery(sectionImageQueries.gallery);
                  
                  const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                    "stock_photos",
                    "search_photos",
                    { query, perPage: 1, page: idx + 1, orientation: "square" }
                  );
                  
                  if (stockResult.success && stockResult.data?.photos?.length > 0) {
                    imagesAdded++;
                    return { ...item, image: stockResult.data.photos[0].url };
                  }
                }
                return item;
              }));
              
              return { ...section, data: { ...section.data, items: updatedItems } };
            }
            
            // Team sections need member photos
            if (sectionType === "team" && section.data?.members) {
              const updatedMembers = await Promise.all(section.data.members.map(async (member: any, idx: number) => {
                if (!member.image && !member.avatar) {
                  const query = getRandomQuery(sectionImageQueries.team);
                  
                  const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                    "stock_photos",
                    "search_photos",
                    { query, perPage: 1, page: idx + 1, orientation: "square" }
                  );
                  
                  if (stockResult.success && stockResult.data?.photos?.length > 0) {
                    imagesAdded++;
                    return { ...member, image: stockResult.data.photos[0].url };
                  }
                }
                return member;
              }));
              
              return { ...section, data: { ...section.data, members: updatedMembers } };
            }
            
            // Case studies need images
            if (sectionType === "case-studies" && section.data?.items) {
              const updatedItems = await Promise.all(section.data.items.map(async (item: any, idx: number) => {
                if (!item.image && !item.imageUrl) {
                  const query = getRandomQuery(sectionImageQueries["case-studies"]);
                  
                  const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                    "stock_photos",
                    "search_photos",
                    { query, perPage: 1, page: idx + 1, orientation: "landscape" }
                  );
                  
                  if (stockResult.success && stockResult.data?.photos?.length > 0) {
                    imagesAdded++;
                    return { ...item, image: stockResult.data.photos[0].url };
                  }
                }
                return item;
              }));
              
              return { ...section, data: { ...section.data, items: updatedItems } };
            }
            
            // Process sections can have step images
            if (sectionType === "process" && section.data?.steps) {
              let stepsWithImages = 0;
              const updatedSteps = await Promise.all(section.data.steps.map(async (step: any, idx: number) => {
                if (!step.image) {
                  const query = getRandomQuery(sectionImageQueries.process);
                  
                  const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
                    "stock_photos",
                    "search_photos",
                    { query, perPage: 1, page: idx + 1, orientation: "square" }
                  );
                  
                  if (stockResult.success && stockResult.data?.photos?.length > 0) {
                    imagesAdded++;
                    stepsWithImages++;
                    return { ...step, image: stockResult.data.photos[0].url };
                  }
                }
                return step;
              }));
              
              if (stepsWithImages > 0) {
                processUpdated++;
                console.log(`[Image Auto-Fill] Added ${stepsWithImages} process step images`);
              }
              return { ...section, data: { ...section.data, steps: updatedSteps } };
            }
            
            return section;
          }));
          
          return { ...page, sections: updatedSections };
        }));
        
        // Save updated content
        await storage.upsertWebsiteContent({
          projectId: ctx.projectId,
          pages: updatedPages,
          globalContent: websiteContent.globalContent,
          siteSettings: websiteContent.siteSettings,
          seo: websiteContent.seo,
          providerUsed: websiteContent.providerUsed,
          status: "completed",
        });
        
        console.log(`[Image Auto-Fill] Complete: ${heroesUpdated} heroes, ${testimonialsUpdated} testimonials, ${servicesUpdated} services, ${storyUpdated} story, ${processUpdated} process sections, ${imagesAdded} total images added`);
        
        return {
          heroesUpdated,
          testimonialsUpdated,
          servicesUpdated,
          storyUpdated,
          processUpdated,
          imagesAdded,
          industry: normalizedIndustry,
          businessKeywords,
        };
      },
    },
  ];
  
  await executeWorkflow(ctx, steps, "Website Plan");
}

/**
 * Graphics Generation Workflow - includes hero image and logo generation
 */
export async function runGraphicsWorkflow(ctx: WorkflowContext): Promise<void> {
  const steps: WorkflowStep[] = [
    {
      name: "Generating hero image and logo",
      execute: async (ctx) => {
        const namingResult = await storage.getNamingResult(ctx.projectId);
        const brandKit = await storage.getBrandKit(ctx.projectId);
        const websiteContent = await storage.getWebsiteContent(ctx.projectId);
        
        const businessName = namingResult?.selectedDomain?.replace(/\.[^.]+$/, "") || ctx.project.name;
        const brandColors = brandKit?.colorPalette?.map(c => c.hex) || [];
        const primaryColor = brandColors[0] || "#4F46E5";
        
        // Generate hero image - prefer Google Studio for stunning AI graphics
        console.log("[Multi-AI Quick] Using Google Studio for hero image");
        const heroResult = await connectorRegistry.execute<any, { b64_json?: string; url?: string }>(
          "image_generation",
          "generate_hero_image",
          {
            businessName,
            businessIdea: ctx.project.businessIdea || "A new business",
            industry: ctx.project.industry || "technology",
            style: "cinematic professional",
            brandColors: { primary: primaryColor },
          },
          { preferredConnector: "nanobanana" }
        );
        
        // Generate logo - prefer Google Studio for excellent text rendering
        console.log("[Multi-AI Quick] Using Google Studio for logo");
        const logoResult = await connectorRegistry.execute<any, { b64_json?: string; url?: string }>(
          "image_generation",
          "generate_logo",
          {
            businessName,
            industry: ctx.project.industry || "technology",
            style: "minimal modern",
            brandColors: { primary: primaryColor },
          },
          { preferredConnector: "nanobanana" }
        );
        
        // Update website content with generated images
        let heroImageB64 = heroResult.success ? heroResult.data?.b64_json : undefined;
        let heroImageUrl: string | undefined = undefined;
        const logoImageB64 = logoResult.success ? logoResult.data?.b64_json : undefined;
        
        // Fallback to stock photos if AI hero generation failed
        if (!heroImageB64) {
          console.log(`[Workflow] AI hero image failed in graphics workflow, falling back to stock photos`);
          const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
            "stock_photos",
            "get_photo_for_industry",
            {
              industry: ctx.project.industry || "business",
              type: "hero",
              businessIdea: ctx.project.businessIdea || "",
            }
          );
          
          if (stockResult.success && stockResult.data?.photos?.length > 0) {
            heroImageUrl = stockResult.data.photos[0].url;
            console.log(`[Workflow] Using stock photo for hero: ${heroImageUrl}`);
          }
        }
        
        if (websiteContent && (heroImageB64 || heroImageUrl || logoImageB64)) {
          const updatedPages = websiteContent.pages?.map((page: any) => {
            if (page.slug === "home") {
              return {
                ...page,
                sections: page.sections?.map((section: any) => {
                  if (section.type === "hero") {
                    if (heroImageB64) {
                      return {
                        ...section,
                        data: {
                          ...section.data,
                          backgroundImageB64: heroImageB64,
                        },
                      };
                    } else if (heroImageUrl) {
                      return {
                        ...section,
                        data: {
                          ...section.data,
                          backgroundImage: heroImageUrl,
                        },
                      };
                    }
                  }
                  return section;
                }),
              };
            }
            return page;
          });
          
          const updatedGlobalContent = {
            ...websiteContent.globalContent,
            ...(logoImageB64 && {
              logoB64: logoImageB64,
            }),
          };
          
          await storage.upsertWebsiteContent({
            projectId: ctx.projectId,
            pages: updatedPages,
            globalContent: updatedGlobalContent,
            siteSettings: websiteContent.siteSettings,
            seo: websiteContent.seo,
            providerUsed: heroResult.provider || logoResult.provider || "stock",
            status: "completed",
          });
        }
        
        return { heroGenerated: heroResult.success, heroStockPhoto: !!heroImageUrl, logoGenerated: logoResult.success };
      },
    },
    {
      name: "Generating marketing graphics",
      execute: async (ctx) => {
        const namingResult = await storage.getNamingResult(ctx.projectId);
        const brandKit = await storage.getBrandKit(ctx.projectId);
        
        const businessName = namingResult?.selectedDomain?.replace(/\.[^.]+$/, "") || ctx.project.name;
        const brandColors = brandKit?.colorPalette?.map(c => c.hex) || [];
        
        const result = await connectorRegistry.execute<any, { graphics: any[] }>(
          "text_generation",
          "generate_graphics_briefs",
          {
            businessName,
            businessIdea: ctx.project.businessIdea || "A new business",
            brandColors,
            types: ["instagram_post", "story", "facebook_ad"],
          }
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to generate graphics");
        }
        
        // Fetch stock photos from Pexels for each graphic
        const industry = ctx.project.industry || "business";
        const stockPhotoResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
          "stock_photos",
          "search_photos",
          {
            query: `${industry} ${businessName} marketing`,
            perPage: 6,
            orientation: "square",
          }
        );
        
        const stockPhotos = stockPhotoResult.success ? (stockPhotoResult.data?.photos || []) : [];
        console.log(`[Workflow] Fetched ${stockPhotos.length} stock photos for marketing graphics`);
        
        // Save each graphic asset with stock photo if available
        const graphics = result.data.graphics || [];
        for (let i = 0; i < graphics.length; i++) {
          const graphic = graphics[i];
          const stockPhoto = stockPhotos[i] || null;
          
          await storage.createGraphicAsset({
            projectId: ctx.projectId,
            type: graphic.type,
            name: graphic.name,
            dimensions: graphic.dimensions,
            designBrief: graphic.designBrief,
            copyText: graphic.copyText,
            imageUrl: stockPhoto?.url || null,
            providerUsed: result.provider,
            status: "completed",
          });
        }
        
        return result.data;
      },
    },
  ];
  
  await executeWorkflow(ctx, steps, "Graphics");
}

/**
 * Get workflow runner by type
 */
export function getWorkflowRunner(
  workflowType: string
): ((ctx: WorkflowContext) => Promise<void>) | undefined {
  const runners: Record<string, (ctx: WorkflowContext) => Promise<void>> = {
    "naming-domain": runNamingDomainWorkflow,
    "brand-kit": runBrandKitWorkflow,
    "website-plan": runWebsitePlanWorkflow,
    "graphics": runGraphicsWorkflow,
  };
  
  return runners[workflowType];
}
