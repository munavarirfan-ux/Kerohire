"use client";

import { useMemo, useState } from "react";
import {
  createEmptyHiringStage,
  type JobHiringStageConfig,
} from "@/lib/hiring/jobHiringStages";
import { HiringRoundConfigPanel } from "./HiringRoundConfigPanel";
import { InterviewRoundsFlow } from "./InterviewRoundsFlow";

export function JobHiringStagesStep({
  stages,
  onChange,
}: {
  stages: JobHiringStageConfig[];
  onChange: (stages: JobHiringStageConfig[]) => void;
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const pills = useMemo(
    () =>
      stages.map((s) => ({
        id: s.id,
        title: s.stageName.trim() || "Untitled round",
        count: s.interviewerNames.length,
      })),
    [stages],
  );

  const editingStage = editingIndex !== null ? stages[editingIndex] : null;

  function handleAddRound(title: string) {
    const stage = createEmptyHiringStage();
    stage.stageName = title;
    onChange([...stages, stage]);
  }

  function handleDeleteRound(id: string) {
    onChange(stages.filter((s) => s.id !== id));
  }

  function openEdit(id: string) {
    const index = stages.findIndex((s) => s.id === id);
    if (index === -1) return;
    setEditingIndex(index);
    setPanelOpen(true);
  }

  function handleSave(stage: JobHiringStageConfig) {
    if (editingIndex === null) return;
    onChange(stages.map((s, i) => (i === editingIndex ? stage : s)));
    setEditingIndex(null);
  }

  return (
    <>
      <InterviewRoundsFlow
        rounds={pills}
        onAddRound={handleAddRound}
        onDeleteRound={handleDeleteRound}
        onRoundClick={openEdit}
      />

      <HiringRoundConfigPanel
        open={panelOpen}
        onOpenChange={(open) => {
          setPanelOpen(open);
          if (!open) setEditingIndex(null);
        }}
        stage={editingStage}
        isNew={false}
        onSave={handleSave}
      />
    </>
  );
}
