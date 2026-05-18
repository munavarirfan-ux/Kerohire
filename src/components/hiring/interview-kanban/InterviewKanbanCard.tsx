"use client";

import { useRef } from "react";
import { Calendar, ChevronDown, GripVertical, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  hasScheduledInterviewActions,
  type InterviewCardAction,
  type InterviewKanbanCardModel,
} from "@/lib/hiring/interviewKanbanOps";
import { cn } from "@/lib/utils";
import { InterviewStatusChip } from "./InterviewStatusChip";

const ACTION_LABELS = {
  schedule: "Schedule Interview",
  view: "View Schedule",
  reschedule: "Reschedule",
  cancel: "Cancel interview",
} as const;

const viewScheduleBtnClass =
  "border-blue-200/90 bg-blue-50 text-blue-800 hover:bg-blue-100/90 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/15";

const menuItemClass =
  "flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12px] font-medium outline-none";

const feedbackToneClass = {
  neutral: "text-[#71717A] dark:text-muted",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-700 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
} as const;

function ScheduledInterviewActionSplit({
  onView,
  onReschedule,
  onCancel,
}: {
  onView: (e: React.MouseEvent) => void;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex w-full pt-0.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onView}
        className={cn(
          "inline-flex h-8 min-w-0 flex-1 items-center justify-center rounded-l-[9px] border px-2 text-[11px] font-semibold",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
          viewScheduleBtnClass,
        )}
      >
        {ACTION_LABELS.view}
      </button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="More interview actions"
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-r-[9px] border border-l-[rgba(59,130,246,0.2)]",
              "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
              viewScheduleBtnClass,
            )}
          >
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[210] w-44 rounded-[10px] p-1">
          <DropdownMenuItem
            className={cn(menuItemClass, "text-amber-800 focus:bg-amber-50 dark:text-amber-300 dark:focus:bg-amber-500/10")}
            onSelect={onReschedule}
          >
            {ACTION_LABELS.reschedule}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(menuItemClass, "text-red-700 focus:bg-red-50 dark:text-red-300 dark:focus:bg-red-500/10")}
            onSelect={onCancel}
          >
            {ACTION_LABELS.cancel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function InterviewKanbanCard({
  model,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
  onAction,
}: {
  model: InterviewKanbanCardModel;
  draggable: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
  onAction?: (model: InterviewKanbanCardModel, action: InterviewCardAction) => void;
}) {
  const { candidate, status, roundTitle, schedulePreview, leadInterviewer, feedbackLabel, feedbackTone } =
    model;
  const suppressClickRef = useRef(false);
  const showScheduledActions = hasScheduledInterviewActions(status);

  function triggerAction(action: InterviewCardAction) {
    if (onAction) {
      onAction(model, action);
      return;
    }
    toast.message(ACTION_LABELS[action], { description: `${candidate.name} · ${roundTitle}` });
  }

  function handleAction(e: React.MouseEvent, action: InterviewCardAction) {
    e.stopPropagation();
    triggerAction(action);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/candidate-id", candidate.id);
        e.dataTransfer.effectAllowed = "move";
        suppressClickRef.current = true;
        onDragStart();
      }}
      onDragEnd={() => {
        onDragEnd();
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) return;
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative rounded-[12px] border border-[rgba(15,23,42,0.07)] bg-white/90 p-3 text-left backdrop-blur-sm",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_-10px_rgba(15,23,42,0.1)]",
        "transition-[border-color,box-shadow,transform] duration-200 ease-out",
        "hover:-translate-y-px hover:border-[rgb(var(--accent-rgb)/0.18)]",
        "hover:shadow-[0_2px_8px_rgba(15,23,42,0.05),0_16px_32px_-12px_rgba(15,23,42,0.12),0_0_0_1px_rgb(var(--accent-rgb)/0.06)]",
        "dark:border-white/[0.08] dark:bg-[rgb(var(--surface-rgb)/0.92)]",
        "dark:hover:border-[rgb(var(--accent-rgb)/0.22)]",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging &&
          "z-10 scale-[1.01] border-[rgb(var(--accent-rgb)/0.25)] opacity-95 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.2),0_0_0_2px_rgb(var(--accent-rgb)/0.12)]",
      )}
      aria-label={`${candidate.name}, ${status}, ${roundTitle}`}
    >
      <div className="flex items-start gap-2">
        {draggable ? (
          <GripVertical
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-70"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-text">
                {candidate.name}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">{candidate.source}</p>
            </div>
            <InterviewStatusChip status={status} />
          </div>

          <p className="line-clamp-1 text-[11px] leading-snug text-text-secondary/80">
            {candidate.experience}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-[#F4F4F5] px-1.5 py-0.5 text-[10px] font-medium text-[#52525B] dark:bg-white/[0.06] dark:text-text-muted">
              {roundTitle}
            </span>
          </div>

          {status === "Ongoing" ? (
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-violet-700 dark:text-violet-300">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              Ongoing now
            </p>
          ) : null}

          {schedulePreview && status !== "Pending" ? (
            <div className="rounded-[9px] border border-[rgba(15,23,42,0.05)] bg-[#FAFAFB]/90 px-2 py-1.5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <p className="flex items-center gap-1 text-[10px] font-medium text-[#52525B] dark:text-text-secondary">
                <Calendar className="h-3 w-3 shrink-0 opacity-70" strokeWidth={1.5} aria-hidden />
                <span className="line-clamp-2">{schedulePreview}</span>
              </p>
            </div>
          ) : null}

          {leadInterviewer ? (
            <p className="flex items-center gap-1 text-[10px] text-[#71717A] dark:text-muted">
              <UserRound className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />
              {leadInterviewer}
            </p>
          ) : null}

          <p className="text-[10px]">
            <span className="text-muted">Feedback: </span>
            <span className={cn("font-medium", feedbackToneClass[feedbackTone])}>{feedbackLabel}</span>
          </p>

          {candidate.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="rounded bg-muted/15 px-1.5 py-0.5 text-[10px] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}

          {showScheduledActions ? (
            <ScheduledInterviewActionSplit
              onView={(e) => handleAction(e, "view")}
              onReschedule={() => triggerAction("reschedule")}
              onCancel={() => triggerAction("cancel")}
            />
          ) : (
            <Button
              type="button"
              size="sm"
              variant={model.primaryAction === "schedule" ? "default" : "outline"}
              className={cn(
                "h-8 w-full rounded-[9px] text-[11px] font-medium",
                model.primaryAction === "schedule" && "bg-forest text-white hover:bg-forest/90",
              )}
              onClick={(e) => handleAction(e, model.primaryAction)}
            >
              {ACTION_LABELS[model.primaryAction]}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
