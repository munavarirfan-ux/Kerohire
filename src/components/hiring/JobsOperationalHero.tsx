"use client";

import { Briefcase, Calendar, FileCheck, Plus, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HiringOverviewStats } from "@/lib/hiring/mockData";
import {
  hiringHeroGlassKpi,
  hiringHeroRadialOverlay,
  hiringHeroShell,
  hiringTransition,
} from "./hiringTokens";
import { HiringHeroTexture } from "./HiringHeroTexture";

function Sparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 14" className={cn("h-3.5 w-10 text-white/40", className)} aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,11 6,9 12,10 18,6 24,7 30,4 40,5"
      />
    </svg>
  );
}

function GlassKpiCard({
  value,
  label,
  subtitle,
  icon: Icon,
}: {
  value: number;
  label: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <li className={hiringHeroGlassKpi}>
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/[0.06] blur-2xl opacity-60 transition-opacity duration-[180ms] ease-out group-hover/kpi:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.16] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Icon className="h-[18px] w-[18px] text-white/90" strokeWidth={1.5} />
        </div>
        <Sparkline />
      </div>
      <p className="relative mt-5 text-[2.25rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-white sm:text-[2.375rem]">
        {value}
      </p>
      <p className="relative mt-3 text-[12px] font-semibold tracking-[-0.01em] text-white/90">{label}</p>
      <p className="relative mt-1 text-[11px] leading-snug text-white/55">{subtitle}</p>
    </li>
  );
}

export function JobsOperationalHero({
  stats,
  onAddJob,
  addJobButtonRef,
}: {
  stats: HiringOverviewStats;
  onAddJob: () => void;
  addJobButtonRef?: React.Ref<HTMLButtonElement>;
}) {
  const kpis = [
    {
      value: stats.activeJobs,
      label: "Active Jobs",
      subtitle: stats.activeJobs > 0 ? "Live workflows" : "No active workflows",
      icon: Briefcase,
    },
    {
      value: stats.candidatesInPipeline,
      label: "Candidates in Pipeline",
      subtitle: stats.insights.candidates,
      icon: Users,
    },
    {
      value: stats.interviewsToday,
      label: "Interviews Today",
      subtitle: stats.insights.interviews,
      icon: Calendar,
    },
    {
      value: stats.offersPending,
      label: "Offers Pending",
      subtitle: stats.offersPending > 0 ? stats.insights.offers : "Awaiting response",
      icon: FileCheck,
    },
  ] as const;

  return (
    <section className={hiringHeroShell} aria-label="Jobs operational overview">
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-teal-200/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={hiringHeroRadialOverlay}
      />

      <div className="relative space-y-9 sm:space-y-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <header className="min-w-0 space-y-2">
            <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
              Jobs
            </h1>
            <p className="max-w-lg text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">
              Operational view of active hiring workflows across your organization.
            </p>
          </header>
          <Button
            ref={addJobButtonRef}
            type="button"
            onClick={onAddJob}
            className={cn(
              "h-10 shrink-0 rounded-[12px] px-5 text-sm font-semibold text-white",
              hiringTransition,
              "bg-accent shadow-[0_2px_10px_rgb(var(--accent-rgb)/0.4)] hover:-translate-y-px hover:bg-accent-hover hover:shadow-[0_6px_24px_rgb(var(--accent-rgb)/0.42)]",
            )}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add New Job
          </Button>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <GlassKpiCard
              key={kpi.label}
              value={kpi.value}
              label={kpi.label}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
