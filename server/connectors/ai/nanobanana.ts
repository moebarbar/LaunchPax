import { GoogleGenAI } from "@google/genai";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * Nano Banana Pro (Google Gemini) Connector
 * 
 * Provides: image_generation, graphics_generation
 * 
 * Uses Google's Gemini image generation models for high-quality graphics,
 * logos, and marketing assets with excellent text rendering.
 */

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is required for Nano Banana connector");
  }
  return new GoogleGenAI({ apiKey });
}

async function generateImage(params: {
  prompt: string;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  style?: "photorealistic" | "illustration" | "minimal" | "vibrant";
}): Promise<ConnectorResult<{ b64_json?: string; url?: string }>> {
  try {
    const client = getClient();
    
    const styleDescriptions: Record<string, string> = {
      photorealistic: "photorealistic, high quality photography, professional lighting",
      illustration: "digital illustration, vector art style, clean lines",
      minimal: "minimalist design, clean, simple, modern",
      vibrant: "vibrant colors, bold, eye-catching, energetic",
    };
    
    const enhancedPrompt = `${params.prompt}. Style: ${styleDescriptions[params.style || "photorealistic"]}`;
    
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: enhancedPrompt,
      config: {
        responseModalities: ["image", "text"],
      },
    });
    
    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return {
          success: true,
          data: { b64_json: part.inlineData.data },
          provider: "nanobanana",
        };
      }
    }
    
    return {
      success: false,
      error: "No image generated in response",
      provider: "nanobanana",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
      provider: "nanobanana",
    };
  }
}

async function generateHeroImage(params: {
  businessName: string;
  businessIdea: string;
  industry: string;
  style?: string;
  brandColors?: { primary: string };
}): Promise<ConnectorResult<{ b64_json?: string; url?: string }>> {
  const prompt = `Professional hero image for ${params.businessName}, a ${params.industry} business. 
${params.businessIdea}. 
Create a stunning, modern, high-quality image suitable for a website hero section.
Style: ${params.style || "modern professional"}, premium quality, award-winning design.
Do NOT include any text or letters in the image.`;
  
  return generateImage({ prompt, aspectRatio: "16:9", style: "photorealistic" });
}

async function generateLogo(params: {
  businessName: string;
  industry: string;
  style?: "minimal" | "bold" | "elegant" | "playful";
  brandColors?: { primary: string };
}): Promise<ConnectorResult<{ b64_json?: string; url?: string }>> {
  const prompt = `Create a professional logo for "${params.businessName}", a ${params.industry} business.
Style: ${params.style || "minimal"}, modern, clean, memorable.
Logo should be versatile and work on both light and dark backgrounds.
${params.brandColors?.primary ? `Use color: ${params.brandColors.primary}` : ""}
Create a simple, iconic mark that represents the brand essence.`;
  
  return generateImage({ prompt, aspectRatio: "1:1", style: "minimal" });
}

async function generateMarketingGraphic(params: {
  type: "instagram_post" | "facebook_ad" | "story" | "banner";
  headline: string;
  businessName: string;
  style?: string;
}): Promise<ConnectorResult<{ b64_json?: string; url?: string }>> {
  const aspectRatios: Record<string, "1:1" | "16:9" | "9:16" | "4:3"> = {
    instagram_post: "1:1",
    facebook_ad: "16:9",
    story: "9:16",
    banner: "16:9",
  };
  
  const prompt = `Marketing graphic for ${params.businessName}.
Headline: "${params.headline}"
Type: ${params.type.replace("_", " ")}
Style: ${params.style || "modern, professional, eye-catching"}
Include the text "${params.headline}" prominently in the design.
Make it scroll-stopping and conversion-focused.`;
  
  return generateImage({
    prompt,
    aspectRatio: aspectRatios[params.type] || "1:1",
    style: "vibrant",
  });
}

async function executeTask<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
  switch (task.action) {
    case "generate_image":
      return generateImage(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_hero_image":
      return generateHeroImage(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_logo":
      return generateLogo(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_marketing_graphic":
      return generateMarketingGraphic(task.input as any) as Promise<ConnectorResult<O>>;
    default:
      return {
        success: false,
        error: `Unknown action: ${task.action}`,
        provider: "nanobanana",
      };
  }
}

export const nanoBananaConnector = defineConnector({
  key: "nanobanana",
  name: "Nano Banana Pro (Google)",
  description: "Next-level AI graphics with superior text rendering for logos, heroes, and marketing assets",
  category: "ai",
  capabilities: ["image_generation", "graphics_generation"],
  authType: "apiKey",
  requiredEnvVars: ["GOOGLE_AI_API_KEY"],
  isConfigured: () => !!process.env.GOOGLE_AI_API_KEY,
  execute: executeTask,
});
