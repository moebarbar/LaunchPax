import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const brandKitUpdateSchema = z.object({}).passthrough();
const logoGenerateSchema = z.object({
  style: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
});
const uploadLogoSchema = z.object({
  imageBase64: z.string().min(1),
  type: z.enum(["favicon", "logo"]).optional(),
});

export function registerBrandKitRoutes(app: Express): void {
  app.get("/api/projects/:id/brand-kit", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const brandKit = await storage.getBrandKit(params.id);
    res.json(brandKit || { status: "pending" });
  });

  app.patch("/api/projects/:id/brand-kit", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updates = parseRequest(brandKitUpdateSchema, req.body, res);
    if (!updates) return;

    try {
      const brandKit = await storage.upsertBrandKit({
        projectId: params.id,
        ...updates,
        status: "ready",
      });
      res.json(brandKit);
    } catch (error) {
      console.error("[PATCH /brand-kit] Error:", error);
      res.status(500).json({ error: "Failed to update brand kit" });
    }
  });

  app.post("/api/projects/:id/brand-kit/generate-logo", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const payload = parseRequest(logoGenerateSchema, req.body, res);
    if (!payload) return;

    try {
      console.log(
        `[Logo Generation] Starting for project ${params.id}, style: ${payload.style}, model: ${payload.model}`
      );

      const brandKit = await storage.getBrandKit(params.id);

      if (!brandKit?.colorsApproved) {
        console.log(`[Logo Generation] Colors not approved for project ${params.id}`);
        return res.status(400).json({ error: "Please approve brand colors before generating a logo" });
      }

      const businessProfile = project.businessProfile as any;
      const colors = brandKit.colorPalette?.map((c) => c.hex) || [];
      console.log(
        `[Logo Generation] Colors: ${colors.join(", ")}, Business: ${businessProfile?.name || project.name}`
      );

      const { aiRouter } = await import("../services/ai-router");

      const businessName = businessProfile?.name || project.name;
      const industry = businessProfile?.industry || "business";
      const logoStyle = payload.style || "modern";

      const logoResult = await aiRouter.executeWithFallback(
        "image_generation",
        "generate_logo",
        {
          businessName,
          industry,
          style: logoStyle,
          colors,
          prompt: `Professional logo design for "${businessName}", a ${industry} company. Style: ${logoStyle}. Colors: ${colors.join(", ")}. Clean, scalable, memorable logo on white background.`,
          width: 1024,
          height: 1024,
        },
        { maxRetries: 2, enableFallback: true }
      );

      console.log(
        `[Logo Generation] Result: success=${logoResult.success}, provider=${logoResult.provider}`
      );

      if (!logoResult.success) {
        console.error(`[Logo Generation] All providers failed:`, logoResult.error);
        return res.status(500).json({
          error: "Logo generation failed. Our AI providers are temporarily unavailable. Please try again in a moment.",
          details: logoResult.error,
        });
      }

      const resultData = logoResult.data as any;
      let logoUrl = resultData?.images?.[0]?.url || resultData?.url;

      if (resultData?.b64_json && !logoUrl) {
        try {
          const cdnResult = await connectorRegistry.execute<any, { url: string }>(
            "image_optimization",
            "upload_image",
            {
              imageBase64: resultData.b64_json,
              folder: `launchpax/${params.id}/branding`,
              transformation: { width: 1024, height: 1024, crop: "fit" },
            }
          );
          if (cdnResult.success && cdnResult.data?.url) {
            logoUrl = cdnResult.data.url;
            console.log(`[Logo Generation] Uploaded base64 logo to CDN: ${logoUrl}`);
          }
        } catch (uploadErr) {
          console.warn(`[Logo Generation] CDN upload failed, using base64 data URL`);
          logoUrl = `data:image/png;base64,${resultData.b64_json}`;
        }
      }

      if (!logoUrl) {
        console.warn(`[Logo Generation] No logo URL in result from ${logoResult.provider}`);
        return res.status(500).json({
          error: "Logo was generated but no image URL was returned. Please try again.",
        });
      }

      const updatedBrandKit = await storage.upsertBrandKit({
        projectId: params.id,
        brandVoice: brandKit.brandVoice,
        taglines: brandKit.taglines,
        colorPalette: brandKit.colorPalette,
        fontPairings: brandKit.fontPairings,
        messagingPillars: brandKit.messagingPillars,
        elevatorPitch: brandKit.elevatorPitch,
        colorsApproved: brandKit.colorsApproved,
        colorExplanation: brandKit.colorExplanation,
        faviconUrl: brandKit.faviconUrl,
        logoUrl,
        logoStyle: logoStyle,
        status: "ready",
      });
      console.log(`[Logo Generation] Brand kit updated, logoUrl saved:`, updatedBrandKit.logoUrl);

      res.json({
        success: true,
        logoUrl,
        provider: logoResult.provider,
      });
    } catch (error) {
      console.error("[POST /brand-kit/generate-logo] Error:", error);
      res.status(500).json({
        error: "Something went wrong while generating your logo. Please try again.",
      });
    }
  });

  app.post("/api/projects/:id/brand-kit/upload-logo", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const payload = parseRequest(uploadLogoSchema, req.body, res);
    if (!payload) return;

    try {
      const cdnResult = await connectorRegistry.execute<any, { url: string }>(
        "image_optimization",
        "upload_image",
        {
          imageBase64: payload.imageBase64,
          folder: `launchpax/${params.id}/branding`,
          transformation:
            payload.type === "favicon"
              ? { width: 512, height: 512, crop: "fill" }
              : { width: 1024, height: 1024, crop: "fit" },
        }
      );

      if (!cdnResult.success || !cdnResult.data?.url) {
        return res
          .status(500)
          .json({ error: "Image upload is currently unavailable. Please try again shortly." });
      }

      const uploadedUrl = cdnResult.data.url;
      const updateData = payload.type === "favicon" ? { faviconUrl: uploadedUrl } : { logoUrl: uploadedUrl };

      await storage.upsertBrandKit({
        projectId: params.id,
        ...updateData,
        status: "ready",
      });

      res.json({
        success: true,
        url: uploadedUrl,
        type: payload.type,
      });
    } catch (error) {
      console.error("[POST /brand-kit/upload-logo] Error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
}
