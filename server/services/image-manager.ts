/**
 * Image Manager Service
 * 
 * Handles all image-related operations:
 * - Image upload and processing
 * - Auto-generation of missing images
 * - SEO alt text and metadata generation
 * - Visual completeness validation
 */

import OpenAI from "openai";
import { connectorRegistry } from "../connectors/registry";
import type { WebsiteContent, SectionContent } from "@shared/schema";

interface ImageMetadata {
  alt: string;
  caption?: string;
  seoFileName: string;
  metaDescription?: string;
  source?: string;
  photographer?: string;
  aiGenerated?: boolean;
}

interface ImageWithMetadata {
  url?: string;
  base64?: string;
  metadata: ImageMetadata;
}

interface VisualCompletenessResult {
  isComplete: boolean;
  missingImages: {
    sectionId: string;
    sectionType: string;
    pageSlug: string;
    requiredImageType: string;
  }[];
  totalSections: number;
  sectionsWithImages: number;
  completenessScore: number;
}

const SECTIONS_REQUIRING_IMAGES = [
  'hero',
  'story',
  'brand-story',
  'testimonials',
  'team',
  'case-studies',
  'gallery',
  'services',
  'features',
];

const SECTIONS_OPTIONAL_IMAGES = [
  'text',
  'stats',
  'pricing',
  'faq',
  'contact',
  'cta',
  'benefits',
  'process',
  'trust-signals',
  'comparison',
];

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

/**
 * Generate SEO-optimized metadata for an image
 */
