import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { connectorRegistry } from "../connectors";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const elementUpdateSchema = z.object({
  path: z.string().min(1).max(500),
  value: z.any().refine((value) => value !== undefined, { message: "Value is required" }),
});

const aiRefineSchema = z.object({
  currentValue: z.string().min(1),
  elementType: z.string().min(1).optional(),
  instruction: z.string().min(1),
});

const aiQuickActionSchema = z.object({
  currentValue: z.string().min(1),
  elementType: z.string().min(1).optional(),
  action: z.string().min(1),
});

const aiVariationsSchema = z.object({
  currentValue: z.string().min(1),
  elementType: z.string().min(1).optional(),
  count: z.number().int().min(1).max(10).optional(),
});

export function registerVisualEditorRoutes(app: Express): void {
  app.patch("/api/projects/:id/website/element", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(elementUpdateSchema, req.body, res);
    if (!payload) return;

    const allowedPathPattern = /^(pages|siteSettings|globalContent|__full_restore|__add_section)/;
    if (!allowedPathPattern.test(payload.path)) {
      return res.status(400).json({ error: "Invalid path prefix" });
    }

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    const websiteContent = await storage.getWebsiteContent(params.id);
    if (!websiteContent) {
      return res.status(404).json({ error: "Website content not found" });
    }

    try {
      if (payload.path === "__full_restore") {
        if (!payload.value || typeof payload.value !== "object") {
          return res.status(400).json({ error: "Full restore value must be an object" });
        }
        await storage.updateWebsiteContent(params.id, {
          pages: (payload.value as any).pages,
          siteSettings: (payload.value as any).siteSettings,
          globalContent: (payload.value as any).globalContent,
        });
        return res.json({ success: true });
      }

      if (payload.path === "pages") {
        if (!Array.isArray(payload.value)) {
          return res.status(400).json({ error: "Pages value must be an array" });
        }
        await storage.updateWebsiteContent(params.id, { pages: payload.value });
        return res.json({ success: true });
      }

      const content: Record<string, any> = JSON.parse(JSON.stringify(websiteContent));
      const pathParts = payload.path.split(".");

      let current: any = content;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
          const [, arrayName, index] = arrayMatch;
          if (!current[arrayName]) {
            return res.status(400).json({ error: `Invalid path segment: ${part}` });
          }
          current = current[arrayName][parseInt(index, 10)];
        } else {
          if (current[part] === undefined) current[part] = {};
          current = current[part];
        }
        if (!current) return res.status(400).json({ error: `Path resolution failed at: ${part}` });
      }

      const finalKey = pathParts[pathParts.length - 1];
      const finalArrayMatch = finalKey.match(/^(.+)\[(\d+)\]$/);
      if (finalArrayMatch) {
        const [, arrayName, index] = finalArrayMatch;
        if (current[arrayName]) {
          current[arrayName][parseInt(index, 10)] = payload.value;
        }
      } else {
        current[finalKey] = payload.value;
      }

      await storage.updateWebsiteContent(params.id, {
        pages: content.pages,
        siteSettings: content.siteSettings,
        globalContent: content.globalContent,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("[VisualEditor] Element update error:", error);
      res.status(500).json({ error: "Failed to update element. Please try again." });
    }
  });

  app.post("/api/projects/:id/editor/ai-refine", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(aiRefineSchema, req.body, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    try {
      const result = await connectorRegistry.execute("text_generation", "refine_text", {
        text: payload.currentValue,
        instruction: payload.instruction,
        context: {
          businessName: project.name,
          industry: project.industry,
          elementType: payload.elementType,
        },
      });

      if (result.success && result.data) {
        const refined =
          typeof result.data === "string"
            ? result.data
            : (result.data as any).text || (result.data as any).refined || payload.currentValue;
        return res.json({ refined });
      }

      const refinedFallback = applySimpleTextTransform(payload.currentValue, payload.instruction);
      res.json({ refined: refinedFallback });
    } catch (error: any) {
      console.error("[VisualEditor] AI refine error:", error);
      const refinedFallback = applySimpleTextTransform(payload.currentValue, payload.instruction);
      res.json({ refined: refinedFallback });
    }
  });

  app.post("/api/projects/:id/editor/ai-quick-action", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(aiQuickActionSchema, req.body, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    try {
      const instructionMap: Record<string, string> = {
        make_shorter: "Make this text significantly shorter and more concise while keeping the key message",
        make_longer: "Expand this text with more detail and supporting points",
        more_professional: "Rewrite in a more professional, corporate tone",
        more_casual: "Rewrite in a more casual, friendly conversational tone",
        add_urgency: "Add a sense of urgency and compelling call to action",
        simplify: "Simplify the language to be easily understood by anyone",
      };

      const instruction = instructionMap[payload.action] || `Apply ${payload.action.replace(/_/g, " ")} transformation`;

      const result = await connectorRegistry.execute("text_generation", "refine_text", {
        text: payload.currentValue,
        instruction,
        context: {
          businessName: project.name,
          industry: project.industry,
          elementType: payload.elementType,
        },
      });

      if (result.success && result.data) {
        const refined =
          typeof result.data === "string"
            ? result.data
            : (result.data as any).text || (result.data as any).refined || payload.currentValue;
        return res.json({ result: refined });
      }

      const resultFallback = applySimpleTextTransform(payload.currentValue, instruction);
      res.json({ result: resultFallback });
    } catch (error: any) {
      console.error("[VisualEditor] Quick action error:", error);
      const resultFallback = applySimpleTextTransform(payload.currentValue, payload.action);
      res.json({ result: resultFallback });
    }
  });

  app.post("/api/projects/:id/editor/ai-variations", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(aiVariationsSchema, req.body, res);
    if (!payload) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: "Project not found" });
    }

    try {
      const result = await connectorRegistry.execute("text_generation", "generate_variations", {
        text: payload.currentValue,
        count: payload.count || 3,
        context: {
          businessName: project.name,
          industry: project.industry,
          elementType: payload.elementType,
        },
      });

      if (result.success && result.data) {
        const variations =
          Array.isArray(result.data) ? result.data : (result.data as any).variations || [payload.currentValue + " (variation)"];
        return res.json({ variations });
      }

      res.json({
        variations: [
          payload.currentValue.replace(/\.$/, "!"),
          payload.currentValue.split("").reverse().join("").length > 20
            ? payload.currentValue.substring(0, Math.ceil(payload.currentValue.length * 0.7)) + "..."
            : payload.currentValue + " - Enhanced",
          payload.currentValue.charAt(0).toUpperCase() + payload.currentValue.slice(1),
        ],
      });
    } catch (error: any) {
      console.error("[VisualEditor] Variations error:", error);
      res.json({
        variations: [
          payload.currentValue + " - Option A",
          payload.currentValue + " - Option B",
          payload.currentValue + " - Option C",
        ],
      });
    }
  });
}

function applySimpleTextTransform(text: string, instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes("shorter") || lower.includes("concise")) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    return sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join(". ").trim() + ".";
  }
  if (lower.includes("uppercase") || lower.includes("upper case")) {
    return text.toUpperCase();
  }
  if (lower.includes("lowercase") || lower.includes("lower case")) {
    return text.toLowerCase();
  }
  if (lower.includes("professional")) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
}
