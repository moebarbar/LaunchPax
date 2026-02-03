import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";
import OpenAI from "openai";

interface GeneratedImage {
  url: string;
  revisedPrompt?: string;
}

interface ImageGenerationResult {
  images: GeneratedImage[];
  model: string;
}

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

async function generateImage(options: {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
  n?: number;
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const client = getClient();
  
  if (!client) {
    return {
      success: false,
      error: "OpenAI API key not configured",
      provider: "dalle",
    };
  }

  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: options.prompt,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      style: options.style || "vivid",
      n: options.n || 1,
    });

    const images: GeneratedImage[] = (response.data || []).map(img => ({
      url: img.url!,
      revisedPrompt: img.revised_prompt,
    }));

    return {
      success: true,
      data: {
        images,
        model: "dall-e-3",
      },
      provider: "dalle",
    };
  } catch (error) {
    console.error("[DALL-E] Image generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
      provider: "dalle",
    };
  }
}

async function generateHeroImage(options: {
  businessName: string;
  industry: string;
  style: "professional" | "creative" | "minimal" | "bold" | "luxury";
  mood?: string;
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const stylePrompts: Record<string, string> = {
    professional: "clean, corporate, professional photography, business environment",
    creative: "artistic, colorful, innovative, dynamic composition",
    minimal: "minimalist, simple, elegant, lots of white space",
    bold: "vibrant colors, striking imagery, high contrast, impactful",
    luxury: "premium, sophisticated, high-end, elegant lighting",
  };

  const prompt = `Create a stunning hero image for ${options.businessName}, a ${options.industry} business. Style: ${stylePrompts[options.style]}. ${options.mood ? `Mood: ${options.mood}.` : ""} The image should be suitable for a website hero section, cinematic quality, 16:9 aspect ratio feel, no text or logos.`;

  return generateImage({
    prompt,
    size: "1792x1024",
    quality: "hd",
    style: options.style === "creative" ? "vivid" : "natural",
  });
}

async function generateLogo(options: {
  businessName: string;
  industry: string;
  style: "modern" | "classic" | "playful" | "minimal" | "tech";
  colors?: string[];
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const styleDescriptions: Record<string, string> = {
    modern: "sleek, contemporary, clean lines",
    classic: "timeless, traditional, elegant",
    playful: "fun, friendly, approachable",
    minimal: "simple, clean, iconic",
    tech: "futuristic, digital, innovative",
  };

  const colorPart = options.colors?.length 
    ? `using colors: ${options.colors.join(", ")}` 
    : "";

  const prompt = `Design a professional logo for "${options.businessName}", a ${options.industry} company. Style: ${styleDescriptions[options.style]}. ${colorPart}. The logo should be memorable, scalable, and suitable for both digital and print. White or transparent background, centered composition.`;

  return generateImage({
    prompt,
    size: "1024x1024",
    quality: "hd",
    style: "natural",
  });
}

export const dalleConnector = defineConnector({
  key: "dalle",
  name: "DALL-E 3",
  description: "AI image generation for hero images, logos, and graphics",
  category: "ai",
  capabilities: ["image_generation", "ai_graphics"],
  authType: "apiKey",
  requiredEnvVars: ["OPENAI_API_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.OPENAI_API_KEY) {
      return { ok: false, message: "OpenAI API key not configured" };
    }
    return { ok: true, message: "OpenAI API key is configured for DALL-E" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "generate_image":
        return generateImage({
          prompt: input.prompt,
          size: input.size,
          quality: input.quality,
          style: input.style,
          n: input.n,
        }) as Promise<ConnectorResult<O>>;

      case "generate_hero":
        return generateHeroImage({
          businessName: input.businessName,
          industry: input.industry,
          style: input.style,
          mood: input.mood,
        }) as Promise<ConnectorResult<O>>;

      case "generate_logo":
        return generateLogo({
          businessName: input.businessName,
          industry: input.industry,
          style: input.style,
          colors: input.colors,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "dalle",
        };
    }
  },
});
