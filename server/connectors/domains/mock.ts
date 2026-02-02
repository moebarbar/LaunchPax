import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult, DomainCheckResult } from "@shared/schema";

/**
 * Mock Domain Connector
 * 
 * Provides mock domain availability checking for demonstration.
 * In production, this would be replaced by real registrar APIs
 * (GoDaddy, Namecheap, Cloudflare, etc.)
 */

export const mockDomainConnector = defineConnector({
  key: "domain_mock",
  name: "Mock Domain Checker (Demo)",
  description: "Simulated domain availability checking for demonstration",
  category: "domains",
  capabilities: ["domain_check"],
  authType: "none",
  requiredEnvVars: [],

  isConfigured() {
    return true; // Always available as fallback
  },

  async test() {
    return { ok: true, message: "Mock domain connector ready" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    switch (task.action) {
      case "check_domains": {
        const input = task.input as { domains: string[] };
        
        // Simulate availability - some taken, some available
        const takenDomains = new Set([
          "google.com", "facebook.com", "amazon.com", "apple.com",
          "microsoft.com", "netflix.com", "twitter.com", "instagram.com",
        ]);

        const results: DomainCheckResult[] = input.domains.map(domain => {
          const normalizedDomain = domain.toLowerCase();
          const isTaken = takenDomains.has(normalizedDomain) || 
                          Math.random() < 0.4; // 40% chance of being taken
          
          return {
            domain: normalizedDomain,
            available: !isTaken,
            price: isTaken ? undefined : Math.floor(10 + Math.random() * 40),
            currency: "USD",
            provider: "domain_mock",
          };
        });

        return {
          success: true,
          data: results as O,
          provider: "domain_mock",
          metadata: { isMock: true },
        };
      }

      case "generate_domain_suggestions": {
        const input = task.input as { names: string[]; tlds?: string[] };
        const tlds = input.tlds || [".com", ".io", ".co", ".ai", ".app"];
        
        const suggestions: Array<{ name: string; domain: string; tld: string }> = [];
        
        for (const name of input.names) {
          const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
          for (const tld of tlds) {
            suggestions.push({
              name,
              domain: `${cleanName}${tld}`,
              tld,
            });
          }
        }

        return {
          success: true,
          data: suggestions as O,
          provider: "domain_mock",
          metadata: { isMock: true },
        };
      }

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "domain_mock",
        };
    }
  },
});
