"use client";

import { cn } from "@/lib/utils";
import type { OperationalActivityItem, OperationalActivityTone } from "@/features/dashboard/data/dashboard.mock";
import { recentOperationalActivity } from "@/features/dashboard/data/dashboard.mock";
import { dashboardCard, dashboardLabel, dashboardShadowHover, dashboardTransition } from "./dashboardTokens";

function toneDot(tone: OperationalActivityTone) {
  if (tone === "success") return "bg-emerald-500";
  if (tone === "warning") return "bg-amber-500";
  if (tone === "accent") return "bg-accent";
  return "bg-muted";
}

export function RecentOperationalActivity({ items = recentOperationalActivity }: { items?: OperationalActivityItem[] }) {
  return (
    <section aria-labelledby="recent-activity-heading" className={cn(dashboardCard, dashboardShadowHover)}>
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[rgba(15,23,42,0.05)] px-4 py-3.5 sm:px-5 sm:py-4 dark:border-white/[0.06]">
        <div>
          <h2 id="recent-activity-heading" className={dashboardLabel}>
            Recent operational activity
          </h2>
          <p className="mt-1 text-[12px] text-text-secondary/70">Live signals across hiring, assessments, and offers</p>
        </div>
        <span className="text-[10px] font-medium tabular-nums text-muted/70">Updated just now</span>
      </div>
      <ul>
        {items.map((row) => (
          <li
            key={row.id}
            className={cn(
              "flex gap-3 border-b border-[rgba(15,23,42,0.04)] px-4 py-3 last:border-b-0 sm:gap-3.5 sm:px-5 sm:py-3.5",
              dashboardTransition,
              "hover:bg-[rgba(15,23,42,0.02)] dark:hover:bg-white/[0.02]",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)]",
                "bg-[rgba(15,23,42,0.02)] text-[10px] font-semibold text-text-secondary/80 dark:border-white/[0.06] dark:bg-white/[0.03]",
              )}
              aria-hidden
            >
              {row.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", toneDot(row.tone))} aria-hidden />
                <p className="min-w-0 text-[13px] font-semibold leading-snug tracking-tight text-text">{row.headline}</p>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary/70">{row.detail}</p>
            </div>
            <time className="shrink-0 text-right text-[11px] font-medium tabular-nums text-muted/75">{row.timeLabel}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
