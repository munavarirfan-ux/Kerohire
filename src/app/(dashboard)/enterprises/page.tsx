import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zeMock } from "@/features/demo/data/ze.mock";

export default function EnterprisesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Enterprises</h2>
          <p className="text-sm text-text-secondary">Super admin workspace management.</p>
        </div>
        <Button className="bg-ao-600 hover:bg-ao-700 text-white">Create enterprise</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enterprise list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-12 bg-app-bg px-4 py-3 text-[12px] font-semibold text-text-secondary">
              <div className="col-span-3">Enterprise</div>
              <div className="col-span-2">Domain</div>
              <div className="col-span-1">Plan</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Joined</div>
              <div className="col-span-1">Users</div>
              <div className="col-span-1">Jobs</div>
              <div className="col-span-1">Candidates</div>
              <div className="col-span-1">Actions</div>
            </div>
            <div className="divide-y divide-border bg-surface">
              {zeMock.enterprises.list.map((e) => (
                <div key={e.domain} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-app-bg transition-subtle">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md border border-border bg-app-bg" />
                    <div>
                      <p className="font-semibold text-text">{e.name}</p>
                      <p className="text-xs text-text-secondary">{e.location}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-text-secondary">{e.domain}</div>
                  <div className="col-span-1 text-text-secondary">{e.plan}</div>
                  <div className="col-span-1">
                    <span className="inline-flex rounded-full border border-border bg-app-bg px-2 py-1 text-[11px] font-semibold text-text-secondary">
                      {e.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-text-secondary">{e.joined}</div>
                  <div className="col-span-1 text-text-secondary">{e.users}</div>
                  <div className="col-span-1 text-text-secondary">{e.jobs}</div>
                  <div className="col-span-1 text-text-secondary">{e.candidates}</div>
                  <div className="col-span-1">
                    <Button variant="outline" className="h-8 px-3">View</Button>
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

