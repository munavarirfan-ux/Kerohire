import { Suspense } from "react";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewFilters } from "./InterviewFilters";
import { InterviewList } from "./InterviewList";

export default async function InterviewsPage() {
  const orgId = await getAppOrgId();
  const sessions = await prisma.interviewSession.findMany({
    where: { orgId },
    include: { candidate: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1>Interviews</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
            <InterviewFilters />
            <InterviewList sessions={sessions} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
