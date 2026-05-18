"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  ClipboardList,
  Copy,
  FileCheck,
  Link2,
  MoreHorizontal,
  Pause,
  Pencil,
  Plus,
  Share2,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import {
  hiringHeroGlassKpi,
  hiringHeroRadialOverlay,
  hiringHeroShell,
  hiringTransition,
} from "../hiringTokens";
import { HiringHeroTexture } from "../HiringHeroTexture";
import type { JobWorkspaceMetrics } from "./jobWorkspaceUtils";
import { getActiveHiringStage } from "./jobWorkspaceUtils";

const glassMeta =
  "inline-flex items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/78 backdrop-blur-md";

const menuContentClass = cn(
  "z-[100] w-[232px] min-w-0 overflow-hidden rounded-[12px] p-1",
  "border border-[rgba(15,23,42,0.06)] bg-white",
  "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_8px_rgba(15,23,42,0.04)]",
  "data-[state=open]:animate-radix-in data-[state=closed]:animate-radix-out",
);

const menuItemClass = cn(
  "flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 py-0 text-[12px] font-medium",
  "outline-none transition-colors duration-150 ease-out",
  "focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]",
);

function Sparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 14" className={cn("h-3.5 w-10 shrink-0 text-white/40", className)} aria-hidden>
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

function HeroGlassKpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <li className={cn(hiringHeroGlassKpi, "min-h-[112px] !rounded-[16px] !p-3 sm:!p-3.5")}>
      <div
        className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/[0.06] blur-2xl opacity-60 transition-opacity duration-[180ms] ease-out group-hover/kpi:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.16] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Icon className="h-4 w-4 text-white/90" strokeWidth={1.5} aria-hidden />
        </div>
        <Sparkline />
      </div>
      <p className="relative mt-3 text-[1.75rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-white">
        {String(value).padStart(2, "0")}
      </p>
      <p className="relative mt-2 text-[11px] font-semibold tracking-[-0.01em] text-white/90">{label}</p>
      <p className="relative mt-0.5 text-[10px] leading-snug text-white/55">{subtitle}</p>
    </li>
  );
}

export function JobWorkspaceHero({
  job,
  metrics,
  candidates,
  onAddCandidate,
  addCandidateButtonRef,
}: {
  job: HiringJob;
  metrics: JobWorkspaceMetrics;
  candidates: HiringCandidate[];
  onAddCandidate?: () => void;
  addCandidateButtonRef?: React.Ref<HTMLButtonElement>;
}) {
  const hiringStage = getActiveHiringStage(job, candidates);

  const copyJobLink = () => {
    const url = `${window.location.origin}/hiring/jobs/${job.id}`;
    void navigator.clipboard.writeText(url);
  };

  const kpis = [
    {
      label: "Applicants",
      value: metrics.totalApplicants,
      icon: Users,
      subtitle: job.candidatesThisWeek > 0 ? `+${job.candidatesThisWeek} this week` : "In pipeline",
    },
    {
      label: "Screening",
      value: metrics.screening,
      icon: ClipboardList,
      subtitle: metrics.screening > 0 ? "In review" : "Queue clear",
    },
    {
      label: "Interviews",
      value: metrics.interviews,
      icon: Calendar,
      subtitle: job.interviewsToday > 0 ? `${job.interviewsToday} today` : "None scheduled",
    },
    {
      label: "Offers",
      value: metrics.offers,
      icon: FileCheck,
      subtitle: metrics.offers > 0 ? "Pending response" : "None active",
    },
    {
      label: "Hired",
      value: metrics.hired,
      icon: BadgeCheck,
      subtitle: job.openings > metrics.hired ? `${job.openings - metrics.hired} openings left` : "Role filled",
    },
  ] as const;

  return (
    <section
      className={cn(hiringHeroShell, "px-5 py-5 sm:px-7 sm:py-6")}
      aria-label="Job workspace header"
    >
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={hiringHeroRadialOverlay} />

      <div className="relative space-y-5">
        <Link
          href="/hiring/jobs"
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full border border-white/[0.16] bg-white/[0.07] px-3 py-1 text-[11px] font-medium text-white/72 backdrop-blur-sm",
            hiringTransition,
            "hover:border-white/[0.26] hover:bg-white/[0.11] hover:text-white",
          )}
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Back to jobs
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <header className="min-w-0 space-y-3">
            <h1 className="text-[1.5rem] font-medium leading-[1.15] tracking-[-0.04em] text-white sm:text-[1.75rem]">
              {job.title}
            </h1>
            <p className="text-[13px] font-normal text-white/[0.58]">
              {job.department}
              <span className="mx-2 text-white/20">·</span>
              {job.location}
              <span className="mx-2 text-white/20">·</span>
              {job.workMode}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={glassMeta}>{job.employmentType}</span>
              <span className={cn(glassMeta, "text-white/88")}>{job.status}</span>
              <span className={glassMeta}>{hiringStage}</span>
              <span className={glassMeta}>Updated {job.lastUpdatedLabel}</span>
            </div>
          </header>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              size="sm"
              className={cn(
                "h-9 gap-1.5 rounded-[11px] px-4 text-[13px] font-medium text-white",
                hiringTransition,
                "bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-white/[0.2]",
              )}
              onClick={copyJobLink}
            >
              <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Share job
            </Button>
            <Button
              ref={addCandidateButtonRef}
              type="button"
              size="sm"
              className={cn(
                "h-9 gap-1.5 rounded-[11px] px-4 text-[13px] font-medium text-white",
                hiringTransition,
                "bg-accent shadow-[0_2px_12px_rgb(var(--accent-rgb)/0.35)] hover:bg-accent-hover",
              )}
              onClick={onAddCandidate}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Add candidate
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 w-9 rounded-[11px] border-white/[0.18] bg-white/[0.08] p-0 text-white backdrop-blur-sm",
                    hiringTransition,
                    "hover:border-white/[0.28] hover:bg-white/[0.14]",
                  )}
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" sideOffset={4} className={menuContentClass}>
                <DropdownMenuItem className={menuItemClass}>
                  <Pencil className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Edit job
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClass}>
                  <Copy className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Duplicate job
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClass} onSelect={copyJobLink}>
                  <Link2 className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Copy job link
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0.5" />
                <DropdownMenuItem className={menuItemClass}>
                  <Pause className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Pause hiring
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClass}>
                  <XCircle className="h-3 w-3 opacity-55" strokeWidth={1.75} />
                  Close job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2.5 border-t border-white/[0.1] pt-4 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {kpis.map((k) => (
            <HeroGlassKpiCard
              key={k.label}
              label={k.label}
              value={k.value}
              subtitle={k.subtitle}
              icon={k.icon}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
