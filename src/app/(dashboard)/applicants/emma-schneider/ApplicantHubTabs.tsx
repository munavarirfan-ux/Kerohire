"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_ITEMS = [
  { id: "work-signals", label: "Work Signals" },
  { id: "interview-logs", label: "Interview Logs" },
  { id: "assessments", label: "Assessments" },
  { id: "background", label: "Background" },
] as const;

export function ApplicantHubTabs({
  workSignals,
}: {
  workSignals: Array<{ title: string; description: string; status: "Strong" | "Moderate" }>;
}) {
  return (
    <Tabs defaultValue="work-signals" className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-chrome-border">
        <TabsList className="min-w-0 flex-1">
          {TAB_ITEMS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Link href="/applicants/emma-schneider/decision" className="mb-2 shrink-0">
          <Button variant="outline" className="rounded-full border-chrome-border">
            Decision Summary
          </Button>
        </Link>
      </div>

      <TabsContent value="work-signals" className="mt-4 focus-visible:ring-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workSignals.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-chrome-border bg-surface p-4 shadow-sm transition-subtle hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-2xl border border-chrome-border bg-parchment" />
                <span
                  className={[
                    "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                    s.status === "Strong"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-orange-200 bg-orange-50 text-orange-700",
                  ].join(" ")}
                >
                  {s.status.toUpperCase()}
                </span>
              </div>
              <p className="mt-3 font-semibold text-text">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{s.description}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="interview-logs" className="mt-4 focus-visible:ring-0">
        <div className="rounded-2xl border border-chrome-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-text">Interview Intelligence</p>
              <p className="text-xs text-muted">Technical round · transcript + evidence summary</p>
            </div>
            <Link href="/interviews/intelligence">
              <Button className="rounded-full bg-accent text-white hover:bg-accent/90">Open analysis</Button>
            </Link>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="assessments" className="mt-4 focus-visible:ring-0">
        <div className="rounded-2xl border border-chrome-border bg-surface p-4 shadow-sm">
          <p className="font-semibold text-text">Assessments</p>
          <p className="mt-1 text-xs text-muted">
            Mock assessment view for the clickable prototype. (Trait evidence, work simulation results, reliability gaps.)
          </p>
        </div>
      </TabsContent>

      <TabsContent value="background" className="mt-4 focus-visible:ring-0">
        <div className="rounded-2xl border border-chrome-border bg-surface p-4 shadow-sm">
          <p className="font-semibold text-text">Background</p>
          <p className="mt-1 text-xs text-muted">
            Mock background tab for portfolio notes, experience highlights, and contextual hiring signals.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
