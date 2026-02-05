import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

// API Configuration
const API_ENDPOINT = "https://api.namecheap.com/xml.response";
const SANDBOX_ENDPOINT = "https://api.sandbox.namecheap.com/xml.response";

function getApiEndpoint(): string {
  return process.env.NAMECHEAP_SANDBOX === "true" ? SANDBOX_ENDPOINT : API_ENDPOINT;
}

function getApiParams(): URLSearchParams {
  const apiUser = process.env.NAMECHEAP_API_USER!;
  const apiKey = process.env.NAMECHEAP_API_KEY!;
  const clientIp = process.env.NAMECHEAP_CLIENT_IP || "127.0.0.1";
  
  return new URLSearchParams({
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: apiUser,
    ClientIp: clientIp,
  });
}

// Interfaces
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

interface DomainPricing {
  tld: string;
  registerPrice: number;
  renewPrice: number;
  transferPrice: number;
  currency: string;
  years: number;
}

interface DomainInfo {
  domain: string;
  createdDate: string;
  expiredDate: string;
  isLocked: boolean;
  autoRenew: boolean;
  whoisGuard: boolean;
  nameservers: string[];
  status: string;
}

interface RegistrationResult {
  domain: string;
  registered: boolean;
  transactionId?: string;
  orderId?: string;
  chargedAmount?: number;
  years: number;
  expireDate?: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  organizationName?: string;
  address2?: string;
}

// Helper to parse XML responses
function extractXmlValue(xml: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = xml.match(regex);
  return match?.[1];
}

function extractXmlAttribute(xml: string, tag: string, attr: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const match = xml.match(regex);
  return match?.[1];
}

function hasError(xml: string): { hasError: boolean; message?: string } {
  if (xml.includes('<Error>') || xml.includes('Status="ERROR"')) {
    const errorMatch = xml.match(/<Error[^>]*>([^<]*)<\/Error>/);
    return { hasError: true, message: errorMatch?.[1] || "Unknown API error" };
  }
  return { hasError: false };
}

// API Functions
async function checkDomain(domain: string): Promise<ConnectorResult<DomainAvailability>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.domains.check");
    params.set("DomainList", domain);

    const response = await fetch(`${getApiEndpoint()}?${params}`);

    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
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

async function checkMultipleDomains(domains: string[]): Promise<ConnectorResult<DomainAvailability[]>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.domains.check");
    params.set("DomainList", domains.join(","));

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const results: DomainAvailability[] = [];
    const regex = /<DomainCheckResult[^>]*Domain="([^"]*)"[^>]*Available="([^"]*)"[^>]*IsPremiumName="([^"]*)"[^>]*PremiumRegistrationPrice="([^"]*)"/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      results.push({
        domain: match[1],
        available: match[2].toLowerCase() === "true",
        premium: match[3].toLowerCase() === "true",
        price: match[4] && match[4] !== "0" ? parseFloat(match[4]) : undefined,
        currency: match[4] && match[4] !== "0" ? "USD" : undefined,
      });
    }

    return {
      success: true,
      data: results,
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Batch domain check failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check domains",
      provider: "namecheap",
    };
  }
}

async function searchDomains(query: string, tlds?: string[]): Promise<ConnectorResult<DomainSearchResult>> {
  const extensions = tlds || [".com", ".net", ".org", ".io", ".co", ".app"];
  const cleanQuery = query.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const domains = extensions.map(ext => cleanQuery + (ext.startsWith(".") ? ext : "." + ext));
  
  const result = await checkMultipleDomains(domains);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error,
      provider: "namecheap",
    };
  }

  return {
    success: true,
    data: {
      results: result.data || [],
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
  suggestions.push(base + ".app");
  suggestions.push(base + ".dev");
  
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

async function getTldPricing(tlds?: string[]): Promise<ConnectorResult<DomainPricing[]>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.users.getPricing");
    params.set("ProductType", "DOMAIN");
    params.set("ProductCategory", "REGISTER");
    
    if (tlds && tlds.length > 0) {
      params.set("ProductName", tlds.map(t => t.replace(".", "")).join(","));
    }

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const pricing: DomainPricing[] = [];
    const productRegex = /<Product Name="([^"]*)"[^>]*>([\s\S]*?)<\/Product>/g;
    let productMatch;

    while ((productMatch = productRegex.exec(text)) !== null) {
      const tld = productMatch[1];
      const productXml = productMatch[2];
      
      const priceMatch = productXml.match(/<Price Duration="(\d+)"[^>]*Price="([^"]*)"[^>]*Currency="([^"]*)"/);
      
      if (priceMatch) {
        pricing.push({
          tld: "." + tld.toLowerCase(),
          registerPrice: parseFloat(priceMatch[2]),
          renewPrice: parseFloat(priceMatch[2]), // Simplified - real API has separate renew prices
          transferPrice: parseFloat(priceMatch[2]),
          currency: priceMatch[3],
          years: parseInt(priceMatch[1]),
        });
      }
    }

    // Return common TLD pricing if API didn't return specific ones
    if (pricing.length === 0) {
      const commonPricing: DomainPricing[] = [
        { tld: ".com", registerPrice: 12.98, renewPrice: 14.98, transferPrice: 12.98, currency: "USD", years: 1 },
        { tld: ".net", registerPrice: 14.98, renewPrice: 16.98, transferPrice: 14.98, currency: "USD", years: 1 },
        { tld: ".org", registerPrice: 12.98, renewPrice: 14.98, transferPrice: 12.98, currency: "USD", years: 1 },
        { tld: ".io", registerPrice: 44.98, renewPrice: 44.98, transferPrice: 44.98, currency: "USD", years: 1 },
        { tld: ".co", registerPrice: 29.98, renewPrice: 29.98, transferPrice: 29.98, currency: "USD", years: 1 },
        { tld: ".app", registerPrice: 19.98, renewPrice: 19.98, transferPrice: 19.98, currency: "USD", years: 1 },
        { tld: ".dev", registerPrice: 16.98, renewPrice: 16.98, transferPrice: 16.98, currency: "USD", years: 1 },
      ];
      return {
        success: true,
        data: tlds ? commonPricing.filter(p => tlds.some(t => p.tld === t || p.tld === "." + t)) : commonPricing,
        provider: "namecheap",
      };
    }

    return {
      success: true,
      data: pricing,
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Get pricing failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get pricing",
      provider: "namecheap",
    };
  }
}

