import { describe, expect, it, vi } from "vitest";
import { createResendDelivery, isResendConfigured } from "../src/lib/resend";
import type { ContactMessage } from "../src/lib/contact";

const message: ContactMessage = {
  name: "Jane Smith",
  email: "jane@example.com",
  message: "I would like to discuss an internship opportunity.",
};

describe("Resend delivery adapter", () => {
  it("requires a key, verified sender, and recipient", () => {
    expect(isResendConfigured({ apiKey: "key", from: "verified@example.com", to: "owner@example.com" })).toBe(true);
    expect(isResendConfigured({ apiKey: "", from: "verified@example.com", to: "owner@example.com" })).toBe(false);
  });

  it("sends a plain-text message and sets reply-to to the visitor", async () => {
    let requestUrl = "";
    let requestInit: RequestInit | undefined;
    const fetcher: typeof fetch = async (input, init) => {
      requestUrl = String(input);
      requestInit = init;
      return new Response(null, { status: 200 });
    };
    const deliver = createResendDelivery(
      { apiKey: "test-key", from: "Portfolio <hello@example.com>", to: "owner@example.com" },
      fetcher,
    );

    await deliver(message);

    expect(requestUrl).toBe("https://api.resend.com/emails");
    expect(requestInit?.headers).toMatchObject({ Authorization: "Bearer test-key" });
    expect(JSON.parse(String(requestInit?.body))).toMatchObject({
      to: ["owner@example.com"],
      reply_to: "jane@example.com",
      subject: "Portfolio message from Jane Smith",
      text: expect.stringContaining(message.message),
    });
  });

  it("does not report success when Resend rejects the request", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 403 }));
    const deliver = createResendDelivery(
      { apiKey: "test-key", from: "hello@example.com", to: "owner@example.com" },
      fetcher as unknown as typeof fetch,
    );
    await expect(deliver(message)).rejects.toThrow("HTTP 403");
  });
});
