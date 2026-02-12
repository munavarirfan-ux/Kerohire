import { NextResponse } from "next/server";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { CandidateReportPDF } from "@/lib/pdf/candidateReport";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const orgId = await getAppOrgId();

  const { id } = await params;
  const candidate = await prisma.candidate.findFirst({
    where: { id, organizationId: orgId },
    include: {
      role: true,
      assessmentResults: { include: { trait: true } },
      interviewSessions: { include: { summary: true, scorecard: true } },
    },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fit = await getRoleFitForCandidate(candidate.id);
  const lastSummary = candidate.interviewSessions.find((s) => s.summary)?.summary;
  const lastScorecard = candidate.interviewSessions.find((s) => s.scorecard)?.scorecard;

  const data = {
    name: candidate.name,
    roleName: candidate.role?.name ?? "—",
    roleFitScore: fit.roleFitScore,
    strengths: fit.alignedTraits,
    risks: fit.risks.map(
      (r) => `${r.traitName ?? r.traitId}: ${r.reason} (${r.value} vs ${r.threshold})`
    ),
    traitRows: candidate.assessmentResults.map((r) => ({
      trait: r.trait.name,
      percentile: r.percentile,
    })),
    confidence: fit.confidence,
    interviewSummary: lastSummary?.summary,
    scorecardRecommendation: lastScorecard?.overallRecommendation,
  };
  const buffer = await renderToBuffer(
    React.createElement(CandidateReportPDF, { data }) as React.ReactElement
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="candidate-${candidate.name.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
