import path from "path";
import { PrismaClient } from "@prisma/client";

/**
 * `.env` is gitignored; new clones often have no DATABASE_URL and Prisma would crash on import.
 * Default to the local SQLite file next to `schema.prisma` (see `.env.example`).
 */
const defaultSqliteUrl = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
const databaseUrl = process.env.DATABASE_URL?.trim() || defaultSqliteUrl;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
