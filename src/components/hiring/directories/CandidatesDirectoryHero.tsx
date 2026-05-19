"use client";

import { Calendar, ClipboardCheck, FileCheck, MessageSquare, Users } from "lucide-react";
import type { CandidateDirectoryStats } from "@/lib/hiring/candidateDirectoryStats";
import { cn } from "@/lib/utils";
import { HeroMetricsCollapsible } from "../HeroMetricsCollapsible";
import { HiringHeroGlassKpiCard } from "../HiringHeroGlassKpiCard";
import { hiringHeroRadialOverlay, hiringHeroShell } from "../hiringTokens";
import { HiringHeroTexture } from "../HiringHeroTexture";

export function CandidatesDirectoryHero({ stats }: { stats: CandidateDirectoryStats }) {
  const kpis = [
    {
      value: stats.total,
      label: "Total Candidates",
      subtitle: "In your view",
      icon: Users,
    },
    {
      value: stats.interviewsActive,
      label: "Interviews Active",
      subtitle: "Live pipelines",
      icon: Calendar,
    },
    {
      value: stats.assessmentPending,
      label: "Assessment Pending",
      subtitle: "Screening queue",
      icon: ClipboardCheck,
    },
    {
      value: stats.feedbackPending,
      label: "Feedback Pending",
      subtitle: "Needs review",
      icon: MessageSquare,
    },
    {
      value: stats.offersSent,
      label: "Offers Sent",
      subtitle: "Hire & offers",
      icon: FileCheck,
    },
  ] as const;

  return (
    <section
      className={cn(hiringHeroShell, "!py-6 sm:!px-8 sm:!py-7 lg:!px-10")}
      aria-label="Candidates overview"
    >
      <HiringHeroTexture />
      <div
        className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[rgb(var(--hero-glow-rgb)/0.14)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={hiringHeroRadialOverlay}
      />

      <div className="relative space-y-6">
        <header className="min-w-0 space-y-2">
          <h1 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[2.125rem]">
            Candidates
          </h1>
          <p className="max-w-xl text-[13px] leading-relaxed text-white/[0.68] sm:text-sm">
            Search, filter, and manage candidates across all hiring pipelines.
          </p>
        </header>

        <HeroMetricsCollapsible
          id="candidates-directory-hero-metrics"
          withBorder={false}
          gridClassName="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5"
        >
          {kpis.map((kpi) => (
            <HiringHeroGlassKpiCard
              key={kpi.label}
              value={kpi.value}
              label={kpi.label}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
              compact
            />
          ))}
        </HeroMetricsCollapsible>
      </div>
    </section>
  );
}