async function getDomainInfo(domain: string): Promise<ConnectorResult<DomainInfo>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const [sld, tld] = domain.split(".");
    
    const params = getApiParams();
    params.set("Command", "namecheap.domains.getInfo");
    params.set("DomainName", domain);

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const domainInfo: DomainInfo = {
      domain,
      createdDate: extractXmlAttribute(text, "DomainGetInfoResult", "DomainName") ? 
        extractXmlValue(text, "CreatedDate") || "" : "",
      expiredDate: extractXmlValue(text, "ExpiredDate") || "",
      isLocked: text.includes('IsLocked="true"'),
      autoRenew: text.includes('AutoRenew="true"'),
      whoisGuard: text.includes('Enabled="true"') && text.includes("Whoisguard"),
      nameservers: [],
      status: extractXmlAttribute(text, "DomainGetInfoResult", "Status") || "unknown",
    };

    // Extract nameservers
    const nsRegex = /<Nameserver>([^<]*)<\/Nameserver>/g;
    let nsMatch;
    while ((nsMatch = nsRegex.exec(text)) !== null) {
      domainInfo.nameservers.push(nsMatch[1]);
    }

    return {
      success: true,
      data: domainInfo,
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Get domain info failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get domain info",
      provider: "namecheap",
    };
  }
}

async function getAccountBalance(): Promise<ConnectorResult<{ balance: number; currency: string }>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.users.getBalances");

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const balanceMatch = text.match(/<UserGetBalancesResult[^>]*AvailableBalance="([^"]*)"[^>]*Currency="([^"]*)"/);
    
    if (balanceMatch) {
      return {
        success: true,
        data: {
          balance: parseFloat(balanceMatch[1]),
          currency: balanceMatch[2],
        },
        provider: "namecheap",
      };
    }

    return {
      success: false,
      error: "Could not parse balance from response",
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Get balance failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get balance",
      provider: "namecheap",
    };
  }
}

async function listDomains(page?: number, pageSize?: number): Promise<ConnectorResult<{ domains: DomainInfo[]; totalItems: number; currentPage: number }>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.domains.getList");
    params.set("Page", String(page || 1));
    params.set("PageSize", String(pageSize || 20));

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const domains: DomainInfo[] = [];
    const domainRegex = /<Domain[^>]*Name="([^"]*)"[^>]*Created="([^"]*)"[^>]*Expires="([^"]*)"[^>]*IsLocked="([^"]*)"[^>]*AutoRenew="([^"]*)"/g;
    let match;

    while ((match = domainRegex.exec(text)) !== null) {
      domains.push({
        domain: match[1],
        createdDate: match[2],
        expiredDate: match[3],
        isLocked: match[4].toLowerCase() === "true",
        autoRenew: match[5].toLowerCase() === "true",
        whoisGuard: false,
        nameservers: [],
        status: "active",
      });
    }

    const totalMatch = text.match(/TotalItems="(\d+)"/);
    const pageMatch = text.match(/CurrentPage="(\d+)"/);

    return {
      success: true,
      data: {
        domains,
        totalItems: totalMatch ? parseInt(totalMatch[1]) : domains.length,
        currentPage: pageMatch ? parseInt(pageMatch[1]) : 1,
      },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] List domains failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list domains",
      provider: "namecheap",
    };
  }
}

