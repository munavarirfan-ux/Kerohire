import { NextResponse } from "next/server";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transcribeAudio } from "@/lib/ai/providers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const orgId = await getAppOrgId();

  const { id } = await params;
  const sessionRecord = await prisma.interviewSession.findFirst({
    where: { id, orgId },
  });
  if (!sessionRecord) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await transcribeAudio(Buffer.from("mock"));
  await prisma.interviewTranscript.upsert({
    where: { sessionId: id },
    create: {
      sessionId: id,
      text: result.transcript,
      segments: JSON.stringify(result.segments),
    },
    update: { text: result.transcript, segments: JSON.stringify(result.segments) },
  });
  await prisma.interviewSession.update({
    where: { id },
    data: { status: "TRANSCRIBED" },
  });

  return NextResponse.json({ ok: true });
}
