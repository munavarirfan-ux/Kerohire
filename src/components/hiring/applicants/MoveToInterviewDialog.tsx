"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { moveCandidateToInterview } from "@/lib/hiring/mockData";
import {
  getInterviewStagesForJob,
  resolveInterviewRoundForStage,
  type JobHiringStageConfig,
} from "@/lib/hiring/jobHiringStages";
import type { HiringCandidate } from "@/lib/hiring/types";

export function MoveToInterviewDialog({
  open,
  onOpenChange,
  candidate,
  jobId,
  onMoved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  jobId: string;
  onMoved?: () => void;
}) {
  const stages = useMemo(() => getInterviewStagesForJob(jobId), [jobId]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedId(stages[0]?.id ?? null);
      setSubmitting(false);
    }
  }, [open, stages]);

  const selectedStage = stages.find((s) => s.id === selectedId);

  function handleConfirm() {
    if (!candidate || !selectedStage) return;
    setSubmitting(true);
    const round = resolveInterviewRoundForStage(jobId, selectedStage);
    const result = moveCandidateToInterview(candidate.id, jobId, round);
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(`Candidate moved to ${selectedStage.stageName}.`);
    onMoved?.();
    onOpenChange(false);
  }

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="z-[220]"
        className="z-[220] flex max-h-[min(90dvh,640px)] w-[calc(100vw-2rem)] max-w-[520px] flex-col gap-0 overflow-hidden border-[rgba(15,23,42,0.06)] bg-white p-0 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.18)]"
      >
        <DialogHeader className="shrink-0 border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
          <DialogTitle className="text-[1rem] font-semibold tracking-[-0.02em] text-text">
            Move candidate to interview stage
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-text-secondary/90">
            Choose which interview stage this shortlisted candidate should move into.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB]/90 px-3.5 py-3 dark:bg-white/[0.03]">
            <dl className="space-y-2 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Candidate</dt>
                <dd className="font-semibold text-text">{candidate.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Current stage</dt>
                <dd className="text-right font-medium text-text">Screening → Shortlisted</dd>
              </div>
            </dl>
          </div>

          {stages.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-[rgba(15,23,42,0.1)] px-4 py-8 text-center">
              <p className="text-[13px] font-medium text-text">No interview stages configured for this job.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 h-9 rounded-[9px] text-[13px]"
                asChild
              >
                <Link href={`/hiring/jobs/${jobId}?tab=interviews`}>Configure hiring stages</Link>
              </Button>
            </div>
          ) : (
            <fieldset className="space-y-2">
              <legend className="text-[12px] font-medium text-text">Interview stage</legend>
              <div className="space-y-2" role="radiogroup" aria-label="Interview stage">
                {stages.map((stage) => {
                  const selected = selectedId === stage.id;
                  return (
                    <label
                      key={stage.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-colors",
                        "focus-within:ring-2 focus-within:ring-accent/25",
                        selected
                          ? "border-accent/35 bg-accent/[0.05] ring-1 ring-accent/15"
                          : "border-[rgba(15,23,42,0.08)] bg-white hover:border-[rgba(15,23,42,0.12)] hover:bg-[#FAFAFB]",
                      )}
                    >
                      <input
                        type="radio"
                        name="interview-stage"
                        value={stage.id}
                        checked={selected}
                        onChange={() => setSelectedId(stage.id)}
                        className="mt-1 h-4 w-4 shrink-0 border-[rgba(15,23,42,0.2)] text-accent focus:ring-accent/30"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-text">{stage.stageName}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
                          <span>{stage.interviewType}</span>
                          <span className="text-[#D4D4D8]">•</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                            {stage.durationMinutes} min
                          </span>
                          <span className="text-[#D4D4D8]">•</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Users className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                            {stage.interviewerNames.length} interviewer
                            {stage.interviewerNames.length === 1 ? "" : "s"}
                          </span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>

        <DialogFooter className="mt-0 shrink-0 gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-[9px]"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-9 rounded-[9px] bg-accent text-white hover:bg-[rgb(var(--accent-hover-rgb))] focus-visible:ring-accent/30"
            disabled={submitting || !selectedStage || stages.length === 0}
            onClick={handleConfirm}
          >
            {submitting ? "Moving…" : "Move to Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
