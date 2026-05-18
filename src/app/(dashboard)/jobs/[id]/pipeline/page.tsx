import { notFound } from "next/navigation";
import Link from "next/link";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PipelineBoard } from "./PipelineBoard";

export default async function PipelinePage({ params }: { params: Promise<{ id: string }> }) {
  const orgId = await getAppOrgId();
  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, orgId },
    include: {
      stages: { orderBy: { order: "asc" }, include: { candidates: true } },
    },
  });

  if (!job) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-chrome-border pb-4">
        <div className="flex items-center gap-4">
          <Link href={`/jobs/${id}`} className="text-chrome-icon hover:text-chrome-active">← Job</Link>
          <h1 className="text-chrome-active">{job.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search"
            className="rounded-2xl border border-chrome-border px-3 py-2 text-sm w-48"
          />
          <span className="text-xs text-chrome-icon">Trial ends in 14 days</span>
          <button type="button" className="rounded-2xl bg-accent text-white px-4 py-2 text-sm font-medium">
            Add Candidate
          </button>
        </div>
      </div>

      <nav className="flex gap-4 border-b border-chrome-border">
        <Link href={`/jobs/${id}`} className="pb-2 text-sm text-chrome-icon hover:text-chrome-active">Job overview</Link>
        <Link href={`/jobs/${id}/pipeline`} className="pb-2 text-sm font-medium text-chrome-active border-b-2 border-chrome-active">Applicant pipeline</Link>
        <Link href={`/jobs/${id}/settings`} className="pb-2 text-sm text-chrome-icon hover:text-chrome-active">Team</Link>
      </nav>

      <PipelineBoard job={job} />
    </div>
  );
}
