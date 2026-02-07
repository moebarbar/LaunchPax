import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { storage } from "../storage";
import { idParamSchema, parseRequest } from "./validation";

export function registerQualityReportRoutes(app: Express): void {
  app.get("/api/projects/:id/quality-report", isAuthenticated, async (req: Request, res: Response) => {
    const userId = req.user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const logs = await storage.getActivityLogs(params.id);
    const qualityLogs = logs
      .filter((log) => log.action === "Quality evaluation completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latestQualityLog = qualityLogs[0];

    if (!latestQualityLog || !latestQualityLog.details) {
      return res.json({
        hasReport: false,
        message: "No quality report available. Generate or regenerate the website to see quality scores.",
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
}
