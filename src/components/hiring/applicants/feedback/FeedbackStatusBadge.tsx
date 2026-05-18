"use client";

import { cn } from "@/lib/utils";
import {
  resolveWorkflowStatus,
  WORKFLOW_STATUS_LABELS,
  isFeedbackOverdue,
  type InterviewFeedbackBundle,
} from "@/lib/hiring/interviewFeedback";

const styles: Record<string, string> = {
  not_requested: "border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] text-[#52525B]",
  requested: "border-blue-200/80 bg-blue-50/80 text-blue-900",
  in_progress: "border-violet-200/80 bg-violet-50/80 text-violet-900",
  submitted: "border-emerald-200/80 bg-emerald-50/80 text-emerald-900",
  overdue: "border-red-200/80 bg-red-50/80 text-red-800",
};

export function FeedbackStatusBadge({ bundle }: { bundle: InterviewFeedbackBundle }) {
  const status = resolveWorkflowStatus(bundle);
  const overdue = isFeedbackOverdue(bundle);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
          styles[status],
        )}
      >
        {WORKFLOW_STATUS_LABELS[status]}
      </span>
      {overdue ? (
        <span className="inline-flex rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-900">
          Overdue feedback
        </span>
      ) : null}
    </div>
  );
}
