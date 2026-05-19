"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringTransition } from "./hiringTokens";
import {
  HIRING_HERO_METRICS_COLLAPSED_KEY,
  useHeroMetricsCollapsed,
} from "./useHeroMetricsCollapsed";

const metricsToggleClass = cn(
  "inline-flex h-7 items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.08] px-3",
  "text-[11px] font-medium text-white/72 backdrop-blur-sm",
  hiringTransition,
  "hover:border-white/[0.22] hover:bg-white/[0.12] hover:text-white/90",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
);

export function HeroMetricsCollapsible({
  id,
  children,
  gridClassName,
  withBorder = true,
  storageKey = HIRING_HERO_METRICS_COLLAPSED_KEY,
}: {
  id: string;
  children: React.ReactNode;
  gridClassName?: string;
  withBorder?: boolean;
  storageKey?: string;
}) {
  const { collapsed, toggle, hydrated } = useHeroMetricsCollapsed(storageKey);

  return (
    <div className={cn(withBorder && "border-t border-white/[0.1] pt-3")}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggle}
          className={metricsToggleClass}
          aria-expanded={hydrated ? !collapsed : true}
          aria-controls={id}
        >
          {collapsed ? (
            <>
              Show metrics
              <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={2} aria-hidden />
            </>
          ) : (
            <>
              Hide metrics
              <ChevronUp className="h-3.5 w-3.5 opacity-70" strokeWidth={2} aria-hidden />
            </>
          )}
        </button>
      </div>

      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          collapsed && hydrated ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul
            className={cn(
              gridClassName,
              "transition-[transform,opacity] duration-200 ease-out",
              collapsed && hydrated ? "-translate-y-1 opacity-0" : "translate-y-0 opacity-100",
            )}
          >
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
}
