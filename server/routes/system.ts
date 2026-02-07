import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

export function registerSystemRoutes(app: Express): void {
  app.get("/api/system/ai-report", isAuthenticated, async (_req: Request, res: Response) => {
    const { aiRouter } = await import("../services/ai-router");
    const { contentCache } = await import("../services/content-cache");
    const { workflowRecovery } = await import("../services/workflow-recovery");

    const aiStats = aiRouter.getStats();
    const modelReport = aiRouter.getModelReport();
    const cacheStats = contentCache.getStats();
    const cacheInfo = contentCache.getCacheInfo();
    const recoveryStats = workflowRecovery.getRecoveryStats();
    const activeJobs = workflowRecovery.getActiveJobs();

    res.json({
      ai: {
        stats: aiStats,
        models: modelReport,
        efficiency: {
          totalCalls: aiStats.totalCalls,
          fallbackRate:
            aiStats.totalCalls > 0
              ? Math.round((aiStats.fallbacksUsed / aiStats.totalCalls) * 100)
              : 0,
        },
      },
      cache: {
        stats: cacheStats,
        info: cacheInfo,
        hitRate:
          cacheStats.hits + cacheStats.misses > 0
            ? Math.round((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100)
            : 0,
      },
      workflows: {
        recovery: recoveryStats,
        activeJobs,
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/system/connectors", isAuthenticated, async (_req: Request, res: Response) => {
    const connectors = connectorRegistry.getAllInfo();

    const byCategory: Record<string, typeof connectors> = {};
    for (const connector of connectors) {
      if (!byCategory[connector.category]) {
        byCategory[connector.category] = [];
      }
      byCategory[connector.category].push(connector);
    }

    res.json({
      total: connectors.length,
      configured: connectors.filter((c) => c.isConfigured).length,
      byCategory,
      connectors,
    });
  });

  app.get("/api/projects/:id/creativity-report", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(params.id);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const { runCreativityChecklist } = await import("../services/creativity-checklist");
    const report = runCreativityChecklist(websiteContent, project.industry || "", false);

    res.json({
      projectId: params.id,
      projectName: project.name,
      industry: project.industry,
      report,
    });
  });

  app.post("/api/projects/:id/invalidate-cache", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { contentCache } = await import("../services/content-cache");
    contentCache.invalidateProject(params.id);

    res.json({ success: true, message: `Cache invalidated for project ${params.id}` });
  });
}
