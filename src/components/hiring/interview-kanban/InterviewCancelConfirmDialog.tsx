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

export function InterviewCancelConfirmDialog({
  open,
  onOpenChange,
  candidate,
  roundTitle,
  onConfirm,
  confirming,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  roundTitle: string;
  onConfirm: () => void;
  confirming?: boolean;
}) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayClassName="z-[270]" className="z-[270] max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
          <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
            Cancel interview?
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed">
            Cancel the scheduled interview for{" "}
            <span className="font-medium text-text">{candidate.name}</span> ({roundTitle})? Panel
            members will be notified.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={confirming}>
            Keep interview
          </Button>
          <Button
            type="button"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? "Cancelling…" : "Cancel interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
