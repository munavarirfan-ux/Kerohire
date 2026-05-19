"use client";

import { useMemo } from "react";
import { useRole } from "@/context/RoleContext";
import { getInterviewDirectoryJobs } from "@/lib/hiring/candidateDirectory";
import { cn } from "@/lib/utils";
import { hiringCanvas, hiringCard } from "../hiringTokens";
import { DirectoryPageHeader } from "./DirectoryPageHeader";
import { InterviewDirectoryJobCard } from "./InterviewDirectoryJobCard";

export function InterviewsDirectory() {
  const { selectedRole } = useRole();
  const jobs = useMemo(() => getInterviewDirectoryJobs(selectedRole), [selectedRole]);

  return (
    <div className={hiringCanvas}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(15,61,46,0.05),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-shell space-y-8 pb-14">
        <DirectoryPageHeader
          title="Interviews"
          subtitle="View interview pipelines across all active jobs."
        />

        <div className="flex items-baseline gap-1.5">
          <span className="tabular-nums text-sm font-semibold tracking-tight text-text">{jobs.length}</span>
          <span className="text-[11px] font-medium text-muted/75">jobs with interview activity</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {jobs.map((job) => (
            <InterviewDirectoryJobCard key={job.id} job={job} />
          ))}
        </div>

        {jobs.length === 0 ? (
          <div
            className={cn(
              hiringCard,
              "border-dashed border-[rgba(15,23,42,0.06)] bg-surface/60 px-6 py-20 text-center",
            )}
          >
            <p className="text-sm font-medium tracking-tight text-text">No interview pipelines yet</p>
            <p className="mt-2 text-xs text-text-secondary/65">
              Jobs with candidates in interview stages will appear here.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
