/**
 * Workflow Recovery Service
 * 
 * Ensures workflows never get permanently stuck:
 * - Tracks workflow progress with checkpoints
 * - Auto-cleanup of stuck jobs after timeout
 * - Resume capability from last successful step
 * - Graceful degradation when all else fails
 */

import { storage } from "../storage";

interface WorkflowCheckpoint {
  jobId: number;
  projectId: number;
  workflowType: string;
  currentStep: number;
  totalSteps: number;
  lastStepName: string;
  startedAt: Date;
  lastUpdateAt: Date;
  stepResults: Record<number, any>;
}

const STUCK_TIMEOUT_MS = 5 * 60 * 1000;
const MAX_WORKFLOW_TIME_MS = 15 * 60 * 1000;

class WorkflowRecovery {
  private checkpoints: Map<number, WorkflowCheckpoint> = new Map();
  private recoveryAttempts: Map<number, number> = new Map();

  startWorkflow(
    jobId: number,
    projectId: number,
    workflowType: string,
    totalSteps: number
  ): void {
    this.checkpoints.set(jobId, {
      jobId,
      projectId,
      workflowType,
      currentStep: 0,
      totalSteps,
      lastStepName: "initializing",
      startedAt: new Date(),
      lastUpdateAt: new Date(),
      stepResults: {},
    });
    this.recoveryAttempts.set(jobId, 0);
    console.log(`[WorkflowRecovery] Started tracking job ${jobId} for ${workflowType}`);
  }

  updateProgress(jobId: number, stepIndex: number, stepName: string, result?: any): void {
    const checkpoint = this.checkpoints.get(jobId);
    if (checkpoint) {
      checkpoint.currentStep = stepIndex;
      checkpoint.lastStepName = stepName;
      checkpoint.lastUpdateAt = new Date();
      if (result !== undefined) {
        checkpoint.stepResults[stepIndex] = result;
      }
      console.log(`[WorkflowRecovery] Job ${jobId} progress: step ${stepIndex + 1}/${checkpoint.totalSteps} (${stepName})`);
    }
  }

  getCheckpoint(jobId: number): WorkflowCheckpoint | undefined {
    return this.checkpoints.get(jobId);
  }

  getLastSuccessfulResult(jobId: number): any {
    const checkpoint = this.checkpoints.get(jobId);
    if (!checkpoint) return undefined;
    
    const maxStep = Math.max(...Object.keys(checkpoint.stepResults).map(Number), -1);
    return maxStep >= 0 ? checkpoint.stepResults[maxStep] : undefined;
  }

  markCompleted(jobId: number): void {
    this.checkpoints.delete(jobId);
    this.recoveryAttempts.delete(jobId);
    console.log(`[WorkflowRecovery] Job ${jobId} completed, checkpoint removed`);
  }

  markFailed(jobId: number, error: string): void {
    const checkpoint = this.checkpoints.get(jobId);
    if (checkpoint) {
      console.log(`[WorkflowRecovery] Job ${jobId} failed at step "${checkpoint.lastStepName}": ${error}`);
    }
  }

  canRetry(jobId: number, maxRetries: number = 3): boolean {
    const attempts = this.recoveryAttempts.get(jobId) || 0;
    return attempts < maxRetries;
  }

  incrementRetry(jobId: number): number {
    const attempts = (this.recoveryAttempts.get(jobId) || 0) + 1;
    this.recoveryAttempts.set(jobId, attempts);
    console.log(`[WorkflowRecovery] Job ${jobId} retry attempt ${attempts}`);
    return attempts;
  }

  async cleanupStuckJobs(): Promise<number> {
    const now = new Date();
    let cleanedCount = 0;

    for (const [jobId, checkpoint] of this.checkpoints.entries()) {
      const timeSinceUpdate = now.getTime() - checkpoint.lastUpdateAt.getTime();
      const totalTime = now.getTime() - checkpoint.startedAt.getTime();

      if (timeSinceUpdate > STUCK_TIMEOUT_MS || totalTime > MAX_WORKFLOW_TIME_MS) {
        console.log(`[WorkflowRecovery] Cleaning up stuck job ${jobId} (${checkpoint.workflowType})`);
        
        try {
          await storage.updateWorkflowJob(jobId, {
            status: "failed",
            error: timeSinceUpdate > STUCK_TIMEOUT_MS 
              ? `Workflow stuck at step "${checkpoint.lastStepName}" for ${Math.round(timeSinceUpdate / 1000)}s`
              : `Workflow exceeded maximum time (${Math.round(totalTime / 60000)} minutes)`,
          });
          
          await storage.createActivityLog({
            projectId: checkpoint.projectId,
            action: `${checkpoint.workflowType}: Auto-cleanup`,
            status: "error",
            details: JSON.stringify({ reason: "stuck_timeout", step: checkpoint.lastStepName }),
          });
        } catch (error) {
          console.error(`[WorkflowRecovery] Failed to cleanup job ${jobId}:`, error);
        }

        this.checkpoints.delete(jobId);
        this.recoveryAttempts.delete(jobId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  getActiveJobs(): { jobId: number; workflowType: string; progress: number; lastStep: string }[] {
    return Array.from(this.checkpoints.values()).map(cp => ({
      jobId: cp.jobId,
      workflowType: cp.workflowType,
      progress: Math.round((cp.currentStep / cp.totalSteps) * 100),
      lastStep: cp.lastStepName,
    }));
  }

  getRecoveryStats(): { active: number; totalRecoveryAttempts: number } {
    const totalAttempts = Array.from(this.recoveryAttempts.values()).reduce((a, b) => a + b, 0);
    return {
      active: this.checkpoints.size,
      totalRecoveryAttempts: totalAttempts,
    };
  }
}

export const workflowRecovery = new WorkflowRecovery();

let cleanupInterval: NodeJS.Timeout | null = null;

export function startWorkflowCleanupJob(): void {
  if (cleanupInterval) return;
  
  cleanupInterval = setInterval(async () => {
    const cleaned = await workflowRecovery.cleanupStuckJobs();
    if (cleaned > 0) {
      console.log(`[WorkflowRecovery] Cleaned up ${cleaned} stuck workflows`);
    }
  }, 60000);
  
  console.log("[WorkflowRecovery] Started automatic cleanup job (every 60s)");
}

export function stopWorkflowCleanupJob(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log("[WorkflowRecovery] Stopped automatic cleanup job");
  }
}
