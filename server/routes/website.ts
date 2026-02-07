import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest, projectIdParamSchema } from "./validation";

const publishSchema = z.object({
  autoFill: z.boolean().optional(),
});

const siteSettingsSchema = z.object({
  siteSettings: z.record(z.unknown()),
});

export function registerWebsiteRoutes(app: Express): void {
  app.get("/api/projects/:id/website-plan", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const content = await storage.getWebsiteContent(params.id);
    res.json(content || { status: "pending" });
  });

  app.get("/api/preview/:token", async (req: Request, res: Response) => {
    const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
    const content = await storage.getWebsiteContentByToken(token);
    if (!content) {
      return res.status(404).json({ error: "Preview not found" });
    }

    const { checkVisualCompleteness } = await import("../services/image-manager");
    const completeness = checkVisualCompleteness(content);

    res.json({
      ...content,
      _visualCompleteness: {
        isComplete: completeness.isComplete,
        score: completeness.completenessScore,
        missingImages: completeness.missingImages,
        warning: !completeness.isComplete
          ? "This preview has missing images. Add images to all sections before publishing."
          : null,
      },
    });
  });

  app.get("/api/site/:projectId", async (req: Request, res: Response) => {
    const params = parseRequest(projectIdParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const content = await storage.getWebsiteContent(params.projectId);

    if (!content) {
      return res.status(404).json({ error: "Site not found" });
    }

    if (!content.isPublished) {
      return res.status(403).json({ error: "This site is not published" });
    }

    res.json(content);
  });

  app.get("/api/projects/:id/preview-url", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const content = await storage.getWebsiteContent(params.id);

    if (!content?.previewToken) {
      return res.status(404).json({ error: "Website content not generated yet" });
    }

    const workflowJob = await storage.getWorkflowJob(params.id, "website-plan");
    const isBuilding = workflowJob?.status === "running" || workflowJob?.status === "pending";

    const activityLogs = await storage.getActivityLogs(params.id);
    const qualityLog = activityLogs?.find((log) => log.action === "Quality evaluation completed");
    let qualityReport = null;
    let passesQualityGate = false;

    if (qualityLog?.details) {
      try {
        qualityReport = JSON.parse(qualityLog.details);
        passesQualityGate = qualityReport.passesGate === true;
      } catch (e) {
        console.log("[Preview] Could not parse quality report");
      }
    }

    const { checkVisualCompleteness } = await import("../services/image-manager");
    const completeness = checkVisualCompleteness(content);

    const baseUrl = req.headers.host?.includes("localhost")
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;

    const previewUrl = `${baseUrl}/preview/${content.previewToken}`;

    const qualityWasSkipped = qualityReport?.skipped === true || qualityReport?.error;
    const isReady = !isBuilding && (passesQualityGate || qualityWasSkipped);
    const buildProgress = workflowJob?.progress || 0;

    res.json({
      previewUrl,
      previewToken: content.previewToken,
      status: content.status,
      isPublished: content.isPublished,
      publishedUrl: content.publishedUrl,
      publishedAt: content.publishedAt,
      visualCompleteness: {
        isComplete: completeness.isComplete,
        score: completeness.completenessScore,
        missingCount: completeness.missingImages.length,
      },
      qualityGate: {
        isBuilding,
        buildProgress,
        passesQualityGate,
        isReady,
        qualityScore: qualityReport?.scores?.overall || 0,
        verdict: qualityReport?.verdict || "pending",
      },
    });
  });

  app.post("/api/projects/:id/publish", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(publishSchema, req.body ?? {}, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    let content = await storage.getWebsiteContent(params.id);
    if (!content || content.status !== "completed") {
      return res.status(400).json({ error: "Website content not ready for publishing" });
    }

    const activityLogs = await storage.getActivityLogs(params.id);
    const qualityLog = activityLogs?.find((log) => log.action === "Quality evaluation completed");
    let qualityReport: { passesGate?: boolean; skipped?: boolean; error?: string } | null = null;
    if (qualityLog?.details) {
      try {
        qualityReport = JSON.parse(qualityLog.details);
      } catch {
        qualityReport = null;
      }
    }

    if (qualityReport && qualityReport.passesGate === false && !qualityReport.skipped && !qualityReport.error) {
      return res.status(400).json({
        error: "Website quality gate not met",
        message: "Please improve the website quality before publishing.",
        qualityReport,
      });
    }

    const { checkVisualCompleteness, autoFillMissingImages } = await import("../services/image-manager");
    let completeness = checkVisualCompleteness(content);

    if (!completeness.isComplete) {
      if (payload.autoFill !== false) {
        const siteSettings = (content.siteSettings as Record<string, any>) || {};
        const fillResult = await autoFillMissingImages(content, {
          businessName: project.name,
          industry: project.industry || "business",
          businessIdea: project.businessIdea || undefined,
          photographyStyle: siteSettings.photographyStyle,
          photographyMood: siteSettings.photographyMood,
          photographyKeywords: siteSettings.photographyKeywords,
        });

        if (fillResult.filledCount > 0) {
          await storage.updateWebsiteContent(params.id, fillResult.updatedContent);
          content = await storage.getWebsiteContent(params.id);
          completeness = checkVisualCompleteness(content!);
        }
      }

      if (!completeness.isComplete) {
        return res.status(400).json({
          error: "Website cannot be published without complete visuals",
          missingImages: completeness.missingImages,
          completenessScore: completeness.completenessScore,
          message: "Please add images to all required sections before publishing.",
        });
      }
    }

    const baseUrl = req.headers.host?.includes("localhost")
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;

    const publishedUrl = `${baseUrl}/site/${params.id}`;

    await storage.publishWebsiteContent(params.id, publishedUrl);

    const updated = await storage.getWebsiteContent(params.id);

    res.json({
      success: true,
      publishedUrl,
      projectId: params.id,
      isPublished: true,
      publishedAt: updated?.publishedAt,
      visualCompleteness: completeness.completenessScore,
      message: "Your website is now live!",
    });
  });

  app.patch("/api/projects/:id/website-settings", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(siteSettingsSchema, req.body, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(params.id);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const updatedSettings = {
      ...websiteContent.siteSettings,
      ...payload.siteSettings,
    };

    await storage.updateWebsiteContent(params.id, { siteSettings: updatedSettings });

    res.json({ success: true, siteSettings: updatedSettings });
  });
}
