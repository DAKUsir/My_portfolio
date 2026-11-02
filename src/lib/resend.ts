import type { ContactMessage } from "./contact";

export type ResendConfig = {
  apiKey: string;
  from: string;
  to: string;
};

export function isResendConfigured(config: ResendConfig) {
  return Boolean(config.apiKey.trim() && config.from.trim() && config.to.trim());
}

export function createResendDelivery(config: ResendConfig, fetcher: typeof fetch = fetch) {
  return async function deliver(message: ContactMessage) {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: message.email,
        subject: `Portfolio message from ${message.name}`,
        text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`Email provider returned HTTP ${response.status}.`);
    }
  };
}
