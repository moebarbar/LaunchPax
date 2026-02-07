import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const sectionRefineSchema = z.object({
  instruction: z.string().min(1),
  pageSlug: z.string().min(1).optional(),
});

const sectionUpdateSchema = z.object({
  data: z.any().refine((value) => value !== undefined, { message: "Section data is required" }),
  pageSlug: z.string().min(1).optional(),
});

export function registerSectionRoutes(app: Express): void {
  app.post(
    "/api/projects/:id/sections/:sectionId/refine",
    isAuthenticated,
    async (req: Request, res: Response) => {
      const userId = req.user?.claims?.sub;
      const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
      if (!params) return;

      const payload = parseRequest(sectionRefineSchema, req.body, res);
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
      let targetSection: { id: string; type: string; data: Record<string, unknown> } | null = null;
      let targetPageIndex = -1;
      let targetSectionIndex = -1;

      for (let pi = 0; pi < pages.length; pi++) {
        const page = pages[pi];
        if (payload.pageSlug && page.slug !== payload.pageSlug) continue;

        for (let si = 0; si < page.sections.length; si++) {
          if (page.sections[si].id === req.params.sectionId) {
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

      const brandKit = await storage.getBrandKit(params.id);

      const result = await connectorRegistry.execute("text_generation", "refine_section", {
        section: targetSection,
        instruction: payload.instruction,
        businessContext: {
          businessName: project.name,
          industry: project.industry,
          tone: project.tone,
          brandVoice: brandKit?.brandVoice,
        },
      });

      if (!result || !result.success) {
        return res.status(500).json({ error: result?.error || "Failed to refine section" });
      }

      const refinedSection = result.data as { id: string; type: string; data: Record<string, unknown> };
      const updatedPages = [...pages];
      updatedPages[targetPageIndex].sections[targetSectionIndex] = {
        ...targetSection,
        data: refinedSection.data,
      };

      await storage.updateWebsiteContent(params.id, { pages: updatedPages });

      await storage.createActivityLog({
        projectId: params.id,
        action: "Section refined",
        details: `Refined ${targetSection.type} section with instruction: "${payload.instruction.substring(0, 50)}..."`,
        status: "completed",
      });

      res.json({
        success: true,
        section: {
          ...targetSection,
          data: refinedSection.data,
        },
      });
    }
  );

  app.patch("/api/projects/:id/sections/:sectionId", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(sectionUpdateSchema, req.body, res);
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

    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (payload.pageSlug && page.slug !== payload.pageSlug) continue;

      for (let si = 0; si < page.sections.length; si++) {
        if (page.sections[si].id === req.params.sectionId) {
          pages[pi].sections[si] = {
            ...pages[pi].sections[si],
            data: payload.data,
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

    await storage.updateWebsiteContent(params.id, { pages });

    res.json({ success: true });
  });
}
