import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

export interface StockPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  alt: string;
  source: "pexels";
}

export interface StockPhotoSearchResult {
  photos: StockPhoto[];
  totalResults: number;
  page: number;
  perPage: number;
}

async function searchPhotos(query: string, options?: { 
  perPage?: number; 
  page?: number;
  orientation?: "landscape" | "portrait" | "square";
  size?: "small" | "medium" | "large";
}): Promise<ConnectorResult<StockPhotoSearchResult>> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Pexels API key not configured",
      provider: "pexels",
    };
  }
  
  const perPage = options?.perPage || 10;
  const page = options?.page || 1;
  
  const params = new URLSearchParams({
    query,
    per_page: perPage.toString(),
    page: page.toString(),
  });
  
  if (options?.orientation) {
    params.append("orientation", options.orientation);
  }
  
  if (options?.size) {
    params.append("size", options.size);
  }
  
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: {
        Authorization: apiKey,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Pexels API error: ${response.status} - ${errorText}`,
        provider: "pexels",
      };
    }
    
    const data = await response.json();
    
    const photos: StockPhoto[] = data.photos.map((photo: any) => ({
      id: photo.id.toString(),
      url: photo.src.large2x || photo.src.large || photo.src.original,
      thumbnailUrl: photo.src.medium || photo.src.small,
      width: photo.width,
      height: photo.height,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt || query,
      source: "pexels" as const,
    }));
    
    return {
      success: true,
      data: {
        photos,
        totalResults: data.total_results,
        page: data.page,
        perPage: perPage,
      },
      provider: "pexels",
    };
  } catch (error) {
    console.error("[Pexels] Search failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search photos",
      provider: "pexels",
    };
  }
}

async function getCuratedPhotos(options?: { 
  perPage?: number; 
  page?: number;
}): Promise<ConnectorResult<StockPhotoSearchResult>> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Pexels API key not configured",
      provider: "pexels",
    };
  }
  
  const perPage = options?.perPage || 10;
  const page = options?.page || 1;
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Pexels API error: ${response.status} - ${errorText}`,
        provider: "pexels",
      };
    }
    
    const data = await response.json();
    
    const photos: StockPhoto[] = data.photos.map((photo: any) => ({
      id: photo.id.toString(),
      url: photo.src.large2x || photo.src.large || photo.src.original,
      thumbnailUrl: photo.src.medium || photo.src.small,
      width: photo.width,
      height: photo.height,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt || "Curated photo",
      source: "pexels" as const,
    }));
    
    return {
      success: true,
      data: {
        photos,
        totalResults: data.total_results,
        page: data.page,
        perPage: perPage,
      },
      provider: "pexels",
    };
  } catch (error) {
    console.error("[Pexels] Curated fetch failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch curated photos",
      provider: "pexels",
    };
  }
}

