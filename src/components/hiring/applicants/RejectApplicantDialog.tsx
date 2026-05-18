"use client";

import { useState } from "react";
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
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { rejectCandidate } from "@/lib/hiring/candidateProfile";
import type { HiringCandidate } from "@/lib/hiring/types";

export function RejectApplicantDialog({
  open,
  onOpenChange,
  candidate,
  onRejected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate;
  onRejected?: (candidate: HiringCandidate) => void;
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setReason("");
      setNote("");
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleReject = () => {
    setSubmitting(true);
    const updated = rejectCandidate(candidate.id, reason.trim() || undefined, note.trim() || undefined);
    setSubmitting(false);
    if (!updated) {
      toast.error("Could not reject applicant");
      return;
    }
    toast.success("Applicant rejected");
    onRejected?.(updated);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent overlayClassName="z-[220]" className="z-[220] max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
          <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Reject applicant?</DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed">
            Are you sure you want to reject <span className="font-medium text-text">{candidate.name}</span>? This
            action will move the candidate to Rejected for this job.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <FormField label="Rejection reason (optional)" htmlFor="reject-reason">
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Does not meet role requirements"
              className="min-h-[72px] resize-y text-[13px]"
            />
          </FormField>
          <FormField label="Internal note (optional)" htmlFor="reject-note">
            <Textarea
              id="reject-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Visible to hiring team only"
              className="min-h-[72px] resize-y text-[13px]"
            />
          </FormField>
        </div>

        <DialogFooter className="border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={handleReject}
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/30"
          >
            {submitting ? "Rejecting…" : "Reject applicant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
