/**
 * Workflow Engine
 * 
 * Orchestrates multi-step workflows using the connector abstraction layer.
 * Workflows are provider-agnostic - they use capabilities, not specific APIs.
 */

import { connectorRegistry } from "../connectors/registry";
import { storage } from "../storage";
import type { Project, ConnectorResult } from "@shared/schema";
import { evaluateWebsiteQuality, runMultiPassRefinement, type QualityReport } from "./quality-engine";

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
 * Execute a workflow with progress tracking
 */
async function executeWorkflow(
  ctx: WorkflowContext,
  steps: WorkflowStep[],
  workflowType: string
): Promise<void> {
  try {
    let prevResult: unknown;
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = Math.round(((i + 1) / steps.length) * 100);
      
      // Update job progress
      await storage.updateWorkflowJob(ctx.jobId, {
        status: "running",
        progress,
      });
      
      // Log activity
      await storage.createActivityLog({
        projectId: ctx.projectId,
        action: `${workflowType}: ${step.name}`,
        status: "running",
      });
      
      // Execute step
      prevResult = await step.execute(ctx, prevResult);
    }
    
    // Mark completed
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
        
        // Save results including SEO data
        await storage.upsertWebsiteContent({
          projectId: ctx.projectId,
          pages: result.data.pages,
          globalContent: result.data.globalContent,
          siteSettings,
          seo: result.data.seo,
          providerUsed: result.provider,
          status: "completed",
        });
        
        return result.data;
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
          console.log(`[Workflow] AI hero image failed, falling back to stock photos for ${ctx.project.industry || "consulting"}`);
          const stockResult = await connectorRegistry.execute<any, { photos: { url: string; alt: string }[] }>(
            "stock_photos",
            "get_photo_for_industry",
            {
              industry: ctx.project.industry || "consulting",
              type: "hero",
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
        
        // Try to use Claude for enhanced About page storytelling
        console.log("[Multi-AI] Using Claude for rich About page storytelling");
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
          { preferredConnector: "claude" }
        );
        
        if (claudeResult.success && claudeResult.data) {
          console.log("[Multi-AI] Claude generated enhanced About page content");
          
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
