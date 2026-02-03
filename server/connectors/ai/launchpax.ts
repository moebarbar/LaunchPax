import OpenAI from "openai";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * LaunchPax Engine Connector (powered by DeepSeek)
 * 
 * Provides: text_generation, content_generation, long_form_content
 * 
 * A cost-effective AI solution for generating long-form content,
 * articles, and detailed copy at a fraction of the cost of other models.
 */

function getClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is required for LaunchPax connector");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });
}

async function generateContent(params: {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<ConnectorResult<{ content: string }>> {
  try {
    const client = getClient();
    
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional copywriter and content strategist. Create compelling, unique, and high-quality content that avoids generic phrases and template-like language.",
        },
        { role: "user", content: params.prompt },
      ],
      max_tokens: params.maxTokens || 2000,
      temperature: params.temperature || 0.7,
    });

    const content = response.choices[0]?.message?.content || "";
    
    return {
      success: true,
      data: { content },
      provider: "launchpax",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Content generation failed",
      provider: "launchpax",
    };
  }
}

async function generateLongFormContent(params: {
  topic: string;
  businessName: string;
  industry: string;
  contentType: string;
  wordCount?: number;
  tone?: string;
}): Promise<ConnectorResult<{ content: string; title: string; summary: string }>> {
  try {
    const client = getClient();
    
    const prompt = `Write a ${params.contentType} for ${params.businessName}, a ${params.industry} business.

Topic: ${params.topic}
Target length: approximately ${params.wordCount || 500} words
Tone: ${params.tone || "professional and engaging"}

Requirements:
- Write compelling, specific content (no generic phrases like "Welcome to" or "Your trusted partner")
- Include concrete details, examples, and unique insights
- Create content that feels authentic and tailored to this specific business
- Use engaging storytelling techniques
- Structure with clear sections if appropriate

Provide the response in this JSON format:
{
  "title": "Compelling headline",
  "summary": "2-3 sentence executive summary",
  "content": "The full article content with paragraphs separated by double newlines"
}`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an elite content strategist and writer. Create exceptional, publication-ready content that rivals top agency work. Always respond with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: params.wordCount ? Math.max(params.wordCount * 2, 2000) : 2000,
      temperature: 0.7,
    });

    const rawContent = response.choices[0]?.message?.content || "";
    
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: {
            title: parsed.title || "Untitled",
            summary: parsed.summary || "",
            content: parsed.content || rawContent,
          },
          provider: "launchpax",
        };
      }
    } catch {
      // If JSON parsing fails, use raw content
    }
    
    return {
      success: true,
      data: {
        title: `About ${params.businessName}`,
        summary: "",
        content: rawContent,
      },
      provider: "launchpax",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Long-form content generation failed",
      provider: "launchpax",
    };
  }
}

async function generateWebsiteContent(params: {
  businessName: string;
  businessIdea: string;
  industry: string;
  tone?: string;
  pages?: string[];
}): Promise<ConnectorResult<any>> {
  try {
    const client = getClient();
    
    const prompt = `Create website content for "${params.businessName}", a ${params.industry} business.

Business idea: ${params.businessIdea}
Tone: ${params.tone || "professional"}
Pages needed: ${(params.pages || ["home", "about", "services", "contact"]).join(", ")}

For each page, create sections with compelling headlines, subheadlines, and body copy.

CRITICAL REQUIREMENTS:
- NO generic phrases: Avoid "Welcome to", "Your trusted partner", "Best in class", "Leading provider"
- Write specific, benefit-focused copy that speaks to real customer needs
- Include concrete value propositions and differentiators
- Create magnetic headlines that capture attention
- Use power words and emotional triggers appropriately

Return valid JSON with this structure:
{
  "pages": [
    {
      "title": "Page Title",
      "slug": "page-slug",
      "sections": [
        {
          "type": "hero|features|cta|text|testimonials|services|stats|faq|team|gallery|contact",
          "data": { section-specific content }
        }
      ]
    }
  ],
  "globalContent": {
    "siteName": "${params.businessName}",
    "tagline": "Compelling tagline"
  },
  "siteSettings": {
    "primaryColor": "#4F46E5"
  }
}`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert website copywriter and UX strategist. Create conversion-focused website content. Always respond with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const rawContent = response.choices[0]?.message?.content || "";
    
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: parsed,
          provider: "launchpax",
        };
      }
    } catch {
      // JSON parsing failed
    }
    
    return {
      success: false,
      error: "Failed to parse website content response",
      provider: "launchpax",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Website content generation failed",
      provider: "launchpax",
    };
  }
}

async function executeTask<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
  switch (task.action) {
    case "generate_content":
      return generateContent(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_long_form_content":
      return generateLongFormContent(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_website_content":
      return generateWebsiteContent(task.input as any) as Promise<ConnectorResult<O>>;
    default:
      return {
        success: false,
        error: `Unknown action: ${task.action}`,
        provider: "launchpax",
      };
  }
}

export const launchpaxConnector = defineConnector({
  key: "launchpax",
  name: "LaunchPax Engine",
  description: "Cost-effective AI content generation for articles, long-form copy, and website content",
  category: "ai",
  capabilities: ["text_generation", "content_generation", "long_form_content"],
  authType: "apiKey",
  requiredEnvVars: [],
  isConfigured: () => !!process.env.DEEPSEEK_API_KEY,
  execute: executeTask,
  async test() {
    if (!process.env.DEEPSEEK_API_KEY) {
      return { ok: false, message: "DEEPSEEK_API_KEY is not configured" };
    }
    try {
      const client = getClient();
      const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Say hello" }],
        max_tokens: 10,
      });
      return { ok: true, message: "LaunchPax Engine connection successful" };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Connection failed" };
    }
  },
});
