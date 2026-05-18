"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getHiringOverviewStats, HIRING_JOBS } from "@/lib/hiring/mockData";
import type { HiringJob } from "@/lib/hiring/types";
import { AddJobDialog } from "./AddJobDialog";
import { JobCard } from "./JobCard";
import { JobsOperationalHero } from "./JobsOperationalHero";
import { EMPTY_JOBS_FILTERS, JobsFiltersPopover, type JobsFilterState } from "./JobsFiltersPopover";
import { hiringCanvas, hiringCard, hiringTransition } from "./hiringTokens";

type SortKey = "updated" | "candidates" | "newest" | "priority";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "candidates", label: "Most candidates" },
  { value: "newest", label: "Newest" },
  { value: "priority", label: "Hiring priority" },
];

function applyFilters(jobs: HiringJob[], filters: JobsFilterState): HiringJob[] {
  let list = jobs.filter((j) => j.status !== "Deleted");
  if (filters.department) list = list.filter((j) => j.department === filters.department);
  if (filters.location) list = list.filter((j) => j.location === filters.location);
  if (filters.status) list = list.filter((j) => j.status === filters.status);
  if (filters.workMode) list = list.filter((j) => j.workMode === filters.workMode);
  if (filters.employmentType) list = list.filter((j) => j.employmentType === filters.employmentType);
  if (filters.visibility) list = list.filter((j) => j.visibility === filters.visibility);
  if (filters.hiringManager) list = list.filter((j) => j.hiringManager === filters.hiringManager);
  return list;
}

function sortJobs(list: HiringJob[], sort: SortKey): HiringJob[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    if (sort === "candidates") return b.candidateCount - a.candidateCount;
    if (sort === "newest") return b.id.localeCompare(a.id);
    if (sort === "priority") {
      const p = { High: 0, Normal: 1, Low: 2 };
      return p[a.priority] - p[b.priority];
    }
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });
  return sorted;
}

export function JobsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addJobButtonRef = useRef<HTMLButtonElement>(null);
  const emptyAddJobButtonRef = useRef<HTMLButtonElement>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [addJobReturnSource, setAddJobReturnSource] = useState<"hero" | "empty">("hero");
  const [filters, setFilters] = useState<JobsFilterState>(EMPTY_JOBS_FILTERS);
  const [sort, setSort] = useState<SortKey>("updated");

  useEffect(() => {
    if (searchParams.get("addJob") === "1") {
      setAddJobOpen(true);
    }
  }, [searchParams]);

  function handleAddJobOpenChange(open: boolean) {
    setAddJobOpen(open);
    if (!open && searchParams.get("addJob") === "1") {
      router.replace("/hiring/jobs", { scroll: false });
    }
  }

  const filtered = useMemo(() => sortJobs(applyFilters(HIRING_JOBS, filters), sort), [filters, sort]);
  const overviewStats = useMemo(() => getHiringOverviewStats(filtered), [filtered]);
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Recently updated";

  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(15,61,46,0.04),transparent)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(167,243,208,0.035),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-shell space-y-8 pb-14">
        <JobsOperationalHero
          stats={overviewStats}
          onAddJob={() => {
            setAddJobReturnSource("hero");
            setAddJobOpen(true);
          }}
          addJobButtonRef={addJobButtonRef}
        />

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <JobsFiltersPopover filters={filters} onApply={setFilters} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 gap-1.5 rounded-[11px] border-[rgba(15,23,42,0.06)] px-3 text-xs font-medium shadow-none",
                  hiringTransition,
                )}
              >
                <span className="text-text-secondary/70">Sort:</span>
                <span className="text-text">{sortLabel}</span>
                <ChevronDown className="h-3 w-3 text-muted/70" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-baseline gap-1.5 pl-1">
            <span className="tabular-nums text-sm font-semibold tracking-tight text-text">{filtered.length}</span>
            <span className="text-[11px] font-medium text-muted/75">active workflows</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div
            className={cn(
              hiringCard,
              "border-dashed border-[rgba(15,23,42,0.06)] bg-surface/60 px-6 py-20 text-center",
            )}
          >
            <p className="text-sm font-medium tracking-tight text-text">No jobs match your filters</p>
            <p className="mt-2 text-xs text-text-secondary/65">Adjust filters or create a new hiring workflow.</p>
            <Button
              ref={emptyAddJobButtonRef}
              type="button"
              size="sm"
              className={cn("mt-6 rounded-[11px]", hiringTransition)}
              onClick={() => {
                setAddJobReturnSource("empty");
                setAddJobOpen(true);
              }}
            >
              Add New Job
            </Button>
          </div>
        ) : null}
      </div>

      <AddJobDialog
        open={addJobOpen}
        onOpenChange={handleAddJobOpenChange}
        returnFocusRef={addJobReturnSource === "hero" ? addJobButtonRef : emptyAddJobButtonRef}
      />
    </div>
  );
}
