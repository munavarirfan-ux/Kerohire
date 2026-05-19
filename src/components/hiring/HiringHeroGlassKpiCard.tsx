"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringHeroGlassKpi } from "./hiringTokens";

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

export function HiringHeroGlassKpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  compact = false,
  padValue = false,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  compact?: boolean;
  padValue?: boolean;
}) {
  const displayValue = padValue ? String(value).padStart(2, "0") : value;

  return (
    <li
      className={cn(
        hiringHeroGlassKpi,
        compact
          ? "min-h-[112px] !rounded-[16px] !p-3 sm:!p-3.5"
          : "min-h-[128px]",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute rounded-full bg-white/[0.06] opacity-60 transition-opacity duration-[180ms] ease-out group-hover/kpi:opacity-100",
          compact ? "-right-5 -top-5 h-16 w-16 blur-2xl" : "-right-6 -top-6 h-20 w-20 blur-2xl",
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[12px] border border-white/[0.16] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
            compact ? "h-9 w-9 rounded-[10px]" : "h-10 w-10",
          )}
        >
          <Icon
            className={cn("text-white/90", compact ? "h-4 w-4" : "h-[18px] w-[18px]")}
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <Sparkline />
      </div>
      <p
        className={cn(
          "relative font-semibold tabular-nums leading-none tracking-[-0.04em] text-white",
          compact
            ? "mt-3 text-[1.75rem]"
            : "mt-5 text-[2.25rem] sm:text-[2.375rem]",
        )}
      >
        {displayValue}
      </p>
      <p
        className={cn(
          "relative font-semibold tracking-[-0.01em] text-white/90",
          compact ? "mt-2 text-[11px]" : "mt-3 text-[12px]",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "relative leading-snug text-white/55",
          compact ? "mt-0.5 text-[10px]" : "mt-1 text-[11px]",
        )}
      >
        {subtitle}
      </p>
    </li>
  );
}
