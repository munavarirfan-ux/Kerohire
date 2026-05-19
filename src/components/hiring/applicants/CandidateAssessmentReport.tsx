"use client";

import { AlertTriangle, CheckCircle2, Clock, FileText, Languages } from "lucide-react";
import {
  dashboardLabel,
  dashboardPanelInteractive,
  dashboardRowSurface,
  dashboardSectionTitle,
} from "@/components/dashboard/dashboardTokens";
import { cn } from "@/lib/utils";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { countCandidateAssessments } from "@/lib/hiring/directoryAccess";

const DEFAULT_SECTIONS = [
  { title: "Algorithms", score: 82, time: "18 min" },
  { title: "System design", score: 74, time: "22 min" },
  { title: "Debugging", score: 88, time: "12 min" },
];

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className={cn(dashboardRowSurface, "p-3")}>
      <p className={dashboardLabel}>{label}</p>
      <p className="mt-1 text-[1.25rem] font-semibold tabular-nums tracking-[-0.03em] text-text">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-text-secondary/65">{hint}</p> : null}
    </div>
  );
}

export function CandidateAssessmentReport({
  candidate,
  job,
}: {
  candidate: HiringCandidate;
  job: HiringJob;
}) {
  const assessmentEmails = candidate.emails.filter((e) => e.type === "Assessment");
  const count = countCandidateAssessments(candidate);
  const score = 78 + (candidate.id.charCodeAt(0) % 15);
  const malpracticeFlags = candidate.resumeStatus === "Flagged" ? 1 : 0;

  return (
    <div className="space-y-4">
      <section className={cn(dashboardPanelInteractive, "p-4")}>
        <h3 className={dashboardSectionTitle}>Assessment summary</h3>
        <p className="mt-1 text-[12px] text-text-secondary/70">
          {job.title} · {count} assessment{count === 1 ? "" : "s"} on record
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Overall score" value={`${score}%`} hint="Weighted across sections" />
          <MetricCard label="Malpractice flags" value={String(malpracticeFlags)} hint="Proctoring signals" />
          <MetricCard label="Language" value="TypeScript" />
          <MetricCard label="Submitted" value={candidate.appliedAt} hint="Local timezone" />
        </div>
      </section>

      <section className={cn(dashboardPanelInteractive, "p-4")}>
        <h3 className={dashboardSectionTitle}>Question performance</h3>
        <ul className="mt-3 space-y-2">
          {DEFAULT_SECTIONS.map((section) => (
            <li
              key={section.title}
              className={cn(
                dashboardRowSurface,
                "flex items-center justify-between gap-3 px-3 py-2.5 text-[12px]",
              )}
            >
              <span className="font-medium text-text">{section.title}</span>
              <span className="tabular-nums text-text-secondary/80">
                {section.score}% · {section.time}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn(dashboardPanelInteractive, "p-4")}>
        <h3 className={dashboardSectionTitle}>Submission details</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className={cn(dashboardRowSurface, "flex items-start gap-2.5 p-3")}>
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-forest/80" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-medium text-text">Code snapshot archived</p>
              <p className="text-[11px] text-text-secondary/65">Full run captured for review</p>
            </div>
          </div>
          <div className={cn(dashboardRowSurface, "flex items-start gap-2.5 p-3")}>
            <Languages className="mt-0.5 h-4 w-4 shrink-0 text-forest/80" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-medium text-text">Primary language</p>
              <p className="text-[11px] text-text-secondary/65">TypeScript</p>
            </div>
          </div>
          <div className={cn(dashboardRowSurface, "flex items-start gap-2.5 p-3")}>
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-forest/80" strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-medium text-text">Time on assessment</p>
              <p className="text-[11px] text-text-secondary/65">52 minutes total</p>
            </div>
          </div>
          <div className={cn(dashboardRowSurface, "flex items-start gap-2.5 p-3")}>
            {malpracticeFlags > 0 ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.5} />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.5} />
            )}
            <div>
              <p className="text-[12px] font-medium text-text">Integrity review</p>
              <p className="text-[11px] text-text-secondary/65">
                {malpracticeFlags > 0 ? "1 signal flagged" : "No malpractice detected"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {assessmentEmails.length > 0 ? (
        <section className={cn(dashboardPanelInteractive, "p-4")}>
          <h3 className={dashboardSectionTitle}>Assessment communications</h3>
          <ul className="mt-3 space-y-2">
            {assessmentEmails.map((email) => (
              <li key={email.id} className={cn(dashboardRowSurface, "px-3 py-2.5")}>
                <p className="text-[12px] font-medium text-text">{email.subject}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary/65">{email.timestamp}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
