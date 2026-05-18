import { prisma } from "@/lib/prisma";
import { DEFAULT_ORG_ID } from "@/lib/auth";
import { seedDemo } from "@/data/seedDemo";

/**
 * In local/dev it's common to boot with an empty SQLite DB.
 * To avoid empty screens, ensure the demo org has baseline records.
 *
 * This is intentionally a no-op in production.
 */
export async function ensureDemoData(orgId: string) {
  if (process.env.NODE_ENV === "production") return;
  if (orgId !== DEFAULT_ORG_ID) return;

  const hasAnyJobs = (await prisma.job.count({ where: { orgId } })) > 0;
  const hasAnyCandidates = (await prisma.candidate.count({ where: { organizationId: orgId } })) > 0;
  const hasAnyInterviews = (await prisma.interviewSession.count({ where: { orgId } })) > 0;

  if (hasAnyJobs && hasAnyCandidates && hasAnyInterviews) return;

  await seedDemo(prisma);
}

