import { GoogleGenAI, Modality } from "@google/genai";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * Google Studio Connector
 * 
 * Provides: image_generation, graphics_generation, text_generation
 * 
 * Uses Google's Gemini and Imagen models for:
 * - Text generation (Gemini 2.0 Flash)
 * - Image generation (Imagen 3)
 * - Multimodal content (Gemini with vision)
 */

// Available models
const MODELS = {
  // Text generation
  TEXT_FAST: "gemini-2.0-flash",
  TEXT_PRO: "gemini-1.5-pro",
  // Image generation 
  IMAGE_GEN: "imagen-3.0-generate-002",
  // Multimodal (vision + text)
  MULTIMODAL: "gemini-2.0-flash",
};

function getClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is required for Google Studio connector");
  }
  return new GoogleGenAI({ apiKey });
}

async function generateText(params: {
  prompt: string;
  model?: "fast" | "pro";
  maxTokens?: number;
}): Promise<ConnectorResult<{ text: string }>> {
  try {
    const client = getClient();
    const modelName = params.model === "pro" ? MODELS.TEXT_PRO : MODELS.TEXT_FAST;
    
    const response = await client.models.generateContent({
      model: modelName,
      contents: params.prompt,
    });
    
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return {
      success: true,
      data: { text },
      provider: "nanobanana",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate text",
      provider: "nanobanana",
    };
  }
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
    
    // Use Imagen 3 for image generation
    const response = await client.models.generateImages({
      model: MODELS.IMAGE_GEN,
      prompt: enhancedPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: params.aspectRatio || "1:1",
      },
    });
    
    // Extract image from response
    const images = response.generatedImages || [];
    if (images.length > 0 && images[0].image?.imageBytes) {
      return {
        success: true,
        data: { b64_json: images[0].image.imageBytes },
        provider: "nanobanana",
      };
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

// Industry-specific icon design inspiration for logos
const INDUSTRY_LOGO_STYLES: Record<string, { symbols: string; style: string; mood: string }> = {
  healthcare: { symbols: "medical cross, heart, pulse line, stethoscope", style: "clean trustworthy", mood: "caring professional" },
  dental: { symbols: "stylized tooth, smile curve, clean lines", style: "fresh clean", mood: "friendly reassuring" },
  medical: { symbols: "medical cross, caduceus simplified, heart", style: "professional modern", mood: "trusted expert" },
  technology: { symbols: "hexagon, circuit node, data flow, abstract tech", style: "futuristic sleek", mood: "innovative cutting-edge" },
  software: { symbols: "code brackets, abstract circuit, geometric shapes", style: "modern tech", mood: "smart innovative" },
  saas: { symbols: "cloud abstract, connected nodes, upward arrow", style: "clean modern", mood: "efficient scalable" },
  food: { symbols: "chef hat, utensils crossed, flame, leaf", style: "warm inviting", mood: "delicious authentic" },
  restaurant: { symbols: "fork knife elegant, plate circle, chef elements", style: "sophisticated", mood: "refined culinary" },
  bakery: { symbols: "wheat stalk, rolling pin, bread loaf", style: "artisan warm", mood: "homemade authentic" },
  coffee: { symbols: "coffee cup steam, bean abstract, mug silhouette", style: "cozy modern", mood: "energizing inviting" },
  fitness: { symbols: "dumbbell abstract, runner silhouette, mountain peak", style: "dynamic powerful", mood: "energetic strong" },
  beauty: { symbols: "flower petal, elegant curves, butterfly wing", style: "elegant refined", mood: "luxurious beautiful" },
  salon: { symbols: "scissors stylized, mirror frame, hair flowing", style: "chic modern", mood: "stylish trendy" },
  real_estate: { symbols: "house roof, key abstract, building skyline", style: "solid trustworthy", mood: "reliable home" },
  finance: { symbols: "upward arrow, shield, chart growth", style: "strong stable", mood: "secure prosperous" },
  legal: { symbols: "balance scales, pillar, shield", style: "authoritative classic", mood: "just powerful" },
  education: { symbols: "book open, lightbulb, graduation cap", style: "inspiring modern", mood: "enlightening growth" },
  construction: { symbols: "hammer, building frame, hard hat", style: "solid strong", mood: "reliable built-to-last" },
  automotive: { symbols: "steering wheel, speedometer, road", style: "dynamic sleek", mood: "powerful fast" },
  travel: { symbols: "compass, plane abstract, globe", style: "adventurous modern", mood: "exciting discovery" },
  photography: { symbols: "camera lens, aperture, frame", style: "creative artistic", mood: "capturing moments" },
  creative: { symbols: "paintbrush, pencil, abstract shapes", style: "artistic bold", mood: "innovative expressive" },
  agency: { symbols: "lightning bolt, rocket, star burst", style: "dynamic impactful", mood: "innovative powerful" },
  ecommerce: { symbols: "shopping bag, cart abstract, box", style: "modern clean", mood: "easy convenient" },
  consulting: { symbols: "arrow pointing up, handshake, lightbulb", style: "professional elegant", mood: "expert trusted" },
  wellness: { symbols: "lotus flower, wave, zen circle", style: "calm peaceful", mood: "balanced serene" },
  spa: { symbols: "lotus, water drop, zen stones", style: "serene elegant", mood: "relaxing luxurious" },
};

async function generateLogo(params: {
  businessName: string;
  industry: string;
  style?: "minimal" | "bold" | "elegant" | "playful";
  brandColors?: { primary: string };
  includeText?: boolean;
}): Promise<ConnectorResult<{ b64_json?: string; url?: string }>> {
  const normalizedIndustry = params.industry.toLowerCase();
  
  // Find matching industry style
  let industryStyle = INDUSTRY_LOGO_STYLES["consulting"]; // default
  for (const [key, value] of Object.entries(INDUSTRY_LOGO_STYLES)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry.split(" ")[0])) {
      industryStyle = value;
      break;
    }
  }
  
  const styleDescriptions: Record<string, string> = {
    minimal: "ultra-clean, refined negative space, geometric simplicity",
    bold: "strong impactful, thick lines, commanding presence",
    elegant: "sophisticated curves, refined proportions, premium feel",
    playful: "friendly approachable, soft edges, welcoming warmth",
  };

  const prompt = `Create a COMBINATION LOGO for "${params.businessName}" - a ${params.industry} business.

DESIGN REQUIREMENTS:
1. LEFT SIDE: A creative icon/symbol inspired by: ${industryStyle.symbols}
2. RIGHT SIDE: The business name "${params.businessName}" in stylish typography
3. The icon and text should be perfectly balanced and work as one unified mark

STYLE DIRECTION:
- Overall mood: ${industryStyle.mood}
- Visual style: ${styleDescriptions[params.style || "minimal"]}
- Icon style: ${industryStyle.style}
${params.brandColors?.primary ? `- Primary color: ${params.brandColors.primary}` : "- Use sophisticated color palette"}

CRITICAL REQUIREMENTS:
- The name "${params.businessName}" MUST be spelled correctly and clearly readable
- Icon should work as standalone favicon (simple, recognizable at 16px)
- Clean white or light background
- Professional quality suitable for premium brand
- Text should use a modern, legible typeface
- Icon and text should be perfectly aligned and proportioned
- Design should look like it belongs to a $100k+ brand
- NO gradients, NO 3D effects, NO complex details
- Vector-quality sharp edges`;
  
  return generateImage({ prompt, aspectRatio: "4:3", style: "minimal" });
}

