import { describe, expect, it, vi } from "vitest";
import {
  createContactHandler,
  MemoryRateLimiter,
  validateContactPayload,
  type ContactMessage,
} from "../src/lib/contact";

const validMessage: ContactMessage = {
  name: "Jane Smith",
  email: "jane@example.com",
  message: "I would like to discuss an internship opportunity.",
};

function makeHandler(options?: {
  configured?: boolean;
  deliver?: (message: ContactMessage) => Promise<void>;
  limit?: number;
}) {
  const deliver = options?.deliver ?? vi.fn(async () => {});
  const handle = createContactHandler({
    limiter: new MemoryRateLimiter(options?.limit ?? 3, 60_000),
    isDeliveryConfigured: () => options?.configured ?? true,
    deliver,
    getClientKey: (request) => request.headers.get("x-test-client") ?? "unit-test-client",
  });
  return { handle, deliver };
}

function makeRequest(
  body: string,
  headers: Record<string, string> = { "content-type": "application/json" },
) {
  return new Request("http://localhost/api/contact", { method: "POST", headers, body });
}

describe("validateContactPayload", () => {
  it("trims valid fields before returning them", () => {
    expect(
      validateContactPayload({
        name: "  Jane Smith  ",
        email: " jane@example.com ",
        message: "  I would like to talk about a role.  ",
      }),
    ).toEqual({
      ok: true,
      value: {
        name: "Jane Smith",
        email: "jane@example.com",
        message: "I would like to talk about a role.",
      },
    });
  });

  it("rejects missing, short, malformed, and overlong fields", () => {
    const result = validateContactPayload({
      name: "A",
      email: "not-an-email",
      message: "tiny",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual({
        name: "Enter a name between 2 and 80 characters.",
        email: "Enter a valid email address.",
        message: "Write a message between 10 and 2,000 characters.",
      });
    }

    const overlong = validateContactPayload({
      name: "N".repeat(81),
      email: `${"a".repeat(245)}@example.com`,
      message: "M".repeat(2001),
    });
    expect(overlong.ok).toBe(false);
  });

  it("rejects control characters in names and email headers", () => {
    const result = validateContactPayload({
      name: "Jane\nBcc: attacker@example.com",
      email: "jane@example.com\r\nBcc: attacker@example.com",
      message: "A sufficiently long message for validation.",
    });
    expect(result.ok).toBe(false);
  });
});

describe("contact request handler", () => {
  it("rejects non-JSON requests", async () => {
    const { handle } = makeHandler();
    const response = await handle(makeRequest(JSON.stringify(validMessage), { "content-type": "text/plain" }));
    expect(response.status).toBe(415);
    expect(await response.json()).toMatchObject({ code: "unsupported_media_type" });
  });

  it("returns a clear error for malformed JSON", async () => {
    const { handle } = makeHandler();
    const response = await handle(makeRequest("{broken"));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "invalid_json" });
  });

  it("rejects oversized content-length and streamed payloads", async () => {
    const { handle } = makeHandler();
    const declaredTooLarge = await handle(
      makeRequest("{}", { "content-type": "application/json", "content-length": "10001" }),
    );
    expect(declaredTooLarge.status).toBe(413);

    const streamedTooLarge = await handle(makeRequest(JSON.stringify({ message: "x".repeat(10_100) })));
    expect(streamedTooLarge.status).toBe(413);
  });

  it("returns field-specific validation errors", async () => {
    const { handle } = makeHandler();
    const response = await handle(
      makeRequest(JSON.stringify({ name: "A", email: "invalid", message: "short" })),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      code: "validation_error",
      errors: { name: expect.any(String), email: expect.any(String), message: expect.any(String) },
    });
  });

  it("fails honestly when email delivery is not configured", async () => {
    const { handle, deliver } = makeHandler({ configured: false });
    const response = await handle(makeRequest(JSON.stringify(validMessage)));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "contact_not_configured" });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("sends a valid message and returns success", async () => {
    const deliver = vi.fn(async () => {});
    const { handle } = makeHandler({ deliver });
    const response = await handle(makeRequest(JSON.stringify(validMessage)));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true });
    expect(deliver).toHaveBeenCalledWith(validMessage);
  });

  it("returns a provider error without exposing provider details", async () => {
    const { handle } = makeHandler({ deliver: async () => { throw new Error("secret provider detail"); } });
    const response = await handle(makeRequest(JSON.stringify(validMessage)));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body).toMatchObject({ code: "delivery_failed" });
    expect(JSON.stringify(body)).not.toContain("secret provider detail");
  });

  it("silently accepts and drops honeypot submissions", async () => {
    const { handle, deliver } = makeHandler();
    const response = await handle(
      makeRequest(JSON.stringify({ ...validMessage, website: "https://spam.example" })),
    );
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions for the same client", async () => {
    const { handle } = makeHandler({ configured: false, limit: 1 });
    const first = await handle(makeRequest(JSON.stringify(validMessage)));
    const second = await handle(makeRequest(JSON.stringify(validMessage)));
    expect(first.status).toBe(503);
    expect(second.status).toBe(429);
    expect(second.headers.get("retry-after")).toBeTruthy();
  });
});
