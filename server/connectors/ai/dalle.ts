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

// Industry-specific icon design inspiration
const INDUSTRY_LOGO_STYLES: Record<string, { symbols: string; style: string; mood: string }> = {
  healthcare: { symbols: "medical cross, heart, pulse line", style: "clean trustworthy", mood: "caring professional" },
  dental: { symbols: "stylized tooth, smile curve", style: "fresh clean", mood: "friendly reassuring" },
  technology: { symbols: "hexagon, circuit node, abstract tech", style: "futuristic sleek", mood: "innovative" },
  software: { symbols: "code brackets, geometric shapes", style: "modern tech", mood: "smart innovative" },
  food: { symbols: "chef hat, utensils crossed, flame", style: "warm inviting", mood: "delicious authentic" },
  restaurant: { symbols: "fork knife elegant, plate circle", style: "sophisticated", mood: "refined culinary" },
  fitness: { symbols: "dumbbell abstract, runner silhouette", style: "dynamic powerful", mood: "energetic strong" },
  beauty: { symbols: "flower petal, elegant curves", style: "elegant refined", mood: "luxurious beautiful" },
  real_estate: { symbols: "house roof, key abstract", style: "solid trustworthy", mood: "reliable home" },
  finance: { symbols: "upward arrow, shield", style: "strong stable", mood: "secure prosperous" },
  education: { symbols: "book open, lightbulb", style: "inspiring modern", mood: "enlightening growth" },
  construction: { symbols: "hammer, building frame", style: "solid strong", mood: "reliable built-to-last" },
  consulting: { symbols: "arrow pointing up, lightbulb", style: "professional elegant", mood: "expert trusted" },
};

async function generateLogo(options: {
  businessName: string;
  industry: string;
  style: "modern" | "classic" | "playful" | "minimal" | "tech";
  colors?: string[];
  includeText?: boolean;
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const styleDescriptions: Record<string, string> = {
    modern: "sleek, contemporary, clean geometric lines, minimalist",
    classic: "timeless, traditional, elegant, refined",
    playful: "fun, friendly, approachable, vibrant",
    minimal: "ultra-simple, clean, iconic, refined whitespace",
    tech: "futuristic, digital, innovative, cutting-edge",
  };

  const normalizedIndustry = options.industry.toLowerCase();
  
  // Find matching industry style
  let industryStyle = INDUSTRY_LOGO_STYLES["consulting"];
  for (const [key, value] of Object.entries(INDUSTRY_LOGO_STYLES)) {
    if (normalizedIndustry.includes(key)) {
      industryStyle = value;
      break;
    }
  }

  const colorPart = options.colors?.length 
    ? `Brand colors: ${options.colors.slice(0, 3).join(", ")}. Use these colors prominently.` 
    : "";

  // Generate COMBINATION LOGO with business name
  const prompt = `Create a COMBINATION LOGO for "${options.businessName}" - a ${options.industry} business.

DESIGN REQUIREMENTS:
1. LEFT SIDE: A creative icon/symbol inspired by: ${industryStyle.symbols}
2. RIGHT SIDE: The business name "${options.businessName}" in stylish typography
3. The icon and text should be perfectly balanced as one unified mark

STYLE DIRECTION:
- Overall mood: ${industryStyle.mood}
- Visual style: ${styleDescriptions[options.style]}
- Icon style: ${industryStyle.style}
${colorPart}

CRITICAL REQUIREMENTS:
- The name "${options.businessName}" MUST be spelled correctly and clearly readable
- Icon should work as standalone favicon (simple, recognizable at 16px)
- Clean white background, perfectly centered
- Professional quality suitable for premium brand
- Vector-quality sharp edges
- NO gradients, NO 3D effects, NO complex details`;

  return generateImage({
    prompt,
    size: "1024x1024",
    quality: "hd",
    style: "natural",
  });
}

async function generateFavicon(options: {
  businessName: string;
  industry: string;
  colors?: string[];
}): Promise<ConnectorResult<ImageGenerationResult>> {
  const normalizedIndustry = options.industry.toLowerCase();
  
  let industryStyle = INDUSTRY_LOGO_STYLES["consulting"];
  for (const [key, value] of Object.entries(INDUSTRY_LOGO_STYLES)) {
    if (normalizedIndustry.includes(key)) {
      industryStyle = value;
      break;
    }
  }
  
  const colorPart = options.colors?.length 
    ? `Use color: ${options.colors[0]}` 
    : "Use bold, saturated color";

  const prompt = `Create a FAVICON ICON for "${options.businessName}" (${options.industry} business).

DESIGN:
- Simple, bold icon inspired by: ${industryStyle.symbols}
- MUST work at 16x16 pixels - keep it EXTREMELY simple
- Strong silhouette with clear shape recognition

STYLE:
- ${colorPart}
- NO text, NO letters, pure symbol/icon only
- Thick lines, simple shapes, high contrast
- Clean white background, perfectly centered
- Think Apple/Nike level iconic simplicity

FORBIDDEN:
- NO gradients, NO shadows, NO 3D effects
- NO tiny details that disappear at small sizes`;

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
          includeText: input.includeText,
        }) as Promise<ConnectorResult<O>>;

      case "generate_favicon":
        return generateFavicon({
          businessName: input.businessName,
          industry: input.industry,
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
