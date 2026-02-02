import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

/**
 * Mock AI Connector
 * 
 * Provides fallback mock data when no real AI connector is available.
 * Used for demonstration and development purposes.
 */

export const mockAIConnector = defineConnector({
  key: "ai_mock",
  name: "Mock AI (Demo Mode)",
  description: "Fallback mock data for demonstration when AI APIs are unavailable",
  category: "ai",
  capabilities: ["name_generation", "brand_generation", "content_generation", "text_generation"],
  authType: "none",
  requiredEnvVars: [],

  isConfigured() {
    return true; // Always available as fallback
  },

  async test() {
    return { ok: true, message: "Mock connector always available" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    switch (task.action) {
      case "generate_names": {
        const input = task.input as { businessIdea: string; industry?: string };
        const baseName = input.industry || "Business";
        
        const names = [
          `${baseName}Flow`,
          `${baseName}Hub`,
          `${baseName}Spark`,
          `${baseName}Wave`,
          `${baseName}Sync`,
          `Bright${baseName}`,
          `${baseName}ify`,
          `${baseName}Labs`,
          `Pure${baseName}`,
          `${baseName}Craft`,
          `Nova${baseName}`,
          `${baseName}Nest`,
          `${baseName}Pulse`,
          `Zen${baseName}`,
          `${baseName}Forge`,
          `Swift${baseName}`,
          `${baseName}Bridge`,
          `${baseName}Sphere`,
          `Prime${baseName}`,
          `${baseName}Edge`,
        ].slice(0, 20);

        return {
          success: true,
          data: names as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_brand_kit": {
        const input = task.input as { businessName: string; tone?: string };
        
        const brandKit = {
          brandVoice: `${input.businessName} speaks with a ${input.tone || "professional"} and approachable voice. We believe in clarity, reliability, and building lasting relationships with our customers.`,
          taglines: [
            `${input.businessName} - Where Innovation Meets Excellence`,
            "Building Tomorrow, Today",
            "Your Success, Our Mission",
            "Elevate Your Experience",
            "Simplicity. Quality. Results.",
          ],
          colorPalette: [
            { name: "Primary", hex: "#2563eb", usage: "Main brand color, CTAs" },
            { name: "Secondary", hex: "#7c3aed", usage: "Accents and highlights" },
            { name: "Background", hex: "#f8fafc", usage: "Page backgrounds" },
            { name: "Text", hex: "#1e293b", usage: "Body text" },
            { name: "Accent", hex: "#10b981", usage: "Success states, highlights" },
          ],
          fontPairings: [
            { heading: "Inter", body: "Inter", accent: "JetBrains Mono" },
            { heading: "Poppins", body: "Open Sans" },
          ],
          messagingPillars: [
            { title: "Innovation", description: "We constantly push boundaries to deliver cutting-edge solutions." },
            { title: "Reliability", description: "Our customers trust us to deliver consistent, dependable results." },
            { title: "Customer Focus", description: "Every decision we make starts with our customers' needs." },
          ],
          elevatorPitch: `${input.businessName} helps businesses achieve their goals through innovative solutions. We combine cutting-edge technology with exceptional service to deliver results that exceed expectations.`,
        };

        return {
          success: true,
          data: brandKit as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_website_content": {
        const input = task.input as { businessName: string; businessIdea: string };
        
        const websiteContent = {
          pages: [
            {
              slug: "home",
              title: `${input.businessName} - Home`,
              metaDescription: `Welcome to ${input.businessName}. ${input.businessIdea}`,
              sections: [
                {
                  id: "hero-1",
                  type: "hero",
                  data: {
                    headline: `Welcome to ${input.businessName}`,
                    subheadline: input.businessIdea,
                    ctaText: "Get Started",
                    ctaLink: "/contact",
                  },
                },
                {
                  id: "features-1",
                  type: "features",
                  data: {
                    headline: "Why Choose Us",
                    items: [
                      { title: "Expert Team", description: "Years of industry experience at your service", icon: "users" },
                      { title: "Quality First", description: "We never compromise on quality", icon: "shield" },
                      { title: "24/7 Support", description: "Always here when you need us", icon: "clock" },
                    ],
                  },
                },
                {
                  id: "cta-1",
                  type: "cta",
                  data: {
                    headline: "Ready to Get Started?",
                    description: "Join thousands of satisfied customers today.",
                    ctaText: "Contact Us",
                    ctaLink: "/contact",
                  },
                },
              ],
            },
            {
              slug: "about",
              title: `About ${input.businessName}`,
              metaDescription: `Learn more about ${input.businessName} and our mission.`,
              sections: [
                {
                  id: "text-1",
                  type: "text",
                  data: {
                    headline: "Our Story",
                    content: `${input.businessName} was founded with a simple mission: ${input.businessIdea}. Today, we continue to serve our customers with the same passion and dedication.`,
                  },
                },
              ],
            },
            {
              slug: "contact",
              title: "Contact Us",
              metaDescription: `Get in touch with ${input.businessName}.`,
              sections: [
                {
                  id: "contact-1",
                  type: "contact",
                  data: {
                    headline: "Get in Touch",
                    description: "We'd love to hear from you.",
                    email: "hello@example.com",
                    phone: "(555) 123-4567",
                  },
                },
              ],
            },
          ],
          globalContent: {
            siteName: input.businessName,
            navigation: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
            footer: {
              copyright: `© 2025 ${input.businessName}. All rights reserved.`,
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ],
            },
          },
          siteSettings: {
            style: "modern",
            primaryColor: "#2563eb",
            fontFamily: "Inter",
          },
        };

        return {
          success: true,
          data: websiteContent as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_graphics_briefs": {
        const input = task.input as { businessName: string };
        
        const graphics = {
          graphics: [
            {
              type: "instagram_post",
              name: "Brand Introduction",
              dimensions: "1080x1080",
              designBrief: {
                prompt: `Modern, clean design for ${input.businessName} brand introduction`,
                style: "minimal",
                colors: ["#2563eb", "#ffffff"],
                elements: ["logo", "tagline"],
                mood: "professional",
              },
              copyText: `Introducing ${input.businessName} - Your new favorite way to succeed. #business #launch #startup`,
            },
            {
              type: "story",
              name: "Coming Soon",
              dimensions: "1080x1920",
              designBrief: {
                prompt: `Exciting coming soon announcement for ${input.businessName}`,
                style: "bold",
                colors: ["#7c3aed", "#ffffff"],
                elements: ["countdown", "logo"],
                mood: "exciting",
              },
              copyText: "Something amazing is coming... Stay tuned!",
            },
            {
              type: "facebook_ad",
              name: "Launch Campaign",
              dimensions: "1200x628",
              designBrief: {
                prompt: `Professional Facebook ad for ${input.businessName} launch`,
                style: "modern",
                colors: ["#2563eb", "#10b981"],
                elements: ["product", "cta button"],
                mood: "trustworthy",
              },
              copyText: `Ready to transform your business? ${input.businessName} is here to help. Learn more today!`,
            },
          ],
        };

        return {
          success: true,
          data: graphics as O,
          provider: "ai_mock",
          metadata: { isMock: true },
        };
      }

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "ai_mock",
        };
    }
  },
});
