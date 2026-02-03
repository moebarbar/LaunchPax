import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface OptimizedImage {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "thumb" | "crop";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  blur?: number;
  grayscale?: boolean;
  aspectRatio?: string;
}

function getCloudinaryUrl(options: {
  publicId: string;
  transformations?: ImageTransformOptions;
}): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";

  const transforms: string[] = [];
  const t = options.transformations;

  if (t) {
    if (t.width) transforms.push(`w_${t.width}`);
    if (t.height) transforms.push(`h_${t.height}`);
    if (t.crop) transforms.push(`c_${t.crop}`);
    if (t.quality) transforms.push(`q_${t.quality}`);
    if (t.format) transforms.push(`f_${t.format}`);
    if (t.blur) transforms.push(`e_blur:${t.blur}`);
    if (t.grayscale) transforms.push("e_grayscale");
    if (t.aspectRatio) transforms.push(`ar_${t.aspectRatio}`);
  }

  const transformString = transforms.length > 0 ? transforms.join(",") + "/" : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${options.publicId}`;
}

async function uploadImage(options: {
  imageUrl: string;
  folder?: string;
  publicId?: string;
}): Promise<ConnectorResult<OptimizedImage>> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    return {
      success: false,
      error: "Cloudinary credentials not configured",
      provider: "cloudinary",
    };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign: Record<string, string> = {
      timestamp: timestamp.toString(),
    };
    if (options.folder) paramsToSign.folder = options.folder;
    if (options.publicId) paramsToSign.public_id = options.publicId;

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map(k => `${k}=${paramsToSign[k]}`)
      .join("&");

    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(sortedParams + apiSecret)
      .digest("hex");

    const formData = new FormData();
    formData.append("file", options.imageUrl);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    if (options.folder) formData.append("folder", options.folder);
    if (options.publicId) formData.append("public_id", options.publicId);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Cloudinary error: ${error.error?.message || response.statusText}`,
        provider: "cloudinary",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        url: data.url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
      },
      provider: "cloudinary",
    };
  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
      provider: "cloudinary",
    };
  }
}

function optimizeImageUrl(options: {
  url: string;
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif";
}): ConnectorResult<{ optimizedUrl: string; srcSet: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    return {
      success: true,
      data: {
        optimizedUrl: options.url,
        srcSet: options.url,
      },
      provider: "cloudinary",
    };
  }

  const baseTransforms = `f_${options.format || "auto"},q_${options.quality || "auto"}`;
  
  const widths = [400, 800, 1200, 1600, 2000];
  const targetWidth = options.width || 1200;
  
  const fetchUrl = encodeURIComponent(options.url);
  const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/${baseTransforms},w_${targetWidth}/${fetchUrl}`;
  
  const srcSet = widths
    .map(w => `https://res.cloudinary.com/${cloudName}/image/fetch/${baseTransforms},w_${w}/${fetchUrl} ${w}w`)
    .join(", ");

  return {
    success: true,
    data: {
      optimizedUrl,
      srcSet,
    },
    provider: "cloudinary",
  };
}

function generateResponsiveUrls(options: {
  publicId: string;
  breakpoints?: number[];
}): ConnectorResult<{ urls: Record<string, string>; srcSet: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    return {
      success: false,
      error: "Cloudinary cloud name not configured",
      provider: "cloudinary",
    };
  }

  const breakpoints = options.breakpoints || [320, 640, 768, 1024, 1280, 1536];
  const urls: Record<string, string> = {};
  const srcSetParts: string[] = [];

  for (const width of breakpoints) {
    const url = getCloudinaryUrl({
      publicId: options.publicId,
      transformations: {
        width,
        quality: "auto",
        format: "auto",
        crop: "fill",
      },
    });
    urls[`${width}w`] = url;
    srcSetParts.push(`${url} ${width}w`);
  }

  return {
    success: true,
    data: {
      urls,
      srcSet: srcSetParts.join(", "),
    },
    provider: "cloudinary",
  };
}

export const cloudinaryConnector = defineConnector({
  key: "cloudinary",
  name: "Cloudinary",
  description: "Image optimization and CDN for faster websites",
  category: "cdn",
  capabilities: ["image_optimization", "cdn"],
  authType: "apiKey",
  requiredEnvVars: ["CLOUDINARY_CLOUD_NAME"],
  optionalEnvVars: ["CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"],
  
  isConfigured(): boolean {
    return !!process.env.CLOUDINARY_CLOUD_NAME;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return { ok: false, message: "Cloudinary cloud name not configured" };
    }
    return { ok: true, message: "Cloudinary configured for image optimization" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "upload":
        return uploadImage({
          imageUrl: input.imageUrl,
          folder: input.folder,
          publicId: input.publicId,
        }) as Promise<ConnectorResult<O>>;

      case "optimize_url":
        return Promise.resolve(optimizeImageUrl({
          url: input.url,
          width: input.width,
          height: input.height,
          quality: input.quality,
          format: input.format,
        })) as Promise<ConnectorResult<O>>;

      case "responsive_urls":
        return Promise.resolve(generateResponsiveUrls({
          publicId: input.publicId,
          breakpoints: input.breakpoints,
        })) as Promise<ConnectorResult<O>>;

      case "get_url":
        return Promise.resolve({
          success: true,
          data: {
            url: getCloudinaryUrl({
              publicId: input.publicId,
              transformations: input.transformations,
            }),
          },
          provider: "cloudinary",
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "cloudinary",
        };
    }
  },
});
