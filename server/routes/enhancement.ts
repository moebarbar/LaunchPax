import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const enhanceSchema = z.object({
  address: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
});

export function registerEnhancementRoutes(app: Express): void {
  app.get("/api/enhancement-capabilities", isAuthenticated, async (_req: Request, res: Response) => {
    const { getEnhancementCapabilities, canCreatePremiumWebsite } = await import("../services/website-enhancer");

    const capabilities = getEnhancementCapabilities();
    const premiumStatus = canCreatePremiumWebsite();

    res.json({
      capabilities,
      premiumStatus,
      summary: {
        total: capabilities.length,
        configured: capabilities.filter((c) => c.configured).length,
        categories: Array.from(new Set(capabilities.map((c) => c.category))).length,
      },
    });
  });

  app.post("/api/projects/:id/enhance", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(enhanceSchema, req.body ?? {}, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(params.id);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const { enhanceWebsite } = await import("../services/website-enhancer");
    const { content, result } = await enhanceWebsite(websiteContent, {
      name: project.name,
      industry: project.industry || "business",
      businessIdea: project.businessIdea || undefined,
      address: payload.address,
      email: payload.email,
      phone: payload.phone,
    });

    if (
      result.stats.imagesEnhanced > 0 ||
      result.stats.sectionsOptimized > 0 ||
      result.stats.integrationsAdded > 0
    ) {
      await storage.updateWebsiteContent(params.id, content);

      await storage.createActivityLog({
        projectId: params.id,
        action: "Website enhanced",
        status: "completed",
        details: JSON.stringify({
          enhancements: result.enhancements,
          stats: result.stats,
        }),
      });
    }

    res.json(result);
  });
}
