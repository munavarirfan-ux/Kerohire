import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-chrome-active">Reports</h1>
      <Card className="border-chrome-border">
        <CardHeader>
          <CardTitle className="text-chrome-active">Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Candidate reports and comparison exports (use Export PDF from applicant or compare pages).</p>
        </CardContent>
      </Card>
    </div>
  );
}
