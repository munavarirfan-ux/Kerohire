"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  assessmentQualification,
  interviewerProductivityRows,
  malpracticeSignals,
  scheduleCalendarDays,
  topTechnologies,
  upcomingScheduleRows,
  evaluatorAvailability,
} from "@/features/dashboard/data/dashboard.mock";
import type { ScheduleRow } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";
import { useChartAccentColors } from "@/lib/useChartAccentColors";
import type {
  AssessmentsPanelMode,
  InterviewsPanelMode,
  SchedulesPanelMode,
} from "@/config/dashboardWidgetsByRole";
import {
  dashboardBentoCell,
  dashboardBentoGrid,
  dashboardBentoSpan,
  dashboardPanel,
  dashboardPanelInteractive,
  dashboardRowSurface,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "./dashboardTokens";

const rowSurface = dashboardRowSurface;
const insightCard = dashboardPanel;

function PanelShell({
  title,
  subtitle,
  children,
  className,
  bodyClassName,
  density = "default",
  elevated = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  density?: "default" | "compact" | "dense";
  elevated?: boolean;
}) {
  const shell = elevated ? dashboardPanelInteractive : dashboardPanel;
  const pad = density === "dense" ? "p-2.5" : density === "compact" ? "p-3" : "p-3.5 sm:p-4";
  const titleClass =
    density === "dense"
      ? "text-[13px] font-medium tracking-[-0.02em] text-[#18181B] dark:text-text"
      : dashboardSectionTitle;

  return (
    <section className={cn("flex h-full min-w-0 flex-col", shell, pad, className)}>
      <header className={cn("shrink-0 px-0.5", density === "dense" ? "mb-2" : "mb-2.5")}>
        <h3 className={titleClass}>{title}</h3>
        {subtitle ? <p className={dashboardSectionSub}>{subtitle}</p> : null}
      </header>
      <div className={cn("min-h-0", bodyClassName)}>{children}</div>
    </section>
  );
}

function InterviewerProductivityPanel() {
  return (
    <PanelShell title="Interviewer workload" subtitle="Ranked load · completion" density="dense">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[200px] text-[13px]">
          <thead>
            <tr className="text-left text-[10px] font-medium uppercase tracking-wider text-muted/70">
              <th className="pb-2 pr-2 font-medium">Interviewer</th>
              <th className="pb-2 text-right font-medium">Done</th>
              <th className="pb-2 text-right font-medium">Hrs</th>
            </tr>
          </thead>
          <tbody>
            {interviewerProductivityRows.map((r) => (
              <tr key={r.name} className="border-t border-[rgba(15,23,42,0.04)] transition-colors hover:bg-[rgba(15,23,42,0.02)] dark:border-white/[0.04]">
                <td className="py-2 pr-2">
                  <span className="font-medium text-text">{r.name}</span>
                </td>
                <td className="py-2 text-right font-medium tabular-nums text-text">{r.conducted}</td>
                <td className="py-2 text-right tabular-nums text-muted/80">{r.totalHours}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}

const CHART_TOOLTIP = {
  cursor: { fill: "rgba(15, 61, 46, 0.028)" },
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #E6E6E2",
    fontSize: 12,
    padding: "11px 14px",
    boxShadow: "0 10px 36px rgb(15 23 42 / 0.07)",
    backgroundColor: "#FFFFFF",
  },
  labelStyle: { color: "#71717A", fontWeight: 600, fontSize: 11, marginBottom: 6 },
  itemStyle: { color: "#18181B", fontWeight: 600, fontSize: 13 },
};

const CHART_GRID = { stroke: "#EBEBE6", strokeOpacity: 0.38, strokeDasharray: "3 6" as const };

function statusChip(status: ScheduleRow["status"]) {
  switch (status) {
    case "Confirmed":
      return "bg-[#DCFCE7] text-[#166534]";
    case "Hold":
      return "bg-[#FEF3C7] text-[#A16207]";
    case "Rescheduled":
      return "bg-muted text-text-secondary";
    default:
      return "bg-secondary-fill text-text-secondary";
  }
}

function candidateInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function AssignedInterviewSchedule({
  title = "Interview queue",
  subtitle = "Upcoming panels · timezone-aware",
  joinVariant = "allPrimary",
  showFooter = true,
  useCandidateAvatar = false,
  showStatusChip = true,
  limitRows,
  density = "default",
  elevated = false,
}: {
  title?: string;
  subtitle?: string;
  joinVariant?: "allPrimary" | "firstPrimary";
  showFooter?: boolean;
  useCandidateAvatar?: boolean;
  showStatusChip?: boolean;
  limitRows?: number;
  density?: "default" | "compact" | "dense";
  elevated?: boolean;
}) {
  const rows = limitRows ? upcomingScheduleRows.slice(0, limitRows) : upcomingScheduleRows;

  return (
    <PanelShell title={title} subtitle={subtitle} bodyClassName="flex flex-col gap-2" density={density} elevated={elevated}>
        {rows.map((row, index) => {
          const avatar = useCandidateAvatar ? candidateInitials(row.candidate) : row.interviewerInitials;
          const primaryJoin = joinVariant === "allPrimary" || (joinVariant === "firstPrimary" && index === 0);
          return (
            <div
              key={row.candidate}
              className={cn("flex cursor-pointer gap-2.5", rowSurface)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F4F4F5] to-white text-[11px] font-semibold text-[#18181B] ring-1 ring-[rgba(15,23,42,0.06)] dark:from-white/10 dark:to-white/5 dark:text-text">
                {avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-text">{row.candidate}</p>
                  {showStatusChip ? (
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", statusChip(row.status))}>
                      {row.status}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-[11px] text-text-secondary">{row.role}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                  <span className="text-text-secondary">{row.stage}</span>
                  <span className="text-muted"> · </span>
                  <span>{row.durationMin} min</span>
                  <span className="text-muted"> · </span>
                  <span className="font-medium text-text-secondary">{row.timezone}</span>
                </p>
                <p className="mt-1 text-xs text-text">
                  <span className="font-medium tabular-nums">{row.timeLabel}</span>
                  <span className="text-muted"> local · </span>
                  <span className="text-text-secondary">{row.interviewer}</span>
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 shrink-0 self-start rounded-[10px] px-3 text-[11px] font-medium",
                  primaryJoin
                    ? "border-transparent bg-accent text-white hover:bg-accent-hover"
                    : "border-border bg-surface text-text hover:bg-muted/25",
                )}
              >
                {row.join}
              </Button>
            </div>
          );
        })}
        {showFooter ? (
          <div className="pt-1">
            <Link href="/interviews" className="block">
              <Button variant="outline" className="h-9 w-full rounded-[12px] border-[rgba(15,23,42,0.06)] text-xs font-medium text-text hover:bg-[rgba(15,23,42,0.03)]">
                Open interviews
              </Button>
            </Link>
          </div>
        ) : null}
    </PanelShell>
  );
}

function BentoWorkspace({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(dashboardBentoGrid, className)} role="region" aria-label={label}>
      {children}
    </div>
  );
}

const bentoCard = cn(insightCard, "flex h-full min-h-0 flex-col");

function TechnologyBentoTile({ name, pct, assessments, barMuted }: (typeof topTechnologies)[number]) {
  return (
    <Card className={cn(dashboardBentoCell, dashboardBentoSpan.quarter, bentoCard)}>
      <CardContent className="flex flex-1 flex-col justify-between p-4 pt-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-text">{name}</p>
            <span className="text-sm font-medium tabular-nums text-forest">{pct}%</span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">{assessments} assessments</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted/40">
          <div
            className={cn("h-full rounded-full", barMuted ? "bg-[#A1A1AA]" : "bg-accent-deep")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBentoTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card className={cn(dashboardBentoCell, dashboardBentoSpan.third, bentoCard)}>
      <CardContent className="flex flex-1 flex-col justify-center p-4 pt-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-2xl font-medium tabular-nums text-text">{value}</p>
        <p className="mt-1 text-xs text-text-secondary">{note}</p>
      </CardContent>
    </Card>
  );
}

export function InterviewsInsightPanel({ mode = "enterprise" }: { mode?: InterviewsPanelMode }) {
  if (mode === "interviewer") {
    return (
      <BentoWorkspace label="Interview operations">
        <div className={cn(dashboardBentoCell, dashboardBentoSpan.wide)}>
          <AssignedInterviewSchedule />
        </div>
      </BentoWorkspace>
    );
  }

  return (
    <BentoWorkspace label="Interview operations">
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.hero, "min-h-[min(360px,48vh)]")}>
        <AssignedInterviewSchedule title="Interview queue" subtitle="Upcoming panels · actions" joinVariant="allPrimary" showFooter elevated />
      </div>
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.side)}>
        <AssignedInterviewSchedule
          title="Your next panel"
          subtitle="Starting soon"
          joinVariant="firstPrimary"
          showFooter={false}
          useCandidateAvatar
          showStatusChip={false}
          limitRows={2}
          density="compact"
        />
      </div>
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.side)}>
        <InterviewerProductivityPanel />
      </div>
    </BentoWorkspace>
  );
}


