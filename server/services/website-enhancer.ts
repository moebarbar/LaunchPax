/**
 * Website Enhancer Service
 * 
 * Integrates all connectors to create "level 1000000" premium websites:
 * - Multi-source stock photos (Pexels + Unsplash)
 * - AI image generation (DALL-E, Stability, Leonardo)
 * - Image optimization (Cloudinary CDN)
 * - Analytics injection (Google Analytics)
 * - Payment integration (Stripe)
 * - Email handling (SendGrid contact forms)
 * - SMS alerts (Twilio notifications)
 * - Map embedding (Google Maps)
 * - Animated graphics (Lottie)
 */

import { connectorRegistry } from "../connectors/registry";
import { findStockImage, generateAIImage, optimizeImage } from "./image-manager";
import type { WebsiteContent, SectionContent } from "@shared/schema";

interface EnhancementResult {
  success: boolean;
  enhancements: string[];
  errors: string[];
  stats: {
    imagesEnhanced: number;
    sectionsOptimized: number;
    integrationsAdded: number;
  };
}

interface BusinessContext {
  name: string;
  industry: string;
  businessIdea?: string;
  address?: string;
  email?: string;
  phone?: string;
}

/**
 * Enhance website with all available integrations
 */
export async function enhanceWebsite(
  websiteContent: WebsiteContent,
  context: BusinessContext
): Promise<{ content: WebsiteContent; result: EnhancementResult }> {
  const enhancements: string[] = [];
  const errors: string[] = [];
  const stats = { imagesEnhanced: 0, sectionsOptimized: 0, integrationsAdded: 0 };
  
  const enhancedContent = JSON.parse(JSON.stringify(websiteContent)) as WebsiteContent;
  
  console.log("[WebsiteEnhancer] Starting comprehensive enhancement...");
  
  // 1. Enhance hero sections with premium AI images
  await enhanceHeroSections(enhancedContent, context, { enhancements, errors, stats });
  
  // 2. Fill missing images with multi-source stock photos
  await fillMissingImages(enhancedContent, context, { enhancements, errors, stats });
  
  // 3. Optimize all images with Cloudinary CDN
  await optimizeAllImages(enhancedContent, { enhancements, errors, stats });
  
  // 4. Inject Google Analytics tracking
  await injectAnalytics(enhancedContent, { enhancements, errors, stats });
  
  // 5. Enhance contact sections with map embeds
  await enhanceContactSections(enhancedContent, context, { enhancements, errors, stats });
  
  // 6. Add payment button functionality
  await enhancePaymentSections(enhancedContent, { enhancements, errors, stats });
  
  // 7. Configure email integration for contact forms
  await configureContactForms(enhancedContent, context, { enhancements, errors, stats });
  
  // 8. Add Lottie animations to key sections
  await addAnimations(enhancedContent, { enhancements, errors, stats });
  
  console.log(`[WebsiteEnhancer] Complete: ${enhancements.length} enhancements, ${errors.length} errors`);
  
  return {
    content: enhancedContent,
    result: {
      success: errors.length === 0,
      enhancements,
      errors,
      stats,
    },
  };
}

async function enhanceHeroSections(
  content: WebsiteContent,
  context: BusinessContext,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const aiConnectors = ["dalle", "stability", "leonardo"]
    .map(k => connectorRegistry.get(k))
    .filter(c => c?.isConfigured());
  
  if (aiConnectors.length === 0) {
    console.log("[WebsiteEnhancer] No AI image connectors, skipping hero enhancement");
    return;
  }
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      const sectionData = section.data as Record<string, unknown>;
      const hasImage = sectionData?.image && typeof sectionData.image === 'string';
      const isPlaceholder = hasImage && (sectionData.image as string).includes("placeholder");
      
      if (section.type === "hero" && (!hasImage || isPlaceholder)) {
        try {
          const result = await generateAIImage({
            sectionType: "hero",
            businessName: context.name,
            industry: context.industry,
            style: "luxury",
            mood: "premium, professional, cinematic",
          });
          
          if (result?.url) {
            sectionData.image = result.url;
            sectionData.imageAlt = result.metadata.alt;
            tracking.enhancements.push(`AI-generated hero image for ${page.slug}`);
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          tracking.errors.push(`Hero image generation failed for ${page.slug}`);
        }
      }
    }
  }
}

