import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface StabilityImage {
  base64: string;
  seed: number;
  finishReason: string;
}

interface ImageGenerationResult {
  images: StabilityImage[];
  model: string;
}

async function generateImage(options: {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: "16:9" | "1:1" | "21:9" | "2:3" | "3:2" | "4:5" | "5:4" | "9:16" | "9:21";
  outputFormat?: "webp" | "png" | "jpeg";
  seed?: number;
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const apiKey = process.env.STABILITY_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Stability AI API key not configured",
      provider: "stability",
    };
  }

  try {
    const formData = new FormData();
    formData.append("prompt", options.prompt);
    formData.append("output_format", options.outputFormat || "webp");
    
    if (options.negativePrompt) {
      formData.append("negative_prompt", options.negativePrompt);
    }
    if (options.aspectRatio) {
      formData.append("aspect_ratio", options.aspectRatio);
    }
    if (options.seed !== undefined) {
      formData.append("seed", options.seed.toString());
    }

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Stability AI error: ${error.message || response.statusText}`,
        provider: "stability",
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: {
        images: [{
          base64: data.image,
          seed: data.seed,
          finishReason: data.finish_reason,
        }],
        model: "stable-diffusion-core",
      },
      provider: "stability",
    };
  } catch (error) {
    console.error("[Stability] Image generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
      provider: "stability",
    };
  }
}

async function generateWebsiteGraphic(options: {
  type: "hero" | "background" | "feature" | "pattern";
  style: string;
  colors?: string[];
  mood?: string;
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const typePrompts: Record<string, string> = {
    hero: "stunning website hero image, cinematic, high quality, professional photography",
    background: "abstract background texture, seamless, subtle, web design",
    feature: "product feature illustration, clean, modern, professional",
    pattern: "seamless pattern, tileable, decorative, web design element",
  };

  const colorPart = options.colors?.length 
    ? `color palette: ${options.colors.join(", ")}` 
    : "";

  const prompt = `${typePrompts[options.type]}, ${options.style} style, ${options.mood || "professional"}, ${colorPart}, 8k quality, trending on artstation`;

  const negativePrompt = "text, watermark, logo, signature, blurry, low quality, distorted";

  return generateImage({
    prompt,
    negativePrompt,
    aspectRatio: options.type === "hero" ? "16:9" : "1:1",
    outputFormat: "webp",
  });
}

export const stabilityConnector = defineConnector({
  key: "stability",
  name: "Stability AI",
  description: "High-quality AI image generation with Stable Diffusion",
  category: "ai",
  capabilities: ["image_generation", "ai_graphics"],
  authType: "apiKey",
  requiredEnvVars: ["STABILITY_API_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.STABILITY_API_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.STABILITY_API_KEY) {
      return { ok: false, message: "Stability AI API key not configured" };
    }
    return { ok: true, message: "Stability AI API key is configured" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "generate_image":
        return generateImage({
          prompt: input.prompt,
          negativePrompt: input.negativePrompt,
          aspectRatio: input.aspectRatio,
          outputFormat: input.outputFormat,
          seed: input.seed,
        }) as Promise<ConnectorResult<O>>;

      case "generate_website_graphic":
        return generateWebsiteGraphic({
          type: input.type,
          style: input.style,
          colors: input.colors,
          mood: input.mood,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "stability",
        };
    }
  },
});
