"use client";

import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { CandidateFormDialog } from "./CandidateFormDialog";

export function EditCandidateDialog({
  open,
  onOpenChange,
  candidate,
  job,
  onSaved,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate;
  job: HiringJob;
  onSaved?: (candidate: HiringCandidate) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <CandidateFormDialog
      mode="edit"
      open={open}
      onOpenChange={onOpenChange}
      job={job}
      candidate={candidate}
      onSaved={onSaved}
      returnFocusRef={returnFocusRef}
    />
  );
}
