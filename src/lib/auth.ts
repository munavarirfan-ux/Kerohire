import { getServerSession } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** NextAuth requires a secret to sign JWTs / cookies. Local dev works without .env if unset. */
const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "production"
    ? "missing-NEXTAUTH_SECRET-set-in-environment"
    : "dev-only-unsafe-nextauth-secret-set-NEXTAUTH_SECRET-in-env");

/** Default org when not logged in (seed org). */
export const DEFAULT_ORG_ID = "seed-org-1";

/** Use in pages/APIs: orgId when authenticated, or default org when auth is disabled. */
export async function getAppOrgId(): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.organizationId) return session.user.organizationId;
  } catch {
    // Auth/session can fail in production (missing env, DB, etc.); fall back to default org
  }
  return DEFAULT_ORG_ID;
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.organizationId = (user as { organizationId?: string }).organizationId;
        token.organizationName = (user as { organizationName?: string }).organizationName;
      }
      // Ensure role/org survive OAuth / adapter paths and stale tokens (client session needs `user.role`).
      const uid = (token.id as string | undefined) ?? (token.sub as string | undefined);
      if (uid && (!token.role || !(token.organizationId as string | undefined))) {
        const row = await prisma.user.findUnique({
          where: { id: uid },
          select: { role: true, organizationId: true, organization: { select: { name: true } } },
        });
        if (row) {
          token.role = row.role;
          token.organizationId = row.organizationId;
          token.organizationName = row.organization.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { organizationId?: string }).organizationId = token.organizationId as string;
        (session.user as { organizationName?: string }).organizationName = token.organizationName as string;
      }
      return session;
    },
  },
};
