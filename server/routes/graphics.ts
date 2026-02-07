import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

export function registerGraphicsRoutes(app: Express): void {
  app.get("/api/projects/:id/graphics", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const assets = await storage.getGraphicAssets(params.id);
    res.json(assets);
  });
}
