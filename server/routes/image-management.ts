import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const sectionImageSchema = z.object({
  imageBase64: z.string().min(1),
  pageSlug: z.string().min(1).optional(),
  generateAlt: z.boolean().optional(),
});

export function registerImageManagementRoutes(app: Express): void {
  app.post("/api/projects/:id/sections/:sectionId/image", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(sectionImageSchema, req.body, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(params.id);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const pages = websiteContent.pages || [];
    let updated = false;
    let sectionType = "";
    let sectionHeadline = "";

    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (payload.pageSlug && page.slug !== payload.pageSlug) continue;

      for (let si = 0; si < page.sections.length; si++) {
        if (page.sections[si].id === req.params.sectionId) {
          sectionType = page.sections[si].type;
          const headlineValue = (page.sections[si].data as { headline?: unknown } | undefined)?.headline;
          sectionHeadline = typeof headlineValue === "string" ? headlineValue : "";
          pages[pi].sections[si].data = {
            ...pages[pi].sections[si].data,
            imageB64: payload.imageBase64,
          };

          if (payload.generateAlt) {
            try {
              const { generateImageMetadata } = await import("../services/image-manager");
              const metadata = await generateImageMetadata({
                sectionType,
                businessName: project.name,
                industry: project.industry || "business",
                pageSlug: page.slug,
                sectionHeadline,
              });
              pages[pi].sections[si].data.imageAlt = metadata.alt;
            } catch (e) {
              console.error("[ImageUpload] Alt text generation failed:", e);
            }
          }

          updated = true;
          break;
        }
      }
      if (updated) break;
    }

    if (!updated) {
      return res.status(404).json({ error: "Section not found" });
    }

    await storage.updateWebsiteContent(params.id, { pages });

    res.json({ success: true, message: "Image uploaded successfully" });
  });

  app.get("/api/projects/:id/visual-completeness", isAuthenticated, async (req: Request, res: Response) => {
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

    const { checkVisualCompleteness } = await import("../services/image-manager");
    const result = checkVisualCompleteness(websiteContent, req.query.strict === "true");

    res.json(result);
  });

  app.post("/api/projects/:id/auto-fill-images", isAuthenticated, async (req: Request, res: Response) => {
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

    const { autoFillMissingImages } = await import("../services/image-manager");
    const imgSettings = (websiteContent.siteSettings as Record<string, any>) || {};
    const result = await autoFillMissingImages(websiteContent, {
      businessName: project.name,
      industry: project.industry || "business",
      businessIdea: project.businessIdea || undefined,
      photographyStyle: imgSettings.photographyStyle,
      photographyMood: imgSettings.photographyMood,
      photographyKeywords: imgSettings.photographyKeywords,
    });

    if (result.filledCount > 0) {
      await storage.updateWebsiteContent(params.id, result.updatedContent);
    }

    res.json({
      success: true,
      filledCount: result.filledCount,
      errors: result.errors,
    });
  });
}
