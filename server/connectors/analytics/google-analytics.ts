import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface AnalyticsConfig {
  measurementId: string;
  scriptTag: string;
  initScript: string;
}

interface TrackingEvent {
  eventName: string;
  params?: Record<string, string | number | boolean>;
}

function generateAnalyticsScript(measurementId: string): AnalyticsConfig {
  const scriptTag = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    </script>
  `.trim();

  const initScript = `
    // Google Analytics initialization
    (function() {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    })();
  `.trim();

  return {
    measurementId,
    scriptTag,
    initScript,
  };
}

function generateEventTrackingCode(event: TrackingEvent): string {
  const paramsStr = event.params 
    ? JSON.stringify(event.params) 
    : "{}";
  
  return `gtag('event', '${event.eventName}', ${paramsStr});`;
}

function generateConversionTrackingCode(options: {
  conversionLabel: string;
  value?: number;
  currency?: string;
}): string {
  const params: Record<string, string | number> = {
    send_to: options.conversionLabel,
  };
  
  if (options.value !== undefined) {
    params.value = options.value;
    params.currency = options.currency || "USD";
  }
  
  return `gtag('event', 'conversion', ${JSON.stringify(params)});`;
}

function getEcommerceTrackingCode(options: {
  action: "view_item" | "add_to_cart" | "purchase" | "begin_checkout";
  items: Array<{
    id: string;
    name: string;
    price?: number;
    quantity?: number;
    category?: string;
  }>;
  transactionId?: string;
  value?: number;
  currency?: string;
}): string {
  const ecommerceData: Record<string, any> = {
    items: options.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      item_category: item.category,
    })),
  };

  if (options.transactionId) {
    ecommerceData.transaction_id = options.transactionId;
  }
  if (options.value !== undefined) {
    ecommerceData.value = options.value;
    ecommerceData.currency = options.currency || "USD";
  }

  return `gtag('event', '${options.action}', ${JSON.stringify(ecommerceData)});`;
}

export const googleAnalyticsConnector = defineConnector({
  key: "google-analytics",
  name: "Google Analytics",
  description: "Website visitor tracking and analytics",
  category: "analytics",
  capabilities: ["analytics"],
  authType: "apiKey",
  requiredEnvVars: ["GOOGLE_ANALYTICS_MEASUREMENT_ID"],
  
  isConfigured(): boolean {
    return !!process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;
    if (!measurementId) {
      return { ok: false, message: "Google Analytics Measurement ID not configured" };
    }
    if (!measurementId.startsWith("G-")) {
      return { ok: false, message: "Invalid Measurement ID format (should start with G-)" };
    }
    return { ok: true, message: "Google Analytics is configured" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;
    const input = task.input as any;

    switch (task.action) {
      case "get_script":
        if (!measurementId) {
          return {
            success: false,
            error: "Google Analytics Measurement ID not configured",
            provider: "google-analytics",
          };
        }
        return Promise.resolve({
          success: true,
          data: generateAnalyticsScript(measurementId),
          provider: "google-analytics",
        }) as Promise<ConnectorResult<O>>;

      case "track_event":
        return Promise.resolve({
          success: true,
          data: generateEventTrackingCode({
            eventName: input.eventName,
            params: input.params,
          }),
          provider: "google-analytics",
        }) as Promise<ConnectorResult<O>>;

      case "track_conversion":
        return Promise.resolve({
          success: true,
          data: generateConversionTrackingCode({
            conversionLabel: input.conversionLabel,
            value: input.value,
            currency: input.currency,
          }),
          provider: "google-analytics",
        }) as Promise<ConnectorResult<O>>;

      case "track_ecommerce":
        return Promise.resolve({
          success: true,
          data: getEcommerceTrackingCode({
            action: input.action,
            items: input.items,
            transactionId: input.transactionId,
            value: input.value,
            currency: input.currency,
          }),
          provider: "google-analytics",
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "google-analytics",
        };
    }
  },
});