async function registerDomain(
  domain: string,
  years: number,
  contact: ContactInfo,
  nameservers?: string[]
): Promise<ConnectorResult<RegistrationResult>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.domains.create");
    params.set("DomainName", domain);
    params.set("Years", String(years));

    // Registrant contact
    params.set("RegistrantFirstName", contact.firstName);
    params.set("RegistrantLastName", contact.lastName);
    params.set("RegistrantAddress1", contact.address1);
    if (contact.address2) params.set("RegistrantAddress2", contact.address2);
    params.set("RegistrantCity", contact.city);
    params.set("RegistrantStateProvince", contact.stateProvince);
    params.set("RegistrantPostalCode", contact.postalCode);
    params.set("RegistrantCountry", contact.country);
    params.set("RegistrantPhone", contact.phone);
    params.set("RegistrantEmailAddress", contact.email);
    if (contact.organizationName) params.set("RegistrantOrganizationName", contact.organizationName);

    // Tech contact (same as registrant)
    params.set("TechFirstName", contact.firstName);
    params.set("TechLastName", contact.lastName);
    params.set("TechAddress1", contact.address1);
    if (contact.address2) params.set("TechAddress2", contact.address2);
    params.set("TechCity", contact.city);
    params.set("TechStateProvince", contact.stateProvince);
    params.set("TechPostalCode", contact.postalCode);
    params.set("TechCountry", contact.country);
    params.set("TechPhone", contact.phone);
    params.set("TechEmailAddress", contact.email);

    // Admin contact (same as registrant)
    params.set("AdminFirstName", contact.firstName);
    params.set("AdminLastName", contact.lastName);
    params.set("AdminAddress1", contact.address1);
    if (contact.address2) params.set("AdminAddress2", contact.address2);
    params.set("AdminCity", contact.city);
    params.set("AdminStateProvince", contact.stateProvince);
    params.set("AdminPostalCode", contact.postalCode);
    params.set("AdminCountry", contact.country);
    params.set("AdminPhone", contact.phone);
    params.set("AdminEmailAddress", contact.email);

    // Billing contact (same as registrant)
    params.set("AuxBillingFirstName", contact.firstName);
    params.set("AuxBillingLastName", contact.lastName);
    params.set("AuxBillingAddress1", contact.address1);
    if (contact.address2) params.set("AuxBillingAddress2", contact.address2);
    params.set("AuxBillingCity", contact.city);
    params.set("AuxBillingStateProvince", contact.stateProvince);
    params.set("AuxBillingPostalCode", contact.postalCode);
    params.set("AuxBillingCountry", contact.country);
    params.set("AuxBillingPhone", contact.phone);
    params.set("AuxBillingEmailAddress", contact.email);

    // Nameservers
    if (nameservers && nameservers.length > 0) {
      nameservers.forEach((ns, i) => {
        params.set(`Nameserver${i + 1}`, ns);
      });
    }

    // Enable WhoisGuard by default
    params.set("AddFreeWhoisguard", "yes");
    params.set("WGEnabled", "yes");

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const registered = text.includes('Registered="true"');
    const transactionId = extractXmlAttribute(text, "DomainCreateResult", "TransactionID");
    const orderId = extractXmlAttribute(text, "DomainCreateResult", "OrderID");
    const chargedAmount = extractXmlAttribute(text, "DomainCreateResult", "ChargedAmount");

    return {
      success: true,
      data: {
        domain,
        registered,
        transactionId,
        orderId,
        chargedAmount: chargedAmount ? parseFloat(chargedAmount) : undefined,
        years,
        expireDate: registered ? new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Register domain failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register domain",
      provider: "namecheap",
    };
  }
}

async function renewDomain(domain: string, years: number): Promise<ConnectorResult<{ renewed: boolean; expireDate: string; chargedAmount?: number }>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const params = getApiParams();
    params.set("Command", "namecheap.domains.renew");
    params.set("DomainName", domain);
    params.set("Years", String(years));

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const renewed = text.includes('Renew="true"') || text.includes('IsSuccess="true"');
    const expireDate = extractXmlAttribute(text, "DomainRenewResult", "DomainDetails_ExpiredDate") || "";
    const chargedAmount = extractXmlAttribute(text, "DomainRenewResult", "ChargedAmount");

    return {
      success: true,
      data: {
        renewed,
        expireDate,
        chargedAmount: chargedAmount ? parseFloat(chargedAmount) : undefined,
      },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Renew domain failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to renew domain",
      provider: "namecheap",
    };
  }
}

