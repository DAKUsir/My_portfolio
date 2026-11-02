import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/health/route";

describe("GET /api/health", () => {
  it("returns a non-cacheable healthy service response", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ status: "ok", service: "portfolio" });
  });
});
