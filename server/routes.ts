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

  // ============================================================================
  // GRAPHICS API
  // ============================================================================

  app.get("/api/projects/:id/graphics", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const assets = await storage.getGraphicAssets(projectId);
    res.json(assets);
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
