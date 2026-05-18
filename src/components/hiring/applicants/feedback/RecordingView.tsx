"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewerFeedbackData } from "@/lib/hiring/interviewFeedback";
import { MetaRow, SidebarCard } from "./FeedbackUi";
import { dashboardPanel } from "@/components/dashboard/dashboardTokens";

export function RecordingView({ recording }: { recording: InterviewerFeedbackData["recording"] }) {
  return (
    <SidebarCard title="Interview recording">
      {recording.url ? (
        <video src={recording.url} controls className="aspect-video w-full rounded-xl bg-[#18181B]" />
      ) : (
        <div
          className={cn(
            dashboardPanel,
            "flex aspect-video flex-col items-center justify-center gap-3 rounded-xl text-center",
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(15,23,42,0.08)] bg-white shadow-sm">
            <Play className="h-6 w-6 text-[#71717A]" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="text-[14px] font-medium text-[#18181B]">No recording uploaded yet</p>
          <p className="max-w-xs text-[12px] text-[#71717A]">
            Recording will appear here after the session is uploaded.
          </p>
        </div>
      )}
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:max-w-md">
        <MetaRow label="Duration" value={recording.duration} />
        <MetaRow label="Uploaded" value={recording.uploadedAt} />
      </dl>
    </SidebarCard>
  );
}
