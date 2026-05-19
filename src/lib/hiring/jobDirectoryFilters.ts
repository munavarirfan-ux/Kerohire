import type { HiringJob, JobStatus } from "@/lib/hiring/types";
import type { JobsFilterState } from "@/components/hiring/JobsFiltersPopover";

export type JobsStatusTab =
  | "all"
  | "published"
  | "internal"
  | "draft"
  | "paused"
  | "closed"
  | "deleted";

export const JOBS_STATUS_TABS: { id: JobsStatusTab; label: string }[] = [
  { id: "all", label: "All active" },
  { id: "published", label: "Published" },
  { id: "internal", label: "Internal" },
  { id: "draft", label: "Drafts" },
  { id: "paused", label: "Paused" },
  { id: "closed", label: "Closed" },
  { id: "deleted", label: "Deleted" },
];

const TAB_STATUSES: Record<Exclude<JobsStatusTab, "all">, JobStatus[]> = {
  published: ["Published"],
  internal: ["Internal", "External"],
  draft: ["Draft"],
  paused: ["On Hold"],
  closed: ["Closed"],
  deleted: ["Deleted"],
};

export function filterJobsByStatusTab(jobs: HiringJob[], tab: JobsStatusTab): HiringJob[] {
  if (tab === "all") {
    return jobs.filter((j) => j.status !== "Deleted");
  }
  const allowed = TAB_STATUSES[tab];
  return jobs.filter((j) => allowed.includes(j.status));
}

export function applyJobsFilters(jobs: HiringJob[], filters: JobsFilterState): HiringJob[] {
  let list = [...jobs];
  if (filters.department) list = list.filter((j) => j.department === filters.department);
  if (filters.location) list = list.filter((j) => j.location === filters.location);
  if (filters.status) list = list.filter((j) => j.status === filters.status);
  if (filters.workMode) list = list.filter((j) => j.workMode === filters.workMode);
  if (filters.employmentType) list = list.filter((j) => j.employmentType === filters.employmentType);
  if (filters.visibility) list = list.filter((j) => j.visibility === filters.visibility);
  if (filters.hiringManager) list = list.filter((j) => j.hiringManager === filters.hiringManager);
  return list;
}

export type JobsSortKey = "updated" | "candidates" | "newest" | "priority";

export function sortJobsList(list: HiringJob[], sort: JobsSortKey): HiringJob[] {
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

export function countJobsByStatusTab(jobs: HiringJob[]): Record<JobsStatusTab, number> {
  return {
    all: jobs.filter((j) => j.status !== "Deleted").length,
    published: jobs.filter((j) => j.status === "Published").length,
    internal: jobs.filter((j) => ["Internal", "External"].includes(j.status)).length,
    draft: jobs.filter((j) => j.status === "Draft").length,
    paused: jobs.filter((j) => j.status === "On Hold").length,
    closed: jobs.filter((j) => j.status === "Closed").length,
    deleted: jobs.filter((j) => j.status === "Deleted").length,
  };
}
