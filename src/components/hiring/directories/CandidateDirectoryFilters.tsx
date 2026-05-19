"use client";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  EMPTY_CANDIDATE_DIRECTORY_FILTERS,
  type CandidateDirectoryFilters,
} from "@/lib/hiring/candidateDirectory";
import { hiringTransition } from "../hiringTokens";
import { DirectoryViewSwitcher } from "./DirectoryViewSwitcher";

type FilterOptions = ReturnType<
  typeof import("@/lib/hiring/candidateDirectory").getCandidateDirectoryFilterOptions
>;

function FilterPill({
  label,
  value,
  options,
  onChange,
  placeholder = "All",
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const active = Boolean(value);
  const display = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium",
            hiringTransition,
            active
              ? "border-forest/20 bg-forest/[0.06] text-forest dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-[rgba(15,23,42,0.06)] bg-white/90 text-text-secondary/80 hover:text-text dark:bg-white/[0.04]",
          )}
        >
          <span className="text-text-secondary/50">{label}</span>
          <span className="max-w-[72px] truncate">{display}</span>
          <ChevronDown className="h-2.5 w-2.5 opacity-45" strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 rounded-[10px]">
        <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="">{placeholder}</DropdownMenuRadioItem>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CandidateDirectoryFiltersBar({
  filters,
  onChange,
  options,
  view,
  onViewChange,
}: {
  filters: CandidateDirectoryFilters;
  onChange: (filters: CandidateDirectoryFilters) => void;
  options: FilterOptions;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}) {
  const set = (patch: Partial<CandidateDirectoryFilters>) => onChange({ ...filters, ...patch });
  const hasFilters =
    filters.jobId ||
    filters.stage ||
    filters.source ||
    filters.owner ||
    filters.minAssessments ||
    filters.minInterviews ||
    filters.query;

  return (
    <div
      className={cn(
        "sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-[14px] border border-[rgba(15,23,42,0.06)]",
        "bg-white/90 px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm",
        "dark:border-white/[0.06] dark:bg-surface/95",
      )}
    >
      <div className="relative min-w-[180px] flex-1 sm:max-w-[240px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/50" />
        <Input
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Search candidates…"
          className="h-7 rounded-full border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] pl-8 text-[11px] shadow-none placeholder:text-text-secondary/40"
        />
      </div>

      <div className="hidden h-5 w-px bg-[rgba(15,23,42,0.08)] sm:block dark:bg-white/[0.08]" aria-hidden />

      <div className="flex flex-wrap items-center gap-1">
        <FilterPill
          label="Job"
          value={filters.jobId}
          onChange={(jobId) => set({ jobId })}
          options={options.jobs.map((j) => ({ value: j.id, label: j.title }))}
        />
        <FilterPill
          label="Stage"
          value={filters.stage}
          onChange={(stage) => set({ stage })}
          options={options.stages.map((s) => ({ value: s, label: s }))}
        />
        <FilterPill
          label="Source"
          value={filters.source}
          onChange={(source) => set({ source })}
          options={options.sources.map((s) => ({ value: s, label: s }))}
        />
        <FilterPill
          label="Owner"
          value={filters.owner}
          onChange={(owner) => set({ owner })}
          options={options.owners.map((o) => ({ value: o, label: o }))}
        />
        <FilterPill
          label="Assess."
          value={filters.minAssessments}
          onChange={(minAssessments) => set({ minAssessments })}
          options={[
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
          ]}
        />
        <FilterPill
          label="Intrv."
          value={filters.minInterviews}
          onChange={(minInterviews) => set({ minInterviews })}
          options={[
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
          ]}
        />
        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2 text-[10px] text-text-secondary/70"
            onClick={() => onChange(EMPTY_CANDIDATE_DIRECTORY_FILTERS)}
          >
            Clear
          </Button>
        ) : null}
      </div>

      <div className="ml-auto shrink-0">
        <DirectoryViewSwitcher
          value={view}
          onChange={onViewChange}
          options={[
            { value: "list", label: "List", icon: "list" },
            { value: "grid", label: "Grid", icon: "grid" },
          ]}
        />
      </div>
    </div>
  );
}