async function generateFaviconIcon(params: {
  businessName: string;
  industry: string;
  brandColors?: { primary: string };
}): Promise<ConnectorResult<{ b64_json?: string; url?: string }>> {
  const normalizedIndustry = params.industry.toLowerCase();
  
  // Find matching industry style
  let industryStyle = INDUSTRY_LOGO_STYLES["consulting"];
  for (const [key, value] of Object.entries(INDUSTRY_LOGO_STYLES)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry.split(" ")[0])) {
      industryStyle = value;
      break;
    }
  }
  
  const prompt = `Create a FAVICON ICON for "${params.businessName}" (${params.industry} business).

DESIGN:
- Simple, bold icon inspired by: ${industryStyle.symbols}
- MUST work at 16x16 pixels - keep it EXTREMELY simple
- Strong silhouette with clear shape recognition
- Perfect for app icon, browser tab, social profile

STYLE:
${params.brandColors?.primary ? `- Use color: ${params.brandColors.primary}` : "- Use bold, saturated color"}
- NO text, NO letters, pure symbol/icon only
- Thick lines, simple shapes, high contrast
- Clean white background, perfectly centered
- Think Apple/Nike level iconic simplicity

FORBIDDEN:
- NO gradients, NO shadows, NO 3D effects
- NO tiny details that disappear at small sizes
- NO complex patterns or textures`;
  
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
    case "generate_text":
      return generateText(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_image":
      return generateImage(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_hero_image":
      return generateHeroImage(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_logo":
      return generateLogo(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_favicon":
      return generateFaviconIcon(task.input as any) as Promise<ConnectorResult<O>>;
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

export const googleStudioConnector = defineConnector({
  key: "nanobanana",
  name: "Google Studio",
  description: "AI powered by Google Gemini (text) and Imagen 3 (graphics) for content, logos, heroes, and marketing assets",
  category: "ai",
  capabilities: ["image_generation", "graphics_generation", "text_generation", "content_generation"],
  authType: "apiKey",
  requiredEnvVars: ["GOOGLE_API_KEY"],
  isConfigured: () => !!process.env.GOOGLE_API_KEY,
  execute: executeTask,
  async test() {
    if (!process.env.GOOGLE_API_KEY) {
      return { ok: false, message: "GOOGLE_API_KEY is not configured" };
    }
    try {
      const client = getClient();
      const response = await client.models.generateContent({
        model: MODELS.TEXT_FAST,
        contents: "Say hello in one word",
      });
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return { ok: true, message: `Google Studio API connected: ${text.trim()}` };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Connection failed" };
    }
  },
});
