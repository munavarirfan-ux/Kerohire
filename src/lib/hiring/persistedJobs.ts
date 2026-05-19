import type { HiringJob } from "./types";

const CREATED_JOBS_KEY = "kerohire-created-jobs";

export function persistCreatedJob(job: HiringJob): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CREATED_JOBS_KEY);
    const list: HiringJob[] = raw ? JSON.parse(raw) : [];
    const next = [job, ...list.filter((j) => j.id !== job.id)];
    localStorage.setItem(CREATED_JOBS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function mergePersistedJobs(jobs: HiringJob[]): HiringJob[] {
  if (typeof window === "undefined") return jobs;
  try {
    const raw = localStorage.getItem(CREATED_JOBS_KEY);
    if (!raw) return jobs;
    const extra = JSON.parse(raw) as HiringJob[];
    const ids = new Set(jobs.map((j) => j.id));
    return [...jobs, ...extra.filter((j) => !ids.has(j.id))];
  } catch {
    return jobs;
  }
}
