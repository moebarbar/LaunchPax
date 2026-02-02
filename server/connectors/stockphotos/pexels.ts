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
        };
        
        const industryQueries: Record<string, string[]> = {
          technology: ["modern office tech", "software development", "computer technology"],
          restaurant: ["restaurant interior", "gourmet food", "dining experience"],
          healthcare: ["medical healthcare", "doctor patient", "wellness clinic"],
          consulting: ["business meeting", "professional consulting", "corporate office"],
          ecommerce: ["online shopping", "product photography", "retail store"],
          saas: ["saas dashboard", "software team", "startup office"],
          legal: ["law office", "legal documents", "courthouse"],
          fitness: ["fitness gym", "workout training", "healthy lifestyle"],
          education: ["classroom learning", "students studying", "education school"],
          realestate: ["modern home interior", "real estate property", "house architecture"],
        };
        
        const queries = industryQueries[input.industry.toLowerCase()] || 
          industryQueries.consulting;
        const query = queries[Math.floor(Math.random() * queries.length)];
        
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
