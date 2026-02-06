import type { ConnectorDefinition, ConnectorCapability, ConnectorTask, ConnectorResult, ConnectorInfo } from "@shared/schema";

/**
 * Universal Connector Registry
 * 
 * This is the central abstraction layer for all external API integrations.
 * All external services MUST go through this registry.
 * 
 * Key principles:
 * - No workflow may directly call an external API
 * - Connectors are swappable/replaceable without code changes
 * - Multiple connectors can provide the same capability
 * - Fallback to mock mode when real APIs unavailable
 */

class ConnectorRegistry {
  private connectors: Map<string, ConnectorDefinition> = new Map();
  private capabilityProviders: Map<ConnectorCapability, string[]> = new Map();

  /**
   * Register a connector with the registry
   */
  register(connector: ConnectorDefinition): void {
    this.connectors.set(connector.key, connector);
    
    // Index by capabilities
    for (const capability of connector.capabilities) {
      const providers = this.capabilityProviders.get(capability) || [];
      if (!providers.includes(connector.key)) {
        providers.push(connector.key);
        this.capabilityProviders.set(capability, providers);
      }
    }
    
    console.log(`[ConnectorRegistry] Registered connector: ${connector.key} with capabilities: ${connector.capabilities.join(", ")}`);
  }

  /**
   * Get a specific connector by key
   */
  get(key: string): ConnectorDefinition | undefined {
    return this.connectors.get(key);
  }

  /**
   * Get all registered connectors
   */
  getAll(): ConnectorDefinition[] {
    return Array.from(this.connectors.values());
  }

  /**
   * Get connector info for frontend display
   */
  getAllInfo(): ConnectorInfo[] {
    return this.getAll().map(connector => ({
      key: connector.key,
      name: connector.name,
      description: connector.description,
      category: connector.category,
      capabilities: connector.capabilities,
      authType: connector.authType,
      requiredEnvVars: connector.requiredEnvVars,
      isConfigured: connector.isConfigured(),
    }));
  }

  /**
   * Get all connectors that provide a specific capability
   */
  getByCapability(capability: ConnectorCapability): ConnectorDefinition[] {
    const providerKeys = this.capabilityProviders.get(capability) || [];
    return providerKeys
      .map(key => this.connectors.get(key))
      .filter((c): c is ConnectorDefinition => c !== undefined);
  }

  /**
   * Get the best available connector for a capability
   * Prefers configured connectors over mock ones
   */
  getBestForCapability(capability: ConnectorCapability): ConnectorDefinition | undefined {
    const providers = this.getByCapability(capability);
    
    // First, try to find a configured non-mock connector
    const configuredReal = providers.find(
      p => p.isConfigured() && !p.key.endsWith("_mock")
    );
    if (configuredReal) return configuredReal;
    
    // Fall back to any configured connector
    const anyConfigured = providers.find(p => p.isConfigured());
    if (anyConfigured) return anyConfigured;
    
    // Fall back to mock if available
    const mock = providers.find(p => p.key.endsWith("_mock"));
    if (mock) return mock;
    
    // Return first available
    return providers[0];
  }

  /**
   * Execute a task using the best available connector
   * Tries ALL configured providers for the capability before falling back to mock
   */
  async execute<I, O>(
    capability: ConnectorCapability,
    action: string,
    input: I,
    options?: { preferredConnector?: string }
  ): Promise<ConnectorResult<O>> {
    const providers = this.getByCapability(capability);
    const mockConnector = providers.find(p => p.key.endsWith("_mock"));
    const errors: string[] = [];
    
    const tryExecute = async (connector: ConnectorDefinition): Promise<ConnectorResult<O>> => {
      const task: ConnectorTask<I> = { capability, action, input };
      return await connector.execute<I, O>(task);
    };

    const buildProviderOrder = (preferred?: string): ConnectorDefinition[] => {
      const realProviders = providers.filter(p => !p.key.endsWith("_mock") && p.isConfigured());
      const ordered: ConnectorDefinition[] = [];
      const seen = new Set<string>();

      if (preferred) {
        const pref = this.connectors.get(preferred);
        if (pref?.isConfigured() && pref.capabilities.includes(capability)) {
          ordered.push(pref);
          seen.add(pref.key);
        }
      }

      for (const p of realProviders) {
        if (!seen.has(p.key)) {
          ordered.push(p);
          seen.add(p.key);
        }
      }

      return ordered;
    };

    const providersToTry = buildProviderOrder(options?.preferredConnector);

    if (providersToTry.length === 0 && mockConnector?.isConfigured()) {
      console.log(`[ConnectorRegistry] No real providers for ${capability}, using mock`);
      return await tryExecute(mockConnector);
    }

    if (providersToTry.length === 0) {
      return {
        success: false,
        error: `No connector available for capability: ${capability}`,
        provider: "none",
      };
    }

    for (const connector of providersToTry) {
      try {
        console.log(`[ConnectorRegistry] Trying ${connector.key} for ${capability}/${action}`);
        const result = await tryExecute(connector);
        
        if (result.success) {
          return result;
        }
        
        errors.push(`${connector.key}: ${result.error}`);
        console.log(`[ConnectorRegistry] ${connector.key} failed: ${result.error}, trying next provider`);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        errors.push(`${connector.key}: ${msg}`);
        console.log(`[ConnectorRegistry] ${connector.key} threw error: ${msg}, trying next provider`);
      }
    }

    if (mockConnector && mockConnector.isConfigured()) {
      console.log(`[ConnectorRegistry] All real providers failed for ${capability}/${action}, falling back to mock`);
      try {
        return await tryExecute(mockConnector);
      } catch (error) {
        errors.push(`mock: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    return {
      success: false,
      error: `All providers failed for ${capability}/${action}. Errors: ${errors.join("; ")}`,
      provider: "none",
    };
  }

  /**
   * Test a specific connector
   */
  async test(key: string): Promise<{ ok: boolean; message: string }> {
    const connector = this.connectors.get(key);
    if (!connector) {
      return { ok: false, message: `Connector not found: ${key}` };
    }
    return connector.test();
  }
}

// Singleton instance
export const connectorRegistry = new ConnectorRegistry();

// Helper to create connector definitions
export function defineConnector(def: ConnectorDefinition): ConnectorDefinition {
  return def;
}
