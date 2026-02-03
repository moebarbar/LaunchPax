import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface SMSResult {
  sid: string;
  to: string;
  status: string;
}

async function sendSMS(options: {
  to: string;
  message: string;
  from?: string;
}): Promise<ConnectorResult<SMSResult>> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = options.from || process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken) {
    return {
      success: false,
      error: "Twilio credentials not configured",
      provider: "twilio",
    };
  }

  if (!fromNumber) {
    return {
      success: false,
      error: "Twilio phone number not configured",
      provider: "twilio",
    };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: options.to,
          From: fromNumber,
          Body: options.message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: `Twilio error: ${error.message || response.statusText}`,
        provider: "twilio",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        sid: data.sid,
        to: data.to,
        status: data.status,
      },
      provider: "twilio",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS",
      provider: "twilio",
    };
  }
}

async function sendBusinessAlert(options: {
  to: string;
  businessName: string;
  alertType: "new_lead" | "new_order" | "appointment" | "custom";
  details: string;
}): Promise<ConnectorResult<SMSResult>> {
  const templates: Record<string, string> = {
    new_lead: `🔔 ${options.businessName}: New lead! ${options.details}`,
    new_order: `💰 ${options.businessName}: New order! ${options.details}`,
    appointment: `📅 ${options.businessName}: New appointment! ${options.details}`,
    custom: `${options.businessName}: ${options.details}`,
  };

  return sendSMS({
    to: options.to,
    message: templates[options.alertType] || templates.custom,
  });
}

export const twilioConnector = defineConnector({
  key: "twilio",
  name: "Twilio",
  description: "SMS notifications and alerts for businesses",
  category: "sms",
  capabilities: ["sms", "alerts", "notifications"],
  authType: "apiKey",
  requiredEnvVars: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
  
  isConfigured(): boolean {
    return !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    );
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return { ok: false, message: "Twilio credentials not configured" };
    }
    return { ok: true, message: "Twilio credentials are configured" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "send_sms":
        return sendSMS({
          to: input.to,
          message: input.message,
          from: input.from,
        }) as Promise<ConnectorResult<O>>;

      case "send_business_alert":
        return sendBusinessAlert({
          to: input.to,
          businessName: input.businessName,
          alertType: input.alertType,
          details: input.details,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "twilio",
        };
    }
  },
});
