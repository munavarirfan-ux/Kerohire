"use client";

import { useRef } from "react";
import { addedByFromPreviewRole } from "@/lib/hiring/stages";
import { useRole } from "@/context/RoleContext";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { CandidateFormDialog } from "./CandidateFormDialog";

export function AddCandidateDialog({
  open,
  onOpenChange,
  job,
  onAdded,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: HiringJob;
  onAdded?: (candidate: HiringCandidate) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const { selectedRole } = useRole();
  const addedBy = addedByFromPreviewRole(selectedRole);
  const fallbackFocusRef = useRef<HTMLButtonElement>(null);

  return (
    <CandidateFormDialog
      mode="create"
      open={open}
      onOpenChange={onOpenChange}
      job={job}
      addedBy={addedBy}
      onSaved={onAdded}
      returnFocusRef={returnFocusRef ?? fallbackFocusRef}
    />
  );
}
