"use client";

import { User } from "lucide-react";
import {
  averageSkillRating,
  computeFeedbackCompletion,
  deriveRatingInsights,
  getRecommendationLabel,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import {
  BenchmarkBar,
  CompletionProgress,
  MetaRow,
  RecommendationPills,
  SidebarCard,
  StarRating,
} from "./FeedbackUi";

export function EvaluationSidebar({
  data,
  onChange,
  readOnly,
}: {
  data: InterviewerFeedbackData;
  onChange: (next: InterviewerFeedbackData) => void;
  readOnly?: boolean;
}) {
  const avg = averageSkillRating(data.skills);
  const completion = computeFeedbackCompletion(data);
  const insights = deriveRatingInsights(avg, data.recommendation);

  return (
    <aside className="sticky top-0 flex w-full shrink-0 flex-col gap-2.5 self-start lg:w-[280px]">
      <SidebarCard title="Interview details">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] text-[13px] font-semibold text-[#52525B]">
            {data.interviewerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || <User className="h-4 w-4" strokeWidth={1.5} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#18181B] dark:text-text">{data.interviewerName}</p>
            <p className="text-[11px] text-[#71717A]">{data.interviewerRole}</p>
          </div>
        </div>
        <dl className="mt-3 space-y-1.5 border-t border-[rgba(15,23,42,0.06)] pt-3">
          <MetaRow label="Round" value={data.interviewRound} />
          <MetaRow label="Type" value={data.interviewType} />
          <MetaRow label="Date" value={data.interviewDate} />
          <MetaRow label="Duration" value={`${data.durationMinutes} min`} />
        </dl>
      </SidebarCard>

      <SidebarCard
        title="Overall candidate rating"
        subtitle="Calculated based on all interview skill ratings."
      >
        <div className="flex items-end justify-between gap-2">
          <p className="text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-[#18181B] dark:text-text">
            {avg > 0 ? avg.toFixed(1) : "—"}
          </p>
          <StarRating label="Overall rating" value={Math.round(avg)} readOnly size="sm" />
        </div>
        <p className="mt-2 text-[13px] font-semibold text-accent">{insights.label}</p>
        <div className="mt-2">
          <BenchmarkBar percent={insights.confidenceScore} />
        </div>
        <p className="mt-1.5 text-[11px] text-[#71717A]">Top {insights.percentile}% this quarter</p>
      </SidebarCard>

      <SidebarCard title="Hiring recommendation">
        {readOnly ? (
          <p className="text-[13px] font-medium text-[#18181B]">
            {getRecommendationLabel(data.recommendation)}
          </p>
        ) : (
          <RecommendationPills
            value={data.recommendation}
            onChange={(recommendation) => onChange({ ...data, recommendation })}
            compact
          />
        )}
      </SidebarCard>

      <SidebarCard>
        <CompletionProgress value={completion} />
      </SidebarCard>
    </aside>
  );
}
