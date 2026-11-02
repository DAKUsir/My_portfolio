const baseUrl = (process.env.PORTFOLIO_URL ?? "https://my-portfolio-rvgm.onrender.com").replace(/\/$/, "");

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: path === "/" ? "text/html" : "application/json" },
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  return response;
}

try {
  const pageResponse = await request("/");
  const page = await pageResponse.text();
  if (!page.includes("<html")) {
    throw new Error("Homepage response did not contain an HTML document");
  }
  console.log(`Homepage healthy: HTTP ${pageResponse.status}`);

  const healthResponse = await request("/api/health");
  const health = await healthResponse.json();
  if (health.status !== "ok" || health.service !== "portfolio") {
    throw new Error("Health endpoint returned an unexpected payload");
  }
  console.log(`Health endpoint healthy: HTTP ${healthResponse.status}`);
} catch (error) {
  console.error(`Production smoke check failed: ${error.message}`);
  process.exitCode = 1;
}
