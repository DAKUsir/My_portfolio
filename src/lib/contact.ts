export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

export type ContactField = keyof ContactMessage;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

type ValidationResult =
  | { ok: true; value: ContactMessage }
  | { ok: false; errors: ContactFieldErrors };

type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, { count: number; expiresAt: number }>();

  constructor(
    private readonly maxAttempts = 3,
    private readonly windowMs = 60_000,
    private readonly maxKeys = 5_000,
  ) {}

  consume(key: string, now = Date.now()): RateLimitResult {
    const current = this.buckets.get(key);
    if (current && current.expiresAt > now) {
      if (current.count >= this.maxAttempts) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((current.expiresAt - now) / 1000)),
        };
      }

      current.count += 1;
      return { allowed: true };
    }

    this.removeExpired(now);
    while (this.buckets.size >= this.maxKeys) {
      const oldestKey = this.buckets.keys().next().value;
      if (oldestKey === undefined) break;
      this.buckets.delete(oldestKey);
    }
    this.buckets.set(key, { count: 1, expiresAt: now + this.windowMs });
    return { allowed: true };
  }

  private removeExpired(now: number) {
    for (const [key, bucket] of this.buckets) {
      if (bucket.expiresAt <= now) this.buckets.delete(key);
    }
  }
}

export function validateContactPayload(payload: unknown): ValidationResult {
  const record = isRecord(payload) ? payload : {};
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const message = typeof record.message === "string" ? record.message.trim() : "";
  const errors: ContactFieldErrors = {};

  if (name.length < 2 || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name)) {
    errors.name = "Enter a name between 2 and 80 characters.";
  }

  if (
    email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email) ||
    /[\r\n]/.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (
    message.length < 10 ||
    message.length > 2000 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)
  ) {
    errors.message = "Write a message between 10 and 2,000 characters.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, message } };
}

type ContactHandlerDependencies = {
  limiter: Pick<MemoryRateLimiter, "consume">;
  isDeliveryConfigured: () => boolean;
  deliver: (message: ContactMessage) => Promise<void>;
  getClientKey?: (request: Request) => string;
};

const maximumBodyBytes = 10_000;

export function createContactHandler({
  limiter,
  isDeliveryConfigured,
  deliver,
  getClientKey = defaultClientKey,
}: ContactHandlerDependencies) {
  return async function handleContact(request: Request): Promise<Response> {
    const rateLimit = limiter.consume(getClientKey(request));
    if (!rateLimit.allowed) {
      return json(
        {
          ok: false,
          code: "rate_limited",
          message: "Too many messages were submitted. Please try again shortly.",
        },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (contentType !== "application/json") {
      return json(
        { ok: false, code: "unsupported_media_type", message: "Send the form as JSON." },
        415,
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > maximumBodyBytes) {
      return json(
        { ok: false, code: "payload_too_large", message: "The submitted message is too large." },
        413,
      );
    }

    const body = await readBody(request, maximumBodyBytes);
    if (!body.ok) {
      if (body.reason === "too_large") {
        return json(
          { ok: false, code: "payload_too_large", message: "The submitted message is too large." },
          413,
        );
      }
      return json({ ok: false, code: "invalid_body", message: "The request body could not be read." }, 400);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(body.value);
    } catch {
      return json({ ok: false, code: "invalid_json", message: "The request body must be valid JSON." }, 400);
    }

    if (isRecord(payload) && typeof payload.website === "string" && payload.website.trim()) {
      return json({ ok: true, message: "Thanks for reaching out." }, 202);
    }

    const validation = validateContactPayload(payload);
    if (!validation.ok) {
      return json(
        {
          ok: false,
          code: "validation_error",
          message: "Please check the highlighted fields.",
          errors: validation.errors,
        },
        400,
      );
    }

    if (!isDeliveryConfigured()) {
      return json(
        {
          ok: false,
          code: "contact_not_configured",
          message: "The contact service is not configured yet. Please use the email link instead.",
        },
        503,
      );
    }

    try {
      await deliver(validation.value);
      return json({ ok: true, message: "Thanks — your message has been sent." }, 200);
    } catch {
      return json(
        {
          ok: false,
          code: "delivery_failed",
          message: "Your message could not be sent right now. Please try the email link instead.",
        },
        502,
      );
    }
  };
}

function defaultClientKey(request: Request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return realIp || forwardedFor || "local";
}

async function readBody(
  request: Request,
  maximumBytes: number,
): Promise<{ ok: true; value: string } | { ok: false; reason: "too_large" | "unreadable" }> {
  if (!request.body) return { ok: true, value: "" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        void reader.cancel().catch(() => {});
        return { ok: false, reason: "too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, value: new TextDecoder().decode(combined) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function json(
  body: Record<string, unknown>,
  status: number,
  headers?: Record<string, string>,
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
