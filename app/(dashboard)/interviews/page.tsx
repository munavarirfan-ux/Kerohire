import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewFilters } from "./InterviewFilters";
import { InterviewList } from "./InterviewList";

export default async function InterviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  const orgId = session.user.organizationId;
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
