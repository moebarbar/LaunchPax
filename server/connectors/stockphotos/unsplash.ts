import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

export interface UnsplashPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  alt: string;
  source: "unsplash";
  downloadUrl?: string;
}

export interface UnsplashSearchResult {
  photos: UnsplashPhoto[];
  totalResults: number;
  page: number;
  perPage: number;
}

async function searchPhotos(query: string, options?: {
  perPage?: number;
  page?: number;
  orientation?: "landscape" | "portrait" | "squarish";
  color?: string;
}): Promise<ConnectorResult<UnsplashSearchResult>> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    return {
      success: false,
      error: "Unsplash API key not configured",
      provider: "unsplash",
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

  if (options?.color) {
    params.append("color", options.color);
  }

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Unsplash error: ${error.errors?.[0] || response.statusText}`,
        provider: "unsplash",
      };
    }

    const data = await response.json();

    const photos: UnsplashPhoto[] = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      width: photo.width,
      height: photo.height,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      alt: photo.alt_description || photo.description || query,
      source: "unsplash" as const,
      downloadUrl: photo.links.download,
    }));

    return {
      success: true,
      data: {
        photos,
        totalResults: data.total,
        page,
        perPage,
      },
      provider: "unsplash",
    };
  } catch (error) {
    console.error("[Unsplash] Search failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search photos",
      provider: "unsplash",
    };
  }
}

async function getRandomPhoto(options?: {
  query?: string;
  orientation?: "landscape" | "portrait" | "squarish";
  count?: number;
}): Promise<ConnectorResult<UnsplashPhoto[]>> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    return {
      success: false,
      error: "Unsplash API key not configured",
      provider: "unsplash",
    };
  }

  const params = new URLSearchParams({
    count: (options?.count || 1).toString(),
  });

  if (options?.query) {
    params.append("query", options.query);
  }

  if (options?.orientation) {
    params.append("orientation", options.orientation);
  }

  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?${params}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Unsplash error: ${error.errors?.[0] || response.statusText}`,
        provider: "unsplash",
      };
    }

    const data = await response.json();
    const photos = (Array.isArray(data) ? data : [data]).map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      width: photo.width,
      height: photo.height,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      alt: photo.alt_description || photo.description || "",
      source: "unsplash" as const,
      downloadUrl: photo.links.download,
    }));

    return {
      success: true,
      data: photos,
      provider: "unsplash",
    };
  } catch (error) {
    console.error("[Unsplash] Random photo failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get random photo",
      provider: "unsplash",
    };
  }
}

export const unsplashConnector = defineConnector({
  key: "unsplash",
  name: "Unsplash",
  description: "High-quality free stock photos",
  category: "images",
  capabilities: ["stock_photos"],
  authType: "apiKey",
  requiredEnvVars: ["UNSPLASH_ACCESS_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.UNSPLASH_ACCESS_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    const result = await getRandomPhoto({ count: 1 });
    if (result.success) {
      return { ok: true, message: "Unsplash API connected successfully" };
    }
    return { ok: false, message: result.error || "Failed to connect to Unsplash" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "search_photos":
        return searchPhotos(input.query, {
          perPage: input.perPage,
          page: input.page,
          orientation: input.orientation,
          color: input.color,
        }) as Promise<ConnectorResult<O>>;

      case "random_photo":
        return getRandomPhoto({
          query: input.query,
          orientation: input.orientation,
          count: input.count,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "unsplash",
        };
    }
  },
});
