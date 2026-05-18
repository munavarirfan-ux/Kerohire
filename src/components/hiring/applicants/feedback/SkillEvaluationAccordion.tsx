"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SKILL_QUICK_SIGNALS, type SkillFeedbackEntry } from "@/lib/hiring/interviewFeedback";
import { DeleteSkillAlertDialog } from "./DeleteSkillAlertDialog";
import { QuickSignalTags, StarRating } from "./FeedbackUi";

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#71717A]">{label}</p>
      <ul className="mb-2 space-y-1">
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex items-center justify-between gap-2 rounded-lg border border-[rgba(15,23,42,0.06)] bg-[#FCFCFD] px-2.5 py-1.5 text-[12px] text-[#3F3F46]"
          >
            <span>{item}</span>
            <button
              type="button"
              aria-label={`Remove ${item}`}
              className="rounded p-0.5 text-[#A1A1AA] hover:text-[#52525B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <X className="h-3 w-3" strokeWidth={2} />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="h-8 flex-1 text-[12px]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-[8px] border border-[rgba(15,23,42,0.08)] px-2.5 text-[11px] font-medium text-[#52525B] hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
          onClick={add}
        >
          <Plus className="h-3 w-3" strokeWidth={2} aria-hidden />
          Add
        </button>
      </div>
    </div>
  );
}

function SkillCard({
  skill,
  onChange,
  onDelete,
  defaultOpen,
  readOnly,
}: {
  skill: SkillFeedbackEntry;
  onChange: (next: SkillFeedbackEntry) => void;
  onDelete?: () => void;
  defaultOpen?: boolean;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [showNotes, setShowNotes] = useState(Boolean(skill.detailedNotes.trim()));
  const signals = SKILL_QUICK_SIGNALS[skill.title] ?? ["Clear", "Structured", "Needs work", "Strong"];

  return (
    <article className="overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)] dark:border-white/[0.06] dark:bg-surface">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FAFAFA]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/25"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-[#A1A1AA] transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
          aria-hidden
        />
        {skill.custom && !readOnly ? (
          <input
            value={skill.title}
            onChange={(e) => onChange({ ...skill, title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Skill name"
            className="min-w-0 flex-1 rounded-[6px] border border-transparent bg-transparent px-1 py-0.5 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] outline-none focus:border-[rgba(15,23,42,0.12)] focus:bg-white dark:text-text"
            aria-label="Skill name"
          />
        ) : (
          <span className="min-w-0 flex-1 text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text">
            {skill.title}
          </span>
        )}
        <span
          className="flex shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {onDelete ? (
            <button
              type="button"
              aria-label={`Remove ${skill.title}`}
              className="rounded-md p-1.5 text-[#A1A1AA] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : null}
          <StarRating
            label={`Rating for ${skill.title}`}
            value={skill.rating}
            onChange={readOnly ? undefined : (rating) => onChange({ ...skill, rating })}
            readOnly={readOnly}
            size="sm"
          />
        </span>
      </button>

      {open ? (
        <div className="space-y-3 border-t border-[rgba(15,23,42,0.06)] px-4 pb-4 pt-3">
          <div>
            <p className="mb-1.5 text-[11px] font-medium text-[#71717A]">Quick signals</p>
            <QuickSignalTags
              options={signals}
              selected={skill.quickSignals}
              onChange={(quickSignals) => onChange({ ...skill, quickSignals })}
            />
          </div>

          <div>
            <label htmlFor={`summary-${skill.id}`} className="mb-1 block text-[11px] font-medium text-[#71717A]">
              Summary
            </label>
            <input
              id={`summary-${skill.id}`}
              value={skill.summary}
              onChange={(e) => onChange({ ...skill, summary: e.target.value })}
              placeholder="One-line evaluation summary…"
              className="flex h-9 w-full rounded-[9px] border border-[rgba(15,23,42,0.08)] bg-[#FCFCFD] px-3 text-[13px] text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
            />
          </div>

          {!showNotes ? (
            <button
              type="button"
              className="text-[12px] font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
              onClick={() => setShowNotes(true)}
            >
              Add detailed notes
            </button>
          ) : (
            <div>
              <label htmlFor={`notes-${skill.id}`} className="mb-1 block text-[11px] font-medium text-[#71717A]">
                Detailed notes
              </label>
              <textarea
                id={`notes-${skill.id}`}
                value={skill.detailedNotes}
                onChange={(e) => onChange({ ...skill, detailedNotes: e.target.value })}
                rows={3}
                className="w-full resize-y rounded-[9px] border border-[rgba(15,23,42,0.08)] bg-[#FCFCFD] px-3 py-2 text-[13px] leading-relaxed text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                placeholder="Optional expanded evaluation…"
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <ListEditor
              label="Strengths"
              items={skill.strengths}
              onChange={(strengths) => onChange({ ...skill, strengths })}
              placeholder="Add strength"
            />
            <ListEditor
              label="Concerns"
              items={skill.concerns}
              onChange={(concerns) => onChange({ ...skill, concerns })}
              placeholder="Add concern"
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function SkillEvaluationAccordion({
  skills,
  onChange,
  readOnly,
}: {
  skills: SkillFeedbackEntry[];
  onChange: (skills: SkillFeedbackEntry[]) => void;
  readOnly?: boolean;
}) {
  const [skillToDelete, setSkillToDelete] = useState<SkillFeedbackEntry | null>(null);

  const updateSkill = (id: string, next: SkillFeedbackEntry) => {
    onChange(skills.map((s) => (s.id === id ? next : s)));
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const confirmDelete = () => {
    if (!skillToDelete) return;
    removeSkill(skillToDelete.id);
    setSkillToDelete(null);
  };

  return (
    <>
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            defaultOpen={i === 0}
            onChange={(next) => updateSkill(skill.id, next)}
          onDelete={!readOnly && skill.custom ? () => setSkillToDelete(skill) : undefined}
          readOnly={readOnly}
        />
        ))}
      </div>

      <DeleteSkillAlertDialog
        open={skillToDelete !== null}
        skillTitle={skillToDelete?.title ?? ""}
        onOpenChange={(open) => {
          if (!open) setSkillToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
