import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zeMock } from "@/features/demo/data/ze.mock";

export default function AssessmentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Assessments</h2>
          <p className="text-sm text-text-secondary">Create, run, and evaluate technical assessments.</p>
        </div>
        <Button className="bg-ao-600 hover:bg-ao-700 text-white">{"+ Create Assessment"}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-12 bg-app-bg px-4 py-3 text-[12px] font-semibold text-text-secondary">
              <div className="col-span-3">Assessment</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Created by</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Invited</div>
              <div className="col-span-1">Evaluated</div>
              <div className="col-span-1">Qualified</div>
              <div className="col-span-1">Status</div>
            </div>
            <div className="divide-y divide-border bg-surface">
              {zeMock.assessments.list.map((a) => (
                <div key={a.name} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-app-bg transition-subtle">
                  <div className="col-span-3 font-semibold text-text">{a.name}</div>
                  <div className="col-span-2 text-text-secondary">{a.role}</div>
                  <div className="col-span-2 text-text-secondary">{a.createdBy}</div>
                  <div className="col-span-1 text-text-secondary">{a.date}</div>
                  <div className="col-span-1 text-text-secondary">{a.invited}</div>
                  <div className="col-span-1 text-text-secondary">{a.evaluated}</div>
                  <div className="col-span-1 text-text-secondary">{a.qualified}</div>
                  <div className="col-span-1">
                    <span className="inline-flex rounded-full border border-border bg-app-bg px-2 py-1 text-[11px] font-semibold text-text-secondary">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

