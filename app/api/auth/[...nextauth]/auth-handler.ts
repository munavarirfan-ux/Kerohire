import NextAuth from "next-auth";

let handlerPromise: ReturnType<typeof NextAuth> | null = null;

async function getHandler() {
  if (!handlerPromise) {
    const { authOptions } = await import("@/lib/auth");
    handlerPromise = NextAuth(authOptions);
  }
  return handlerPromise;
}

export async function GET(req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const handler = await getHandler();
  return handler(req, ctx as any);
}

export async function POST(req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const handler = await getHandler();
  return handler(req, ctx as any);
}
