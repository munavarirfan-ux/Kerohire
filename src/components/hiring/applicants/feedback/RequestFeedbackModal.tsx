"use client";

import { useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HiringCandidate } from "@/lib/hiring/types";
import type { InterviewerFeedbackData } from "@/lib/hiring/interviewFeedback";
import { MetaRow } from "./FeedbackUi";

export function RequestFeedbackModal({
  open,
  onOpenChange,
  candidate,
  interviewer,
  jobTitle,
  onSend,
  sending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate;
  interviewer: InterviewerFeedbackData;
  jobTitle: string;
  onSend: (input: { message: string; sendEmail: boolean }) => void;
  sending?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  const handleSend = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSend({ message, sendEmail });
    setMessage("");
    setSendEmail(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="z-[251] max-w-md"
        overlayClassName="z-[250] bg-[rgba(15,23,42,0.55)] backdrop-blur-[4px]"
      >
        <DialogHeader>
          <DialogTitle>Request feedback from interviewers?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-left text-[13px] text-text-secondary/80">
              <p>This will:</p>
              <ul className="list-inside list-disc space-y-0.5 pl-0.5">
                <li>Trigger in-app notifications</li>
                <li>Send reminder emails to assigned interviewers</li>
                <li>Create pending interviewer tasks</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <dl className="space-y-2 rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FCFCFD] p-3.5">
          <MetaRow label="Interviewer" value={interviewer.interviewerName} />
          <MetaRow label="Round" value={interviewer.interviewRound} />
          <MetaRow label="Candidate" value={candidate.name} />
          <MetaRow label="Role" value={jobTitle} />
        </dl>

        <div className="space-y-2">
          <Label htmlFor="request-message" className="text-[13px]">
            Custom message <span className="font-normal text-[#A1A1AA]">(optional)</span>
          </Label>
          <Textarea
            id="request-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add context for the interviewer…"
            rows={3}
            className="text-[13px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="send-email"
            checked={sendEmail}
            onCheckedChange={(v) => setSendEmail(v === true)}
          />
          <Label htmlFor="send-email" className="cursor-pointer text-[13px] font-normal">
            Send email notification
          </Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSend} disabled={sending}>
            {sending ? "Sending…" : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
