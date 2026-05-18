"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Users,
  Mic2,
  Percent,
  Inbox,
  Check,
  Calendar,
  ClipboardList,
  Flag,
  Layers,
  Archive,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiDef } from "@/features/dashboard/data/dashboard.mock";
import { dashboardKpiCard, dashboardKpiIcon, dashboardLabel } from "./dashboardTokens";

const iconMap: Record<KpiDef["icon"], LucideIcon> = {
  briefcase: Briefcase,
  users: Users,
  mic: Mic2,
  percent: Percent,
  inbox: Inbox,
  check: Check,
  calendar: Calendar,
  clipboard: ClipboardList,
  flag: Flag,
  layers: Layers,
  archive: Archive,
  shield: Shield,
};

function TrendBadge({ trend, trendUp }: { trend: string; trendUp?: boolean }) {
  const positive = trendUp === true;
  const negative = trendUp === false;
  const Icon = negative ? ArrowDownRight : ArrowUpRight;

  return (
    <span
      className={cn(
        "inline-flex max-w-[9rem] items-center gap-0.5 truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
        positive && "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
        negative && "bg-red-500/10 text-red-700 dark:text-red-400",
        !positive && !negative && "bg-[rgba(15,23,42,0.04)] text-[#52525B] dark:text-muted",
      )}
    >
      {(positive || negative) && <Icon className="h-3 w-3 shrink-0" strokeWidth={2} />}
      <span className="truncate">{trend}</span>
    </span>
  );
}

function KpiCard({ k }: { k: KpiDef }) {
  const Icon = iconMap[k.icon];

  return (
    <article className={dashboardKpiCard}>
      <div className={dashboardKpiIcon}>
        <Icon className="h-[18px] w-[18px] text-accent-deep dark:text-accent-200" strokeWidth={1.75} />
      </div>

      <p className={cn(dashboardLabel, "mt-3")}>{k.label}</p>
      <p className="mt-1 text-[1.75rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-[#18181B] dark:text-text">
        {k.value}
      </p>
      <p className="mt-1.5 text-[12px] font-medium leading-snug text-[#3F3F46] dark:text-text-secondary/90">
        {k.subtitle}
      </p>
      {k.trend ? (
        <p className="mt-2">
          <TrendBadge trend={k.trend} trendUp={k.trendUp} />
        </p>
      ) : null}
    </article>
  );
}

export function KpiStrip({ items }: { items: KpiDef[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((k) => (
        <KpiCard key={k.id} k={k} />
      ))}
    </div>
  );
}
