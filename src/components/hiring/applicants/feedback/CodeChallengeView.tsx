"use client";

import { cn } from "@/lib/utils";
import type { InterviewerFeedbackData } from "@/lib/hiring/interviewFeedback";
import { SidebarCard } from "./FeedbackUi";
import { dashboardPanel } from "@/components/dashboard/dashboardTokens";

export function CodeChallengeView({ data }: { data: InterviewerFeedbackData["codeChallenge"] }) {
  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-2">
      <SidebarCard title="Question" className="min-h-[320px]">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#3F3F46]">{data.question}</p>
      </SidebarCard>

      <SidebarCard title="Submission" className="min-h-[320px]">
        <pre
          className={cn(
            dashboardPanel,
            "max-h-[min(480px,55vh)] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-[#3F3F46]",
          )}
        >
          {data.code}
        </pre>
      </SidebarCard>
    </div>
  );
}
