import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { initializeConnectors, connectorRegistry } from "./connectors";
import { getWorkflowRunner } from "./workflows/engine";
import type { Project } from "@shared/schema";

export async function registerRoutes(server: Server, app: Express): Promise<void> {
  // Initialize connectors
  initializeConnectors();

  // Setup authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // ============================================================================
  // PROJECTS API
  // ============================================================================

  // Get all projects for current user
  app.get("/api/projects", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const projects = await storage.getProjects(userId);
    res.json(projects);
  });

  // Get single project
  app.get("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  // Create project
  app.post("/api/projects", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await storage.createProject({
      ...req.body,
      userId,
    });

    // Log creation
    await storage.createActivityLog({
      projectId: project.id,
      action: "Project created",
      details: `Created project "${project.name}"`,
      status: "completed",
    });

    res.status(201).json(project);
  });

  // Update project
  app.patch("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updated = await storage.updateProject(projectId, req.body);
    res.json(updated);
  });

  // Delete project
  app.delete("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    await storage.deleteProject(projectId);
    res.status(204).send();
  });

  // ============================================================================
  // NAMING & DOMAIN API
  // ============================================================================

  // Get naming results
  app.get("/api/projects/:id/naming-domain/results", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const result = await storage.getNamingResult(projectId);
    res.json(result || { status: "pending" });
  });

  // Toggle favorite
  app.post("/api/projects/:id/naming-domain/favorites", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const { domain } = req.body;
    
    const result = await storage.getNamingResult(projectId);
    if (!result) {
      return res.status(404).json({ message: "No naming results found" });
    }

    const favorites = result.favorites || [];
    const index = favorites.indexOf(domain);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(domain);
    }

    await storage.updateNamingResult(projectId, { favorites });
    res.json({ success: true });
  });

  // Select domain
  app.post("/api/projects/:id/naming-domain/select", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const { domain } = req.body;
    
    await storage.updateNamingResult(projectId, { 
      selectedDomain: domain,
      isCustomDomain: false,
      customDomain: null,
    });
    
    await storage.createActivityLog({
      projectId,
      action: "Domain selected",
      details: `Selected domain: ${domain}`,
      status: "completed",
    });

    res.json({ success: true });
  });

  // Set custom domain (Bring Your Own Domain)
  app.post("/api/projects/:id/naming-domain/custom", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const { domain } = req.body;
    
    if (!domain || typeof domain !== "string") {
      return res.status(400).json({ message: "Domain is required" });
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ message: "Invalid domain format" });
    }
    
    await storage.updateNamingResult(projectId, { 
      customDomain: domain.toLowerCase(),
      isCustomDomain: true,
      selectedDomain: domain.toLowerCase(),
    });
    
    await storage.createActivityLog({
      projectId,
      action: "Custom domain set",
      details: `User added their own domain: ${domain}`,
      status: "completed",
    });

    res.json({ success: true, domain: domain.toLowerCase() });
  });

  // ============================================================================
  // BRAND KIT API
  // ============================================================================

  app.get("/api/projects/:id/brand-kit", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const brandKit = await storage.getBrandKit(projectId);
    res.json(brandKit || { status: "pending" });
  });

  // ============================================================================
  // WEBSITE CONTENT API
  // ============================================================================

  app.get("/api/projects/:id/website-plan", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const content = await storage.getWebsiteContent(projectId);
    res.json(content || { status: "pending" });
  });

  // Public preview endpoint (for iframe embedding) - uses secure preview token
  app.get("/api/preview/:token", async (req: Request, res: Response) => {
    const token = req.params.token;
    const content = await storage.getWebsiteContentByToken(token);
    if (!content) {
      return res.status(404).json({ error: "Preview not found" });
    }
    res.json(content);
  });

  // Public published site endpoint - serves only published websites
  app.get("/api/site/:projectId", async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const content = await storage.getWebsiteContent(projectId);
    
    if (!content) {
      return res.status(404).json({ error: "Site not found" });
    }
    
    if (!content.isPublished) {
      return res.status(403).json({ error: "This site is not published" });
    }
    
    res.json(content);
  });

  // Get shareable preview URL for a project
  app.get("/api/projects/:id/preview-url", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const content = await storage.getWebsiteContent(projectId);
    
    if (!content?.previewToken) {
      return res.status(404).json({ error: "Website content not generated yet" });
    }
    
    const baseUrl = req.headers.host?.includes("localhost") 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;
    
    const previewUrl = `${baseUrl}/preview/${content.previewToken}`;
    
    res.json({ 
      previewUrl,
      previewToken: content.previewToken,
      status: content.status,
      isPublished: content.isPublished,
      publishedUrl: content.publishedUrl,
      publishedAt: content.publishedAt,
    });
  });

  // Publish website (mark as published and generate live URL)
  app.post("/api/projects/:id/publish", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const content = await storage.getWebsiteContent(projectId);
    if (!content || content.status !== "completed") {
      return res.status(400).json({ error: "Website content not ready for publishing" });
    }
    
    const baseUrl = req.headers.host?.includes("localhost") 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;
    
    // Published URL uses /site/:projectId route (distinct from preview)
    const publishedUrl = `${baseUrl}/site/${projectId}`;
    
    await storage.publishWebsiteContent(projectId, publishedUrl);
    
    const updated = await storage.getWebsiteContent(projectId);
    
    res.json({
      success: true,
      publishedUrl,
      projectId,
      isPublished: true,
      publishedAt: updated?.publishedAt,
      message: "Your website is now live!",
    });
  });

  // ============================================================================
  // SECTION EDITING API (Prompt-Based Refinement)
  // ============================================================================

  // Refine a single section using AI
  app.post("/api/projects/:id/sections/:sectionId/refine", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const sectionId = req.params.sectionId;
    const { instruction, pageSlug } = req.body;

    if (!instruction || typeof instruction !== "string") {
      return res.status(400).json({ error: "Instruction is required" });
    }

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get current website content
    const websiteContent = await storage.getWebsiteContent(projectId);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    // Find the section in the pages
    const pages = websiteContent.pages || [];
    let targetSection: { id: string; type: string; data: Record<string, unknown> } | null = null;
    let targetPageIndex = -1;
    let targetSectionIndex = -1;

    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (pageSlug && page.slug !== pageSlug) continue;
      
      for (let si = 0; si < page.sections.length; si++) {
        if (page.sections[si].id === sectionId) {
          targetSection = page.sections[si] as { id: string; type: string; data: Record<string, unknown> };
          targetPageIndex = pi;
          targetSectionIndex = si;
          break;
        }
      }
      if (targetSection) break;
    }

    if (!targetSection) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Get brand kit for context
    const brandKit = await storage.getBrandKit(projectId);

    // Call AI to refine the section
    const result = await connectorRegistry.execute(
      "text_generation",
      "refine_section",
      {
        section: targetSection,
        instruction,
        businessContext: {
          businessName: project.name,
          industry: project.industry,
          tone: project.tone,
          brandVoice: brandKit?.brandVoice,
        },
      }
    );

    if (!result.success) {
      return res.status(500).json({ error: result.error || "Failed to refine section" });
    }

    // Update the section in the pages array
    const refinedSection = result.data as { id: string; type: string; data: Record<string, unknown> };
    const updatedPages = [...pages];
    updatedPages[targetPageIndex].sections[targetSectionIndex] = {
      ...targetSection,
      data: refinedSection.data,
    };

    // Save updated content
    await storage.updateWebsiteContent(projectId, { pages: updatedPages });

    // Log the activity
    await storage.createActivityLog({
      projectId,
      action: "Section refined",
      details: `Refined ${targetSection.type} section with instruction: "${instruction.substring(0, 50)}..."`,
      status: "completed",
    });

    res.json({
      success: true,
      section: {
        ...targetSection,
        data: refinedSection.data,
      },
    });
  });

  // Update a section directly (manual edits)
  app.patch("/api/projects/:id/sections/:sectionId", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const sectionId = req.params.sectionId;
    const { data, pageSlug } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Section data is required" });
    }

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get current website content
    const websiteContent = await storage.getWebsiteContent(projectId);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    // Find and update the section
    const pages = websiteContent.pages || [];
    let updated = false;

    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (pageSlug && page.slug !== pageSlug) continue;
      
      for (let si = 0; si < page.sections.length; si++) {
        if (page.sections[si].id === sectionId) {
          pages[pi].sections[si] = {
            ...pages[pi].sections[si],
            data,
          };
          updated = true;
          break;
        }
      }
      if (updated) break;
    }

    if (!updated) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Save updated content
    await storage.updateWebsiteContent(projectId, { pages });

    res.json({ success: true });
  });

  // ============================================================================
  // GRAPHICS API
  // ============================================================================

  app.get("/api/projects/:id/graphics", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const assets = await storage.getGraphicAssets(projectId);
    res.json(assets);
  });

  // ============================================================================
  // STOCK PHOTOS API
  // ============================================================================

  app.get("/api/stock-photos/search", isAuthenticated, async (req: Request, res: Response) => {
    const { query, perPage, page, orientation, size } = req.query;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    
    const result = await connectorRegistry.execute(
      "stock_photos",
      "search_photos",
      {
        query,
        perPage: perPage ? parseInt(perPage as string) : 10,
        page: page ? parseInt(page as string) : 1,
        orientation: orientation as "landscape" | "portrait" | "square" | undefined,
        size: size as "small" | "medium" | "large" | undefined,
      }
    );
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result.data);
  });

  app.get("/api/stock-photos/curated", isAuthenticated, async (req: Request, res: Response) => {
    const { perPage, page } = req.query;
    
    const result = await connectorRegistry.execute(
      "stock_photos",
      "get_curated",
      {
        perPage: perPage ? parseInt(perPage as string) : 10,
        page: page ? parseInt(page as string) : 1,
      }
    );
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result.data);
  });

  app.get("/api/stock-photos/industry/:industry", isAuthenticated, async (req: Request, res: Response) => {
    const { industry } = req.params;
    const { type } = req.query;
    
    const result = await connectorRegistry.execute(
      "stock_photos",
      "get_photo_for_industry",
      {
        industry,
        type: type as "hero" | "team" | "product" | "background" | undefined,
      }
    );
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result.data);
  });

  // ============================================================================
  // ACTIVITY LOG API
  // ============================================================================

  app.get("/api/projects/:id/activity", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const logs = await storage.getActivityLogs(projectId);
    res.json(logs);
  });

  // ============================================================================
  // WORKFLOW API
  // ============================================================================

  // Get workflow status
  app.get("/api/projects/:id/workflows/:type/status", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const workflowType = req.params.type;
    
    const job = await storage.getWorkflowJob(projectId, workflowType);
    // Return "not_started" when no job exists, not "pending"
    res.json(job || { status: "not_started", progress: 0 });
  });

  // Run workflow
  app.post("/api/projects/:id/workflows/:type/run", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const workflowType = req.params.type;

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get workflow runner
    const runner = getWorkflowRunner(workflowType);
    if (!runner) {
      return res.status(400).json({ message: `Unknown workflow type: ${workflowType}` });
    }

    // Check if already running
    const existingJob = await storage.getWorkflowJob(projectId, workflowType);
    if (existingJob?.status === "running" || existingJob?.status === "pending") {
      return res.status(409).json({ message: "Workflow already in progress" });
    }

    // Create job with running status
    const job = await storage.createWorkflowJob({
      projectId,
      workflowType,
      status: "running",
      progress: 0,
    });

    console.log(`[Workflow] Starting ${workflowType} for project ${projectId}, job ${job.id}`);

    // Run workflow async
    runner({ projectId, project, jobId: job.id })
      .then(() => {
        console.log(`[Workflow] Completed ${workflowType} for project ${projectId}`);
      })
      .catch(async (error) => {
        console.error(`[Workflow] Failed ${workflowType} for project ${projectId}:`, error);
        // Update job status to failed
        await storage.updateWorkflowJob(job.id, {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      });

    res.status(202).json({ jobId: job.id, status: "running" });
  });

  // ============================================================================
  // IMAGE GENERATION API
  // ============================================================================

  // Generate image
  app.post("/api/images/generate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { prompt, size, type } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const result = await connectorRegistry.execute<{ prompt: string; size?: string }, { b64_json?: string; url?: string }>(
        "image_generation",
        "generate_image",
        { prompt, size: size || "1024x1024" }
      );

      if (!result.success) {
        return res.status(500).json({ message: result.error || "Image generation failed" });
      }

      res.json(result.data);
    } catch (error) {
      console.error("[Images] Generation failed:", error);
      res.status(500).json({ message: "Image generation failed" });
    }
  });

  // Generate hero image for a project
  app.post("/api/projects/:id/images/hero", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const brandKit = await storage.getBrandKit(projectId);
      
      const result = await connectorRegistry.execute<{
        businessName: string;
        businessIdea: string;
        industry?: string;
        brandColors?: { primary: string; secondary?: string };
        style?: string;
      }, { b64_json?: string; url?: string; type?: string }>(
        "image_generation",
        "generate_hero_image",
        {
          businessName: project.name,
          businessIdea: project.businessIdea || "",
          industry: project.industry,
          brandColors: brandKit ? { 
            primary: brandKit.colors?.primary || "#3b82f6",
            secondary: brandKit.colors?.secondary 
          } : undefined,
          style: brandKit?.designStyle,
        }
      );

      if (!result.success) {
        return res.status(500).json({ message: result.error || "Hero image generation failed" });
      }

      // Store the generated image reference in the project's generated assets
      const existingAssets = await storage.getGeneratedAssets(projectId);
      await storage.createGeneratedAsset({
        projectId,
        type: "hero_image",
        name: "Hero Background",
        data: { b64_json: result.data?.b64_json?.substring(0, 100) + "..." }, // Store reference only
        status: "completed",
      });

      res.json(result.data);
    } catch (error) {
      console.error("[Images] Hero generation failed:", error);
      res.status(500).json({ message: "Hero image generation failed" });
    }
  });

  // Generate logo for a project
  app.post("/api/projects/:id/images/logo", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const brandKit = await storage.getBrandKit(projectId);
      
      const result = await connectorRegistry.execute<{
        businessName: string;
        industry?: string;
        style?: string;
        brandColors?: { primary: string; secondary?: string; accent?: string };
      }, { b64_json?: string; url?: string; type?: string }>(
        "image_generation",
        "generate_logo",
        {
          businessName: project.name,
          industry: project.industry,
          style: brandKit?.designStyle,
          brandColors: brandKit?.colors,
        }
      );

      if (!result.success) {
        return res.status(500).json({ message: result.error || "Logo generation failed" });
      }

      // Store the generated logo
      await storage.createGeneratedAsset({
        projectId,
        type: "logo",
        name: "Brand Logo",
        data: { b64_json: result.data?.b64_json?.substring(0, 100) + "..." },
        status: "completed",
      });

      res.json(result.data);
    } catch (error) {
      console.error("[Images] Logo generation failed:", error);
      res.status(500).json({ message: "Logo generation failed" });
    }
  });

  // ============================================================================
  // CONNECTORS API
  // ============================================================================

  // List all connectors
  app.get("/api/connectors", isAuthenticated, async (req: Request, res: Response) => {
    const connectors = connectorRegistry.getAllInfo();
    res.json(connectors);
  });

  // Test connector
  app.post("/api/connectors/:key/test", isAuthenticated, async (req: Request, res: Response) => {
    const key = req.params.key;
    const result = await connectorRegistry.test(key);
    
    // Update config with test result
    await storage.upsertConnectorConfig({
      connectorKey: key,
      testStatus: result.ok ? "ok" : result.message,
      lastTestedAt: new Date(),
    });

    res.json(result);
  });
}
