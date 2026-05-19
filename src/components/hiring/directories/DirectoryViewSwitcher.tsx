"use client";

import { LayoutGrid, LayoutList, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringTransition } from "../hiringTokens";

export type DirectoryViewMode = "list" | "grid" | "kanban";

const ICONS = {
  list: LayoutList,
  grid: LayoutGrid,
  kanban: Columns3,
} as const;

export function DirectoryViewSwitcher<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: keyof typeof ICONS }[];
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className={cn(
        "inline-flex rounded-[11px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] p-0.5",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-white/[0.06] dark:bg-white/[0.03]",
        className,
      )}
    >
      {options.map((opt) => {
        const Icon = opt.icon ? ICONS[opt.icon] : null;
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-[8px] px-2.5 text-[11px] font-medium",
              hiringTransition,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/25",
              selected
                ? "bg-white text-text shadow-sm dark:bg-surface"
                : "text-text-secondary/70 hover:text-text",
            )}
          >
            {Icon ? <Icon className="h-3.5 w-3.5 opacity-70" strokeWidth={1.75} /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
