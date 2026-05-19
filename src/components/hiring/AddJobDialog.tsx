"use client";

import { useRef } from "react";
import { NewJobFormDialog } from "./NewJobFormDialog";

export function AddJobDialog({
  open,
  onOpenChange,
  onCreated,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (jobId: string) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const fallbackFocusRef = useRef<HTMLButtonElement>(null);

  return (
    <NewJobFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onCreated={onCreated}
      returnFocusRef={returnFocusRef ?? fallbackFocusRef}
    />
  );
}
