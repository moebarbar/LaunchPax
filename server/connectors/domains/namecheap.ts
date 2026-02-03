import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface DomainAvailability {
  domain: string;
  available: boolean;
  premium: boolean;
  price?: number;
  currency?: string;
}

interface DomainSearchResult {
  results: DomainAvailability[];
  query: string;
}

async function checkDomain(domain: string): Promise<ConnectorResult<DomainAvailability>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  const clientIp = process.env.NAMECHEAP_CLIENT_IP || "127.0.0.1";
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = new URLSearchParams({
      ApiUser: apiUser,
      ApiKey: apiKey,
      UserName: apiUser,
      ClientIp: clientIp,
      Command: "namecheap.domains.check",
      DomainList: domain,
    });

    const response = await fetch(
      `https://api.namecheap.com/xml.response?${params}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    
    if (text.includes('<Error>') || text.includes('Status="ERROR"')) {
      const errorMatch = text.match(/<Error[^>]*>([^<]*)<\/Error>/);
      return {
        success: false,
        error: `Namecheap API error: ${errorMatch?.[1] || "Unknown error"}`,
        provider: "namecheap",
      };
    }
    
    const domainCheckMatch = text.match(/<DomainCheckResult[^>]*Domain="[^"]*"[^>]*Available="([^"]*)"[^>]*IsPremiumName="([^"]*)"[^>]*PremiumRegistrationPrice="([^"]*)"[^>]*/);
    
    let available = false;
    let premium = false;
    let price: number | undefined = undefined;
    
    if (domainCheckMatch) {
      available = domainCheckMatch[1].toLowerCase() === "true";
      premium = domainCheckMatch[2].toLowerCase() === "true";
      const priceStr = domainCheckMatch[3];
      if (priceStr && priceStr !== "0") {
        price = parseFloat(priceStr);
      }
    } else {
      available = text.includes('Available="true"');
      premium = text.includes('IsPremiumName="true"');
    }

    return {
      success: true,
      data: {
        domain,
        available,
        premium,
        price,
        currency: price ? "USD" : undefined,
      },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Domain check failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check domain",
      provider: "namecheap",
    };
  }
}

async function searchDomains(query: string, tlds?: string[]): Promise<ConnectorResult<DomainSearchResult>> {
  const extensions = tlds || [".com", ".net", ".org", ".io", ".co", ".app"];
  const domains = extensions.map(ext => query.replace(/[^a-z0-9-]/gi, "") + ext);
  
  const results: DomainAvailability[] = [];
  
  for (const domain of domains) {
    const result = await checkDomain(domain);
    if (result.success && result.data) {
      results.push(result.data);
    } else {
      results.push({
        domain,
        available: false,
        premium: false,
      });
    }
  }

  return {
    success: true,
    data: {
      results,
      query,
    },
    provider: "namecheap",
  };
}

async function getSuggestions(keyword: string): Promise<ConnectorResult<string[]>> {
  const suffixes = ["hub", "app", "io", "lab", "studio", "pro", "plus", "zone", "cloud", "hq"];
  const prefixes = ["get", "try", "use", "my", "the", "go"];
  
  const suggestions: string[] = [];
  const base = keyword.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  suggestions.push(base + ".com");
  suggestions.push(base + ".io");
  suggestions.push(base + ".co");
  
  for (const suffix of suffixes.slice(0, 5)) {
    suggestions.push(base + suffix + ".com");
  }
  
  for (const prefix of prefixes.slice(0, 3)) {
    suggestions.push(prefix + base + ".com");
  }

  return {
    success: true,
    data: suggestions,
    provider: "namecheap",
  };
}

export const namecheapConnector = defineConnector({
  key: "namecheap",
  name: "Namecheap",
  description: "Domain availability checking and registration",
  category: "domains",
  capabilities: ["domain_check", "domain_register"],
  authType: "apiKey",
  requiredEnvVars: ["NAMECHEAP_API_USER", "NAMECHEAP_API_KEY"],
  optionalEnvVars: ["NAMECHEAP_CLIENT_IP"],
  
  isConfigured(): boolean {
    return !!(process.env.NAMECHEAP_API_USER && process.env.NAMECHEAP_API_KEY);
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.NAMECHEAP_API_USER || !process.env.NAMECHEAP_API_KEY) {
      return { ok: false, message: "Namecheap credentials not configured" };
    }
    const result = await checkDomain("example.com");
    if (result.success) {
      return { ok: true, message: "Namecheap API connected successfully" };
    }
    return { ok: false, message: result.error || "Failed to connect to Namecheap" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "check_domain":
        return checkDomain(input.domain) as Promise<ConnectorResult<O>>;

      case "search_domains":
        return searchDomains(input.query, input.tlds) as Promise<ConnectorResult<O>>;

      case "get_suggestions":
        return getSuggestions(input.keyword) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "namecheap",
        };
    }
  },
});
