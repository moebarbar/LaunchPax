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
  
  // 9. Assign smart icons based on content
  assignSmartIcons(enhancedContent, context, { enhancements, errors, stats });
  
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
  const sectionsNeedingImages = ["features", "services", "testimonials", "team", "story", "about", "brand-story", "case-studies", "gallery"];
  
  for (const page of content.pages || []) {
    for (const section of page.sections) {
      const sectionData = section.data as Record<string, unknown>;
      const hasImage = sectionData?.image && typeof sectionData.image === 'string';
      
      // Fill section-level image
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
      
      // Fill item-level images for sections with arrays of items
      await fillItemImages(section, context, tracking);
    }
  }
}

/**
 * Fill images for individual items within sections (team members, testimonial avatars, etc.)
 */
async function fillItemImages(
  section: SectionContent,
  context: BusinessContext,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): Promise<void> {
  const sectionData = section.data as Record<string, unknown>;
  
  // Helper function to detect placeholder images (filenames without proper URLs)
  const isPlaceholderImage = (value: unknown): boolean => {
    if (!value || typeof value !== "string") return true;
    const v = value.toLowerCase();
    // If it's a full URL (http/https/data), it's valid
    if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("data:")) return false;
    // If it looks like just a filename (e.g., "john.jpg", "rachel.jpg"), it's a placeholder
    if (v.match(/^[a-z0-9_-]+\.(jpg|jpeg|png|gif|webp|svg)$/i)) return true;
    // If it's empty or very short, treat as placeholder
    if (v.length < 10) return true;
    return false;
  };
  
  // Team members need photos
  if (section.type === "team") {
    const members = (sectionData.members || []) as Array<Record<string, unknown>>;
    for (let i = 0; i < members.length; i++) {
      if (isPlaceholderImage(members[i].image)) {
        try {
          const gender = i % 2 === 0 ? "man" : "woman";
          const result = await findStockImage({
            sectionType: "team",
            industry: context.industry,
            businessIdea: `professional ${gender} ${context.industry} headshot portrait`,
            mood: "professional portrait",
          });
          if (result?.url) {
            members[i].image = result.url;
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Team photo fill failed:`, error);
        }
      }
    }
  }
  
  // Testimonials need avatar photos
  if (section.type === "testimonials") {
    const items = (sectionData.items || []) as Array<Record<string, unknown>>;
    for (let i = 0; i < items.length; i++) {
      if (isPlaceholderImage(items[i].avatar) && isPlaceholderImage(items[i].image)) {
        try {
          const gender = i % 2 === 0 ? "woman" : "man";
          const result = await findStockImage({
            sectionType: "testimonials",
            industry: context.industry,
            businessIdea: `professional ${gender} headshot smiling portrait`,
            mood: "happy professional",
          });
          if (result?.url) {
            items[i].avatar = result.url;
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Testimonial avatar fill failed:`, error);
        }
      }
    }
  }
  
  // Services need images - fill ALL items (no cap)
  if (section.type === "services") {
    const items = (sectionData.items || []) as Array<Record<string, unknown>>;
    for (let i = 0; i < items.length; i++) {
      if (isPlaceholderImage(items[i].image)) {
        try {
          const serviceTitle = (items[i].title as string) || "";
          const result = await findStockImage({
            sectionType: "services",
            industry: context.industry,
            businessIdea: `${serviceTitle} ${context.industry} professional`,
            mood: "professional service",
          });
          if (result?.url) {
            items[i].image = result.url;
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Service image fill failed:`, error);
        }
      }
    }
  }
  
  // Case studies need images
  if (section.type === "case-studies") {
    const items = (sectionData.items || []) as Array<Record<string, unknown>>;
    for (let i = 0; i < items.length; i++) {
      if (isPlaceholderImage(items[i].image)) {
        try {
          const clientName = (items[i].client as string) || "";
          const result = await findStockImage({
            sectionType: "case-studies",
            industry: context.industry,
            businessIdea: `${clientName} ${context.industry} business success`,
            mood: "professional business",
          });
          if (result?.url) {
            items[i].image = result.url;
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Case study image fill failed:`, error);
        }
      }
    }
  }
  
  // Gallery items need images
  if (section.type === "gallery") {
    const items = (sectionData.items || []) as Array<Record<string, unknown>>;
    for (let i = 0; i < items.length; i++) {
      if (isPlaceholderImage(items[i].image)) {
        try {
          const caption = (items[i].caption as string) || "";
          const result = await findStockImage({
            sectionType: "gallery",
            industry: context.industry,
            businessIdea: `${caption} ${context.industry}`,
            mood: "professional showcase",
          });
          if (result?.url) {
            items[i].image = result.url;
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] Gallery image fill failed:`, error);
        }
      }
    }
  }
  
  // Features/benefits may need images
  if (section.type === "features" || section.type === "benefits") {
    const items = (sectionData.items || []) as Array<Record<string, unknown>>;
    for (let i = 0; i < items.length; i++) {
      if (isPlaceholderImage(items[i].image)) {
        try {
          const title = (items[i].title as string) || "";
          const result = await findStockImage({
            sectionType: section.type,
            industry: context.industry,
            businessIdea: `${title} ${context.industry}`,
            mood: "professional modern",
          });
          if (result?.url) {
            items[i].image = result.url;
            tracking.stats.imagesEnhanced++;
          }
        } catch (error) {
          console.error(`[WebsiteEnhancer] ${section.type} image fill failed:`, error);
        }
      }
    }
  }
}

/**
 * Assign smart, varied icons based on feature/service content
 */
function assignSmartIcons(
  content: WebsiteContent,
  context: BusinessContext,
  tracking: { enhancements: string[]; errors: string[]; stats: { imagesEnhanced: number; sectionsOptimized: number; integrationsAdded: number } }
): void {
  // Icon keywords mapping - maps common words to appropriate icons
  const iconKeywords: Record<string, string[]> = {
    // Speed & Performance
    zap: ["fast", "quick", "speed", "instant", "rapid", "efficient", "lightning", "turbo"],
    rocket: ["launch", "grow", "scale", "accelerate", "boost", "momentum", "startup"],
    clock: ["time", "hours", "schedule", "appointment", "24/7", "available", "wait", "duration"],
    
    // Security & Trust  
    shield: ["secure", "protect", "safe", "guard", "defense", "privacy", "insured", "certified"],
    lock: ["private", "encrypt", "confidential", "exclusive", "restricted"],
    
    // Quality & Excellence
    star: ["premium", "quality", "excellence", "best", "top", "rated", "review", "superior"],
    award: ["award", "winner", "certified", "recognized", "achievement", "honor"],
    trophy: ["champion", "leading", "first", "number one", "#1", "winner"],
    crown: ["luxury", "elite", "exclusive", "vip", "premium", "royal"],
    gem: ["valuable", "precious", "unique", "rare", "special"],
    
    // Service & Support
    heart: ["care", "love", "passion", "dedicated", "compassion", "personalized", "friendly"],
    users: ["team", "community", "people", "group", "staff", "family", "clients", "customers"],
    message: ["support", "chat", "communication", "contact", "talk", "consult", "help"],
    
    // Growth & Success
    trending: ["growth", "increase", "improve", "progress", "develop", "advance", "rise"],
    chart: ["results", "analytics", "data", "metrics", "performance", "measure", "track"],
    target: ["goal", "focus", "precise", "accurate", "aimed", "targeted", "objective"],
    
    // Innovation & Tech
    lightbulb: ["idea", "creative", "innovative", "solution", "smart", "intelligent", "think"],
    cpu: ["technology", "digital", "tech", "ai", "automation", "software", "system"],
    settings: ["customize", "configure", "flexible", "adjust", "tailored", "options"],
    
    // Business & Professional
    briefcase: ["business", "professional", "corporate", "enterprise", "work", "career"],
    globe: ["global", "worldwide", "international", "anywhere", "remote", "online"],
    wrench: ["service", "repair", "maintenance", "fix", "tool", "hands-on"],
    check: ["complete", "done", "verified", "approved", "guaranteed", "included", "ready"],
  };

  // Industry-specific icon preferences
  const industryIcons: Record<string, string[]> = {
    healthcare: ["heart", "shield", "users", "check", "clock", "star", "award"],
    dental: ["star", "heart", "shield", "check", "clock", "users", "award"],
    technology: ["cpu", "zap", "rocket", "lightbulb", "chart", "globe", "settings"],
    food: ["heart", "star", "clock", "users", "award", "check", "trophy"],
    bakery: ["heart", "star", "clock", "award", "users", "check", "trophy"],
    fitness: ["target", "trending", "zap", "heart", "users", "star", "trophy"],
    beauty: ["heart", "star", "gem", "crown", "users", "award", "shield"],
    finance: ["shield", "chart", "trending", "lock", "check", "award", "briefcase"],
    education: ["lightbulb", "star", "award", "users", "chart", "check", "globe"],
    real_estate: ["shield", "check", "star", "users", "award", "globe", "briefcase"],
    construction: ["wrench", "shield", "check", "users", "award", "star", "clock"],
    legal: ["shield", "briefcase", "check", "award", "users", "star", "lock"],
  };

  // Get industry-preferred icons
  const normalizedIndustry = context.industry.toLowerCase();
  let preferredIcons: string[] = ["star", "shield", "zap", "heart", "target", "users"];
  for (const [key, icons] of Object.entries(industryIcons)) {
    if (normalizedIndustry.includes(key)) {
      preferredIcons = icons;
      break;
    }
  }

  // Generic/default icons that should be replaced with better ones
  const genericIcons = new Set(["check", "circle", "dot", "item", "feature", "bullet", ""]);
  
  // Helper to check if icon needs replacement
  const needsIconAssignment = (icon: unknown): boolean => {
    if (!icon || typeof icon !== "string") return true;
    if (icon.trim() === "") return true;
    return genericIcons.has(icon.toLowerCase());
  };
  
  let iconsAssigned = 0;

  for (const page of content.pages || []) {
    for (const section of page.sections) {
      const sectionData = section.data as Record<string, unknown>;
      
      // Process features sections
      if (section.type === "features" || section.type === "benefits") {
        const items = (sectionData.items || []) as Array<Record<string, unknown>>;
        const usedIcons = new Set<string>();
        
        // First pass: collect already-assigned non-generic icons
        for (let i = 0; i < items.length; i++) {
          const existingIcon = items[i].icon as string;
          if (existingIcon && !needsIconAssignment(existingIcon)) {
            usedIcons.add(existingIcon);
          }
        }
        
        for (let i = 0; i < items.length; i++) {
          // Only assign if icon is missing or generic
          if (!needsIconAssignment(items[i].icon)) {
            continue;
          }
          
          const title = ((items[i].title as string) || "").toLowerCase();
          const description = ((items[i].description as string) || "").toLowerCase();
          const itemContent = `${title} ${description}`;
          
          // Find best matching icon based on keywords
          let bestIcon = "";
          let bestScore = 0;
          
          for (const [icon, keywords] of Object.entries(iconKeywords)) {
            let score = 0;
            for (const keyword of keywords) {
              if (itemContent.includes(keyword)) {
                score += keyword.length; // Longer matches get higher scores
              }
            }
            if (score > bestScore && !usedIcons.has(icon)) {
              bestScore = score;
              bestIcon = icon;
            }
          }
          
          // Fallback to industry-preferred icons with variety
          if (!bestIcon || usedIcons.has(bestIcon)) {
            for (const icon of preferredIcons) {
              if (!usedIcons.has(icon)) {
                bestIcon = icon;
                break;
              }
            }
          }
          
          // Final fallback - cycle through all icons
          if (!bestIcon) {
            const allIcons = Object.keys(iconKeywords);
            bestIcon = allIcons[i % allIcons.length];
          }
          
          items[i].icon = bestIcon;
          usedIcons.add(bestIcon);
          iconsAssigned++;
        }
      }
      
      // Process services sections
      if (section.type === "services") {
        const items = (sectionData.items || []) as Array<Record<string, unknown>>;
        const usedIcons = new Set<string>();
        
        // First pass: collect already-assigned non-generic icons
        for (let i = 0; i < items.length; i++) {
          const existingIcon = items[i].icon as string;
          if (existingIcon && !needsIconAssignment(existingIcon)) {
            usedIcons.add(existingIcon);
          }
        }
        
        for (let i = 0; i < items.length; i++) {
          // Only assign if icon is missing or generic
          if (!needsIconAssignment(items[i].icon)) {
            continue;
          }
          
          const title = ((items[i].title as string) || "").toLowerCase();
          const description = ((items[i].description as string) || "").toLowerCase();
          const itemContent = `${title} ${description}`;
          
          let bestIcon = "";
          let bestScore = 0;
          
          for (const [icon, keywords] of Object.entries(iconKeywords)) {
            let score = 0;
            for (const keyword of keywords) {
              if (itemContent.includes(keyword)) {
                score += keyword.length;
              }
            }
            if (score > bestScore && !usedIcons.has(icon)) {
              bestScore = score;
              bestIcon = icon;
            }
          }
          
          if (!bestIcon || usedIcons.has(bestIcon)) {
            for (const icon of preferredIcons) {
              if (!usedIcons.has(icon)) {
                bestIcon = icon;
                break;
              }
            }
          }
          
          if (!bestIcon) {
            const allIcons = Object.keys(iconKeywords);
            bestIcon = allIcons[i % allIcons.length];
          }
          
          items[i].icon = bestIcon;
          usedIcons.add(bestIcon);
          iconsAssigned++;
        }
      }
      
      // Process process/steps sections
      if (section.type === "process") {
        const steps = (sectionData.steps || []) as Array<Record<string, unknown>>;
        const processIcons = ["target", "settings", "zap", "lightbulb", "star", "rocket"];
        
        for (let i = 0; i < steps.length; i++) {
          if (needsIconAssignment(steps[i].icon)) {
            steps[i].icon = processIcons[i % processIcons.length];
            iconsAssigned++;
          }
        }
      }
    }
  }
  
  if (iconsAssigned > 0) {
    tracking.enhancements.push(`Smart icons assigned to ${iconsAssigned} items`);
    tracking.stats.sectionsOptimized += iconsAssigned;
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
