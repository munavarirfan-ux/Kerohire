"use client";

import { ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import {
  overviewBody,
  overviewElevatedPanel,
  overviewGlassCard,
  overviewMuted,
  overviewSectionLabel,
  overviewSectionTitle,
} from "../hiringTokens";
import {
  getHiringTeam,
  getPipelineSnapshot,
  getRoleExpectations,
} from "./jobWorkspaceUtils";

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-3">
      <h3 className={overviewSectionTitle}>{title}</h3>
      {sub ? <p className={cn(overviewMuted, "mt-0.5")}>{sub}</p> : null}
    </header>
  );
}

function SkillPill({ children, variant }: { children: string; variant: "required" | "preferred" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-150",
        variant === "required"
          ? "bg-accent-deep text-white shadow-[0_1px_2px_rgb(var(--accent-deep-rgb)/0.35)]"
          : "border border-[rgba(16,24,40,0.06)] bg-accent/5 text-[#52525B] dark:border-white/[0.06] dark:bg-accent/10 dark:text-text-secondary/85",
      )}
    >
      {children}
    </span>
  );
}

export function JobWorkspaceOverview({
  job,
  candidates,
}: {
  job: HiringJob;
  candidates: HiringCandidate[];
}) {
  const team = getHiringTeam(job);
  const pipeline = getPipelineSnapshot(candidates);
  const expectations = getRoleExpectations(job);
  const maxPipeline = Math.max(...pipeline.map((s) => s.count), 1);

  return (
    <div className="space-y-4" role="region" aria-label="Job overview">
      {/* About role — editorial + elevated side panel */}
      <section className={cn(overviewGlassCard, "grid gap-4 lg:grid-cols-[1fr_260px] lg:gap-5")}>
        <div className="min-w-0 space-y-4">
          <SectionHeader title="About role" sub="Role summary and expectations" />
          <p className={cn(overviewBody, "max-w-prose")}>{job.description}</p>

          <div>
            <p className={overviewSectionLabel}>Responsibilities</p>
            <ul className="mt-2 space-y-2">
              {job.responsibilities.map((r) => (
                <li key={r} className={cn(overviewBody, "flex gap-2.5")}>
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-deep/35" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={overviewSectionLabel}>Expectations</p>
            <ul className="mt-2 space-y-2">
              {expectations.map((e) => (
                <li key={e} className={cn(overviewBody, "flex gap-2.5")}>
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#A1A1AA]/60" aria-hidden />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className={cn(overviewElevatedPanel, "h-fit lg:sticky lg:top-[220px]")}>
          <p className={overviewSectionLabel}>Role details</p>
          <dl className="mt-3 space-y-3">
            {[
              ["Salary", job.salaryRange],
              ["Openings", String(job.openings)],
              ["Deadline", job.deadline],
              ["Type", job.employmentType],
              ["Level", job.experienceLevel],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-3">
                <dt className="text-[11px] font-medium text-[#A1A1AA]">{label}</dt>
                <dd className="text-right text-[13px] font-medium text-[#3F3F46] dark:text-text-secondary/90">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className={overviewGlassCard}>
        <SectionHeader title="Skills" sub="Required capabilities for this search" />
        <div className="space-y-4">
          <div>
            <p className={overviewSectionLabel}>Required</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.requiredSkills.map((s) => (
                <SkillPill key={s} variant="required">
                  {s}
                </SkillPill>
              ))}
            </div>
          </div>
          {job.niceToHaveSkills.length > 0 ? (
            <div>
              <p className={overviewSectionLabel}>Nice to have</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {job.niceToHaveSkills.map((s) => (
                  <SkillPill key={s} variant="preferred">
                    {s}
                  </SkillPill>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className={overviewGlassCard}>
        <SectionHeader title="Pipeline snapshot" sub="Live distribution across stages" />
          <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-[14px] border border-[rgba(16,24,40,0.05)] bg-white/50 px-3 py-2 dark:border-white/[0.05] dark:bg-white/[0.02]">
            {pipeline.map((stage, i) => (
              <span key={`track-${stage.id}`} className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    stage.count > 0 ? "text-accent-deep dark:text-accent" : "text-[#A1A1AA]",
                  )}
                >
                  {stage.label}
                  <span className="tabular-nums text-[#71717A]"> ({stage.count})</span>
                </span>
                {i < pipeline.length - 1 ? (
                  <ArrowRight className="h-3 w-3 text-[#D4D4D8]" strokeWidth={1.5} aria-hidden />
                ) : null}
              </span>
            ))}
          </div>
          <div className="space-y-3">
            {pipeline.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className="flex w-24 shrink-0 items-center gap-1.5 text-[12px] font-medium text-[#52525B] dark:text-text-secondary/85">
                  {stage.label}
                  {i < pipeline.length - 1 ? (
                    <ArrowRight className="hidden h-3 w-3 text-[#D4D4D8] sm:block" strokeWidth={1.5} />
                  ) : null}
                </div>
                <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-deep/80 to-accent/50"
                    style={{ width: `${Math.max(8, (stage.count / maxPipeline) * 100)}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-[12px] font-medium tabular-nums text-[#18181B] dark:text-text">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
      </section>

      {/* Hiring team */}
      <section className={overviewGlassCard}>
        <div className="mb-4 flex items-start gap-2">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep/70 dark:text-accent/80" strokeWidth={1.5} />
          <SectionHeader title="Hiring team" sub="Owners and coordination for this role" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.id}
              className="rounded-[18px] border border-[rgba(16,24,40,0.05)] bg-white/80 p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-[180ms] hover:-translate-y-px hover:shadow-[0_8px_24px_-10px_rgba(15,23,42,0.1)] dark:border-white/[0.06] dark:bg-white/[0.03]"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/15 to-accent-deep/10 text-[12px] font-medium text-accent-deep dark:text-accent">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#18181B] dark:text-text">{member.name}</p>
                  <p className={overviewMuted}>{member.role}</p>
                  <p className="mt-2 text-[11px] text-[#A1A1AA]">{member.timezone}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#52525B] dark:text-text-secondary/80">
                    {member.workload}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