export function AssessmentsInsightPanel({ mode = "enterprise" }: { mode?: AssessmentsPanelMode }) {
  const chart = useChartAccentColors();
  const qualTitle =
    mode === "curator" ? "Question pool health" : mode === "evaluator" ? "Ongoing assessment mix" : "Qualification distribution";
  const qualSub =
    mode === "curator"
      ? "Difficulty bands across live items"
      : mode === "evaluator"
        ? "Score bands for candidates in flight"
        : "Evidence-based score bands";

  const malpracticeTitle =
    mode === "curator" ? "Low quality / calibration signals" : mode === "evaluator" ? "Malpractice review" : "Malpractice monitoring";
  const malpracticeSub =
    mode === "curator"
      ? "Items pulled for curator review"
      : mode === "evaluator"
        ? "Evaluator lane — integrity without hiring noise"
        : "Session integrity signals for review";

  return (
    <BentoWorkspace label="Assessment intelligence">
      <Card className={cn(dashboardBentoCell, dashboardBentoSpan.hero, bentoCard)}>
        <CardHeader className="shrink-0 pb-2 pt-0">
          <CardTitle className="text-base font-medium text-text">{qualTitle}</CardTitle>
          <p className="text-xs font-normal text-text-secondary">{qualSub}</p>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 pt-3">
          <div className="h-[min(240px,100%)] min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentQualification} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid {...CHART_GRID} vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 80]} tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} formatter={(v: number) => [`${v} candidates`, "Count"]} />
                <Bar dataKey="count" fill={chart.primary} radius={[9, 9, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(dashboardBentoCell, dashboardBentoSpan.sideTall, bentoCard)}>
        <CardHeader className="shrink-0 pb-2 pt-0">
          <CardTitle className="text-base font-medium text-text">{malpracticeTitle}</CardTitle>
          <p className="text-xs font-normal text-text-secondary">{malpracticeSub}</p>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto pt-3">
          {malpracticeSignals.map((m) => {
            const accent = m.label.includes("AI");
            return (
            <div key={m.label}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-text">{m.label}</span>
                <span className="tabular-nums text-text-secondary">{m.pct}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/40">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500 ease-out",
                    accent ? "bg-accent" : "bg-[#A1A1AA]",
                  )}
                  style={{ width: `${Math.min(100, m.pct)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">{m.note}</p>
            </div>
            );
          })}
        </CardContent>
      </Card>

      {mode !== "evaluator"
        ? topTechnologies.map((t) => <TechnologyBentoTile key={t.name} {...t} />)
        : (
          <>
            <StatBentoTile label="Last 30 days" value="312" note="+9% vs prior window" />
            <StatBentoTile label="Avg evaluation time" value="22m" note="Stable vs SLA target" />
            <StatBentoTile label="Integrity mix" value="6" note="Flagged sessions in calibration band" />
          </>
        )}

      {mode === "curator" ? (
        <>
          <StatBentoTile label="Archived" value="62" note="24-month retention window" />
          <StatBentoTile label="Assessment content quality" value="4.2" note="Weighted peer review score" />
          <StatBentoTile label="Coverage gaps" value="3" note="Tracks missing gold-standard items" />
        </>
      ) : null}
    </BentoWorkspace>
  );
}

function InterviewerAvailabilityPanel() {
  return (
    <PanelShell title="Interviewer availability" subtitle="Slots and capacity this week" density="dense">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[10px] font-medium uppercase tracking-wider text-muted/70">
            <th className="pb-2 pr-2">Interviewer</th>
            <th className="pb-2 text-right">Slots</th>
            <th className="pb-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {evaluatorAvailability.map((e) => (
            <tr key={e.name} className="border-t border-[rgba(15,23,42,0.04)] dark:border-white/[0.04]">
              <td className="py-2 pr-2 font-medium text-text">{e.name}</td>
              <td className="py-2 text-right tabular-nums text-muted/80">{e.slots}</td>
              <td className="py-2 text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                    e.status === "Available" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF3C7] text-[#A16207]",
                  )}
                >
                  {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelShell>
  );
}

export function SchedulesInsightPanel({ mode = "enterprise" }: { mode?: SchedulesPanelMode }) {
  const chart = useChartAccentColors();

  if (mode === "interviewer") {
    return (
      <BentoWorkspace label="Schedule intelligence">
        <Card className={cn(dashboardBentoCell, dashboardBentoSpan.chart, bentoCard)}>
          <CardHeader className="pb-2 pt-0">
            <CardTitle className="text-base font-medium text-text">Your interview load</CardTitle>
            <p className="text-xs font-normal text-text-secondary">Scheduled panels by weekday</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scheduleCalendarDays} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid {...CHART_GRID} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="interviews" name="Interviews" fill={chart.primary} radius={[9, 9, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(dashboardBentoCell, dashboardBentoSpan.sideWide, bentoCard)}>
          <CardHeader className="shrink-0 pb-2 pt-0">
            <CardTitle className="text-base font-medium text-text">Your upcoming panels</CardTitle>
            <p className="text-xs font-normal text-text-secondary">Assigned schedule · feedback prep</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <ul className="space-y-3">
              {upcomingScheduleRows.map((r) => (
                <li
                  key={r.candidate}
                  className="rounded-[12px] border border-border bg-surface px-3 py-2.5 text-xs shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-all duration-200 hover:border-muted hover:bg-muted/15"
                >
                  <p className="font-medium tabular-nums text-text">
                    {r.timeLabel}
                    <span className="font-medium text-text-secondary"> {r.timezone}</span>
                    <span className="text-muted"> · </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{r.stage}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    {r.durationMin} min panel · <span className="font-medium text-text">{r.candidate}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/schedules">
              <Button className="h-9 w-full rounded-[12px] bg-accent text-xs font-medium text-white hover:bg-accent-hover">
                Open schedules
              </Button>
            </Link>
          </CardContent>
        </Card>
      </BentoWorkspace>
    );
  }

  return (
    <BentoWorkspace label="Schedule intelligence">
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.hero, "min-h-[min(360px,48vh)]")}>
        <AssignedInterviewSchedule title="Global interview schedule" subtitle="Organization-wide panels" joinVariant="allPrimary" showFooter elevated />
      </div>
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.side)}>
        <AssignedInterviewSchedule
          title="Your next panel"
          subtitle="Starting soon"
          joinVariant="firstPrimary"
          showFooter={false}
          useCandidateAvatar
          showStatusChip={false}
          limitRows={2}
          density="compact"
        />
      </div>
      <div className={cn(dashboardBentoCell, dashboardBentoSpan.side)}>
        <InterviewerAvailabilityPanel />
      </div>
    </BentoWorkspace>
  );
}

