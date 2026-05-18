"use client";

import { useId, useMemo, useState } from "react";
import { Circle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  FeedbackNoteEntry,
  FeedbackNotePhase,
  InterviewSessionStatus,
} from "@/lib/hiring/interviewFeedback";
import { cn } from "@/lib/utils";

const PAD_LINE = 28;
const padLinesStyle = {
  backgroundImage: `repeating-linear-gradient(
    transparent,
    transparent ${PAD_LINE - 1}px,
    rgba(120, 113, 108, 0.14) ${PAD_LINE - 1}px,
    rgba(120, 113, 108, 0.14) ${PAD_LINE}px
  )`,
  backgroundSize: `100% ${PAD_LINE}px`,
} as const;

/** Read-only notepad — your writing as one continuous sheet, not a feed. */
function NotePadSheet({
  label,
  notes,
  emptyHint,
  className,
}: {
  label: string;
  notes: FeedbackNoteEntry[];
  emptyHint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div
        className="relative min-h-[180px] border border-[#E7E5E4] bg-[#FFFEF9] dark:border-white/[0.08] dark:bg-[#1A1814]"
        style={padLinesStyle}
      >
        <span
          className="pointer-events-none absolute bottom-0 left-[52px] top-0 w-px bg-[#F87171]/35 dark:bg-red-400/20"
          aria-hidden
        />
        <div className="relative border-b border-[#E7E5E4]/80 bg-[#FAF8F2]/90 px-5 py-2.5 dark:border-white/[0.06] dark:bg-[#141210]/90">
          <p className="text-[11px] font-medium tracking-wide text-[#A8A29E] dark:text-text-muted">
            {label}
          </p>
        </div>

        <div className="relative px-5 pb-6 pt-4 pl-[68px]">
          {notes.length === 0 ? (
            <p className="text-[14px] leading-7 text-[#A8A29E] italic dark:text-text-muted">
              {emptyHint ?? "Nothing written yet."}
            </p>
          ) : (
            <div className="text-[14px] leading-7 text-[#44403C] dark:text-[#E7E5E4]">
              {notes.map((note, index) => (
                <div key={note.id} className={index > 0 ? "mt-6" : undefined}>
                  <p className="whitespace-pre-wrap">{note.body}</p>
                  <time className="mt-1 block text-right text-[10px] tabular-nums text-[#C4B5A5] dark:text-[#78716C]">
                    {note.at}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PadWriter({
  inputId,
  placeholder,
  submitLabel,
  onSubmit,
}: {
  inputId: string;
  placeholder: string;
  submitLabel: string;
  onSubmit: (body: string) => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="overflow-hidden rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div
        className="relative min-h-[140px] border border-[#E7E5E4] bg-[#FFFEF9] dark:border-white/[0.08] dark:bg-[#1A1814]"
        style={padLinesStyle}
      >
        <span
          className="pointer-events-none absolute bottom-0 left-[52px] top-0 w-px bg-[#F87171]/35 dark:bg-red-400/20"
          aria-hidden
        />
        <div className="relative px-5 pb-3 pt-4 pl-[68px]">
          <label htmlFor={inputId} className="sr-only">
            Write on notepad
          </label>
          <textarea
            id={inputId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder={placeholder}
            className="w-full resize-none border-0 bg-transparent p-0 text-[14px] leading-7 text-[#44403C] placeholder:text-[#C4B5A5] placeholder:italic focus-visible:outline-none dark:text-[#E7E5E4] dark:placeholder:text-[#78716C]"
            style={{ minHeight: PAD_LINE * 4 }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && draft.trim()) {
                e.preventDefault();
                onSubmit(draft.trim());
                setDraft("");
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#E7E5E4]/80 bg-[#FAF8F2]/80 px-5 py-2 dark:border-white/[0.06] dark:bg-[#141210]/80">
          <span className="text-[10px] text-[#A8A29E]">⌘ + Enter to add</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 rounded-[8px] border-[#D6D3D1] bg-white px-2.5 text-[11px] text-[#57534E] hover:bg-[#FAFAF9] dark:border-white/[0.1] dark:bg-transparent dark:text-text"
            disabled={!draft.trim()}
            onClick={() => {
              onSubmit(draft.trim());
              setDraft("");
            }}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NotesTimeline({
  notes,
  sessionStatus,
  readOnly,
  onAdd,
  onSessionStatusChange,
}: {
  notes: FeedbackNoteEntry[];
  sessionStatus: InterviewSessionStatus;
  readOnly?: boolean;
  onAdd: (body: string, phase: FeedbackNotePhase) => void;
  onSessionStatusChange?: (status: InterviewSessionStatus) => void;
}) {
  const livePadId = useId();
  const afterPadId = useId();
  const duringNotes = useMemo(() => notes.filter((n) => n.phase === "during"), [notes]);
  const afterNotes = useMemo(() => notes.filter((n) => n.phase === "after"), [notes]);
  const inProgress = sessionStatus === "in_progress";
  const completed = sessionStatus === "completed";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {sessionStatus === "scheduled" && !readOnly ? (
        <div className="rounded-[10px] border border-dashed border-[#D6D3D1] bg-[#FAFAF9] px-5 py-6 text-center dark:border-white/[0.1] dark:bg-white/[0.02]">
          <p className="text-[13px] leading-relaxed text-[#57534E] dark:text-text-muted">
            Start the interview to open your notepad. Everything you write during the call
            appears here when you&apos;re done.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-4 h-8 gap-1.5 rounded-[9px] px-3 text-[12px]"
            onClick={() => onSessionStatusChange?.("in_progress")}
          >
            <Play className="h-3.5 w-3.5" aria-hidden />
            Start interview
          </Button>
        </div>
      ) : null}

      {inProgress && !readOnly ? (
        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <Circle className="relative h-2 w-2 fill-emerald-500 text-emerald-500" aria-hidden />
            </span>
            <span className="text-[12px] font-medium text-[#57534E] dark:text-text-muted">
              Interview in progress
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-[8px] px-2 text-[11px] text-[#78716C] hover:text-[#44403C]"
            onClick={() => onSessionStatusChange?.("completed")}
          >
            End interview
          </Button>
        </div>
      ) : null}

      {sessionStatus !== "scheduled" ? (
        <>
          {inProgress && !readOnly ? (
            <PadWriter
              inputId={livePadId}
              placeholder="Write as you go — observations, questions, impressions…"
              submitLabel="Add to pad"
              onSubmit={(body) => onAdd(body, "during")}
            />
          ) : null}

          {duringNotes.length > 0 ? (
            <NotePadSheet
              label="My interview notes"
              notes={duringNotes}
              className={inProgress && !readOnly ? "mt-4" : undefined}
            />
          ) : null}
        </>
      ) : null}

      {afterNotes.length > 0 || (completed && !readOnly) ? (
        <div className="space-y-3">
          {afterNotes.length > 0 ? (
            <NotePadSheet label="Reflections" notes={afterNotes} />
          ) : null}
          {completed && !readOnly ? (
            <PadWriter
              inputId={afterPadId}
              placeholder="Reflections after the call — follow-ups, overall impression…"
              submitLabel="Add reflection"
              onSubmit={(body) => onAdd(body, "after")}
            />
          ) : null}
        </div>
      ) : null}

      {notes.length === 0 && sessionStatus === "scheduled" && readOnly ? (
        <NotePadSheet label="Interview notepad" notes={[]} emptyHint="No notes yet." />
      ) : null}
    </div>
  );
}
