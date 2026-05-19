"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";
import {
  canManageInterviewRounds,
  createInterviewRound,
  getInterviewRounds,
  resolveInterviewColumnId,
  saveInterviewRounds,
  type InterviewRound,
} from "@/lib/hiring/interviewRounds";
import {
  buildInterviewListRows,
  EMPTY_INTERVIEW_LIST_FILTERS,
  filterInterviewListRows,
  getInterviewListFilterOptions,
} from "@/lib/hiring/interviewListData";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { InterviewKanban } from "./interview-kanban/InterviewKanban";
import { InterviewRoundsFlow } from "./InterviewRoundsFlow";
import { DirectoryViewSwitcher } from "./directories/DirectoryViewSwitcher";
import { InterviewCandidatesListView } from "./interview-kanban/InterviewCandidatesListView";
import { InterviewListFiltersBar } from "./interview-kanban/InterviewListFiltersBar";

export function InterviewKanbanBoard({
  job,
  jobId,
  candidates,
  onCardClick,
  onCandidateMoved,
  onScheduleCandidate,
  onRequestFeedback,
}: {
  job: HiringJob;
  jobId: string;
  candidates: HiringCandidate[];
  onCardClick?: (candidate: HiringCandidate) => void;
  onCandidateMoved?: () => void;
  onScheduleCandidate?: (candidate: HiringCandidate) => void;
  onRequestFeedback?: (candidate: HiringCandidate) => void;
}) {
  const { selectedRole } = useRole();
  const canManage = canManageInterviewRounds(selectedRole);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [listFilters, setListFilters] = useState(EMPTY_INTERVIEW_LIST_FILTERS);
  const [rounds, setRounds] = useState<InterviewRound[]>(() => getInterviewRounds(jobId));

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

  function handleAddRound(title: string) {
    const round = createInterviewRound(title, rounds);
    setRounds((prev) => [...prev, round]);
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

  const roundPills = useMemo(
    () =>
      rounds.map((round) => ({
        id: round.id,
        title: round.title,
        count: candidates.filter((c) => columnResolver(c) === round.id).length,
      })),
    [rounds, candidates, columnResolver],
  );

  const listRows = useMemo(
    () => buildInterviewListRows(job, candidates, rounds),
    [job, candidates, rounds],
  );
  const filteredListRows = useMemo(
    () => filterInterviewListRows(listRows, listFilters),
    [listRows, listFilters],
  );
  const listFilterOptions = useMemo(() => getInterviewListFilterOptions(listRows), [listRows]);

  const handleSchedule = onScheduleCandidate ?? onCardClick;
  const handleFeedback = onRequestFeedback ?? onCardClick;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DirectoryViewSwitcher
          value={view}
          onChange={setView}
          options={[
            { value: "kanban", label: "Kanban View", icon: "kanban" },
            { value: "list", label: "List View", icon: "list" },
          ]}
        />
      </div>

      {canManage ? (
        <InterviewRoundsFlow
          rounds={roundPills}
          onAddRound={handleAddRound}
          onDeleteRound={(id) => {
            const round = rounds.find((r) => r.id === id);
            if (round) handleDeleteRound(round);
          }}
        />
      ) : (
        <p className="text-[12px] text-text-secondary/70">
          {rounds.map((r) => r.title).join(" · ")}
        </p>
      )}

      {view === "kanban" ? (
        <InterviewKanban
          rounds={rounds}
          candidates={candidates}
          onCardClick={onCardClick}
          onCandidateMoved={onCandidateMoved}
        />
      ) : (
        <>
          <InterviewListFiltersBar
            filters={listFilters}
            onChange={setListFilters}
            roundOptions={listFilterOptions.rounds}
            interviewerOptions={listFilterOptions.interviewers}
          />
          <InterviewCandidatesListView
            rows={filteredListRows}
            job={job}
            onOpenReport={(c) => onCardClick?.(c)}
            onSchedule={(c) => handleSchedule?.(c)}
            onRequestFeedback={(c) => handleFeedback?.(c)}
          />
        </>
      )}
    </div>
  );
}
