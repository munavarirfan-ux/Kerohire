import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  const orgId = session.user.organizationId;

  const [rolesCount, candidatesCount, recentInterviews] = await Promise.all([
    prisma.roleProfile.count({ where: { organizationId: orgId } }),
    prisma.candidate.count({ where: { organizationId: orgId } }),
    prisma.interviewSession.findMany({
      where: { orgId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { candidate: true },
    }),
  ]);

  const inReview = await prisma.candidate.count({
    where: { organizationId: orgId, status: "in_review" },
  });

  const jobsCount = await prisma.job.count({ where: { orgId } });

  return (
    <div className="space-y-6">
      <h1 className="text-chrome-active">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-big-number text-forest">{jobsCount}</p>
          </CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-big-number text-forest">{inReview}</p>
          </CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-big-number text-forest">{candidatesCount}</p>
          </CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Recent interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-big-number text-forest">{recentInterviews.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-chrome-border">
        <CardHeader>
          <CardTitle className="text-chrome-active">Recent interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInterviews.length === 0 ? (
            <p className="text-sm text-slate-500">No interviews yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentInterviews.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.candidate.name} — {s.title}</span>
                  <Link href={`/applicants/${s.candidateId}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
