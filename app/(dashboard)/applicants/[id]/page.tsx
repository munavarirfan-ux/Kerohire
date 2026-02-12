import { notFound } from "next/navigation";
import Link from "next/link";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseJson } from "@/lib/json";
import { ApplicantTabs } from "./ApplicantTabs";

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const orgId = await getAppOrgId();
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id, organizationId: orgId },
    include: {
      job: true,
      currentStage: true,
      role: true,
      assessmentResults: { include: { trait: true } },
      notes: { include: { author: true } },
      interviewSessions: {
        include: { transcript: true, summary: true, scorecard: true, translationRecords: true },
      },
      contentSubmissions: { include: { aiSignals: true } },
    },
  });

  if (!candidate) notFound();
  const fit = await getRoleFitForCandidate(candidate.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/applicants" className="text-chrome-icon hover:text-chrome-active transition-subtle">
          ← Back
        </Link>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-chrome flex items-center justify-center text-chrome-active font-semibold">
              {candidate.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-chrome-active">{candidate.name}</h1>
              <p className="text-sm text-slate-500">
                ID: {candidate.id.slice(0, 8)} · {candidate.job?.title ?? "—"} · {candidate.currentStage?.name ?? "—"}
              </p>
              <p className="text-xs text-slate-400">{candidate.email} {candidate.phone && `· ${candidate.phone}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-3 py-1 rounded-lg bg-parchment border border-chrome-border">
              <p className="text-xs text-slate-500">ATS</p>
              <p className="text-lg font-semibold text-forest">{candidate.atsScore != null ? `${candidate.atsScore}%` : "—"}</p>
            </div>
            <div className="text-center px-3 py-1 rounded-lg bg-sage/30 border border-chrome-border">
              <p className="text-xs text-slate-500">Fit</p>
              <p className="text-lg font-semibold text-forest">{fit.roleFitScore}%</p>
            </div>
            <div className="text-center px-3 py-1 rounded-lg bg-parchment border border-chrome-border">
              <p className="text-xs text-slate-500">Skill</p>
              <p className="text-lg font-semibold text-forest">{candidate.skillScore != null ? `${candidate.skillScore}%` : "—"}</p>
            </div>
            <Button variant="outline" size="sm" className="border-chrome-active text-chrome-active">
              Move to stage
            </Button>
          </div>
        </div>
      </div>

      <ApplicantTabs candidate={candidate} fit={fit} />
    </div>
  );
}
