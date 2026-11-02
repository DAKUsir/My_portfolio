export async function GET() {
  return Response.json(
    {
      status: "ok",
      service: "portfolio",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
