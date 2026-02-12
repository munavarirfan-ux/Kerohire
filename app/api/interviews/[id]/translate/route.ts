import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { translate } from "@/lib/ai/providers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sessionRecord = await prisma.interviewSession.findFirst({
    where: { id, orgId: session.user.organizationId },
    include: { summary: true },
  });
  if (!sessionRecord?.summary) {
    return NextResponse.json({ error: "No summary" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const fromLang = (body.fromLang as string) ?? "en";
  const toLang = (body.toLang as string) ?? "de";

  const result = await translate(
    sessionRecord.summary.summary,
    fromLang,
    toLang
  );

  await prisma.translationRecord.create({
    data: {
      entityType: "InterviewSummary",
      entityId: sessionRecord.summary.id,
      fromLang,
      toLang,
      translatedText: result.translatedText,
      summaryId: sessionRecord.summary.id,
      sessionId: id,
    },
  });

  return NextResponse.json({ ok: true });
}
