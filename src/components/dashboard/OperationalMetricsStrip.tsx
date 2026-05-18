"use client";

import type { KpiDef } from "@/features/dashboard/data/dashboard.mock";

/** Compact inline operational metrics — no card chrome */
export function OperationalMetricsStrip({ items, max = 5 }: { items: KpiDef[]; max?: number }) {
  const metrics = items.slice(0, max);
  if (metrics.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-baseline gap-x-1 gap-y-1 text-[13px] sm:gap-x-0"
      aria-label="Operational metrics"
    >
      {metrics.map((m, i) => (
        <span key={m.id} className="inline-flex items-baseline">
          {i > 0 ? (
            <span className="mx-2.5 hidden text-muted/35 sm:inline" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="inline-flex flex-wrap items-baseline gap-1 sm:gap-1.5">
            <span className="font-semibold tabular-nums tracking-[-0.03em] text-text">{m.value}</span>
            <span className="text-muted/70">{m.label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
