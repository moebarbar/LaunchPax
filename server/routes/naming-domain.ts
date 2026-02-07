import type { Express, Request, Response } from "express";
import { z } from "zod";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

const domainSchema = z.object({
  domain: z.string().min(1),
});

const customDomainSchema = z.object({
  domain: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/),
});

export function registerNamingDomainRoutes(app: Express): void {
  app.get("/api/projects/:id/naming-domain/results", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const result = await storage.getNamingResult(params.id);
    res.json(result || { status: "pending" });
  });

  app.post("/api/projects/:id/naming-domain/favorites", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(domainSchema, req.body, res);
    if (!payload) return;

    const result = await storage.getNamingResult(params.id);
    if (!result) {
      return res.status(404).json({ message: "No naming results found" });
    }

    const favorites = result.favorites || [];
    const index = favorites.indexOf(payload.domain);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(payload.domain);
    }

    await storage.updateNamingResult(params.id, { favorites });
    res.json({ success: true });
  });

  app.post("/api/projects/:id/naming-domain/select", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(domainSchema, req.body, res);
    if (!payload) return;

    await storage.updateNamingResult(params.id, {
      selectedDomain: payload.domain,
      isCustomDomain: false,
      customDomain: null,
    });

    await storage.createActivityLog({
      projectId: params.id,
      action: "Domain selected",
      details: `Selected domain: ${payload.domain}`,
      status: "completed",
    });

    res.json({ success: true });
  });

  app.post("/api/projects/:id/naming-domain/custom", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const payload = parseRequest(customDomainSchema, req.body, res);
    if (!payload) return;

    const normalizedDomain = payload.domain.toLowerCase();

    await storage.updateNamingResult(params.id, {
      customDomain: normalizedDomain,
      isCustomDomain: true,
      selectedDomain: normalizedDomain,
    });

    await storage.createActivityLog({
      projectId: params.id,
      action: "Custom domain set",
      details: `User added their own domain: ${payload.domain}`,
      status: "completed",
    });

    res.json({ success: true, domain: normalizedDomain });
  });
}
