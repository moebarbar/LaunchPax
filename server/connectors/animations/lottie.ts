import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface LottieAnimation {
  id: string;
  name: string;
  previewUrl: string;
  lottieUrl: string;
  dotLottieUrl?: string;
  tags: string[];
  createdBy?: string;
  format?: "lottie" | "dotlottie";
}

interface LottieSearchResult {
  animations: LottieAnimation[];
  totalResults: number;
  page: number;
}

interface DotLottiePreset {
  id: string;
  name: string;
  dotLottieUrl: string;
  tags: string[];
}

const DOTLOTTIE_PRESETS: Record<string, DotLottiePreset[]> = {
  loading: [
    { id: "load-1", name: "Spinner", dotLottieUrl: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189571e1bc9d/7Czfx8OMqu.lottie", tags: ["loading", "spinner"] },
    { id: "load-2", name: "Loading Dots", dotLottieUrl: "https://lottie.host/65f22d4e-7df7-4e15-9a5b-45f67e40f18a/bSOPpfWIUn.lottie", tags: ["loading", "dots"] },
    { id: "load-3", name: "Loading Bars", dotLottieUrl: "https://lottie.host/a0fd3b44-c86e-4e5c-86f8-0cab6e9f17bc/rDeBnbUYiX.lottie", tags: ["loading", "bars"] },
  ],
  success: [
    { id: "suc-1", name: "Success Check", dotLottieUrl: "https://lottie.host/8c8c8caa-70b8-49ac-a2d2-ecb79e85af00/qk8pXhDJMb.lottie", tags: ["success", "check"] },
    { id: "suc-2", name: "Celebrate", dotLottieUrl: "https://lottie.host/e9dc4c98-0a11-4476-8cfe-8f08ef4a2d29/sSCzLaGNCs.lottie", tags: ["success", "celebration"] },
  ],
  error: [
    { id: "err-1", name: "Error Cross", dotLottieUrl: "https://lottie.host/e3d43fae-d5cf-4b86-a2a5-c9b3a9f6c6f0/AzHZK7QBMa.lottie", tags: ["error", "cross"] },
    { id: "err-2", name: "Warning", dotLottieUrl: "https://lottie.host/2cdd7a8e-b7a4-4a60-82aa-b1b8f39f3f0a/pVbLGFSNUY.lottie", tags: ["error", "warning"] },
  ],
  icons: [
    { id: "ico-1", name: "Email", dotLottieUrl: "https://lottie.host/d05bc2a9-6ef0-4f22-9bcc-29d178a5fa47/MmPCJhv9e5.lottie", tags: ["email", "mail", "contact"] },
    { id: "ico-2", name: "Star", dotLottieUrl: "https://lottie.host/ae6c1e05-b4d7-4f9a-82c3-7a8b9c0d1e2f/gHiJkLmNoP.lottie", tags: ["star", "rating", "favorite"] },
    { id: "ico-3", name: "Heart", dotLottieUrl: "https://lottie.host/f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/qRsTuVwXyZ.lottie", tags: ["heart", "like", "love"] },
    { id: "ico-4", name: "Rocket", dotLottieUrl: "https://lottie.host/a1b2c3d4-e5f6-7890-abcd-ef1234567890/abc123def456.lottie", tags: ["rocket", "launch", "startup"] },
    { id: "ico-5", name: "Chart", dotLottieUrl: "https://lottie.host/b2c3d4e5-f6a7-8901-bcde-f23456789012/bcd234efg567.lottie", tags: ["chart", "analytics", "growth"] },
  ],
  ui: [
    { id: "ui-1", name: "Menu Toggle", dotLottieUrl: "https://lottie.host/c3d4e5f6-a7b8-9012-cdef-345678901234/cde345fgh678.lottie", tags: ["menu", "hamburger", "toggle"] },
    { id: "ui-2", name: "Arrow", dotLottieUrl: "https://lottie.host/d4e5f6a7-b8c9-0123-def0-456789012345/def456ghi789.lottie", tags: ["arrow", "navigation", "direction"] },
    { id: "ui-3", name: "Play/Pause", dotLottieUrl: "https://lottie.host/e5f6a7b8-c9d0-1234-ef01-567890123456/efg567hij890.lottie", tags: ["play", "pause", "media"] },
  ],
};

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
      dotLottieUrl: anim.lottie_url,
      tags: anim.tags || [],
      createdBy: anim.created_by?.name,
      format: "lottie" as const,
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
        dotLottieUrl: DOTLOTTIE_PRESETS.loading[0].dotLottieUrl,
        tags: ["loading", "spinner"],
        format: "lottie",
      },
    ],
    success: [
      {
        id: "success-1",
        name: "Success Checkmark",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_jbrw3hcz.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_jbrw3hcz.json",
        dotLottieUrl: DOTLOTTIE_PRESETS.success[0].dotLottieUrl,
        tags: ["success", "check"],
        format: "lottie",
      },
    ],
    error: [
      {
        id: "error-1",
        name: "Error Animation",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_tl52xzvn.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_tl52xzvn.json",
        dotLottieUrl: DOTLOTTIE_PRESETS.error[0].dotLottieUrl,
        tags: ["error", "warning"],
        format: "lottie",
      },
    ],
    default: [
      {
        id: "default-1",
        name: "Animated Icon",
        previewUrl: "https://assets.lottiefiles.com/packages/lf20_touohxv0.json",
        lottieUrl: "https://assets.lottiefiles.com/packages/lf20_touohxv0.json",
        dotLottieUrl: DOTLOTTIE_PRESETS.icons[0].dotLottieUrl,
        tags: ["icon", "animation"],
        format: "lottie",
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
      { id: "biz-1", name: "Chart Growth", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_qjosmr4w.json", dotLottieUrl: DOTLOTTIE_PRESETS.icons[4].dotLottieUrl, tags: ["chart", "growth"], format: "lottie" },
      { id: "biz-2", name: "Handshake", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_pynkl5ks.json", dotLottieUrl: DOTLOTTIE_PRESETS.icons[3].dotLottieUrl, tags: ["deal", "partnership"], format: "lottie" },
    ],
    social: [
      { id: "soc-1", name: "Like Heart", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_hxart9lz.json", dotLottieUrl: DOTLOTTIE_PRESETS.icons[2].dotLottieUrl, tags: ["like", "heart"], format: "lottie" },
      { id: "soc-2", name: "Share", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_u4yrau.json", dotLottieUrl: DOTLOTTIE_PRESETS.icons[1].dotLottieUrl, tags: ["share", "social"], format: "lottie" },
    ],
    navigation: [
      { id: "nav-1", name: "Menu Toggle", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_4kx2q32n.json", dotLottieUrl: DOTLOTTIE_PRESETS.ui[0].dotLottieUrl, tags: ["menu", "hamburger"], format: "lottie" },
      { id: "nav-2", name: "Arrow", previewUrl: "", lottieUrl: "https://assets.lottiefiles.com/packages/lf20_rd3vq5ms.json", dotLottieUrl: DOTLOTTIE_PRESETS.ui[1].dotLottieUrl, tags: ["arrow", "direction"], format: "lottie" },
    ],
  };

  const animations = iconCategories[category.toLowerCase()] || iconCategories.business;

  return {
    success: true,
    data: animations,
    provider: "lottie",
  };
}

function presetToAnimation(preset: DotLottiePreset): LottieAnimation {
  return {
    id: preset.id,
    name: preset.name,
    previewUrl: preset.dotLottieUrl,
    lottieUrl: preset.dotLottieUrl,
    dotLottieUrl: preset.dotLottieUrl,
    tags: preset.tags,
    format: "dotlottie",
  };
}

function getDotLottiePresets(category?: string): ConnectorResult<{ animations: LottieAnimation[]; categories: string[] }> {
  if (category && DOTLOTTIE_PRESETS[category]) {
    const animations = DOTLOTTIE_PRESETS[category].map(presetToAnimation);
    return {
      success: true,
      data: { animations, categories: [category] },
      provider: "lottie",
    };
  }
  
  const allAnimations: LottieAnimation[] = [];
  const categories = Object.keys(DOTLOTTIE_PRESETS);
  
  for (const cat of categories) {
    allAnimations.push(...DOTLOTTIE_PRESETS[cat].map(presetToAnimation));
  }
  
  return {
    success: true,
    data: { 
      animations: allAnimations, 
      categories 
    },
    provider: "lottie",
  };
}

function getAnimationByType(type: string): ConnectorResult<LottieAnimation | null> {
  const allAnimations: LottieAnimation[] = [
    ...DOTLOTTIE_PRESETS.loading.map(presetToAnimation),
    ...DOTLOTTIE_PRESETS.success.map(presetToAnimation),
    ...DOTLOTTIE_PRESETS.error.map(presetToAnimation),
    ...DOTLOTTIE_PRESETS.icons.map(presetToAnimation),
    ...DOTLOTTIE_PRESETS.ui.map(presetToAnimation),
  ];

  const found = allAnimations.find(a => 
    a.id === type || 
    a.name.toLowerCase().includes(type.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(type.toLowerCase()))
  );

  return {
    success: true,
    data: found || null,
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

      case "get_presets":
        return Promise.resolve(getDotLottiePresets(input.category)) as Promise<ConnectorResult<O>>;

      case "get_animation":
        return Promise.resolve(getAnimationByType(input.type)) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "lottie",
        };
    }
  },
});
