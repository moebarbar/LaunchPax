/**
 * Connector Registration
 * 
 * This file registers all available connectors with the registry.
 * Add new connectors here to make them available to the platform.
 */

import { connectorRegistry } from "./registry";

// AI Connectors
import { openaiConnector } from "./ai/openai";
import { claudeConnector } from "./ai/claude";
import { nanoBananaConnector } from "./ai/nanobanana";
import { mockAIConnector } from "./ai/mock";

// Domain Connectors
import { mockDomainConnector } from "./domains/mock";

// Stock Photo Connectors
import { pexelsConnector } from "./stockphotos/pexels";
import { stockPhotosMockConnector } from "./stockphotos/mock";

// Register all connectors
export function initializeConnectors(): void {
  console.log("[Connectors] Initializing connector registry...");
  
  // AI connectors (LaunchPax Engine)
  connectorRegistry.register(openaiConnector);
  connectorRegistry.register(claudeConnector);
  connectorRegistry.register(nanoBananaConnector);
  connectorRegistry.register(mockAIConnector);
  
  // Domain connectors
  connectorRegistry.register(mockDomainConnector);
  
  // Stock photo connectors
  connectorRegistry.register(pexelsConnector);
  connectorRegistry.register(stockPhotosMockConnector);
  
  // Log status
  const all = connectorRegistry.getAll();
  const configured = all.filter(c => c.isConfigured());
  console.log(`[Connectors] Registered ${all.length} connectors (${configured.length} configured)`);
}

// Re-export registry
export { connectorRegistry } from "./registry";
