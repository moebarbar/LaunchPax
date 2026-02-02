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

function getIndustryContext(industry: string): string {
  const contexts: Record<string, string> = {
    "Technology": `Focus on innovation, efficiency, and cutting-edge solutions. Emphasize scalability, security, and ROI. Use modern tech terminology. Testimonials should mention specific metrics and time savings.`,
    "Healthcare": `Prioritize trust, safety, and patient outcomes. Use empathetic language. Emphasize certifications, experience, and care quality. Include HIPAA compliance messaging where relevant.`,
    "Finance": `Convey stability, expertise, and trustworthiness. Use precise language. Emphasize security, returns, and regulatory compliance. Include fiduciary responsibility messaging.`,
    "Real Estate": `Focus on dreams, investment potential, and local expertise. Use aspirational language. Emphasize market knowledge, negotiation skills, and client success stories.`,
    "Restaurant": `Appeal to senses and experiences. Use vivid, appetizing descriptions. Emphasize quality ingredients, atmosphere, and memorable dining experiences.`,
    "Retail": `Focus on product quality, customer service, and convenience. Use engaging, benefit-driven language. Emphasize selection, value, and shopping experience.`,
    "Education": `Emphasize outcomes, expertise, and transformation. Use inspiring language. Focus on student success, methodology, and credentials.`,
    "Consulting": `Convey expertise, results, and strategic thinking. Use authoritative language. Emphasize case studies, methodology, and measurable outcomes.`,
    "Manufacturing": `Focus on quality, precision, and reliability. Use technical but accessible language. Emphasize capabilities, certifications, and production excellence.`,
    "Entertainment": `Create excitement and emotional connection. Use dynamic, engaging language. Emphasize unique experiences and memorable moments.`,
    "Legal": `Convey authority, experience, and client advocacy. Use professional language. Emphasize track record, expertise areas, and client confidentiality.`,
    "Marketing": `Demonstrate creativity and results-orientation. Use bold, confident language. Emphasize ROI, case studies, and innovative strategies.`,
    "Fitness": `Inspire action and transformation. Use motivational language. Emphasize results, expertise, and community.`,
    "Beauty": `Appeal to self-improvement and confidence. Use aspirational language. Emphasize expertise, quality products, and transformative results.`,
    "Travel": `Create wanderlust and excitement. Use vivid, experiential language. Emphasize unique experiences, expertise, and seamless service.`,
  };
  
  return contexts[industry] || `Focus on professionalism, quality, and customer satisfaction. Use clear, benefit-driven language. Emphasize experience, reliability, and results.`;
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
        model: "gpt-4o",
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
          model: "gpt-4o",
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
          model: "gpt-4o",
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

        const industryContext = getIndustryContext(industry);

        const prompt = `You are a world-class conversion copywriter and brand strategist. Create a PREMIUM, high-converting website that could win design awards.

BUSINESS PROFILE:
- Name: ${input.businessName}
- Core Offering: ${input.businessIdea}
- Industry: ${industry}
- Target Audience: ${input.targetAudience || "discerning professionals and businesses"}
- Location: ${input.location || "United States"}
- Brand Tone: ${tone}
${input.brandVoice ? `- Brand Voice: ${input.brandVoice}` : ""}

INDUSTRY-SPECIFIC GUIDANCE:
${industryContext}

PAGES TO CREATE: ${pageList.join(", ")}

AVAILABLE SECTION TYPES:
- "hero": {headline, subheadline, ctaText, ctaLink} - Powerful opening that stops visitors in their tracks
- "features": {headline, subheadline, items:[{title, description, icon}]} - Value propositions. Icons: star, shield, zap, heart, target, users, clock, check, award, globe, briefcase, settings, wrench, lightbulb
- "services": {headline, subheadline, items:[{title, description, icon, price, features:[]}]} - Detailed offerings with benefits
- "testimonials": {headline, subheadline, items:[{quote, author, role, company}]} - Social proof with compelling stories
- "team": {headline, subheadline, members:[{name, role, bio}]} - Humanize the brand
- "stats": {headline, items:[{value, label, suffix, prefix}]} - Credibility numbers
- "pricing": {headline, subheadline, plans:[{name, price, period, description, features:[], highlighted, ctaText}]} - Clear value tiers
- "faq": {headline, subheadline, items:[{question, answer}]} - Objection handling
- "cta": {headline, subheadline, buttonText, buttonLink} - Conversion driver
- "text": {headline, content, alignment} - Story and context
- "contact": {headline, subheadline, email, phone, address, showForm:true}

PAGE BLUEPRINTS:
1. HOME (6 sections): hero → features (6 items) → stats (4 credibility numbers) → services (4 highlighted) → testimonials (3 compelling stories) → cta
2. ABOUT (5 sections): hero → text (origin story, mission, vision - 3 rich paragraphs) → team (4 members with personality) → stats → cta
3. SERVICES (5 sections): hero → services (6 comprehensive offerings) → pricing (3 tiers: starter/professional/enterprise) → faq (6 objection-handlers) → cta
4. CONTACT (4 sections): hero → contact (with form) → text (response commitment, office hours) → cta

COPYWRITING EXCELLENCE REQUIREMENTS:
- Headlines: Use power words, create curiosity, promise transformation. NO generic phrases like "Welcome to" or "About Us"
- Subheadlines: Expand on the promise with specific benefits. 2-3 sentences that build desire.
- Features: Each title should be a benefit statement (not a feature name). Descriptions 20-30 words explaining the transformation.
- Testimonials: Write as real people speak. Include specific results or emotions. 30-50 words per quote. Use diverse realistic names.
- Team: Give each member a distinct personality. Include a unique achievement or passion. 25-35 words.
- FAQ: Address real objections and fears. Answers should reassure and build confidence. 40-60 words each.
- CTAs: Create urgency without being pushy. Personalize to the action ("Get My Free Strategy Call" not "Submit")
- Stats: Use believable but impressive numbers with context

COLOR PSYCHOLOGY (choose based on ${industry}):
- Professional services: Deep blues (#1e40af), slate grays, gold accents
- Healthcare/Wellness: Calming teals (#0d9488), soft greens, warm neutrals
- Technology: Electric blues (#3b82f6), vibrant purples, modern gradients
- Creative/Agency: Bold primaries, unexpected combinations
- Finance: Navy (#1e3a5a), forest green (#166534), gold
- Food/Restaurant: Warm oranges (#ea580c), rich reds, earthy tones
- Real Estate: Sophisticated navy (#1e3a8a), gold (#ca8a04), warm grays

JSON STRUCTURE (follow exactly):
{
  "pages": [
    {
      "slug": "home",
      "title": "Compelling Page Title | ${input.businessName}",
      "metaDescription": "SEO-optimized description with keywords, 150-160 chars",
      "sections": [
        {"id": "unique-id", "type": "section-type", "data": {...}}
      ]
    }
  ],
  "globalContent": {
    "siteName": "${input.businessName}",
    "tagline": "Memorable 5-8 word value proposition",
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
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "style": "modern",
    "fontFamily": "Inter",
    "headingFont": "Poppins"
  }
}`;

        const response = await client.chat.completions.create({
          model: "gpt-4o",
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
          model: "gpt-4o",
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
