"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllJobs, getHiringOverviewStats } from "@/lib/hiring/mockData";
import {
  applyJobsFilters,
  countJobsByStatusTab,
  filterJobsByStatusTab,
  sortJobsList,
  type JobsSortKey,
  type JobsStatusTab,
} from "@/lib/hiring/jobDirectoryFilters";
import { AddJobDialog } from "./AddJobDialog";
import { JobsOperationalHero } from "./JobsOperationalHero";
import { EMPTY_JOBS_FILTERS, type JobsFilterState } from "./JobsFiltersPopover";
import {
  JobDirectoryGridView,
  JobDirectoryListView,
  JOBS_PAGE_SIZE,
} from "./jobs/JobDirectoryViews";
import { JobsDirectoryToolbar } from "./jobs/JobsDirectoryToolbar";
import { hiringCanvas, hiringCard, hiringTransition } from "./hiringTokens";

export function JobsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addJobButtonRef = useRef<HTMLButtonElement>(null);
  const emptyAddJobButtonRef = useRef<HTMLButtonElement>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [addJobReturnSource, setAddJobReturnSource] = useState<"hero" | "empty">("hero");
  const [statusTab, setStatusTab] = useState<JobsStatusTab>("all");
  const [filters, setFilters] = useState<JobsFilterState>(EMPTY_JOBS_FILTERS);
  const [sort, setSort] = useState<JobsSortKey>("updated");
  const [view, setView] = useState<"list" | "grid">("grid");
  const [page, setPage] = useState(1);
  const [jobsRefresh, setJobsRefresh] = useState(0);

  const allJobs = useMemo(() => getAllJobs(), [jobsRefresh]);
  const statusCounts = useMemo(() => countJobsByStatusTab(allJobs), [allJobs]);

  useEffect(() => {
    if (searchParams.get("addJob") === "1") {
      setAddJobOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [statusTab, filters, sort, view]);

  function handleAddJobOpenChange(open: boolean) {
    setAddJobOpen(open);
    if (!open && searchParams.get("addJob") === "1") {
      router.replace("/hiring/jobs", { scroll: false });
    }
  }

  const filtered = useMemo(() => {
    const byTab = filterJobsByStatusTab(allJobs, statusTab);
    const byFilters = applyJobsFilters(byTab, filters);
    return sortJobsList(byFilters, sort);
  }, [allJobs, statusTab, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * JOBS_PAGE_SIZE;
    return filtered.slice(start, start + JOBS_PAGE_SIZE);
  }, [filtered, page]);

  const overviewStats = useMemo(() => getHiringOverviewStats(filtered), [filtered]);

  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(15,61,46,0.04),transparent)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-8%,rgba(167,243,208,0.035),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-shell space-y-5 pb-12">
        <JobsOperationalHero
          stats={overviewStats}
          onAddJob={() => {
            setAddJobReturnSource("hero");
            setAddJobOpen(true);
          }}
          addJobButtonRef={addJobButtonRef}
        />

        <JobsDirectoryToolbar
          statusTab={statusTab}
          onStatusTabChange={setStatusTab}
          statusCounts={statusCounts}
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />

        <section>
          {filtered.length > 0 ? (
            view === "list" ? (
              <JobDirectoryListView
                jobs={paginatedJobs}
                totalCount={filtered.length}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            ) : (
              <JobDirectoryGridView
                jobs={paginatedJobs}
                totalCount={filtered.length}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )
          ) : (
            <div
              className={cn(
                hiringCard,
                "flex flex-col items-center justify-center border-dashed px-6 py-16 text-center",
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)]">
                <Briefcase className="h-5 w-5 text-muted/50" strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-sm font-semibold tracking-tight text-text">No jobs match</p>
              <p className="mt-1 max-w-sm text-[12px] text-text-secondary/65">
                Try another status tab or adjust filters.
              </p>
              <Button
                ref={emptyAddJobButtonRef}
                type="button"
                size="sm"
                className={cn("mt-5 rounded-[11px]", hiringTransition)}
                onClick={() => {
                  setAddJobReturnSource("empty");
                  setAddJobOpen(true);
                }}
              >
                Add New Job
              </Button>
            </div>
          )}
        </section>
      </div>

      <AddJobDialog
        open={addJobOpen}
        onOpenChange={handleAddJobOpenChange}
        onCreated={() => setJobsRefresh((n) => n + 1)}
        returnFocusRef={addJobReturnSource === "hero" ? addJobButtonRef : emptyAddJobButtonRef}
      />
    </div>
  );
}