async function setNameservers(domain: string, nameservers: string[]): Promise<ConnectorResult<{ success: boolean }>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const [sld, tld] = domain.split(".");
    
    const params = getApiParams();
    params.set("Command", "namecheap.domains.dns.setCustom");
    params.set("SLD", sld);
    params.set("TLD", tld);
    params.set("Nameservers", nameservers.join(","));

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    return {
      success: true,
      data: { success: text.includes('Update="true"') || !error.hasError },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Set nameservers failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set nameservers",
      provider: "namecheap",
    };
  }
}

async function getDnsRecords(domain: string): Promise<ConnectorResult<{ records: Array<{ hostName: string; type: string; address: string; ttl: number }> }>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const [sld, tld] = domain.split(".");
    
    const params = getApiParams();
    params.set("Command", "namecheap.domains.dns.getHosts");
    params.set("SLD", sld);
    params.set("TLD", tld);

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    const records: Array<{ hostName: string; type: string; address: string; ttl: number }> = [];
    const recordRegex = /<host[^>]*HostId="[^"]*"[^>]*Name="([^"]*)"[^>]*Type="([^"]*)"[^>]*Address="([^"]*)"[^>]*TTL="([^"]*)"/gi;
    let match;

    while ((match = recordRegex.exec(text)) !== null) {
      records.push({
        hostName: match[1],
        type: match[2],
        address: match[3],
        ttl: parseInt(match[4]),
      });
    }

    return {
      success: true,
      data: { records },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Get DNS records failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get DNS records",
      provider: "namecheap",
    };
  }
}

async function setDnsRecords(
  domain: string,
  records: Array<{ hostName: string; type: string; address: string; ttl?: number }>
): Promise<ConnectorResult<{ success: boolean }>> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  
  if (!apiUser || !apiKey) {
    return {
      success: false,
      error: "Namecheap credentials not configured",
      provider: "namecheap",
    };
  }

  try {
    const [sld, tld] = domain.split(".");
    
    const params = getApiParams();
    params.set("Command", "namecheap.domains.dns.setHosts");
    params.set("SLD", sld);
    params.set("TLD", tld);

    records.forEach((record, i) => {
      const index = i + 1;
      params.set(`HostName${index}`, record.hostName);
      params.set(`RecordType${index}`, record.type);
      params.set(`Address${index}`, record.address);
      params.set(`TTL${index}`, String(record.ttl || 1800));
    });

    const response = await fetch(`${getApiEndpoint()}?${params}`);
    if (!response.ok) {
      return {
        success: false,
        error: `Namecheap API error: ${response.statusText}`,
        provider: "namecheap",
      };
    }

    const text = await response.text();
    const error = hasError(text);
    if (error.hasError) {
      return {
        success: false,
        error: `Namecheap API error: ${error.message}`,
        provider: "namecheap",
      };
    }

    return {
      success: true,
      data: { success: text.includes('IsSuccess="true"') },
      provider: "namecheap",
    };
  } catch (error) {
    console.error("[Namecheap] Set DNS records failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set DNS records",
      provider: "namecheap",
    };
  }
}

export const namecheapConnector = defineConnector({
  key: "namecheap",
  name: "Namecheap",
  description: "Domain availability checking, registration, DNS management, and renewal",
  category: "domains",
  capabilities: ["domain_check", "domain_register"],
  authType: "apiKey",
  requiredEnvVars: ["NAMECHEAP_API_USER", "NAMECHEAP_API_KEY"],
  optionalEnvVars: ["NAMECHEAP_CLIENT_IP", "NAMECHEAP_SANDBOX"],
  
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

      case "check_domains":
        return checkMultipleDomains(input.domains) as Promise<ConnectorResult<O>>;

      case "search_domains":
        return searchDomains(input.query, input.tlds) as Promise<ConnectorResult<O>>;

      case "get_suggestions":
        return getSuggestions(input.keyword) as Promise<ConnectorResult<O>>;

      case "get_pricing":
        return getTldPricing(input.tlds) as Promise<ConnectorResult<O>>;

      case "get_domain_info":
        return getDomainInfo(input.domain) as Promise<ConnectorResult<O>>;

      case "get_balance":
        return getAccountBalance() as Promise<ConnectorResult<O>>;

      case "list_domains":
        return listDomains(input.page, input.pageSize) as Promise<ConnectorResult<O>>;

      case "register_domain":
        return registerDomain(input.domain, input.years, input.contact, input.nameservers) as Promise<ConnectorResult<O>>;

      case "renew_domain":
        return renewDomain(input.domain, input.years) as Promise<ConnectorResult<O>>;

      case "set_nameservers":
        return setNameservers(input.domain, input.nameservers) as Promise<ConnectorResult<O>>;

      case "get_dns_records":
        return getDnsRecords(input.domain) as Promise<ConnectorResult<O>>;

      case "set_dns_records":
        return setDnsRecords(input.domain, input.records) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "namecheap",
        };
    }
  },
});
