"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HiringCandidate } from "@/lib/hiring/types";

export function KanbanMoveConfirmDialog({
  open,
  onOpenChange,
  candidate,
  targetColumnTitle,
  onConfirm,
  confirming,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  targetColumnTitle: string;
  onConfirm: () => void;
  confirming?: boolean;
}) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayClassName="z-[220]" className="z-[220] max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
          <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
            Move candidate?
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed">
            Are you sure you want to move{" "}
            <span className="font-medium text-text">{candidate.name}</span> to{" "}
            <span className="font-medium text-text">{targetColumnTitle}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={confirming}>
            Cancel
          </Button>
          <Button type="button" variant="default" onClick={onConfirm} disabled={confirming}>
            {confirming ? "Moving…" : "Move candidate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
