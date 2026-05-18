import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UsersRolesPage() {
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2>Users & Roles</h2>
          <p className="text-sm text-text-secondary">Role-based access control and team management.</p>
        </div>
        <Button className="w-full shrink-0 bg-ao-600 hover:bg-ao-700 text-white sm:w-auto">Invite user</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role definitions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F9F5FF]">
                <th className="px-5 py-3 text-left font-semibold text-text">User Role</th>
                <th className="px-5 py-3 text-left font-semibold text-text">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {[
                {
                  role: "Super Admin",
                  title: "Takes complete control of the account",
                  body: "Assumes full authority over the account, overseeing team management, interviews, assessments, and question pool.",
                },
                {
                  role: "Admin",
                  title: "Platform Owner",
                  body: "Administer users, oversees assessments and interviews, including scheduling and candidate invitations, and contribute to the question pool.",
                },
                {
                  role: "Curator",
                  title: "Curates Questions",
                  body: "Administer the question pool by contributing towards adding, editing, or removing the questions.",
                },
                {
                  role: "Evaluator",
                  title: "Interviewer and Assessment Evaluator",
                  body: "Evaluate assessments and interviews, by submitting feedback and scores.",
                },
              ].map((row) => (
                <tr key={row.role} className="hover:bg-app-bg/60">
                  <td className="px-5 py-4 align-top font-semibold text-text">{row.role}</td>
                  <td className="px-5 py-4 align-top text-text-secondary">
                    <p className="font-semibold text-text">{row.title}</p>
                    <p className="mt-1 text-sm leading-relaxed">{row.body}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RBAC (prototype)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary space-y-2">
          <p>This is a placeholder screen so sidebar navigation never hits 404.</p>
          <p>Next: role matrix, permissions editor, and scoped navigation per role.</p>
        </CardContent>
      </Card>
    </div>
  );
}

