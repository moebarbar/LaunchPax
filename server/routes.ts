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
    
    await storage.updateNamingResult(projectId, { selectedDomain: domain });
    
    await storage.createActivityLog({
      projectId,
      action: "Domain selected",
      details: `Selected domain: ${domain}`,
      status: "completed",
    });

    res.json({ success: true });
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
    res.json(job || { status: "pending", progress: 0 });
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

    // Create job
    const job = await storage.createWorkflowJob({
      projectId,
      workflowType,
      status: "pending",
      progress: 0,
    });

    // Run workflow async
    runner({ projectId, project, jobId: job.id }).catch((error) => {
      console.error(`Workflow ${workflowType} failed:`, error);
    });

    res.status(202).json({ jobId: job.id, status: "pending" });
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
