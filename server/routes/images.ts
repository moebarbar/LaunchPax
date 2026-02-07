import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const imageGenerateSchema = z.object({
  prompt: z.string().min(1),
  size: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
});

export function registerImagesRoutes(app: Express): void {
  app.post("/api/images/generate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const payload = parseRequest(imageGenerateSchema, req.body, res);
      if (!payload) return;

      const result = await connectorRegistry.execute<{ prompt: string; size?: string }, { b64_json?: string; url?: string }>(
        "image_generation",
        "generate_image",
        { prompt: payload.prompt, size: payload.size || "1024x1024" }
      );

      if (!result.success) {
        return res.status(500).json({
          message: "Image generation is temporarily unavailable. Please try again in a moment.",
          details: result.error,
        });
      }

      res.json(result.data);
    } catch (error) {
      console.error("[Images] Generation failed:", error);
      res.status(500).json({
        message: "Something went wrong generating your image. Please try again.",
      });
    }
  });

  app.post("/api/projects/:id/images/hero", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const brandKit = await storage.getBrandKit(params.id);

      const result = await connectorRegistry.execute<
        {
          businessName: string;
          businessIdea: string;
          industry?: string;
          brandColors?: { primary: string; secondary?: string };
          style?: string;
        },
        { b64_json?: string; url?: string; type?: string }
      >("image_generation", "generate_hero_image", {
        businessName: project.name,
        businessIdea: project.businessIdea || "",
        industry: project.industry,
        brandColors: brandKit
          ? {
              primary: brandKit.colors?.primary || "#3b82f6",
              secondary: brandKit.colors?.secondary,
            }
          : undefined,
        style: brandKit?.designStyle,
      });

      if (!result.success) {
        return res.status(500).json({
          message: "Hero image generation is temporarily unavailable. Your website will use a gradient background instead.",
          details: result.error,
        });
      }

      await storage.createGeneratedAsset({
        projectId: params.id,
        type: "hero_image",
        name: "Hero Background",
        data: { url: result.data?.url || "generated" },
        status: "completed",
      });

      res.json(result.data);
    } catch (error) {
      console.error("[Images] Hero generation failed:", error);
      res.status(500).json({
        message: "Something went wrong generating your hero image. Your website will use a gradient background instead.",
      });
    }
  });

  app.post("/api/projects/:id/images/logo", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const brandKit = await storage.getBrandKit(params.id);

      const result = await connectorRegistry.execute<
        {
          businessName: string;
          industry?: string;
          style?: string;
          brandColors?: { primary: string; secondary?: string; accent?: string };
        },
        { b64_json?: string; url?: string; type?: string }
      >("image_generation", "generate_logo", {
        businessName: project.name,
        industry: project.industry,
        style: brandKit?.designStyle,
        brandColors: brandKit?.colors,
      });

      if (!result.success) {
        return res.status(500).json({
          message: "Logo generation is temporarily unavailable. You can upload your own logo instead.",
          details: result.error,
        });
      }

      await storage.createGeneratedAsset({
        projectId: params.id,
        type: "logo",
        name: "Brand Logo",
        data: { url: result.data?.url || "generated" },
        status: "completed",
      });

      res.json(result.data);
    } catch (error) {
      console.error("[Images] Logo generation failed:", error);
      res.status(500).json({
        message: "Something went wrong generating your logo. You can upload your own logo instead.",
      });
    }
  });
}
