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
   * Falls back to mock connector if the primary one fails
   */
  async execute<I, O>(
    capability: ConnectorCapability,
    action: string,
    input: I,
    options?: { preferredConnector?: string }
  ): Promise<ConnectorResult<O>> {
    const providers = this.getByCapability(capability);
    const mockConnector = providers.find(p => p.key.endsWith("_mock"));
    
    // Helper to try executing with fallback
    const tryExecute = async (connector: ConnectorDefinition): Promise<ConnectorResult<O>> => {
      const task: ConnectorTask<I> = { capability, action, input };
      return await connector.execute<I, O>(task);
    };
    
    // Try preferred connector first if specified
    if (options?.preferredConnector) {
      const preferred = this.connectors.get(options.preferredConnector);
      if (preferred?.isConfigured() && preferred.capabilities.includes(capability)) {
        try {
          const result = await tryExecute(preferred);
          if (result.success) return result;
          
          // If preferred failed, try fallback to mock
          if (mockConnector && mockConnector.isConfigured()) {
            console.log(`[ConnectorRegistry] ${preferred.key} failed, falling back to mock: ${result.error}`);
            return await tryExecute(mockConnector);
          }
          return result;
        } catch (error) {
          // On exception, try mock fallback
          if (mockConnector && mockConnector.isConfigured()) {
            console.log(`[ConnectorRegistry] ${preferred.key} threw error, falling back to mock`);
            return await tryExecute(mockConnector);
          }
          throw error;
        }
      }
    }

    // Get best available connector for this capability
    const connector = this.getBestForCapability(capability);
    
    if (!connector) {
      return {
        success: false,
        error: `No connector available for capability: ${capability}`,
        provider: "none",
      };
    }

    if (!connector.isConfigured()) {
      // If main connector is not configured, try mock fallback
      if (mockConnector && mockConnector.isConfigured() && connector.key !== mockConnector.key) {
        console.log(`[ConnectorRegistry] ${connector.key} is not configured, falling back to mock`);
        return await tryExecute(mockConnector);
      }
      return {
        success: false,
        error: `Connector ${connector.key} is not configured`,
        provider: connector.key,
      };
    }

    try {
      const result = await tryExecute(connector);
      
      // If main connector failed and we have a mock, try the mock
      if (!result.success && mockConnector && mockConnector.isConfigured() && connector.key !== mockConnector.key) {
        console.log(`[ConnectorRegistry] ${connector.key} failed, falling back to mock: ${result.error}`);
        return await tryExecute(mockConnector);
      }
      
      return result;
    } catch (error) {
      // On exception, try mock fallback
      if (mockConnector && mockConnector.isConfigured() && connector.key !== mockConnector.key) {
        console.log(`[ConnectorRegistry] ${connector.key} threw error, falling back to mock`);
        return await tryExecute(mockConnector);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: connector.key,
      };
    }
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
