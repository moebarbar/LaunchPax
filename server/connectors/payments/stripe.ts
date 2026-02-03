import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface StripeCheckoutSession {
  id: string;
  url: string;
  paymentStatus: string;
}

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}

interface StripeProduct {
  id: string;
  name: string;
  description?: string;
}

async function createCheckoutSession(options: {
  lineItems: { priceId: string; quantity: number }[];
  successUrl: string;
  cancelUrl: string;
  mode?: "payment" | "subscription";
}): Promise<ConnectorResult<StripeCheckoutSession>> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Stripe API key not configured",
      provider: "stripe",
    };
  }

  try {
    const body = new URLSearchParams({
      mode: options.mode || "payment",
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
    });

    options.lineItems.forEach((item, idx) => {
      body.append(`line_items[${idx}][price]`, item.priceId);
      body.append(`line_items[${idx}][quantity]`, item.quantity.toString());
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: `Stripe error: ${error.error?.message || response.statusText}`,
        provider: "stripe",
      };
    }

    const session = await response.json();
    return {
      success: true,
      data: {
        id: session.id,
        url: session.url,
        paymentStatus: session.payment_status,
      },
      provider: "stripe",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
      provider: "stripe",
    };
  }
}

async function createPaymentIntent(options: {
  amount: number;
  currency: string;
  description?: string;
}): Promise<ConnectorResult<StripePaymentIntent>> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Stripe API key not configured",
      provider: "stripe",
    };
  }

  try {
    const body = new URLSearchParams({
      amount: options.amount.toString(),
      currency: options.currency,
    });
    if (options.description) {
      body.append("description", options.description);
    }

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: `Stripe error: ${error.error?.message || response.statusText}`,
        provider: "stripe",
      };
    }

    const intent = await response.json();
    return {
      success: true,
      data: {
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status,
        clientSecret: intent.client_secret,
      },
      provider: "stripe",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment intent",
      provider: "stripe",
    };
  }
}

async function listProducts(): Promise<ConnectorResult<StripeProduct[]>> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "Stripe API key not configured",
      provider: "stripe",
    };
  }

  try {
    const response = await fetch("https://api.stripe.com/v1/products?active=true&limit=100", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: `Stripe error: ${error.error?.message || response.statusText}`,
        provider: "stripe",
      };
    }

    const data = await response.json();
    const products: StripeProduct[] = data.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
    }));

    return {
      success: true,
      data: products,
      provider: "stripe",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list products",
      provider: "stripe",
    };
  }
}

export const stripeConnector = defineConnector({
  key: "stripe",
  name: "Stripe",
  description: "Payment processing for e-commerce websites",
  category: "payments",
  capabilities: ["payments", "checkout", "subscriptions"],
  authType: "apiKey",
  requiredEnvVars: ["STRIPE_SECRET_KEY"],
  
  isConfigured(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    const result = await listProducts();
    if (result.success) {
      return { ok: true, message: "Stripe API connected successfully" };
    }
    return { ok: false, message: result.error || "Failed to connect to Stripe" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "create_checkout":
        return createCheckoutSession({
          lineItems: input.lineItems,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
          mode: input.mode,
        }) as Promise<ConnectorResult<O>>;

      case "create_payment_intent":
        return createPaymentIntent({
          amount: input.amount,
          currency: input.currency,
          description: input.description,
        }) as Promise<ConnectorResult<O>>;

      case "list_products":
        return listProducts() as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "stripe",
        };
    }
  },
});
