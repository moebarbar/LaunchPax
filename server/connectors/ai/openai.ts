import OpenAI from "openai";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * OpenAI Connector (via Replit AI Integrations)
 * 
 * Provides: name_generation, brand_generation, content_generation, text_generation
 * 
 * Uses Replit AI Integrations which provides OpenAI-compatible API access
 * without requiring user's own API key.
 */

function getClient() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "",
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

export const openaiConnector = defineConnector({
  key: "openai",
  name: "OpenAI (via Replit AI)",
  description: "AI text and content generation powered by GPT models",
  category: "ai",
  capabilities: ["name_generation", "brand_generation", "content_generation", "text_generation"],
  authType: "bearer",
  requiredEnvVars: ["AI_INTEGRATIONS_OPENAI_API_KEY", "AI_INTEGRATIONS_OPENAI_BASE_URL"],

  isConfigured() {
    return !!(
      process.env.AI_INTEGRATIONS_OPENAI_API_KEY &&
      process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
    );
  },

  async test() {
    if (!this.isConfigured()) {
      return { ok: false, message: "OpenAI API not configured" };
    }
    try {
      const client = getClient();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say 'ok'" }],
        max_completion_tokens: 10,
      });
      return { ok: true, message: "OpenAI connection successful" };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Connection failed",
      };
    }
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const client = getClient();

    switch (task.action) {
      case "generate_names": {
        const input = task.input as {
          businessIdea: string;
          industry?: string;
          tone?: string;
          count?: number;
        };
        
        const prompt = `Generate ${input.count || 25} creative, memorable business names for:
Business idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Brand tone: ${input.tone}` : ""}

Requirements:
- Names should be unique, brandable, and easy to spell
- Mix of invented words, compound words, and creative spellings
- Suitable for domain registration
- Modern and professional

Return ONLY a JSON array of strings with the names, no explanations.`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        const names = parsed.names || parsed.suggestions || [];

        return {
          success: true,
          data: names as O,
          provider: "openai",
        };
      }

      case "generate_brand_kit": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          industry?: string;
          tone?: string;
          targetAudience?: string;
        };

        const prompt = `Create a complete brand kit for:
Business: ${input.businessName}
Idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Desired tone: ${input.tone}` : ""}
${input.targetAudience ? `Target audience: ${input.targetAudience}` : ""}

Generate a JSON object with:
{
  "brandVoice": "2-3 sentence description of the brand's personality and communication style",
  "taglines": ["array of 5 short, punchy taglines"],
  "colorPalette": [
    {"name": "Primary", "hex": "#XXXXXX", "usage": "Main brand color"},
    {"name": "Secondary", "hex": "#XXXXXX", "usage": "Accent color"},
    {"name": "Background", "hex": "#XXXXXX", "usage": "Background"},
    {"name": "Text", "hex": "#XXXXXX", "usage": "Body text"},
    {"name": "Accent", "hex": "#XXXXXX", "usage": "Highlights and CTAs"}
  ],
  "fontPairings": [
    {"heading": "Font name for headings", "body": "Font name for body text", "accent": "Optional accent font"}
  ],
  "messagingPillars": [
    {"title": "Pillar name", "description": "1-2 sentences explaining this messaging pillar"}
  ],
  "elevatorPitch": "A compelling 2-3 sentence pitch for the business"
}

Use real Google Font names. Colors should work well together.`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        const brandKit = JSON.parse(content);

        return {
          success: true,
          data: brandKit as O,
          provider: "openai",
        };
      }

      case "generate_website_content": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          industry?: string;
          tone?: string;
          brandVoice?: string;
          pages?: string[];
        };

        const pageList = input.pages || ["home", "about", "services", "contact"];

        const prompt = `Generate structured website content for:
Business: ${input.businessName}
Idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Tone: ${input.tone}` : ""}
${input.brandVoice ? `Brand voice: ${input.brandVoice}` : ""}

Create content for pages: ${pageList.join(", ")}

Return a JSON object with this structure:
{
  "pages": [
    {
      "slug": "home",
      "title": "Page Title",
      "metaDescription": "SEO description",
      "sections": [
        {
          "id": "unique-id",
          "type": "hero",
          "data": {
            "headline": "Main headline",
            "subheadline": "Supporting text",
            "ctaText": "Get Started",
            "ctaLink": "/contact"
          }
        },
        {
          "id": "unique-id-2",
          "type": "features",
          "data": {
            "headline": "Why Choose Us",
            "items": [
              {"title": "Feature 1", "description": "Description", "icon": "star"},
              {"title": "Feature 2", "description": "Description", "icon": "shield"}
            ]
          }
        }
      ]
    }
  ],
  "globalContent": {
    "siteName": "${input.businessName}",
    "navigation": [
      {"label": "Home", "href": "/"},
      {"label": "About", "href": "/about"}
    ],
    "footer": {
      "copyright": "© 2025 ${input.businessName}",
      "links": []
    }
  },
  "siteSettings": {
    "style": "modern"
  }
}

Section types: hero, features, cta, testimonials, pricing, contact, text, stats, team
Make content professional, engaging, and specific to the business.`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 4000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        const websiteContent = JSON.parse(content);

        return {
          success: true,
          data: websiteContent as O,
          provider: "openai",
        };
      }

      case "generate_graphics_briefs": {
        const input = task.input as {
          businessName: string;
          businessIdea: string;
          brandColors?: string[];
          types?: string[];
        };

        const types = input.types || ["instagram_post", "story", "facebook_ad"];

        const prompt = `Create design briefs and copy for marketing graphics:
Business: ${input.businessName}
Idea: ${input.businessIdea}
${input.brandColors?.length ? `Brand colors: ${input.brandColors.join(", ")}` : ""}

Generate briefs for: ${types.join(", ")}

Return JSON:
{
  "graphics": [
    {
      "type": "instagram_post",
      "name": "Launch Announcement",
      "dimensions": "1080x1080",
      "designBrief": {
        "prompt": "Detailed image generation prompt",
        "style": "minimal/bold/playful",
        "colors": ["#hex1", "#hex2"],
        "elements": ["logo", "tagline", "product"],
        "mood": "professional and modern"
      },
      "copyText": "Caption text with hashtags"
    }
  ]
}

Create 3-5 graphics per type requested.`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 3000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        const graphics = JSON.parse(content);

        return {
          success: true,
          data: graphics as O,
          provider: "openai",
        };
      }

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "openai",
        };
    }
  },
});