export const pexelsConnector = defineConnector({
  key: "pexels",
  name: "Pexels Stock Photos",
  description: "High-quality free stock photos from Pexels",
  category: "images",
  capabilities: ["stock_photos"],
  authType: "apiKey",
  requiredEnvVars: ["PEXELS_API_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.PEXELS_API_KEY;
  },
  
  async test(): Promise<{ ok: boolean; message: string }> {
    const result = await getCuratedPhotos({ perPage: 1 });
    if (result.success) {
      return { ok: true, message: "Pexels API connected successfully" };
    }
    return { ok: false, message: result.error || "Failed to connect to Pexels" };
  },
  
  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    switch (task.action) {
      case "search_photos": {
        const input = task.input as { 
          query: string; 
          perPage?: number;
          page?: number;
          orientation?: "landscape" | "portrait" | "square";
          size?: "small" | "medium" | "large";
        };
        return searchPhotos(input.query, {
          perPage: input.perPage,
          page: input.page,
          orientation: input.orientation,
          size: input.size,
        }) as Promise<ConnectorResult<O>>;
      }
      
      case "get_curated": {
        const input = task.input as { perPage?: number; page?: number };
        return getCuratedPhotos({
          perPage: input.perPage,
          page: input.page,
        }) as Promise<ConnectorResult<O>>;
      }
      
      case "get_photo_for_industry": {
        const input = task.input as { 
          industry: string;
          type?: "hero" | "team" | "product" | "background";
          businessIdea?: string;
        };
        
        // Comprehensive industry queries with high-quality, specific search terms
        const industryQueries: Record<string, string[]> = {
          restaurant: ["delicious food plating", "restaurant dining ambiance", "gourmet cuisine presentation", "chef cooking kitchen", "fresh ingredients cooking"],
          food: ["appetizing food photography", "fresh culinary dishes", "professional food styling", "restaurant meal presentation", "delicious gourmet plating"],
          technology: ["modern tech workspace", "software engineering team", "innovative technology office", "digital transformation", "tech startup environment"],
          healthcare: ["medical professional caring", "wellness health clinic", "doctor patient consultation", "healthcare facility modern", "medical team caring"],
          consulting: ["business strategy meeting", "professional consulting office", "executive boardroom", "corporate teamwork collaboration", "business professionals working"],
          ecommerce: ["online shopping experience", "product photography studio", "retail store modern", "ecommerce packaging delivery", "shopping checkout"],
          saas: ["software dashboard interface", "tech startup team", "modern office workspace", "software development team", "digital product meeting"],
          legal: ["law office professional", "legal documents desk", "courthouse architecture", "attorney professional", "law firm interior"],
          fitness: ["fitness gym workout", "personal training session", "healthy active lifestyle", "modern gym equipment", "sports training athlete"],
          education: ["classroom learning students", "university campus", "education school teaching", "library studying", "academic environment"],
          realestate: ["luxury home interior", "modern architecture house", "real estate property", "beautiful home design", "residential interior design"],
          beauty: ["beauty spa treatment", "skincare cosmetics", "salon professional", "wellness relaxation", "beauty products luxury"],
          automotive: ["luxury car automotive", "car dealership showroom", "automotive mechanic", "vehicle showroom", "modern car design"],
          travel: ["travel destination scenic", "vacation resort luxury", "tourism adventure", "hotel hospitality", "travel adventure exploration"],
          finance: ["financial planning meeting", "banking professional", "investment trading", "finance business office", "wealth management"],
          manufacturing: ["modern factory manufacturing", "industrial production", "machinery equipment", "quality control inspection", "warehouse logistics"],
          creative: ["creative design studio", "artistic workspace", "design team brainstorming", "creative agency office", "art photography studio"],
          marketing: ["marketing team meeting", "digital marketing agency", "creative brainstorming", "advertising campaign", "brand strategy"],
          nonprofit: ["community volunteer helping", "charity donation", "nonprofit organization", "community service", "helping people together"],
          entertainment: ["entertainment performance stage", "music concert", "event venue", "entertainment production", "creative performance"],
          construction: ["construction building site", "architecture engineering", "construction workers", "building development", "civil engineering project"],
        };
        
        // Industry aliases - map variations to canonical industry names
        const industryAliases: Record<string, string> = {
          // Food & Restaurant variations
          "food & beverage": "restaurant",
          "food and beverage": "restaurant",
          "f&b": "restaurant",
          "dining": "restaurant",
          "cafe": "restaurant",
          "coffee shop": "restaurant",
          "bakery": "restaurant",
          "catering": "restaurant",
          "fast food": "restaurant",
          "quick service": "restaurant",
          "hospitality": "restaurant",
          "culinary": "restaurant",
          "foodservice": "restaurant",
          "bar": "restaurant",
          "pub": "restaurant",
          "bistro": "restaurant",
          
          // Tech variations
          "tech": "technology",
          "it": "technology",
          "software": "technology",
          "information technology": "technology",
          "digital": "technology",
          "web development": "technology",
          "app development": "technology",
          "startup": "saas",
          "fintech": "technology",
          
          // Healthcare variations
          "health": "healthcare",
          "medical": "healthcare",
          "wellness": "healthcare",
          "dental": "healthcare",
          "pharmacy": "healthcare",
          "mental health": "healthcare",
          "therapy": "healthcare",
          "chiropractic": "healthcare",
          "veterinary": "healthcare",
          "vet": "healthcare",
          
          // Real estate variations
          "real estate": "realestate",
          "property": "realestate",
          "housing": "realestate",
          "mortgage": "realestate",
          "rental": "realestate",
          "apartments": "realestate",
          
          // Fitness variations
          "gym": "fitness",
          "sports": "fitness",
          "wellness center": "fitness",
          "yoga": "fitness",
          "personal training": "fitness",
          "athletics": "fitness",
          
          // Beauty variations
          "salon": "beauty",
          "spa": "beauty",
          "cosmetics": "beauty",
          "skincare": "beauty",
          "hair": "beauty",
          "nails": "beauty",
          
          // Legal variations
          "law": "legal",
          "attorney": "legal",
          "lawyer": "legal",
          "law firm": "legal",
          
          // Education variations
          "school": "education",
          "university": "education",
          "college": "education",
          "training": "education",
          "tutoring": "education",
          "learning": "education",
          "academy": "education",
          
          // Finance variations
          "financial": "finance",
          "banking": "finance",
          "investment": "finance",
          "insurance": "finance",
          "accounting": "finance",
          "wealth management": "finance",
          
          // Business services variations
          "professional services": "consulting",
          "business services": "consulting",
          "management": "consulting",
          "advisory": "consulting",
          
          // Retail/Ecommerce variations
          "retail": "ecommerce",
          "online store": "ecommerce",
          "shop": "ecommerce",
          "store": "ecommerce",
          
          // Marketing variations
          "advertising": "marketing",
          "pr": "marketing",
          "public relations": "marketing",
          "media": "marketing",
          "digital marketing": "marketing",
          "social media": "marketing",
          
          // Creative variations
          "design": "creative",
          "graphic design": "creative",
          "photography": "creative",
          "video production": "creative",
          "art": "creative",
          "agency": "creative",
        };
        
        // Normalize industry input
        const normalizedIndustry = input.industry.toLowerCase().trim();
        
        // Try direct match first, then aliases
        let matchedIndustry = industryQueries[normalizedIndustry] 
          ? normalizedIndustry 
          : industryAliases[normalizedIndustry];
        
        // If still no match, try partial matching
        if (!matchedIndustry) {
          for (const [alias, canonical] of Object.entries(industryAliases)) {
            if (normalizedIndustry.includes(alias) || alias.includes(normalizedIndustry)) {
              matchedIndustry = canonical;
              break;
            }
          }
        }
        
        // Smart fallback: analyze businessIdea for keywords if industry unknown
        if (!matchedIndustry && input.businessIdea) {
          const ideaLower = input.businessIdea.toLowerCase();
          const industryKeywords: Record<string, string[]> = {
            restaurant: ["food", "restaurant", "dining", "meal", "eat", "chef", "cook", "cuisine", "menu", "kitchen", "dish", "grill", "pizza", "sushi", "burger", "cafe", "coffee", "bakery", "catering"],
            healthcare: ["health", "medical", "doctor", "patient", "clinic", "therapy", "wellness", "care", "hospital", "nurse", "dental", "pharmacy"],
            technology: ["software", "app", "tech", "digital", "code", "platform", "saas", "ai", "data", "cloud", "api"],
            fitness: ["gym", "fitness", "workout", "training", "exercise", "sports", "athletic", "yoga"],
            beauty: ["beauty", "salon", "spa", "cosmetic", "skincare", "hair", "nail", "makeup"],
            realestate: ["home", "house", "property", "real estate", "apartment", "rental", "mortgage"],
            education: ["school", "learn", "teach", "education", "course", "training", "tutor", "academy"],
            ecommerce: ["shop", "store", "buy", "sell", "product", "retail", "ecommerce", "order"],
            legal: ["law", "legal", "attorney", "lawyer", "court"],
            finance: ["finance", "bank", "invest", "money", "loan", "insurance", "accounting"],
            creative: ["design", "creative", "art", "photo", "video", "brand", "agency"],
            consulting: ["consult", "business", "strategy", "management", "advisory"],
          };
          
          let bestMatch = { industry: "", score: 0 };
          for (const [industry, keywords] of Object.entries(industryKeywords)) {
            const score = keywords.filter(kw => ideaLower.includes(kw)).length;
            if (score > bestMatch.score) {
              bestMatch = { industry, score };
            }
          }
          
          if (bestMatch.score > 0) {
            matchedIndustry = bestMatch.industry;
            console.log(`[Pexels] Smart match: "${input.industry}" → "${matchedIndustry}" (score: ${bestMatch.score})`);
          }
        }
        
        // Final fallback: use a visually appealing generic business query (NOT boring meeting rooms)
        const finalIndustry = matchedIndustry || "creative";
        const queries = industryQueries[finalIndustry] || industryQueries.creative;
        const query = queries[Math.floor(Math.random() * queries.length)];
        
        console.log(`[Pexels] Industry "${input.industry}" → "${finalIndustry}" → query: "${query}"`);
        
        const orientation = input.type === "hero" ? "landscape" : "square";
        
        return searchPhotos(query, {
          perPage: 5,
          orientation,
          size: "large",
        }) as Promise<ConnectorResult<O>>;
      }
      
      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "pexels",
        };
    }
  },
});
