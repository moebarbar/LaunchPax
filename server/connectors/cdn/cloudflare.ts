import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  paused: boolean;
}

interface PurgeResult {
  success: boolean;
  purgedFiles?: string[];
}

interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

async function listZones(): Promise<ConnectorResult<CloudflareZone[]>> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  
  if (!apiToken) {
    return {
      success: false,
      error: "Cloudflare API token not configured",
      provider: "cloudflare",
    };
  }

  try {
    const response = await fetch("https://api.cloudflare.com/client/v4/zones", {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Cloudflare error: ${error.errors?.[0]?.message || response.statusText}`,
        provider: "cloudflare",
      };
    }

    const data = await response.json();
    const zones: CloudflareZone[] = (data.result || []).map((zone: any) => ({
      id: zone.id,
      name: zone.name,
      status: zone.status,
      paused: zone.paused,
    }));

    return {
      success: true,
      data: zones,
      provider: "cloudflare",
    };
  } catch (error) {
    console.error("[Cloudflare] List zones failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list zones",
      provider: "cloudflare",
    };
  }
}

async function purgeCache(options: {
  zoneId: string;
  files?: string[];
  purgeEverything?: boolean;
}): Promise<ConnectorResult<PurgeResult>> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  
  if (!apiToken) {
    return {
      success: false,
      error: "Cloudflare API token not configured",
      provider: "cloudflare",
    };
  }

  try {
    const body = options.purgeEverything 
      ? { purge_everything: true }
      : { files: options.files };

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${options.zoneId}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Cloudflare error: ${error.errors?.[0]?.message || response.statusText}`,
        provider: "cloudflare",
      };
    }

    return {
      success: true,
      data: {
        success: true,
        purgedFiles: options.files,
      },
      provider: "cloudflare",
    };
  } catch (error) {
    console.error("[Cloudflare] Purge cache failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to purge cache",
      provider: "cloudflare",
    };
  }
}

async function createDNSRecord(options: {
  zoneId: string;
  type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}): Promise<ConnectorResult<DNSRecord>> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  
  if (!apiToken) {
    return {
      success: false,
      error: "Cloudflare API token not configured",
      provider: "cloudflare",
    };
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${options.zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: options.type,
          name: options.name,
          content: options.content,
          ttl: options.ttl || 1,
          proxied: options.proxied ?? true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Cloudflare error: ${error.errors?.[0]?.message || response.statusText}`,
        provider: "cloudflare",
      };
    }

    const data = await response.json();
    const record = data.result;

    return {
      success: true,
      data: {
        id: record.id,
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        proxied: record.proxied,
      },
      provider: "cloudflare",
    };
  } catch (error) {
    console.error("[Cloudflare] Create DNS record failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create DNS record",
      provider: "cloudflare",
    };
  }
}

export const cloudflareConnector = defineConnector({
  key: "cloudflare",
  name: "Cloudflare",
  description: "CDN, DNS, and edge deployment for websites",
  category: "cdn",
  capabilities: ["cdn", "hosting"],
  authType: "apiKey",
  requiredEnvVars: ["CLOUDFLARE_API_TOKEN"],
  
  isConfigured(): boolean {
    return !!process.env.CLOUDFLARE_API_TOKEN;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      return { ok: false, message: "Cloudflare API token not configured" };
    }
    const result = await listZones();
    if (result.success) {
      return { ok: true, message: "Cloudflare API connected successfully" };
    }
    return { ok: false, message: result.error || "Failed to connect to Cloudflare" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "list_zones":
        return listZones() as Promise<ConnectorResult<O>>;

      case "purge_cache":
        return purgeCache({
          zoneId: input.zoneId,
          files: input.files,
          purgeEverything: input.purgeEverything,
        }) as Promise<ConnectorResult<O>>;

      case "create_dns_record":
        return createDNSRecord({
          zoneId: input.zoneId,
          type: input.type,
          name: input.name,
          content: input.content,
          ttl: input.ttl,
          proxied: input.proxied,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "cloudflare",
        };
    }
  },
});
