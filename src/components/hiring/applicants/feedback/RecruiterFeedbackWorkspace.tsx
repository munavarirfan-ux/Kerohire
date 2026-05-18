"use client";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import type { RecruiterFeedbackData } from "@/lib/hiring/interviewFeedback";
import { SidebarCard } from "./FeedbackUi";

const FIELDS: { key: keyof RecruiterFeedbackData; label: string; multiline?: boolean }[] = [
  { key: "evaluationNotes", label: "Evaluation notes", multiline: true },
  { key: "cultureFit", label: "Culture fit" },
  { key: "salaryAlignment", label: "Salary alignment" },
  { key: "availability", label: "Availability" },
  { key: "recommendation", label: "Final recommendation" },
  { key: "concerns", label: "Concerns / blockers", multiline: true },
  { key: "decisionSummary", label: "Decision summary", multiline: true },
];

export function RecruiterFeedbackWorkspace({
  data,
  onChange,
}: {
  data: RecruiterFeedbackData;
  onChange: (next: RecruiterFeedbackData) => void;
}) {
  return (
    <div className="mx-auto grid max-w-2xl gap-2.5">
      <SidebarCard title="Compensation">
        <div className="grid gap-2 sm:grid-cols-3">
          <FormField label="Expected" htmlFor="expected-salary">
            <Input
              id="expected-salary"
              value={data.expectedSalary}
              onChange={(e) => onChange({ ...data, expectedSalary: e.target.value })}
              className="h-9 text-[13px]"
            />
          </FormField>
          <FormField label="Budget" htmlFor="budget-range">
            <Input
              id="budget-range"
              value={data.budgetRange}
              onChange={(e) => onChange({ ...data, budgetRange: e.target.value })}
              className="h-9 text-[13px]"
            />
          </FormField>
          <FormField label="Status" htmlFor="comp-status">
            <Input
              id="comp-status"
              value={data.compensationStatus}
              onChange={(e) => onChange({ ...data, compensationStatus: e.target.value })}
              className="h-9 text-[13px]"
            />
          </FormField>
        </div>
      </SidebarCard>

      {FIELDS.map((field) => (
        <SidebarCard key={field.key}>
          <FormField label={field.label} htmlFor={`recruiter-${field.key}`}>
            {field.multiline ? (
              <textarea
                id={`recruiter-${field.key}`}
                value={data[field.key]}
                onChange={(e) => onChange({ ...data, [field.key]: e.target.value })}
                rows={3}
                className="w-full resize-y rounded-[9px] border border-[rgba(15,23,42,0.08)] bg-[#FCFCFD] px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
              />
            ) : (
              <Input
                id={`recruiter-${field.key}`}
                value={data[field.key]}
                onChange={(e) => onChange({ ...data, [field.key]: e.target.value })}
                className="h-9 text-[13px]"
              />
            )}
          </FormField>
        </SidebarCard>
      ))}
    </div>
  );
}
