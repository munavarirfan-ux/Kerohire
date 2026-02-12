"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Prisma } from "@prisma/client";

type Job = Prisma.JobGetPayload<{
  include: {
    stages: {
      orderBy: { order: "asc" };
      include: { candidates: true };
    };
  };
}>;

export function PipelineBoard({ job }: { job: Job }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
      {job.stages.map((stage) => (
        <div
          key={stage.id}
          className="w-72 shrink-0 rounded-2xl border border-chrome-border bg-white shadow-sm"
        >
          <div className="px-4 py-3 border-b border-chrome-border bg-chrome/20">
            <h3 className="font-medium text-chrome-active">{stage.name}</h3>
            <p className="text-xs text-slate-500">{stage.candidates.length} applicants</p>
          </div>
          <CardContent className="p-2 space-y-2">
            {stage.candidates.map((c) => (
              <Card key={c.id} className="border-chrome-border p-3 hover:shadow-sm transition-subtle">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-chrome flex items-center justify-center text-chrome-active text-xs font-medium shrink-0">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-forest truncate">{c.name}</p>
                      <p className="text-xs text-slate-500 truncate">{c.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sage/50 text-forest shrink-0">Taken</span>
                </div>
                <div className="mt-2 flex gap-2 text-xs text-slate-500">
                  <span>ATS: {c.atsScore != null ? `${c.atsScore}%` : "—"}</span>
                  <span>Fit: —</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">1 min ago</p>
                <Link href={`/applicants/${c.id}`} className="mt-2 block w-full text-xs text-accent font-medium hover:underline">
                  View →
                </Link>
              </Card>
            ))}
          </CardContent>
        </div>
      ))}
    </div>
  );
}
