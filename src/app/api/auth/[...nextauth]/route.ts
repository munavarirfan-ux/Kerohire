export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ nextauth: string[] }> }
) {
  const { GET } = await import("./auth-handler");
  return GET(req, ctx);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ nextauth: string[] }> }
) {
  const { POST } = await import("./auth-handler");
  return POST(req, ctx);
}
