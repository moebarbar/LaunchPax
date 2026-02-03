import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface LottieAnimation {
  id: string;
  name: string;
  previewUrl: string;
  lottieUrl: string;
  tags: string[];
  createdBy?: string;
}

interface LottieSearchResult {
  animations: LottieAnimation[];
  totalResults: number;
  page: number;
}

async function searchAnimations(query: string, options?: {
  page?: number;
  perPage?: number;
}): Promise<ConnectorResult<LottieSearchResult>> {
  const apiKey = process.env.LOTTIEFILES_API_KEY;
  
  if (!apiKey) {
    return getFallbackAnimations(query);
  }

  try {
    const params = new URLSearchParams({
      query,
      page: (options?.page || 1).toString(),
      per_page: (options?.perPage || 20).toString(),
    });

    const response = await fetch(
      `https://api.lottiefiles.com/v2/featured?${params}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return getFallbackAnimations(query);
    }

    const data = await response.json();
    
    const animations: LottieAnimation[] = (data.data || []).map((anim: any) => ({
      id: anim.id,
      name: anim.name,
      previewUrl: anim.preview_url || anim.lottie_url,
      lottieUrl: anim.lottie_url,
      tags: anim.tags || [],
      createdBy: anim.created_by?.name,
    }));

    return {
      success: true,
      data: {
        animations,
        totalResults: data.total || animations.length,
        page: options?.page || 1,
      },
      provider: "lottie",
    };
  } catch (error) {
    console.error("[Lottie] Search failed:", error);
    return getFallbackAnimations(query);
  }
}

function getFallbackAnimations(query: string): ConnectorResult<LottieSearchResult> {
  const popularAnimations: Record<string, LottieAnimation[]> = {
    loading: [
      {
        id: "loading-1",
        name: "Loading Spinner",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_p8bfn5to.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_p8bfn5to.json",
        tags: ["loading", "spinner"],
      },
    ],
    success: [
      {
        id: "success-1",
        name: "Success Checkmark",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_jbrw3hcz.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_jbrw3hcz.json",
        tags: ["success", "check"],
      },
    ],
    error: [
      {
        id: "error-1",
        name: "Error Animation",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_tl52xzvn.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_tl52xzvn.json",
        tags: ["error", "warning"],
      },
    ],
    default: [
      {
        id: "default-1",
        name: "Animated Icon",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_touohxv0.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_touohxv0.json",
        tags: ["icon", "animation"],
      },
    ],
  };

  const key = Object.keys(popularAnimations).find(k => 
    query.toLowerCase().includes(k)
  ) || "default";

  return {
    success: true,
    data: {
      animations: popularAnimations[key],
      totalResults: popularAnimations[key].length,
      page: 1,
    },
    provider: "lottie",
  };
}

async function getIconAnimations(category: string): Promise<ConnectorResult<LottieAnimation[]>> {
  const iconCategories: Record<string, LottieAnimation[]> = {
    business: [
      { id: "biz-1", name: "Chart Growth", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_qjosmr4w.json", tags: ["chart", "growth"] },
      { id: "biz-2", name: "Handshake", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_pynkl5ks.json", tags: ["deal", "partnership"] },
    ],
    social: [
      { id: "soc-1", name: "Like Heart", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_hxart9lz.json", tags: ["like", "heart"] },
      { id: "soc-2", name: "Share", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_u4yrau.json", tags: ["share", "social"] },
    ],
    navigation: [
      { id: "nav-1", name: "Menu Toggle", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_4kx2q32n.json", tags: ["menu", "hamburger"] },
      { id: "nav-2", name: "Arrow", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_rd3vq5ms.json", tags: ["arrow", "direction"] },
    ],
  };

  const animations = iconCategories[category.toLowerCase()] || iconCategories.business;

  return {
    success: true,
    data: animations,
    provider: "lottie",
  };
}

export const lottieConnector = defineConnector({
  key: "lottie",
  name: "Lottie Animations",
  description: "Animated icons and graphics for websites",
  category: "animations",
  capabilities: ["animations"],
  authType: "apiKey",
  requiredEnvVars: [],
  optionalEnvVars: ["LOTTIEFILES_API_KEY"],
  
  isConfigured(): boolean {
    return true;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    return { ok: true, message: "Lottie animations available (using fallback library)" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "search":
        return searchAnimations(input.query, {
          page: input.page,
          perPage: input.perPage,
        }) as Promise<ConnectorResult<O>>;

      case "get_icons":
        return getIconAnimations(input.category) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "lottie",
        };
    }
  },
});
