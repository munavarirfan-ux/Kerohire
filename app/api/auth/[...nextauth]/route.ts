import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let handler: ReturnType<typeof NextAuth> | null = null;

function getHandler() {
  if (!handler) {
    const { authOptions } = require("@/lib/auth") as { authOptions: NextAuthOptions };
    handler = NextAuth(authOptions);
  }
  return handler;
}

export const GET = (req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) =>
  getHandler()(req, ctx as any);
export const POST = (req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) =>
  getHandler()(req, ctx as any);
