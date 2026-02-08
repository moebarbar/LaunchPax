import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replit_integrations/auth";
import { getWorkflowRunner, WorkflowStepError } from "../workflows/engine";
import { storage } from "../storage";
import { idParamSchema, parseRequest, workflowTypeParamSchema } from "./validation";

export function registerWorkflowRoutes(app: Express): void {
  app.get("/api/projects/:id/workflows/:type/status", isAuthenticated, async (req: Request, res: Response) => {
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const typeParams = parseRequest(workflowTypeParamSchema, req.params, res, "Invalid workflow type");
    if (!typeParams) return;

    const job = await storage.getWorkflowJob(params.id, typeParams.type);
    res.json(job || { status: "not_started", progress: 0 });
  });

  app.post("/api/projects/:id/workflows/:type/run", isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    const params = parseRequest(idParamSchema, req.params, res, "Invalid project id");
    if (!params) return;

    const typeParams = parseRequest(workflowTypeParamSchema, req.params, res, "Invalid workflow type");
    if (!typeParams) return;

    const project = await storage.getProject(params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const runner = getWorkflowRunner(typeParams.type);
    if (!runner) {
      return res.status(400).json({ message: `Unknown workflow type: ${typeParams.type}` });
    }

    const existingJob = await storage.getWorkflowJob(params.id, typeParams.type);
    if (existingJob?.status === "running" || existingJob?.status === "pending") {
      return res.status(409).json({ message: "Workflow already in progress" });
    }

    const job = await storage.createWorkflowJob({
      projectId: params.id,
      workflowType: typeParams.type,
      status: "running",
      progress: 0,
    });

    console.log(`[Workflow] Starting ${typeParams.type} for project ${params.id}, job ${job.id}`);

    runner({ projectId: params.id, project, jobId: job.id })
      .then(() => {
        console.log(`[Workflow] Completed ${typeParams.type} for project ${params.id}`);
      })
      .catch(async (error) => {
        console.error(`[Workflow] Failed ${typeParams.type} for project ${params.id}:`, error);
        const errorDetails =
          error instanceof WorkflowStepError
            ? { code: error.code, step: error.stepName, message: error.message }
            : { code: "workflow_failed", message: error instanceof Error ? error.message : "Unknown error" };

        await storage.updateWorkflowJob(job.id, {
          status: "failed",
          error: errorDetails.message,
          result: { error: errorDetails },
        });
      });

    res.status(202).json({ jobId: job.id, status: "running" });
  });
}
