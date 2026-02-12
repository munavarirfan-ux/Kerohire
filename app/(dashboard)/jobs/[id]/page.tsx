import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, orgId: session.user.organizationId },
    include: {
      stages: { orderBy: { order: "asc" } },
      _count: { select: { candidates: true } },
      postContent: true,
    },
  });

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/jobs" className="text-chrome-icon hover:text-chrome-active transition-subtle">← Jobs</Link>
        <div className="flex-1">
          <h1 className="text-chrome-active">{job.title}</h1>
          <p className="text-sm text-slate-500">{job.department} · {job.location} · {job.status}</p>
        </div>
        <Link href={`/jobs/${id}/pipeline`}>
          <Button className="bg-accent text-white">Pipeline</Button>
        </Link>
        <Link href={`/jobs/${id}/settings`}>
          <Button variant="outline" className="border-chrome-active text-chrome-active">Settings</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-chrome-border">
          <CardHeader><CardTitle className="text-forest text-sm">Applicants</CardTitle></CardHeader>
          <CardContent><p className="text-big-number text-forest">{job._count.candidates}</p></CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader><CardTitle className="text-forest text-sm">Stages</CardTitle></CardHeader>
          <CardContent><p className="text-big-number text-forest">{job.stages.length}</p></CardContent>
        </Card>
        <Card className="border-chrome-border">
          <CardHeader><CardTitle className="text-forest text-sm">Status</CardTitle></CardHeader>
          <CardContent><p className="text-lg font-medium text-forest">{job.status}</p></CardContent>
        </Card>
      </div>

      <Card className="border-chrome-border">
        <CardHeader><CardTitle className="text-chrome-active">Stages</CardTitle></CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
            {job.stages.map((s) => (
              <li key={s.id}>{s.name}{s.slaTargetHours ? ` (SLA: ${s.slaTargetHours}h)` : ""}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
