"use client";

import { ClipboardCheck, MessageSquare, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HiringStageName } from "@/lib/hiring/stages";
import { hiringTransition } from "../hiringTokens";

export function candidateInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function stagePillClass(stage: HiringStageName | string, substage?: string): string {
  const sub = (substage ?? "").toLowerCase();
  if (sub.includes("reject") || stage === "Rejected") {
    return "border-zinc-200/90 bg-zinc-100/90 text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-muted";
  }
  const s = String(stage).toLowerCase();
  if (s.includes("applicant") || s === "applied") {
    return "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300";
  }
  if (s.includes("screen")) {
    return "border-sky-500/20 bg-sky-500/[0.08] text-sky-800 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300";
  }
  if (s.includes("interview")) {
    return "border-orange-500/20 bg-orange-500/[0.09] text-orange-900 dark:border-orange-400/25 dark:bg-orange-400/10 dark:text-orange-200";
  }
  if (s.includes("offer") || s.includes("hire")) {
    return "border-violet-500/20 bg-violet-500/[0.08] text-violet-900 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-200";
  }
  return "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-[#52525B] dark:border-white/[0.06] dark:bg-white/[0.03]";
}

export function CandidateStagePill({
  stage,
  substage,
  className,
}: {
  stage: string;
  substage?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-tight",
        stagePillClass(stage, substage),
        className,
      )}
    >
      {stage}
    </span>
  );
}

export function CandidateAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        "border border-[rgba(15,23,42,0.06)] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F6]",
        "text-[11px] font-semibold tracking-tight text-[#3F3F46]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
        "dark:border-white/[0.08] dark:from-white/[0.06] dark:to-white/[0.02] dark:text-text",
        className,
      )}
      aria-hidden
    >
      {candidateInitials(name)}
    </div>
  );
}

export function MetricChip({
  count,
  label,
  tone = "neutral",
  icon: Icon,
}: {
  count: number;
  label: string;
  tone?: "neutral" | "sky" | "orange";
  icon?: LucideIcon;
}) {
  const toneClass = {
    neutral:
      "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] text-text-secondary/85",
    sky: "border-sky-500/15 bg-sky-500/[0.06] text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
    orange:
      "border-orange-500/15 bg-orange-500/[0.07] text-orange-900 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tabular-nums",
        toneClass,
      )}
    >
      {Icon ? <Icon className="h-3 w-3 opacity-70" strokeWidth={1.75} /> : null}
      <span>{count}</span>
      <span className="font-medium opacity-80">{label}</span>
    </span>
  );
}

export function DirectoryStatCard({
  value,
  label,
  hint,
  icon: Icon,
  accent = "forest",
}: {
  value: number;
  label: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "forest" | "sky" | "orange" | "violet" | "amber";
}) {
  const accentMap = {
    forest: "from-forest/[0.06] to-emerald-500/[0.02] text-forest dark:text-emerald-300",
    sky: "from-sky-500/[0.08] to-sky-500/[0.02] text-sky-800 dark:text-sky-300",
    orange: "from-orange-500/[0.08] to-orange-500/[0.02] text-orange-900 dark:text-orange-200",
    violet: "from-violet-500/[0.08] to-violet-500/[0.02] text-violet-900 dark:text-violet-200",
    amber: "from-amber-500/[0.08] to-amber-500/[0.02] text-amber-900 dark:text-amber-200",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.05)]",
        "bg-gradient-to-br from-white to-[#F8FAFC] p-4",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_24px_-12px_rgba(15,23,42,0.08)]",
        hiringTransition,
        "hover:-translate-y-px hover:shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)]",
        "dark:border-white/[0.06] dark:from-surface dark:to-white/[0.02]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br opacity-60 blur-xl",
          accentMap[accent],
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[11px] border border-[rgba(15,23,42,0.05)] bg-white/80",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:bg-white/[0.04]",
          )}
        >
          <Icon className="h-4 w-4 text-text-secondary/70" strokeWidth={1.5} />
        </div>
      </div>
      <p className="relative mt-3 text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-text">
        {value}
      </p>
      <p className="relative mt-1.5 text-[12px] font-semibold tracking-[-0.01em] text-text">{label}</p>
      {hint ? <p className="relative mt-0.5 text-[11px] text-text-secondary/65">{hint}</p> : null}
    </div>
  );
}
