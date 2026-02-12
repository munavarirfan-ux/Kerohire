import { notFound } from "next/navigation";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InterviewDetailClient } from "./InterviewDetailClient";

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orgId = await getAppOrgId();
  const { id } = await params;
  const interview = await prisma.interviewSession.findFirst({
    where: { id, orgId },
    include: {
      candidate: true,
      transcript: true,
      summary: true,
      scorecard: true,
      translationRecords: true,
    },
  });

  if (!interview) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>{interview.title}</h1>
        <Link href="/interviews">
          <Button variant="outline">Back to interviews</Button>
        </Link>
      </div>
      <p className="text-sm text-slate-600">
        Candidate: {interview.candidate.name} · Status: {interview.status}
      </p>

      <InterviewDetailClient interview={interview} />
    </div>
  );
}
