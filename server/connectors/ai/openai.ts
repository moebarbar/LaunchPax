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
          baseName?: string;
          count?: number;
        };
        
        const baseNameContext = input.baseName 
          ? `The user has named their business "${input.baseName}". Generate creative variations and similar-sounding alternatives.`
          : "";
        
        const prompt = `Generate ${input.count || 15} creative, memorable business names for:
Business idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Brand tone: ${input.tone}` : ""}
${baseNameContext}

Requirements:
- Names should be unique, brandable, and easy to spell
- Include variations of the base name if provided
- Suitable for domain registration (short, no special characters)
- Modern and professional

Return a JSON object with a "names" array containing the business name strings.
Example: {"names": ["BrandName1", "BrandName2"]}`;

        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let names: string[] = [];
        try {
          const parsed = JSON.parse(content);
          names = parsed.names || parsed.suggestions || parsed.businessNames || [];
          if (!Array.isArray(names)) {
            names = Object.values(parsed).find(v => Array.isArray(v)) as string[] || [];
          }
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse JSON response:", content);
          throw new Error("Failed to parse AI response");
        }

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

        const prompt = `Create a brand kit for:
Business: ${input.businessName}
Idea: ${input.businessIdea}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.tone ? `Desired tone: ${input.tone}` : ""}

Return a JSON object with these fields:
- brandVoice: string (2-3 sentences about brand personality)
- taglines: array of 5 short taglines
- colorPalette: array of {name, hex, usage} objects for 5 colors
- fontPairings: array with one {heading, body} object using Google Font names
- messagingPillars: array of 3 {title, description} objects
- elevatorPitch: string (2-3 sentence pitch)`;

        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let brandKit: Record<string, unknown> = {};
        try {
          brandKit = JSON.parse(content);
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse brand kit JSON:", content);
          throw new Error("Failed to parse AI response for brand kit");
        }

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
          targetAudience?: string;
          location?: string;
        };

        const pageList = input.pages || ["home", "about", "services", "contact"];
        const tone = input.tone || "professional";
        const industry = input.industry || "business";

        const prompt = `You are an expert website copywriter creating a COMPLETE professional multi-page website.

BUSINESS DETAILS:
- Name: ${input.businessName}
- Description: ${input.businessIdea}
- Industry: ${industry}
- Target Audience: ${input.targetAudience || "general consumers"}
- Location: ${input.location || "United States"}
- Tone: ${tone}
${input.brandVoice ? `- Brand Voice: ${input.brandVoice}` : ""}

CREATE THESE PAGES: ${pageList.join(", ")}

SECTION TYPES TO USE (with their data structures):
- "hero": {headline, subheadline, ctaText, ctaLink} - Bold opening with compelling headline
- "features": {headline, subheadline, items:[{title, description, icon}]} - 4-6 feature cards. Icons: star, shield, zap, heart, target, users, clock, check, award, globe
- "services": {headline, subheadline, items:[{title, description, icon, price}]} - Detailed service offerings
- "testimonials": {headline, items:[{quote, author, role, company}]} - 3-4 customer testimonials with realistic names/companies
- "team": {headline, subheadline, members:[{name, role, bio}]} - 3-4 team members
- "stats": {headline, items:[{value, label, suffix}]} - Impressive statistics like "500+" "99%" "10K+"
- "pricing": {headline, subheadline, plans:[{name, price, period, features:[], highlighted, ctaText}]} - 2-3 pricing tiers
- "faq": {headline, items:[{question, answer}]} - 5-6 common questions with detailed answers
- "cta": {headline, subheadline, buttonText, buttonLink} - Call-to-action banner
- "text": {headline, content, alignment} - Rich text block for about/story content
- "contact": {headline, subheadline, email, phone, address, showForm:true}

PAGE STRUCTURE REQUIREMENTS:
1. HOME: hero + features (6 items) + services (4 items) + stats (4 items) + testimonials (3 items) + cta = 6 sections
2. ABOUT: hero + text (company story, 3 paragraphs) + team (4 members) + stats (4 items) + cta = 5 sections
3. SERVICES: hero + services (6 detailed) + pricing (3 tiers) + faq (6 items) + cta = 5 sections
4. CONTACT: hero + contact + text (additional info) + cta = 4 sections

CONTENT QUALITY REQUIREMENTS:
- Write compelling, specific headlines (not generic)
- Subheadlines should be 2-3 sentences explaining value
- Feature descriptions should be 15-25 words each
- Testimonial quotes should be 25-40 words each
- Team bios should be 20-30 words each
- FAQ answers should be 30-50 words each
- Use realistic statistics (e.g., "500+ Happy Clients", "10+ Years Experience", "98% Satisfaction Rate")
- Make CTAs action-oriented and specific to the business

RETURN THIS EXACT JSON STRUCTURE:
{
  "pages": [
    {
      "slug": "home",
      "title": "Page Title | ${input.businessName}",
      "metaDescription": "SEO description 150-160 chars",
      "sections": [...]
    }
  ],
  "globalContent": {
    "siteName": "${input.businessName}",
    "tagline": "Compelling 5-8 word tagline",
    "navigation": [
      {"label": "Home", "href": "/"},
      {"label": "About", "href": "/about"},
      {"label": "Services", "href": "/services"},
      {"label": "Contact", "href": "/contact"}
    ],
    "footer": {
      "copyright": "© 2024 ${input.businessName}. All rights reserved.",
      "links": [{"label": "Privacy Policy", "href": "/privacy"}, {"label": "Terms of Service", "href": "/terms"}],
      "socialLinks": [{"platform": "twitter", "url": "#"}, {"platform": "linkedin", "url": "#"}, {"platform": "facebook", "url": "#"}]
    }
  },
  "siteSettings": {
    "primaryColor": "#hex appropriate for industry",
    "secondaryColor": "#hex complementary",
    "accentColor": "#hex highlight color",
    "style": "modern"
  }
}`;

        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 12000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let websiteContent: Record<string, unknown> = {};
        try {
          websiteContent = JSON.parse(content);
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse website content JSON:", content);
          throw new Error("Failed to parse AI response for website content");
        }

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

        const types = input.types || ["instagram_post", "facebook_ad"];

        const prompt = `Create design briefs for marketing graphics for ${input.businessName}.
Business idea: ${input.businessIdea}
Create 2-3 briefs for these types: ${types.join(", ")}

Return JSON with "graphics" array. Each item has: type, name, dimensions, designBrief (object with prompt, style, colors array, mood), copyText.`;

        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || "{}";
        
        let graphics: Record<string, unknown> = {};
        try {
          graphics = JSON.parse(content);
        } catch (parseError) {
          console.error("[OpenAI] Failed to parse graphics briefs JSON:", content);
          throw new Error("Failed to parse AI response for graphics briefs");
        }

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
