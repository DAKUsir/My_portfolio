import { expect, test } from "@playwright/test";

test("the health endpoint reports the app is ready", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "portfolio" });
});

test("the contact form enforces browser validation before sending", async ({ page }) => {
  await page.goto("/#contact");

  const name = page.getByLabel("Your name");
  const email = page.getByLabel("Email address");
  const message = page.getByLabel("What would you like to talk about?");
  await name.fill("A");
  await email.fill("not-an-email");
  await message.fill("short");

  await expect(name).toHaveJSProperty("validity.valid", false);
  await expect(email).toHaveJSProperty("validity.typeMismatch", true);
  await expect(message).toHaveJSProperty("validity.tooShort", true);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toBeEmpty();
});

test("the API returns field errors for invalid contact data", async ({ request }) => {
  const response = await request.post("/api/contact", {
    headers: { "x-real-ip": "203.0.113.20" },
    data: { name: "A", email: "not-an-email", message: "short" },
  });

  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({
    code: "validation_error",
    errors: { name: expect.any(String), email: expect.any(String), message: expect.any(String) },
  });
});

test("the form explains delivery errors and offers an email fallback", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        code: "contact_not_configured",
        message: "The contact service is not configured yet. Please use the email link instead.",
      }),
    }),
  );
  await page.goto("/#contact");
  await page.getByLabel("Your name").fill("Jane Smith");
  await page.getByLabel("Email address").fill("jane@example.com");
  await page.getByLabel("What would you like to talk about?").fill(
    "I would like to discuss an internship opportunity.",
  );
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.locator(".contact-form-status")).toContainText("contact service is not configured");
  await expect(page.getByRole("link", { name: "Open your email app instead" })).toHaveAttribute(
    "href",
    /^mailto:chauhan\.aditya\.tech@gmail\.com\?/,
  );
});

test("the contact form stays within a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#contact");
  const form = page.locator(".contact-form");
  const box = await form.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
});
