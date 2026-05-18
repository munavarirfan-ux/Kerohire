"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HiringStage } from "@/lib/hiring/types";

export function FlowBuilder({
  stages,
  onChange,
  readOnly = false,
}: {
  stages: HiringStage[];
  onChange?: (stages: HiringStage[]) => void;
  readOnly?: boolean;
}) {
  const update = onChange ?? (() => {});

  function addStage() {
    const id = `stage-${Date.now()}`;
    update([...stages, { id, name: "New stage", substages: [{ id: `${id}-sub`, name: "New substage" }] }]);
  }

  function addSubstage(stageId: string) {
    update(
      stages.map((s) =>
        s.id === stageId
          ? {
              ...s,
              substages: [...s.substages, { id: `sub-${Date.now()}`, name: "New substage" }],
            }
          : s,
      ),
    );
  }

  function removeStage(stageId: string) {
    update(stages.filter((s) => s.id !== stageId));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {stages.map((stage, i) => (
          <span key={stage.id} className="flex items-center gap-2">
            {i > 0 ? <span className="text-muted">→</span> : null}
            <span className="rounded-lg border border-forest/20 bg-forest/5 px-2 py-1 text-xs font-semibold text-forest">
              {stage.name}
            </span>
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="rounded-[14px] border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-center gap-2">
              {!readOnly ? <GripVertical className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} /> : null}
              <input
                readOnly={readOnly}
                value={stage.name}
                onChange={(e) =>
                  update(stages.map((s) => (s.id === stage.id ? { ...s, name: e.target.value } : s)))
                }
                className={cn(
                  "min-w-0 flex-1 rounded-lg border border-border bg-app-bg px-2 py-1.5 text-sm font-semibold text-text",
                  readOnly && "border-transparent bg-transparent px-0",
                )}
              />
              {!readOnly ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 px-0 text-muted hover:text-red-600"
                  onClick={() => removeStage(stage.id)}
                  aria-label="Remove stage"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {stage.substages.map((sub) => (
                <span
                  key={sub.id}
                  className="inline-flex items-center rounded-full border border-border bg-muted/15 px-2.5 py-1 text-[11px] font-medium text-text-secondary"
                >
                  {sub.name}
                </span>
              ))}
              {!readOnly ? (
                <button
                  type="button"
                  onClick={() => addSubstage(stage.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-forest hover:text-forest"
                >
                  <Plus className="h-3 w-3" />
                  Substage
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {!readOnly ? (
        <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-[10px]" onClick={addStage}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add stage
        </Button>
      ) : null}
    </div>
  );
}
