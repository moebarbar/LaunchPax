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

  app.patch("/api/projects/:id/brand-kit", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const updates = req.body;
      const brandKit = await storage.upsertBrandKit({
        projectId,
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
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const { style, model } = req.body;
      console.log(`[Logo Generation] Starting for project ${projectId}, style: ${style}, model: ${model}`);
      
      const brandKit = await storage.getBrandKit(projectId);
      
      if (!brandKit?.colorsApproved) {
        console.log(`[Logo Generation] Colors not approved for project ${projectId}`);
        return res.status(400).json({ error: "Please approve brand colors before generating a logo" });
      }

      const businessProfile = project.businessProfile as any;
      const colors = brandKit.colorPalette?.map(c => c.hex) || [];
      console.log(`[Logo Generation] Colors: ${colors.join(", ")}, Business: ${businessProfile?.name || project.name}`);
      
      let logoResult;
      const { connectorRegistry } = await import("./connectors/registry");
      
      if (model === "leonardo") {
        console.log(`[Logo Generation] Using Leonardo AI`);
        logoResult = await connectorRegistry.execute(
          "image_generation",
          "generate_image",
          {
            prompt: `Professional logo design for "${businessProfile?.name || project.name}", a ${businessProfile?.industry || "business"} company. Style: ${style || "modern"}. Colors: ${colors.join(", ")}. Clean, scalable, memorable logo on white background. No text, symbol only.`,
            width: 1024,
            height: 1024,
          }
        );
      } else {
        console.log(`[Logo Generation] Using DALL-E 3`);
        logoResult = await connectorRegistry.execute(
          "image_generation",
          "generate_logo",
          {
            businessName: businessProfile?.name || project.name,
            industry: businessProfile?.industry || "business",
            style: style || "modern",
            colors,
          }
        );
      }

      console.log(`[Logo Generation] Result:`, JSON.stringify(logoResult, null, 2));

      if (!logoResult.success) {
        console.error(`[Logo Generation] Failed:`, logoResult.error);
        return res.status(500).json({ error: logoResult.error || "Failed to generate logo" });
      }

      const logoUrl = (logoResult.data as any)?.images?.[0]?.url || (logoResult.data as any)?.url;
      console.log(`[Logo Generation] Logo URL:`, logoUrl);
      
      if (logoUrl) {
        const updatedBrandKit = await storage.upsertBrandKit({
          projectId,
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
          logoStyle: style || "modern",
          status: "ready",
        });
        console.log(`[Logo Generation] Brand kit updated, logoUrl saved:`, updatedBrandKit.logoUrl);
      } else {
        console.warn(`[Logo Generation] No logo URL in result`);
        return res.status(500).json({ error: "Failed to get logo URL from AI provider" });
      }

      res.json({ 
        success: true, 
        logoUrl,
        provider: logoResult.provider,
      });
    } catch (error) {
      console.error("[POST /brand-kit/generate-logo] Error:", error);
      res.status(500).json({ error: "Failed to generate logo" });
    }
  });

  app.post("/api/projects/:id/brand-kit/upload-logo", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    try {
      const { imageBase64, type } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ error: "Image data is required" });
      }

      const { uploadToCloudinary } = await import("./services/cloudinary");
      const uploadResult = await uploadToCloudinary(imageBase64, {
        folder: `launchpax/${projectId}/branding`,
        transformation: type === "favicon" 
          ? { width: 512, height: 512, crop: "fill" }
          : { width: 1024, height: 1024, crop: "fit" },
      });

      if (!uploadResult.success || !uploadResult.url) {
        return res.status(500).json({ error: "Failed to upload image" });
      }

      const updateData = type === "favicon" 
        ? { faviconUrl: uploadResult.url }
        : { logoUrl: uploadResult.url };

      await storage.upsertBrandKit({
        projectId,
        ...updateData,
        status: "ready",
      });

      res.json({ 
        success: true, 
        url: uploadResult.url,
        type,
      });
    } catch (error) {
      console.error("[POST /brand-kit/upload-logo] Error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
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

    // Visual completeness check for preview - warn but allow (user needs to see to fix)
    const { checkVisualCompleteness } = await import("./services/image-manager");
    const completeness = checkVisualCompleteness(content);
    
    // Include completeness warning in response
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

  // Get shareable preview URL for a project (quality-gated)
  app.get("/api/projects/:id/preview-url", isAuthenticated, async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const content = await storage.getWebsiteContent(projectId);
    
    if (!content?.previewToken) {
      return res.status(404).json({ error: "Website content not generated yet" });
    }

    // Check if workflow is still running
    const workflowJob = await storage.getWorkflowJob(projectId, "website-plan");
    const isBuilding = workflowJob?.status === "running" || workflowJob?.status === "pending";
    
    // Get quality report from activity logs
    const activityLogs = await storage.getActivityLogs(projectId);
    const qualityLog = activityLogs?.find(log => log.action === "Quality evaluation completed");
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

    // Check visual completeness and include warning if incomplete
    const { checkVisualCompleteness } = await import("./services/image-manager");
    const completeness = checkVisualCompleteness(content);
    
    const baseUrl = req.headers.host?.includes("localhost") 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`;
    
    const previewUrl = `${baseUrl}/preview/${content.previewToken}`;
    
    // Determine if preview is ready
    // Allow preview when: not building AND (quality passes OR quality was skipped/errored)
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
      // Quality gate status
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

  // Publish website (mark as published and generate live URL)
  app.post("/api/projects/:id/publish", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const { autoFill = true } = req.body;
    
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    let content = await storage.getWebsiteContent(projectId);
    if (!content || content.status !== "completed") {
      return res.status(400).json({ error: "Website content not ready for publishing" });
    }

    // Visual completeness check - NEVER publish without images
    const { checkVisualCompleteness, autoFillMissingImages } = await import("./services/image-manager");
    let completeness = checkVisualCompleteness(content);
    
    if (!completeness.isComplete) {
      if (autoFill) {
        // Auto-fill missing images before publishing
        const siteSettings = content.siteSettings as Record<string, any> || {};
        const fillResult = await autoFillMissingImages(content, {
          businessName: project.name,
          industry: project.industry || "business",
          businessIdea: project.businessIdea || undefined,
          photographyStyle: siteSettings.photographyStyle,
          photographyMood: siteSettings.photographyMood,
          photographyKeywords: siteSettings.photographyKeywords,
        });
        
        if (fillResult.filledCount > 0) {
          await storage.updateWebsiteContent(projectId, fillResult.updatedContent);
          content = await storage.getWebsiteContent(projectId);
          completeness = checkVisualCompleteness(content!);
        }
      }
      
      // If still incomplete after auto-fill, block publishing
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
      visualCompleteness: completeness.completenessScore,
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

  // Update website settings (colors, fonts, style)
  app.patch("/api/projects/:id/website-settings", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const { siteSettings } = req.body;

    if (!siteSettings) {
      return res.status(400).json({ error: "Site settings are required" });
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

    // Merge with existing settings
    const updatedSettings = {
      ...websiteContent.siteSettings,
      ...siteSettings,
    };

    // Save updated settings
    await storage.updateWebsiteContent(projectId, { siteSettings: updatedSettings });

    res.json({ success: true, siteSettings: updatedSettings });
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
  // QUALITY REPORT API
  // ============================================================================

  app.get("/api/projects/:id/quality-report", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    
    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Get the latest quality evaluation from activity logs (sorted by most recent)
    const logs = await storage.getActivityLogs(projectId);
    const qualityLogs = logs
      .filter(log => log.action === "Quality evaluation completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const latestQualityLog = qualityLogs[0];
    
    if (!latestQualityLog || !latestQualityLog.details) {
      return res.json({ 
        hasReport: false,
        message: "No quality report available. Generate or regenerate the website to see quality scores."
      });
    }
    
    try {
      const report = JSON.parse(latestQualityLog.details);
      res.json({
        hasReport: true,
        ...report,
        evaluatedAt: latestQualityLog.createdAt,
      });
    } catch {
      res.json({ hasReport: false, message: "Failed to parse quality report" });
    }
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

  // ============================================================================
  // IMAGE MANAGEMENT API
  // ============================================================================

  // Upload image to section
  app.post("/api/projects/:id/sections/:sectionId/image", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const sectionId = req.params.sectionId;
    const { imageBase64, pageSlug, generateAlt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
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

    // Find and update the section with image
    const pages = websiteContent.pages || [];
    let updated = false;
    let sectionType = "";
    let sectionHeadline = "";

    for (let pi = 0; pi < pages.length; pi++) {
      const page = pages[pi];
      if (pageSlug && page.slug !== pageSlug) continue;
      
      for (let si = 0; si < page.sections.length; si++) {
        if (page.sections[si].id === sectionId) {
          sectionType = page.sections[si].type;
          sectionHeadline = page.sections[si].data?.headline || "";
          pages[pi].sections[si].data = {
            ...pages[pi].sections[si].data,
            imageB64: imageBase64,
          };

          // Generate SEO alt text if requested
          if (generateAlt) {
            try {
              const { generateImageMetadata } = await import("./services/image-manager");
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

    // Save updated content
    await storage.updateWebsiteContent(projectId, { pages });

    res.json({ success: true, message: "Image uploaded successfully" });
  });

  // Check visual completeness
  app.get("/api/projects/:id/visual-completeness", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);
    const strictMode = req.query.strict === "true";

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(projectId);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const { checkVisualCompleteness } = await import("./services/image-manager");
    const result = checkVisualCompleteness(websiteContent, strictMode);

    res.json(result);
  });

  // Auto-fill missing images
  app.post("/api/projects/:id/auto-fill-images", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const projectId = parseInt(req.params.id);

    // Verify project ownership
    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(projectId);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const { autoFillMissingImages } = await import("./services/image-manager");
    const imgSettings = websiteContent.siteSettings as Record<string, any> || {};
    const result = await autoFillMissingImages(websiteContent, {
      businessName: project.name,
      industry: project.industry || "business",
      businessIdea: project.businessIdea || undefined,
      photographyStyle: imgSettings.photographyStyle,
      photographyMood: imgSettings.photographyMood,
      photographyKeywords: imgSettings.photographyKeywords,
    });

    if (result.filledCount > 0) {
      await storage.updateWebsiteContent(projectId, result.updatedContent);
    }

    res.json({
      success: true,
      filledCount: result.filledCount,
      errors: result.errors,
    });
  });

  // Search stock photos
  app.get("/api/stock-photos/search", isAuthenticated, async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const orientation = req.query.orientation as "landscape" | "portrait" | "square" | undefined;
    const perPage = parseInt(req.query.perPage as string) || 10;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const pexelsConnector = connectorRegistry.get("pexels");
    if (!pexelsConnector?.isConfigured()) {
      return res.status(503).json({ error: "Stock photo service not available" });
    }

    const result = await pexelsConnector.execute({
      action: "search_photos",
      input: { query, perPage, orientation },
      metadata: { purpose: "user_search" },
    });

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  });

  // Get enhancement capabilities (what integrations are available)
  app.get("/api/enhancement-capabilities", isAuthenticated, async (_req: Request, res: Response) => {
    const { getEnhancementCapabilities, canCreatePremiumWebsite } = await import("./services/website-enhancer");
    
    const capabilities = getEnhancementCapabilities();
    const premiumStatus = canCreatePremiumWebsite();
    
    res.json({
      capabilities,
      premiumStatus,
      summary: {
        total: capabilities.length,
        configured: capabilities.filter(c => c.configured).length,
        categories: Array.from(new Set(capabilities.map(c => c.category))).length,
      },
    });
  });

  // Enhance project website with all available integrations
  app.post("/api/projects/:id/enhance", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const projectId = parseInt(req.params.id as string);

    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(projectId);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const { enhanceWebsite } = await import("./services/website-enhancer");
    const { content, result } = await enhanceWebsite(websiteContent, {
      name: project.name,
      industry: project.industry || "business",
      businessIdea: project.businessIdea || undefined,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
    });

    if (result.stats.imagesEnhanced > 0 || result.stats.sectionsOptimized > 0 || result.stats.integrationsAdded > 0) {
      await storage.updateWebsiteContent(projectId, content);
      
      await storage.createActivityLog({
        projectId,
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

  // ============================================================================
  // SYSTEM MONITORING API
  // ============================================================================

  // Get AI model usage report
  app.get("/api/system/ai-report", isAuthenticated, async (req: Request, res: Response) => {
    const { aiRouter } = await import("./services/ai-router");
    const { contentCache } = await import("./services/content-cache");
    const { workflowRecovery } = await import("./services/workflow-recovery");
    
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
          fallbackRate: aiStats.totalCalls > 0 
            ? Math.round((aiStats.fallbacksUsed / aiStats.totalCalls) * 100) 
            : 0,
        },
      },
      cache: {
        stats: cacheStats,
        info: cacheInfo,
        hitRate: (cacheStats.hits + cacheStats.misses) > 0
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

  // Get creativity checklist for a project
  app.get("/api/projects/:id/creativity-report", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const projectId = parseInt(req.params.id as string);

    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(projectId);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    const { runCreativityChecklist } = await import("./services/creativity-checklist");
    const report = runCreativityChecklist(websiteContent, project.industry || "", false);
    
    res.json({
      projectId,
      projectName: project.name,
      industry: project.industry,
      report,
    });
  });

  // Invalidate cache for a project
  app.post("/api/projects/:id/invalidate-cache", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const projectId = parseInt(req.params.id as string);

    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { contentCache } = await import("./services/content-cache");
    contentCache.invalidateProject(projectId);
    
    res.json({ success: true, message: `Cache invalidated for project ${projectId}` });
  });

  // Get connector status and capabilities
  app.get("/api/system/connectors", isAuthenticated, async (req: Request, res: Response) => {
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
      configured: connectors.filter(c => c.isConfigured).length,
      byCategory,
      connectors,
    });
  });
}
