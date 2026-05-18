import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zeMock } from "@/features/demo/data/ze.mock";

export default function SchedulesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Schedules</h2>
          <p className="text-sm text-text-secondary">Operational view of upcoming and assigned interviews.</p>
        </div>
        <Button className="bg-ao-600 hover:bg-ao-700 text-white">{zeMock.interviews.primaryCta}</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming interviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {zeMock.interviews.list.map((i) => (
              <div key={i.candidate + i.dateTime} className="rounded-lg border border-border bg-surface p-4 hover:bg-app-bg transition-subtle">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{i.candidate}</p>
                    <p className="text-xs text-text-secondary">{i.role} · {i.interviewer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text">{i.dateTime}</p>
                    <p className="text-xs text-muted">{i.timezone}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex rounded-full border border-border bg-app-bg px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                    {i.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 px-3">View</Button>
                    <Button variant="outline" className="h-8 px-3">Reschedule</Button>
                    <Button variant="ghost" className="h-8 px-3">Cancel</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-app-bg p-4">
              <p className="text-sm font-semibold text-text">Flow preview</p>
              <ol className="mt-3 space-y-2 text-sm text-text-secondary list-decimal list-inside">
                <li>Select job</li>
                <li>Select candidate</li>
                <li>Select template or create custom</li>
                <li>Assign interviewer</li>
                <li>Date/time/timezone</li>
                <li>Attach scorecard</li>
                <li>Send invite + sync calendar</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