async function fillMissingImages(
  content: WebsiteContent,
  context: BusinessContext,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const sectionsNeedingImages = ["features", "services", "testimonials", "team", "story", "about"];
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      const sectionData = section.data as Record<string, unknown>;
      const hasImage = sectionData?.image && typeof sectionData.image === 'string';
      
      if (sectionsNeedingImages.includes(section.type) && !hasImage) {
        try {
          const result = await findStockImage({
            sectionType: section.type,
            industry: context.industry,
            businessIdea: context.businessIdea,
          });
          
          if (result?.url) {
            sectionData.image = result.url;
            sectionData.imageAlt = result.metadata.alt;
            tracking.enhancements.push(`Stock photo added to ${section.type} on ${page.slug}`);
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Image fill failed for ${section.type}:`, error);
        }
      }
    }
  }
}

async function optimizeAllImages(
  content: WebsiteContent,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const cloudinaryConnector = connectorRegistry.get("cloudinary");
  if (!cloudinaryConnector?.isConfigured()) {
    return;
  }
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      const sectionData = section.data as Record<string, unknown>;
      const imageUrl = sectionData?.image as string | undefined;
      
      if (imageUrl && !imageUrl.includes("cloudinary")) {
        try {
          const optimizedUrl = await optimizeImage(imageUrl, {
            width: section.type === "hero" ? 1920 : 1200,
            quality: "auto",
            format: "auto",
          });
          
          if (optimizedUrl !== imageUrl) {
            sectionData.image = optimizedUrl;
            tracking.stats.sectionsOptimized++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Image optimization failed:`, error);
        }
      }
    }
  }
  
  if (tracking.stats.sectionsOptimized > 0) {
    tracking.enhancements.push(`Optimized ${tracking.stats.sectionsOptimized} images with Cloudinary CDN`);
  }
}

async function injectAnalytics(
  content: WebsiteContent,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const gaConnector = connectorRegistry.get("google-analytics");
  if (!gaConnector?.isConfigured()) {
    return;
  }
  
  try {
    const result = await gaConnector.execute({
      capability: "analytics",
      action: "get_script",
      input: {},
    });
    
    if (result.success && result.data) {
      const data = result.data as any;
      content.siteSettings = content.siteSettings || {};
      (content.siteSettings as any).analyticsScript = data.scriptTag;
      (content.siteSettings as any).analyticsEnabled = true;
      tracking.enhancements.push("Google Analytics tracking added");
      tracking.stats.integrationsAdded++;
    }
  } catch (error) {
    tracking.errors.push("Failed to inject Google Analytics");
  }
}

async function enhanceContactSections(
  content: WebsiteContent,
  context: BusinessContext,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const mapsConnector = connectorRegistry.get("google-maps");
  if (!mapsConnector?.isConfigured() || !context.address) {
    return;
  }
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      if (section.type === "contact" && !(section as any).mapEmbed) {
        try {
          const result = await mapsConnector.execute({
            capability: "maps",
            action: "generate_embed",
            input: { address: context.address, zoom: 15 },
          });
          
          if (result.success && result.data) {
            const data = result.data as any;
            (section as any).mapEmbed = data.embedUrl;
            tracking.enhancements.push("Google Maps embed added to contact section");
            tracking.stats.integrationsAdded++;
          }
        } catch (error) {
          console.error("[WebsiteEnhancer] Map embed failed:", error);
        }
      }
    }
  }
}

async function enhancePaymentSections(
  content: WebsiteContent,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const stripeConnector = connectorRegistry.get("stripe");
  if (!stripeConnector?.isConfigured()) {
    return;
  }
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      if (section.type === "pricing" || section.type === "cta") {
        (section as any).paymentEnabled = true;
        (section as any).paymentProvider = "stripe";
      }
    }
  }
  
  tracking.enhancements.push("Stripe payment integration enabled");
  tracking.stats.integrationsAdded++;
}

async function configureContactForms(
  content: WebsiteContent,
  context: BusinessContext,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const sendgridConnector = connectorRegistry.get("sendgrid");
  const twilioConnector = connectorRegistry.get("twilio");
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      if (section.type === "contact") {
        if (sendgridConnector?.isConfigured()) {
          (section as any).emailEnabled = true;
          (section as any).emailProvider = "sendgrid";
          (section as any).notificationEmail = context.email;
          tracking.stats.integrationsAdded++;
        }
        
        if (twilioConnector?.isConfigured() && context.phone) {
          (section as any).smsEnabled = true;
          (section as any).smsProvider = "twilio";
          (section as any).notificationPhone = context.phone;
          tracking.stats.integrationsAdded++;
        }
      }
    }
  }
  
  if (sendgridConnector?.isConfigured()) {
    tracking.enhancements.push("SendGrid email integration enabled for contact forms");
  }
  if (twilioConnector?.isConfigured()) {
    tracking.enhancements.push("Twilio SMS alerts enabled for new leads");
  }
}

