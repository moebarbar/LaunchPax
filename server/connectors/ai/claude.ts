import Anthropic from "@anthropic-ai/sdk";
import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * Claude (Anthropic) Connector
 * 
 * Provides: text_generation, content_generation, long_form_content
 * 
 * Uses Claude 3.5 Sonnet for high-quality long-form content generation.
 * Excellent for blog posts, detailed descriptions, and nuanced copy.
 */

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required for Claude connector");
  }
  return new Anthropic({ apiKey });
}

async function generateLongFormContent(params: {
  topic: string;
  businessName: string;
  industry: string;
  contentType: "blog_post" | "about_page" | "case_study" | "whitepaper" | "faq";
  wordCount?: number;
  tone?: string;
}): Promise<ConnectorResult<{ content: string; title: string; summary: string }>> {
  try {
    const client = getClient();
    const wordCount = params.wordCount || 800;
    
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are an expert content writer for ${params.businessName}, a ${params.industry} business.

Write a ${params.contentType.replace("_", " ")} about: ${params.topic}

Requirements:
- Approximately ${wordCount} words
- Tone: ${params.tone || "professional and engaging"}
- Include a compelling title
- Write for SEO with natural keyword integration
- Make it actionable and valuable for the reader

Respond with JSON:
{
  "title": "The article title",
  "content": "The full article content with proper paragraphs",
  "summary": "A 2-3 sentence summary"
}`
        }
      ],
    });
    
    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error("Unexpected response type from Claude");
    }
    
    // Extract JSON from markdown code blocks if present
    let jsonText = textContent.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }
    
    const result = JSON.parse(jsonText);
    
    return {
      success: true,
      data: {
        content: result.content,
        title: result.title,
        summary: result.summary,
      },
      provider: "claude",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate content",
      provider: "claude",
    };
  }
}

async function generateDetailedCopy(params: {
  section: string;
  businessName: string;
  industry: string;
  context: string;
  maxLength?: number;
}): Promise<ConnectorResult<{ copy: string }>> {
  try {
    const client = getClient();
    
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a premium copywriter for ${params.businessName} (${params.industry}).

Write compelling copy for: ${params.section}

Context: ${params.context}

Requirements:
- Maximum ${params.maxLength || 500} characters
- Be specific and benefit-focused
- Avoid generic phrases like "Welcome to" or "Your trusted partner"
- Create emotional connection
- Include a clear value proposition

Return just the copy text, no JSON formatting.`
        }
      ],
    });
    
    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error("Unexpected response type from Claude");
    }
    
    return {
      success: true,
      data: { copy: textContent.text.trim() },
      provider: "claude",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate copy",
      provider: "claude",
    };
  }
}

async function executeTask<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
  switch (task.action) {
    case "generate_long_form_content":
      return generateLongFormContent(task.input as any) as Promise<ConnectorResult<O>>;
    case "generate_detailed_copy":
      return generateDetailedCopy(task.input as any) as Promise<ConnectorResult<O>>;
    default:
      return {
        success: false,
        error: `Unknown action: ${task.action}`,
        provider: "claude",
      };
  }
}

export const claudeConnector = defineConnector({
  key: "claude",
  name: "Claude (Anthropic)",
  description: "Advanced AI for long-form content, nuanced copy, and detailed writing",
  category: "ai",
  capabilities: ["text_generation", "content_generation", "long_form_content"],
  authType: "apiKey",
  requiredEnvVars: ["ANTHROPIC_API_KEY"],
  isConfigured: () => !!process.env.ANTHROPIC_API_KEY,
  execute: executeTask,
  async test() {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { ok: false, message: "ANTHROPIC_API_KEY is not configured" };
    }
    try {
      const client = getClient();
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 10,
        messages: [{ role: "user", content: "Say hello" }],
      });
      return { ok: true, message: "Claude API connection successful" };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Connection failed" };
    }
  },
});
