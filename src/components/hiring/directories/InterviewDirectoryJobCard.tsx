"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Calendar, CheckCircle2, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import type { InterviewDirectoryJob } from "@/lib/hiring/candidateDirectory";
import { hiringCard, hiringTransition } from "../hiringTokens";
import { StatusBadge } from "../StatusBadge";

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-[10px] border border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.02)] px-2.5 py-2 dark:border-white/[0.05] dark:bg-white/[0.02]">
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary/65">
        <Icon className="h-3 w-3 opacity-60" strokeWidth={1.75} />
        {label}
      </div>
      <p className="mt-0.5 text-[1.125rem] font-semibold tabular-nums tracking-[-0.03em] text-text">{value}</p>
    </div>
  );
}

export function InterviewDirectoryJobCard({ job }: { job: InterviewDirectoryJob }) {
  const router = useRouter();
  const href = ROUTES.hiringJobInterview(job.id);
  const { stats } = job;

  return (
    <article
      className={cn(
        hiringCard,
        "group relative flex h-full flex-col overflow-hidden",
        hiringTransition,
        "hover:-translate-y-0.5 hover:border-[rgba(15,61,46,0.12)]",
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="space-y-1.5 pr-8">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.03em] text-text group-hover:text-forest">
              {job.title}
            </h3>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-[12px] font-medium text-text-secondary/70">
            {job.department}
            <span className="mx-1.5 text-muted/30">·</span>
            {job.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="In interview" value={stats.interviewCandidates} icon={Users} />
          <Stat label="Upcoming" value={stats.upcomingInterviews} icon={Calendar} />
          <Stat label="Feedback pending" value={stats.feedbackPending} icon={MessageSquare} />
          <Stat label="Completed" value={stats.completedInterviews} icon={CheckCircle2} />
        </div>

        {stats.rounds.length > 0 ? (
          <p className="text-[11px] text-text-secondary/65">
            <span className="font-medium text-text-secondary/85">Rounds:</span>{" "}
            {stats.rounds.join(" · ")}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]">
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-[10px] px-4 text-[12px] font-semibold"
            onClick={() => router.push(href)}
          >
            View Interviews
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </article>
  );
}
