"use client";

import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetGlassElevated, zemeetLabel, zemeetPrimaryBtn } from "@/components/zemeet/zemeetTokens";
import { SKILL_RATING_LABELS, type ZeMeetRecommendation } from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";

const RECOMMENDATIONS: ZeMeetRecommendation[] = [
  "Strong Hire",
  "Hire",
  "Hold",
  "No Hire",
  "Re-interview",
];

export function ZeMeetFeedbackModal({ onSubmit }: { onSubmit: () => void }) {
  const { feedback, setFeedback, phase } = useZeMeet();

  if (phase !== "feedback") return null;

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
      <div className={cn(zemeetGlassElevated, "max-h-[90vh] w-full max-w-lg overflow-y-auto p-6")}>
        <p className={zemeetLabel}>Post-interview</p>
        <h2 className="mt-1 text-[1.25rem] font-semibold text-white">Submit feedback</h2>
        <p className="mt-1 text-[13px] text-white/55">
          Syncs automatically to Candidate Report → Feedback
        </p>

        <div className="mt-6">
          <p className={zemeetLabel}>Overall recommendation</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {RECOMMENDATIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFeedback((f) => ({ ...f, recommendation: r }))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  feedback.recommendation === r
                    ? "border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.2)] text-white"
                    : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <p className={zemeetLabel}>Skill ratings</p>
          {SKILL_RATING_LABELS.map((skill) => (
            <div key={skill} className="flex items-center justify-between gap-4">
              <span className="text-[12px] text-white/70">{skill}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      setFeedback((f) => ({
                        ...f,
                        skillRatings: { ...f.skillRatings, [skill]: n },
                      }))
                    }
                    className={cn(
                      "h-7 w-7 rounded-[8px] text-[11px] font-semibold",
                      (feedback.skillRatings[skill] ?? 0) >= n
                        ? "bg-[rgb(var(--accent-rgb)/0.35)] text-white"
                        : "bg-white/[0.06] text-white/40",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Field
          label="Summary"
          value={feedback.summary}
          onChange={(v) => setFeedback((f) => ({ ...f, summary: v }))}
          rows={3}
        />
        <Field
          label="Technical evaluation"
          value={feedback.technicalEvaluation}
          onChange={(v) => setFeedback((f) => ({ ...f, technicalEvaluation: v }))}
          rows={2}
        />
        <Field
          label="Culture fit"
          value={feedback.cultureFit}
          onChange={(v) => setFeedback((f) => ({ ...f, cultureFit: v }))}
          rows={2}
        />

        <label className="mt-4 flex items-center gap-2 text-[13px] text-white/70">
          <input
            type="checkbox"
            checked={feedback.reInterview}
            onChange={(e) => setFeedback((f) => ({ ...f, reInterview: e.target.checked }))}
            className="rounded border-white/20"
          />
          Recommend re-interview in a future round
        </label>

        <button type="button" className={cn(zemeetPrimaryBtn, "mt-6 w-full")} onClick={onSubmit}>
          Submit & close
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <label className="mt-4 block">
      <span className={zemeetLabel}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1.5 w-full resize-none rounded-[10px] border border-white/[0.08] bg-[#0d1118] px-3 py-2 text-[13px] text-white outline-none focus:ring-2 focus:ring-white/15"
      />
    </label>
  );
}
