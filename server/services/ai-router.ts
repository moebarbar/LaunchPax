/**
 * Smart AI Router Service
 * 
 * Routes AI tasks to the optimal model based on:
 * - Task type (naming, brand, content, images)
 * - Cost efficiency (cheaper models for appropriate tasks)
 * - Availability (fallback chain when primary fails)
 * - Quality requirements (premium vs draft mode)
 */

import { connectorRegistry } from "../connectors/registry";
import type { ConnectorResult, ConnectorCapability } from "@shared/schema";

export interface AIRouterConfig {
  preferQuality?: boolean;
  maxRetries?: number;
  enableFallback?: boolean;
}

interface ModelPriority {
  primary: string;
  fallbacks: string[];
  capability: ConnectorCapability;
}

const TASK_ROUTING: Record<string, ModelPriority> = {
  name_generation: {
    primary: "openai",
    fallbacks: ["launchpax", "ai_mock"],
    capability: "name_generation",
  },
  brand_generation: {
    primary: "openai",
    fallbacks: ["launchpax", "ai_mock"],
    capability: "brand_generation",
  },
  content_generation: {
    primary: "openai",
    fallbacks: ["launchpax", "claude", "ai_mock"],
    capability: "content_generation",
  },
  long_form_content: {
    primary: "launchpax",
    fallbacks: ["claude", "openai", "ai_mock"],
    capability: "long_form_content",
  },
  text_generation: {
    primary: "launchpax",
    fallbacks: ["openai", "claude", "ai_mock"],
    capability: "text_generation",
  },
  image_generation: {
    primary: "dalle",
    fallbacks: ["stability", "leonardo", "nanobanana"],
    capability: "image_generation",
  },
  ai_graphics: {
    primary: "dalle",
    fallbacks: ["stability", "leonardo"],
    capability: "ai_graphics",
  },
  stylized_art: {
    primary: "leonardo",
    fallbacks: ["stability", "dalle"],
    capability: "stylized_art",
  },
};

interface UsageStats {
  modelCalls: Record<string, number>;
  cacheHits: number;
  cacheMisses: number;
  fallbacksUsed: number;
  totalCalls: number;
}

class AIRouter {
  private stats: UsageStats = {
    modelCalls: {},
    cacheHits: 0,
    cacheMisses: 0,
    fallbacksUsed: 0,
    totalCalls: 0,
  };

  private incrementModelCall(model: string): void {
    this.stats.modelCalls[model] = (this.stats.modelCalls[model] || 0) + 1;
    this.stats.totalCalls++;
  }

  getStats(): UsageStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = {
      modelCalls: {},
      cacheHits: 0,
      cacheMisses: 0,
      fallbacksUsed: 0,
      totalCalls: 0,
    };
  }

  async executeWithFallback<TInput, TOutput>(
    taskType: string,
    action: string,
    params: TInput,
    config: AIRouterConfig = {}
  ): Promise<ConnectorResult<TOutput>> {
    const { maxRetries = 3, enableFallback = true } = config;
    
    const routing = TASK_ROUTING[taskType];
    if (!routing) {
      console.log(`[AIRouter] No routing for task type: ${taskType}, using capability lookup`);
      return connectorRegistry.execute<TInput, TOutput>(
        taskType as ConnectorCapability,
        action,
        params
      );
    }

    const modelsToTry = [routing.primary, ...(enableFallback ? routing.fallbacks : [])];
    const errors: string[] = [];
    
    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      const connector = connectorRegistry.get(model);
      
      if (!connector) {
        console.log(`[AIRouter] Connector not found: ${model}, trying next`);
        continue;
      }
      
      if (!connector.isConfigured()) {
        console.log(`[AIRouter] Connector not configured: ${model}, trying next`);
        continue;
      }

      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          console.log(`[AIRouter] Attempting ${model} for ${taskType}/${action} (attempt ${retry + 1})`);
          
          const connectorTask = {
            capability: routing.capability,
            action,
            input: params,
          };
          const result = await connector.execute<TInput, TOutput>(connectorTask);
          
          if (result.success) {
            this.incrementModelCall(model);
            if (i > 0) {
              this.stats.fallbacksUsed++;
              console.log(`[AIRouter] Fallback success: ${model} for ${taskType}`);
            }
            return result;
          }
          
          const errMsg = `${model}: ${result.error}`;
          errors.push(errMsg);
          console.log(`[AIRouter] ${model} returned error: ${result.error}, retry ${retry + 1}/${maxRetries}`);
          
          if (result.error?.includes("rate limit") || result.error?.includes("quota")) {
            console.log(`[AIRouter] Rate limit detected, moving to fallback`);
            break;
          }
          
          if (retry < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, retry), 10000);
            console.log(`[AIRouter] Waiting ${delay}ms before retry`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          errors.push(`${model}: ${errorMessage}`);
          console.log(`[AIRouter] ${model} threw error: ${errorMessage}`);
          
          if (retry < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, retry), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      console.log(`[AIRouter] ${model} exhausted retries, trying next fallback`);
    }

    const errorSummary = errors.length > 0 ? errors.join("; ") : "No providers available";
    console.log(`[AIRouter] All models failed for ${taskType}/${action}: ${errorSummary}`);
    
    return {
      success: false,
      error: `All AI providers failed for ${taskType}. Tried: ${modelsToTry.filter(m => connectorRegistry.get(m)?.isConfigured()).join(", ") || "none configured"}. Please try again later.`,
      provider: "ai_router",
    };
  }

  getBestModelForTask(taskType: string): string | null {
    const routing = TASK_ROUTING[taskType];
    if (!routing) return null;

    const modelsToCheck = [routing.primary, ...routing.fallbacks];
    for (const model of modelsToCheck) {
      const connector = connectorRegistry.get(model);
      if (connector?.isConfigured()) {
        return model;
      }
    }
    return null;
  }

  getModelReport(): Record<string, { primary: string; available: string[]; configured: boolean }> {
    const report: Record<string, { primary: string; available: string[]; configured: boolean }> = {};
    
    for (const [taskType, routing] of Object.entries(TASK_ROUTING)) {
      const allModels = [routing.primary, ...routing.fallbacks];
      const available = allModels.filter(m => {
        const connector = connectorRegistry.get(m);
        return connector?.isConfigured();
      });
      
      report[taskType] = {
        primary: routing.primary,
        available,
        configured: available.length > 0,
      };
    }
    
    return report;
  }
}

export const aiRouter = new AIRouter();
