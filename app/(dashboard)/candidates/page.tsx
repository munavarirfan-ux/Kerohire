import { getServerSession } from "next-auth";
import { authOptions, getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CandidatesPage() {
  const orgId = await getAppOrgId();
  const session = await getServerSession(authOptions);
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });
  const anonymizeSetting =
    session?.user?.role === "HR" && (org?.anonymizedScreening ?? false);

  const candidates = await prisma.candidate.findMany({
    where: { organizationId: orgId },
    include: {
      role: true,
      assessmentResults: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = await Promise.all(
    candidates.map(async (c) => {
      const fit = await getRoleFitForCandidate(c.id);
      return {
        id: c.id,
        name: anonymizeSetting && session?.user?.role === "HR" ? "Candidate" : c.name,
        email: anonymizeSetting && session?.user?.role === "HR" ? "" : c.email ?? "",
        roleName: c.role?.name ?? "—",
        status: c.status,
        roleFitScore: fit.roleFitScore,
        riskCount: fit.risks.length,
        confidence: fit.confidence,
      };
    })
  );

  return (
    <div className="space-y-6">
      <h1>Candidates</h1>
      <Card>
        <CardHeader>
          <CardTitle>All candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 font-medium text-primary">Name</th>
                  <th className="pb-3 font-medium text-primary">Role</th>
                  <th className="pb-3 font-medium text-primary">Status</th>
                  <th className="pb-3 font-medium text-primary">Role fit %</th>
                  <th className="pb-3 font-medium text-primary">Risks</th>
                  <th className="pb-3 font-medium text-primary">Confidence</th>
                  <th className="pb-3 font-medium text-primary"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-slate-100 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3">{r.name}</td>
                    <td className="py-3">{r.roleName}</td>
                    <td className="py-3">{r.status}</td>
                    <td className="py-3">{r.roleFitScore}%</td>
                    <td className="py-3">{r.riskCount}</td>
                    <td className="py-3">{r.confidence}%</td>
                    <td className="py-3">
                      <Link
                        href={`/candidates/${r.id}`}
                        className="text-accent font-medium hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
