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
import { googleStudioConnector } from "./ai/nanobanana";
import { launchpaxConnector } from "./ai/launchpax";
import { mockAIConnector } from "./ai/mock";
import { dalleConnector } from "./ai/dalle";
import { stabilityConnector } from "./ai/stability";
import { leonardoConnector } from "./ai/leonardo";

// Domain Connectors
import { mockDomainConnector } from "./domains/mock";
import { namecheapConnector } from "./domains/namecheap";

// Stock Photo Connectors
import { pexelsConnector } from "./stockphotos/pexels";
import { stockPhotosMockConnector } from "./stockphotos/mock";
import { unsplashConnector } from "./stockphotos/unsplash";

// Payment Connectors
import { stripeConnector } from "./payments/stripe";

// Email Connectors
import { sendgridConnector } from "./email/sendgrid";

// SMS Connectors
import { twilioConnector } from "./sms/twilio";

// Maps Connectors
import { googleMapsConnector } from "./maps/google-maps";

// Animation Connectors
import { lottieConnector } from "./animations/lottie";

// CDN & Image Optimization Connectors
import { cloudinaryConnector } from "./cdn/cloudinary";
import { cloudflareConnector } from "./cdn/cloudflare";

// Analytics Connectors
import { googleAnalyticsConnector } from "./analytics/google-analytics";

// Register all connectors
export function initializeConnectors(): void {
  console.log("[Connectors] Initializing connector registry...");
  
  // AI connectors (LaunchPax Engine - Multi-Model Orchestration)
  connectorRegistry.register(openaiConnector);
  connectorRegistry.register(claudeConnector);
  connectorRegistry.register(googleStudioConnector);
  connectorRegistry.register(launchpaxConnector);
  connectorRegistry.register(mockAIConnector);
  connectorRegistry.register(dalleConnector);
  connectorRegistry.register(stabilityConnector);
  connectorRegistry.register(leonardoConnector);
  
  // Domain connectors
  connectorRegistry.register(mockDomainConnector);
  connectorRegistry.register(namecheapConnector);
  
  // Stock photo connectors
  connectorRegistry.register(pexelsConnector);
  connectorRegistry.register(stockPhotosMockConnector);
  connectorRegistry.register(unsplashConnector);
  
  // Payment connectors
  connectorRegistry.register(stripeConnector);
  
  // Email connectors
  connectorRegistry.register(sendgridConnector);
  
  // SMS connectors
  connectorRegistry.register(twilioConnector);
  
  // Maps connectors
  connectorRegistry.register(googleMapsConnector);
  
  // Animation connectors
  connectorRegistry.register(lottieConnector);
  
  // CDN & Image optimization connectors
  connectorRegistry.register(cloudinaryConnector);
  connectorRegistry.register(cloudflareConnector);
  
  // Analytics connectors
  connectorRegistry.register(googleAnalyticsConnector);
  
  // Log status
  const all = connectorRegistry.getAll();
  const configured = all.filter(c => c.isConfigured());
  console.log(`[Connectors] Registered ${all.length} connectors (${configured.length} configured)`);
  
  // Log by category
  const categories = new Map<string, number>();
  all.forEach(c => {
    const cat = c.category || "other";
    categories.set(cat, (categories.get(cat) || 0) + 1);
  });
  console.log(`[Connectors] Categories: ${[...categories.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
}

// Re-export registry
export { connectorRegistry } from "./registry";
