import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function JobSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, orgId: session.user.organizationId },
    include: { stages: { orderBy: { order: "asc" } }, screeningQuestions: true, interviewKits: true },
  });

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/jobs/${id}`} className="text-chrome-icon hover:text-chrome-active">← Job</Link>
        <h1 className="text-chrome-active">Settings — {job.title}</h1>
      </div>

      <Card className="border-chrome-border">
        <CardHeader><CardTitle className="text-chrome-active">Stages</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600">
            {job.stages.map((s, i) => (
              <li key={s.id}>{i + 1}. {s.name} {s.slaTargetHours && `(SLA: ${s.slaTargetHours}h)`}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-chrome-border">
        <CardHeader><CardTitle className="text-chrome-active">Screening questions</CardTitle></CardHeader>
        <CardContent>
          {job.screeningQuestions.length === 0 ? (
            <p className="text-sm text-slate-500">None yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-600">
              {job.screeningQuestions.map((q) => (
                <li key={q.id}>{q.question} ({q.type})</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-chrome-border">
        <CardHeader><CardTitle className="text-chrome-active">Interview kits</CardTitle></CardHeader>
        <CardContent>
          {job.interviewKits.length === 0 ? (
            <p className="text-sm text-slate-500">None yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-600">
              {job.interviewKits.map((k) => (
                <li key={k.id}>{k.name}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
