/**
 * Workflow Engine
 * 
 * Orchestrates multi-step workflows using the connector abstraction layer.
 * Workflows are provider-agnostic - they use capabilities, not specific APIs.
 */

import { connectorRegistry } from "../connectors/registry";
import { storage } from "../storage";
import type { Project, ConnectorResult } from "@shared/schema";

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
            pages: ["home", "about", "services", "contact"],
          }
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to generate website content");
        }
        
        // Apply brand kit colors if available
        const siteSettings = {
          ...result.data.siteSettings,
          primaryColor: brandKit?.colorPalette?.[0]?.hex || result.data.siteSettings?.primaryColor,
          fontFamily: brandKit?.fontPairings?.[0]?.body,
          headingFont: brandKit?.fontPairings?.[0]?.heading,
        };
        
        // Save results
        await storage.upsertWebsiteContent({
          projectId: ctx.projectId,
          pages: result.data.pages,
          globalContent: result.data.globalContent,
          siteSettings,
          providerUsed: result.provider,
          status: "completed",
        });
        
        return result.data;
      },
    },
  ];
  
  await executeWorkflow(ctx, steps, "Website Plan");
}

/**
 * Graphics Generation Workflow
 */
export async function runGraphicsWorkflow(ctx: WorkflowContext): Promise<void> {
  const steps: WorkflowStep[] = [
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
        
        // Save each graphic asset
        for (const graphic of result.data.graphics || []) {
          await storage.createGraphicAsset({
            projectId: ctx.projectId,
            type: graphic.type,
            name: graphic.name,
            dimensions: graphic.dimensions,
            designBrief: graphic.designBrief,
            copyText: graphic.copyText,
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
