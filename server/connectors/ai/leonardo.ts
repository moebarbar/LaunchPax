import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface LeonardoImage {
  id: string;
  url: string;
  nsfw: boolean;
}

interface GenerationResult {
  generationId: string;
  images: LeonardoImage[];
  status: string;
}

async function generateImage(options: {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numImages?: number;
  modelId?: string;
  styleUUID?: string;
}): Promise<ConnectorResult<GenerationResult>> {
  const apiKey = process.env.LEONARDO_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Leonardo AI API key not configured",
      provider: "leonardo",
    };
  }

  try {
    const createResponse = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: options.prompt,
        negative_prompt: options.negativePrompt || "blurry, low quality, text, watermark",
        width: options.width || 1024,
        height: options.height || 1024,
        num_images: options.numImages || 1,
        modelId: options.modelId || "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
        styleUUID: options.styleUUID,
        public: false,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json().catch(() => ({}));
      return {
        success: false,
        error: `Leonardo AI error: ${error.error || createResponse.statusText}`,
        provider: "leonardo",
      };
    }

    const createData = await createResponse.json();
    const generationId = createData.sdGenerationJob?.generationId;

    if (!generationId) {
      return {
        success: false,
        error: "Failed to start generation",
        provider: "leonardo",
      };
    }

    const maxAttempts = 30;
    const pollInterval = 2000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusResponse = await fetch(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!statusResponse.ok) {
        continue;
      }

      const statusData = await statusResponse.json();
      const generation = statusData.generations_by_pk;

      if (generation?.status === "COMPLETE") {
        const images: LeonardoImage[] = (generation.generated_images || []).map((img: any) => ({
          id: img.id,
          url: img.url,
          nsfw: img.nsfw,
        }));

        return {
          success: true,
          data: {
            generationId,
            images,
            status: "COMPLETE",
          },
          provider: "leonardo",
        };
      }

      if (generation?.status === "FAILED") {
        return {
          success: false,
          error: "Image generation failed",
          provider: "leonardo",
        };
      }
    }

    return {
      success: false,
      error: "Image generation timed out after 60 seconds",
      provider: "leonardo",
    };
  } catch (error) {
    console.error("[Leonardo] Generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
      provider: "leonardo",
    };
  }
}

async function generateStylizedGraphic(options: {
  subject: string;
  style: "anime" | "3d" | "illustration" | "photo" | "cinematic" | "fantasy";
  industry?: string;
}): Promise<ConnectorResult<GenerationResult>> {
  const styleModifiers: Record<string, string> = {
    anime: "anime style, vibrant colors, detailed, studio ghibli inspired",
    "3d": "3D render, octane render, unreal engine, photorealistic, detailed",
    illustration: "digital illustration, vector art, clean lines, modern design",
    photo: "professional photography, high quality, natural lighting, sharp focus",
    cinematic: "cinematic lighting, dramatic, movie poster quality, epic",
    fantasy: "fantasy art, magical, ethereal, detailed environment",
  };

  const prompt = `${options.subject}, ${styleModifiers[options.style]}, ${options.industry ? `${options.industry} industry` : ""}, professional quality, trending on artstation`;

  return generateImage({
    prompt,
    width: options.style === "cinematic" ? 1536 : 1024,
    height: options.style === "cinematic" ? 1024 : 1024,
  });
}

export const leonardoConnector = defineConnector({
  key: "leonardo",
  name: "Leonardo AI",
  description: "Stylized AI graphics and illustrations",
  category: "ai",
  capabilities: ["image_generation", "ai_graphics", "stylized_art"],
  authType: "apiKey",
  requiredEnvVars: ["LEONARDO_API_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.LEONARDO_API_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.LEONARDO_API_KEY) {
      return { ok: false, message: "Leonardo AI API key not configured" };
    }
    return { ok: true, message: "Leonardo AI API key is configured" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "generate_image":
        return generateImage({
          prompt: input.prompt,
          negativePrompt: input.negativePrompt,
          width: input.width,
          height: input.height,
          numImages: input.numImages,
          modelId: input.modelId,
          styleUUID: input.styleUUID,
        }) as Promise<ConnectorResult<O>>;

      case "generate_stylized":
        return generateStylizedGraphic({
          subject: input.subject,
          style: input.style,
          industry: input.industry,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "leonardo",
        };
    }
  },
});
