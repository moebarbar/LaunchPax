import { defineConnector } from "../registry";
import type { ConnectorTask, ConnectorResult } from "@shared/schema";

interface EmailResult {
  messageId: string;
  accepted: string[];
}

async function sendEmail(options: {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}): Promise<ConnectorResult<EmailResult>> {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "SendGrid API key not configured",
      provider: "sendgrid",
    };
  }

  const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: toAddresses.map(email => ({ email })) }],
        from: { email: options.from },
        reply_to: options.replyTo ? { email: options.replyTo } : undefined,
        subject: options.subject,
        content: [
          options.text ? { type: "text/plain", value: options.text } : null,
          options.html ? { type: "text/html", value: options.html } : null,
        ].filter(Boolean),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `SendGrid error: ${error.errors?.[0]?.message || response.statusText}`,
        provider: "sendgrid",
      };
    }

    const messageId = response.headers.get("x-message-id") || `msg_${Date.now()}`;
    return {
      success: true,
      data: {
        messageId,
        accepted: toAddresses,
      },
      provider: "sendgrid",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
      provider: "sendgrid",
    };
  }
}

async function sendContactFormEmail(options: {
  to: string;
  fromName: string;
  fromEmail: string;
  businessName: string;
  message: string;
  phone?: string;
}): Promise<ConnectorResult<EmailResult>> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <p style="color: #666;">You received a new message from your website:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>From:</strong> ${options.fromName}</p>
        <p><strong>Email:</strong> ${options.fromEmail}</p>
        ${options.phone ? `<p><strong>Phone:</strong> ${options.phone}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${options.message}</p>
      </div>
      <p style="color: #999; font-size: 12px;">This email was sent from the contact form on ${options.businessName}'s website.</p>
    </div>
  `;

  return sendEmail({
    to: options.to,
    from: process.env.SENDGRID_FROM_EMAIL || options.to,
    replyTo: options.fromEmail,
    subject: `New Contact Form Message from ${options.fromName}`,
    html,
    text: `New message from ${options.fromName} (${options.fromEmail}):\n\n${options.message}`,
  });
}

export const sendgridConnector = defineConnector({
  key: "sendgrid",
  name: "SendGrid",
  description: "Email delivery for contact forms and notifications",
  category: "email",
  capabilities: ["email", "contact_form", "notifications"],
  authType: "apiKey",
  requiredEnvVars: ["SENDGRID_API_KEY"],
  optionalEnvVars: ["SENDGRID_FROM_EMAIL"],
  
  isConfigured(): boolean {
    return !!process.env.SENDGRID_API_KEY;
  },

  async test(): Promise<{ ok: boolean; message: string }> {
    if (!process.env.SENDGRID_API_KEY) {
      return { ok: false, message: "SendGrid API key not configured" };
    }
    return { ok: true, message: "SendGrid API key is configured" };
  },

  async execute<I, O>(task: ConnectorTask<I>): Promise<ConnectorResult<O>> {
    const input = task.input as any;

    switch (task.action) {
      case "send_email":
        return sendEmail({
          to: input.to,
          from: input.from,
          subject: input.subject,
          text: input.text,
          html: input.html,
          replyTo: input.replyTo,
        }) as Promise<ConnectorResult<O>>;

      case "send_contact_form":
        return sendContactFormEmail({
          to: input.to,
          fromName: input.fromName,
          fromEmail: input.fromEmail,
          businessName: input.businessName,
          message: input.message,
          phone: input.phone,
        }) as Promise<ConnectorResult<O>>;

      default:
        return {
          success: false,
          error: `Unknown action: ${task.action}`,
          provider: "sendgrid",
        };
    }
  },
});
