import { NextResponse } from "next/server";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeTranscript } from "@/lib/ai/providers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const orgId = await getAppOrgId();

  const { id } = await params;
  const sessionRecord = await prisma.interviewSession.findFirst({
    where: { id, orgId },
    include: { transcript: true, candidate: true },
  });
  if (!sessionRecord?.transcript) {
    return NextResponse.json({ error: "No transcript" }, { status: 400 });
  }

  const result = await summarizeTranscript(
    sessionRecord.transcript.text,
    sessionRecord.candidate.roleId ?? undefined
  );

  await prisma.interviewSummary.upsert({
    where: { sessionId: id },
    create: {
      sessionId: id,
      roleId: sessionRecord.candidate.roleId,
      summary: result.summary,
      evidence: JSON.stringify(result.evidence ?? []),
      mappedTraits: JSON.stringify(result.mappedTraits ?? {}),
      risks: JSON.stringify(result.risks ?? []),
    },
    update: {
      summary: result.summary,
      evidence: JSON.stringify(result.evidence ?? []),
      mappedTraits: JSON.stringify(result.mappedTraits ?? {}),
      risks: JSON.stringify(result.risks ?? []),
    },
  });

  const rubric =
    result.mappedTraits && typeof result.mappedTraits === "object"
      ? Object.fromEntries(Object.keys(result.mappedTraits).map((k) => [k, 4]))
      : {};
  await prisma.interviewScorecard.upsert({
    where: { sessionId: id },
    create: {
      sessionId: id,
      overallRecommendation: "Recommendation based on interview (mock).",
      rubric: JSON.stringify(rubric),
    },
    update: {},
  });

  await prisma.interviewSession.update({
    where: { id },
    data: { status: "SUMMARIZED" },
  });

  return NextResponse.json({ ok: true });
}