async function addAnimations(
  content: WebsiteContent,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const lottieConnector = connectorRegistry.get("lottie");
  if (!lottieConnector?.isConfigured()) {
    return;
  }
  
  const animatedSections = ["features", "services", "stats", "process"];
  let animationsAdded = 0;
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      if (animatedSections.includes(section.type) && !(section as any).animation) {
        try {
          const result = await lottieConnector.execute({
            capability: "animations",
            action: "get_icons",
            input: { category: "business" },
          });
          
          if (result.success && result.data) {
            const animations = result.data as any[];
            if (animations.length > 0) {
              (section as any).animation = animations[0].lottieUrl;
              animationsAdded++;
            }
          }
        } catch (error) {
          console.error("[WebsiteEnhancer] Animation fetch failed:", error);
        }
      }
    }
  }
  
  if (animationsAdded > 0) {
    tracking.enhancements.push(`Added ${animationsAdded} Lottie animations`);
    tracking.stats.integrationsAdded += animationsAdded;
  }
}

/**
 * Get enhancement status for all available connectors
 */
export function getEnhancementCapabilities(): {
  category: string;
  capability: string;
  provider: string;
  configured: boolean;
}[] {
  const capabilities = [
    { category: "Stock Photos", capability: "stock_photos", providers: ["pexels", "unsplash"] },
    { category: "AI Images", capability: "image_generation", providers: ["dalle", "stability", "leonardo"] },
    { category: "Image CDN", capability: "image_optimization", providers: ["cloudinary"] },
    { category: "Analytics", capability: "analytics", providers: ["google-analytics"] },
    { category: "Payments", capability: "payments", providers: ["stripe"] },
    { category: "Email", capability: "email", providers: ["sendgrid"] },
    { category: "SMS", capability: "sms", providers: ["twilio"] },
    { category: "Maps", capability: "maps", providers: ["google-maps"] },
    { category: "Animations", capability: "animations", providers: ["lottie"] },
    { category: "CDN", capability: "cdn", providers: ["cloudflare"] },
    { category: "Domains", capability: "domain_check", providers: ["namecheap"] },
  ];
  
  const result: { category: string; capability: string; provider: string; configured: boolean }[] = [];
  
  for (const cap of capabilities) {
    for (const provider of cap.providers) {
      const connector = connectorRegistry.get(provider);
      result.push({
        category: cap.category,
        capability: cap.capability,
        provider,
        configured: connector?.isConfigured() || false,
      });
    }
  }
  
  return result;
}

/**
 * Check if website can be enhanced to premium level
 */
export function canCreatePremiumWebsite(): {
  ready: boolean;
  availableFeatures: string[];
  missingFeatures: string[];
} {
  const requiredForPremium = [
    { feature: "Stock photos", connectors: ["pexels", "unsplash"] },
    { feature: "AI content", connectors: ["openai", "claude", "launchpax"] },
  ];
  
  const premiumEnhancements = [
    { feature: "AI hero images", connectors: ["dalle", "stability", "leonardo"] },
    { feature: "Image optimization", connectors: ["cloudinary"] },
    { feature: "Analytics", connectors: ["google-analytics"] },
    { feature: "Payment processing", connectors: ["stripe"] },
    { feature: "Email notifications", connectors: ["sendgrid"] },
    { feature: "SMS alerts", connectors: ["twilio"] },
    { feature: "Map embedding", connectors: ["google-maps"] },
    { feature: "Animations", connectors: ["lottie"] },
  ];
  
  const availableFeatures: string[] = [];
  const missingFeatures: string[] = [];
  
  for (const req of requiredForPremium) {
    const hasAny = req.connectors.some(c => connectorRegistry.get(c)?.isConfigured());
    if (hasAny) {
      availableFeatures.push(req.feature);
    } else {
      missingFeatures.push(req.feature + " (required)");
    }
  }
  
  for (const enh of premiumEnhancements) {
    const hasAny = enh.connectors.some(c => connectorRegistry.get(c)?.isConfigured());
    if (hasAny) {
      availableFeatures.push(enh.feature);
    } else {
      missingFeatures.push(enh.feature);
    }
  }
  
  const ready = requiredForPremium.every(req => 
    req.connectors.some(c => connectorRegistry.get(c)?.isConfigured())
  );
  
  return { ready, availableFeatures, missingFeatures };
}
