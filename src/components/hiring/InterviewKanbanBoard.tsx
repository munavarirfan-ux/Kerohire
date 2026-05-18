"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/RoleContext";
import {
  canManageInterviewRounds,
  createInterviewRound,
  getInterviewRounds,
  resolveInterviewColumnId,
  saveInterviewRounds,
  type InterviewRound,
} from "@/lib/hiring/interviewRounds";
import type { HiringCandidate } from "@/lib/hiring/types";
import { InterviewKanban } from "./interview-kanban/InterviewKanban";

export function InterviewKanbanBoard({
  jobId,
  candidates,
  onCardClick,
  onCandidateMoved,
}: {
  jobId: string;
  candidates: HiringCandidate[];
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
}) {
  const { selectedRole } = useRole();
  const canManage = canManageInterviewRounds(selectedRole);
  const [rounds, setRounds] = useState<InterviewRound[]>(() => getInterviewRounds(jobId));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoundTitle, setNewRoundTitle] = useState("");

  useEffect(() => {
    setRounds(getInterviewRounds(jobId));
  }, [jobId]);

  useEffect(() => {
    saveInterviewRounds(jobId, rounds);
  }, [jobId, rounds]);

  const columnResolver = useCallback(
    (candidate: HiringCandidate) => resolveInterviewColumnId(candidate, rounds),
    [rounds],
  );

  function handleAddRound() {
    const title = newRoundTitle.trim();
    if (!title) {
      toast.error("Enter a round name");
      return;
    }
    if (rounds.some((r) => r.title.toLowerCase() === title.toLowerCase())) {
      toast.error("A round with this name already exists");
      return;
    }
    const round = createInterviewRound(title, rounds);
    setRounds((prev) => [...prev, round]);
    setNewRoundTitle("");
    setShowAddForm(false);
    toast.success(`Added ${round.title}`);
  }

  function handleDeleteRound(round: InterviewRound) {
    if (rounds.length <= 1) {
      toast.error("At least one interview round is required");
      return;
    }
    const count = candidates.filter((c) => columnResolver(c) === round.id).length;
    if (count > 0) {
      toast.error(`Move ${count} candidate${count === 1 ? "" : "s"} out of this round before deleting`);
      return;
    }
    setRounds((prev) => prev.filter((r) => r.id !== round.id));
    toast.success(`Removed ${round.title}`);
  }

  return (
    <div className="space-y-4">
      {canManage ? (
        <div className="rounded-[14px] border border-[rgba(15,23,42,0.06)] bg-white p-4 dark:border-white/[0.06] dark:bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text">Interview rounds</p>
              <p className="mt-0.5 text-[12px] text-text-secondary/70">
                Configure rounds for this job&apos;s interview pipeline.
              </p>
            </div>
            {!showAddForm ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-[9px] text-[12px]"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                Add round
              </Button>
            ) : null}
          </div>

          <ul className="mt-3 flex flex-wrap gap-2">
            {rounds.map((round) => {
              const count = candidates.filter((c) => columnResolver(c) === round.id).length;
              return (
                <li
                  key={round.id}
                  className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-[#FAFAFB] py-1 pl-3 pr-1 text-[12px] font-medium text-[#3F3F46] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-text-secondary"
                >
                  <span>{round.title}</span>
                  <span className="tabular-nums text-[11px] text-muted">({count})</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full text-muted hover:text-destructive"
                    aria-label={`Delete ${round.title}`}
                    onClick={() => handleDeleteRound(round)}
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                  </Button>
                </li>
              );
            })}
          </ul>

          {showAddForm ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Input
                value={newRoundTitle}
                onChange={(e) => setNewRoundTitle(e.target.value)}
                placeholder="e.g. Culture fit"
                className="h-9 max-w-xs rounded-[9px] text-[13px]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRound();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-[9px] bg-forest text-white hover:bg-forest/90"
                onClick={handleAddRound}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-[9px]"
                onClick={() => {
                  setShowAddForm(false);
                  setNewRoundTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-[12px] text-text-secondary/70">
          {rounds.map((r) => r.title).join(" · ")}
        </p>
      )}

      <InterviewKanban
        rounds={rounds}
        candidates={candidates}
        onCardClick={onCardClick}
        onCandidateMoved={onCandidateMoved}
      />
    </div>
  );
}
