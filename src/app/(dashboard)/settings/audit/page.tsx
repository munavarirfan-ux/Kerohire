import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuditPage() {
  const orgId = await getAppOrgId();
  const events = await prisma.auditEvent.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: true },
  });

  return (
    <div className="space-y-6">
      <h1>Audit log</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-primary">Time</th>
                  <th className="text-left py-2 font-medium text-primary">Actor</th>
                  <th className="text-left py-2 font-medium text-primary">Action</th>
                  <th className="text-left py-2 font-medium text-primary">Entity</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted">
                      No audit events yet.
                    </td>
                  </tr>
                ) : (
                  events.map((e) => (
                    <tr key={e.id} className="border-b border-border">
                      <td className="py-2 text-text-secondary">
                        {e.createdAt.toISOString().slice(0, 19).replace("T", " ")}
                      </td>
                      <td className="py-2">{e.actor?.email ?? "—"}</td>
                      <td className="py-2">{e.action}</td>
                      <td className="py-2">
                        {e.entityType} {e.entityId ?? ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