export async function generateImageMetadata(
  imageContext: {
    sectionType: string;
    businessName: string;
    industry: string;
    pageSlug: string;
    sectionHeadline?: string;
  }
): Promise<ImageMetadata> {
  const client = getOpenAIClient();
  
  if (!client) {
    return generateFallbackMetadata(imageContext);
  }
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an SEO expert generating image metadata. Create concise, descriptive, keyword-rich alt text and metadata.`
        },
        {
          role: "user",
          content: `Generate SEO-optimized image metadata for:
Business: ${imageContext.businessName}
Industry: ${imageContext.industry}
Page: ${imageContext.pageSlug}
Section Type: ${imageContext.sectionType}
Section Headline: ${imageContext.sectionHeadline || 'Not specified'}

Return JSON with:
- alt: Descriptive alt text (50-125 characters, include keywords naturally)
- caption: Optional caption for display (if appropriate)
- seoFileName: SEO-friendly filename (lowercase, hyphens, no extension)
- metaDescription: Brief description for meta tags (if for key sections like hero)`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });
    
    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        alt: parsed.alt || generateFallbackMetadata(imageContext).alt,
        caption: parsed.caption,
        seoFileName: parsed.seoFileName || generateFallbackMetadata(imageContext).seoFileName,
        metaDescription: parsed.metaDescription,
      };
    }
  } catch (error) {
    console.error("[ImageManager] Failed to generate metadata:", error);
  }
  
  return generateFallbackMetadata(imageContext);
}

function generateFallbackMetadata(context: {
  sectionType: string;
  businessName: string;
  industry: string;
  pageSlug: string;
  sectionHeadline?: string;
}): ImageMetadata {
  const typeDescriptions: Record<string, string> = {
    hero: "hero banner showcasing",
    story: "brand story visual for",
    "brand-story": "brand journey image for",
    testimonials: "customer testimonial for",
    team: "team member at",
    "case-studies": "case study results from",
    gallery: "gallery image from",
    services: "professional service by",
    features: "feature highlight from",
  };
  
  const description = typeDescriptions[context.sectionType] || "professional image for";
  const alt = `${context.businessName} - ${description} ${context.industry} ${context.sectionHeadline || context.pageSlug}`.trim();
  
  return {
    alt: alt.substring(0, 125),
    seoFileName: `${context.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${context.sectionType}-${context.pageSlug}`,
  };
}

/**
 * Search for stock photos matching section context
 * Uses multiple sources: Pexels (primary) + Unsplash (fallback)
 */
export async function findStockImage(
  context: {
    sectionType: string;
    industry: string;
    businessIdea?: string;
    mood?: string;
  }
): Promise<ImageWithMetadata | null> {
  const pexelsConnector = connectorRegistry.get("pexels");
  const unsplashConnector = connectorRegistry.get("unsplash");
  
  const stockConnectors = [
    { connector: pexelsConnector, name: "Pexels" },
    { connector: unsplashConnector, name: "Unsplash" },
  ].filter(c => c.connector?.isConfigured());
  
  if (stockConnectors.length === 0) {
    console.log("[ImageManager] No stock photo connectors configured");
    return null;
  }
  
  const searchQueries = buildSearchQueries(context);
  const orientation = context.sectionType === "hero" ? "landscape" : "square";
  
  for (const { connector, name } of stockConnectors) {
    for (const query of searchQueries) {
      try {
        const result = await connector!.execute({
          capability: "stock_photos",
          action: "search_photos",
          input: {
            query,
            perPage: 5,
            orientation,
            size: "large",
          },
          options: { purpose: "section_image", sectionType: context.sectionType },
        });
        
        if (result.success && result.data) {
          const photos = (result.data as any).photos || [];
          if (photos.length > 0) {
            const photo = photos[0];
            console.log(`[ImageManager] Found image from ${name} for "${query}"`);
            return {
              url: photo.url,
              metadata: {
                alt: photo.alt || `${context.industry} ${context.sectionType} image`,
                seoFileName: `${context.industry.toLowerCase().replace(/\s+/g, '-')}-${context.sectionType}`,
                source: name.toLowerCase(),
                photographer: photo.photographer,
              },
            };
          }
        }
      } catch (error) {
        console.error(`[ImageManager] ${name} search failed for "${query}":`, error);
      }
    }
  }
  
  return null;
}

/**
 * Generate AI image for premium hero sections
 * Tries multiple AI providers: DALL-E 3, Stability AI, Leonardo AI
 */
export async function generateAIImage(
  context: {
    sectionType: string;
    businessName: string;
    industry: string;
    style?: "professional" | "creative" | "minimal" | "bold" | "luxury";
    mood?: string;
  }
): Promise<ImageWithMetadata | null> {
  const dalleConnector = connectorRegistry.get("dalle");
  const stabilityConnector = connectorRegistry.get("stability");
  const leonardoConnector = connectorRegistry.get("leonardo");
  
  const aiConnectors = [
    { connector: dalleConnector, name: "DALL-E", action: "generate_hero" },
    { connector: stabilityConnector, name: "Stability", action: "generate_website_graphic" },
    { connector: leonardoConnector, name: "Leonardo", action: "generate_stylized" },
  ].filter(c => c.connector?.isConfigured());
  
  if (aiConnectors.length === 0) {
    console.log("[ImageManager] No AI image connectors configured, falling back to stock");
    return findStockImage({
      sectionType: context.sectionType,
      industry: context.industry,
      mood: context.mood,
    });
  }
  
  for (const { connector, name, action } of aiConnectors) {
    try {
      console.log(`[ImageManager] Generating AI image with ${name}...`);
      
      const result = await connector!.execute({
        capability: "image_generation",
        action,
        input: {
          businessName: context.businessName,
          industry: context.industry,
          style: context.style || "professional",
          mood: context.mood,
          type: context.sectionType === "hero" ? "hero" : "feature",
          subject: `${context.businessName} ${context.industry} business`,
        },
      });
      
      if (result.success && result.data) {
        const data = result.data as any;
        const imageUrl = data.images?.[0]?.url || data.url;
        
        if (imageUrl) {
          console.log(`[ImageManager] AI image generated with ${name}`);
          return {
            url: imageUrl,
            metadata: {
              alt: `${context.businessName} ${context.sectionType} - AI generated`,
              seoFileName: `${context.businessName.toLowerCase().replace(/\s+/g, '-')}-${context.sectionType}`,
              source: `ai-${name.toLowerCase()}`,
              aiGenerated: true,
            },
          };
        }
      }
    } catch (error) {
      console.error(`[ImageManager] ${name} generation failed:`, error);
    }
  }
  
  console.log("[ImageManager] All AI generators failed, falling back to stock photos");
  return findStockImage({
    sectionType: context.sectionType,
    industry: context.industry,
    mood: context.mood,
  });
}

/**
 * Optimize image URL using Cloudinary CDN
 */
export async function optimizeImage(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif";
  }
): Promise<string> {
  const cloudinaryConnector = connectorRegistry.get("cloudinary");
  
  if (!cloudinaryConnector?.isConfigured()) {
    return imageUrl;
  }
  
  try {
    const result = await cloudinaryConnector.execute({
      capability: "image_optimization",
      action: "optimize_url",
      input: {
        url: imageUrl,
        width: options?.width || 1200,
        quality: options?.quality || "auto",
        format: options?.format || "auto",
      },
    });
    
    if (result.success && result.data) {
      const data = result.data as any;
      return data.optimizedUrl || imageUrl;
    }
  } catch (error) {
    console.error("[ImageManager] Cloudinary optimization failed:", error);
  }
  
  return imageUrl;
}

function buildSearchQueries(context: {
  sectionType: string;
  industry: string;
  businessIdea?: string;
  mood?: string;
}): string[] {
  const queries: string[] = [];
  
  const industryMappings: Record<string, string[]> = {
    technology: ["modern tech office", "software development team", "digital innovation"],
    restaurant: ["gourmet food photography", "restaurant interior", "chef cooking"],
    bakery: ["artisan bakery", "fresh pastries", "baking kitchen"],
    healthcare: ["medical professional", "healthcare clinic", "patient care"],
    fitness: ["fitness training", "gym workout", "healthy lifestyle"],
    consulting: ["business consulting", "professional meeting", "corporate office"],
    saas: ["software dashboard", "startup team", "modern workspace"],
    realestate: ["modern home interior", "real estate property", "luxury house"],
    legal: ["law firm office", "legal professional", "courthouse"],
    education: ["classroom learning", "students studying", "education"],
    ecommerce: ["online shopping", "product photography", "retail"],
  };
  
  const industryKey = Object.keys(industryMappings).find(
    key => context.industry.toLowerCase().includes(key)
  );
  
  if (industryKey) {
    queries.push(...industryMappings[industryKey]);
  }
  
  queries.push(`${context.industry} ${context.sectionType}`);
  
  if (context.businessIdea) {
    const keywords = context.businessIdea.split(' ').slice(0, 5).join(' ');
    queries.push(keywords);
  }
  
  if (context.mood) {
    queries.push(`${context.mood} ${context.industry}`);
  }
  
  return queries.slice(0, 3);
}

/**
 * Check visual completeness of website content
 */
export function checkVisualCompleteness(
  websiteContent: WebsiteContent,
  strictMode: boolean = false
): VisualCompletenessResult {
  const missingImages: VisualCompletenessResult['missingImages'] = [];
  let totalSections = 0;
  let sectionsWithImages = 0;
  
  const pages = websiteContent.pages || [];
  
  for (const page of pages) {
    for (const section of page.sections) {
      totalSections++;
      
      const hasImage = sectionHasImage(section);
      const requiresImage = strictMode 
        ? [...SECTIONS_REQUIRING_IMAGES, ...SECTIONS_OPTIONAL_IMAGES].includes(section.type)
        : SECTIONS_REQUIRING_IMAGES.includes(section.type);
      
      if (hasImage) {
        sectionsWithImages++;
      } else if (requiresImage) {
        missingImages.push({
          sectionId: section.id,
          sectionType: section.type,
          pageSlug: page.slug,
          requiredImageType: getRequiredImageType(section.type),
        });
      }
    }
  }
  
  const completenessScore = totalSections > 0 
    ? Math.round((sectionsWithImages / Math.max(1, missingImages.length + sectionsWithImages)) * 100)
    : 100;
  
  return {
    isComplete: missingImages.length === 0,
    missingImages,
    totalSections,
    sectionsWithImages,
    completenessScore,
  };
}

function sectionHasImage(section: SectionContent): boolean {
  const data = section.data || {};
  
  if (data.image || data.imageB64 || data.imageUrl || data.backgroundImage) {
    return true;
  }
  
  if (Array.isArray(data.items)) {
    return data.items.some((item: any) => item.image || item.imageB64 || item.avatar);
  }
  
  if (Array.isArray(data.members)) {
    return data.members.some((member: any) => member.image || member.imageB64);
  }
  
  if (Array.isArray(data.images)) {
    return data.images.length > 0;
  }
  
  return false;
}

function getRequiredImageType(sectionType: string): string {
  const imageTypes: Record<string, string> = {
    hero: "hero_background",
    story: "story_visual",
    "brand-story": "brand_visual",
    testimonials: "testimonial_avatar",
    team: "team_photo",
    "case-studies": "case_study_image",
    gallery: "gallery_images",
    services: "service_icon_or_image",
    features: "feature_icon",
  };
  
  return imageTypes[sectionType] || "section_image";
}

/**
 * Auto-fill missing images in website content
 */
export async function autoFillMissingImages(
  websiteContent: WebsiteContent,
  projectContext: {
    businessName: string;
    industry: string;
    businessIdea?: string;
  }
): Promise<{
  updatedContent: WebsiteContent;
  filledCount: number;
  errors: string[];
}> {
  const completeness = checkVisualCompleteness(websiteContent);
  
  if (completeness.isComplete) {
    return { updatedContent: websiteContent, filledCount: 0, errors: [] };
  }
  
  const updatedContent = JSON.parse(JSON.stringify(websiteContent));
  let filledCount = 0;
  const errors: string[] = [];
  
  for (const missing of completeness.missingImages) {
    try {
      const stockImage = await findStockImage({
        sectionType: missing.sectionType,
        industry: projectContext.industry,
        businessIdea: projectContext.businessIdea,
      });
      
      if (stockImage) {
        const pageIndex = updatedContent.pages.findIndex(
          (p: any) => p.slug === missing.pageSlug
        );
        
        if (pageIndex >= 0) {
          const sectionIndex = updatedContent.pages[pageIndex].sections.findIndex(
            (s: any) => s.id === missing.sectionId
          );
          
          if (sectionIndex >= 0) {
            const section = updatedContent.pages[pageIndex].sections[sectionIndex];
            section.data = section.data || {};
            section.data.image = stockImage.url;
            section.data.imageAlt = stockImage.metadata.alt;
            filledCount++;
          }
        }
      }
    } catch (error) {
      errors.push(`Failed to fill image for ${missing.sectionType}: ${error}`);
    }
  }
  
  return { updatedContent, filledCount, errors };
}

/**
 * Optimize image data with responsive sizes and lazy loading hints
 */
export function optimizeImageData(
  imageUrl: string,
  sectionType: string
): {
  url: string;
  sizes: { small: string; medium: string; large: string };
  loading: "lazy" | "eager";
  aspectRatio: string;
} {
  const isHero = sectionType === "hero";
  
  return {
    url: imageUrl,
    sizes: {
      small: `${imageUrl}?w=480`,
      medium: `${imageUrl}?w=1024`,
      large: `${imageUrl}?w=1920`,
    },
    loading: isHero ? "eager" : "lazy",
    aspectRatio: isHero ? "16:9" : "4:3",
  };
}
