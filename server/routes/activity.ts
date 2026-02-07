import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

export function registerActivityRoutes(app: Express): void {
  app.get("/api/projects/:id/activity", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const logs = await storage.getActivityLogs(params.id);
    res.json(logs);
  });
}
