"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { EducationEntry, EmployerEntry } from "@/lib/hiring/candidateProfile";

export const candidateFormInputClass =
  "h-10 text-[14px] focus-visible:ring-2 focus-visible:ring-accent/25 aria-[invalid=true]:border-[#FCA5A5] aria-[invalid=true]:ring-red-500/20";

export function EducationBlock({
  entry,
  error,
  onChange,
  onSetHighest,
  onRemove,
  canRemove,
}: {
  entry: EducationEntry;
  error?: string;
  onChange: (entry: EducationEntry) => void;
  onSetHighest: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const institutionId = `education-${entry.id}-institution`;

  return (
    <div
      className={cn(
        "rounded-xl border bg-[#FAFAFB] p-4 dark:bg-white/[0.02]",
        error ? "border-[#FCA5A5]" : "border-[rgba(15,23,42,0.06)]",
      )}
      aria-invalid={error ? true : undefined}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-text">
            {entry.degree}
            {entry.required ? (
              <span className="ml-1 text-[#DC2626]" aria-hidden="true">
                *
              </span>
            ) : null}
          </p>
          {entry.isHighest ? (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
              Highest
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {!entry.isHighest ? (
            <Button type="button" variant="ghost" size="sm" className="h-9 px-2 text-[12px]" onClick={onSetHighest}>
              Mark highest
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 gap-1 px-2 text-[12px] text-muted hover:text-red-600"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Remove
          </Button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="mb-3 text-[12px] font-medium text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Degree / qualification" htmlFor={`education-${entry.id}-degree`} required={entry.required}>
          <Input
            id={`education-${entry.id}-degree`}
            value={entry.degree}
            onChange={(e) => onChange({ ...entry, degree: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField label="Institution name" htmlFor={institutionId} required={entry.required}>
          <Input
            id={institutionId}
            value={entry.institution}
            onChange={(e) => onChange({ ...entry, institution: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField label="Place" htmlFor={`education-${entry.id}-place`}>
          <Input
            id={`education-${entry.id}-place`}
            value={entry.place}
            onChange={(e) => onChange({ ...entry, place: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField label="Year of passing" htmlFor={`education-${entry.id}-year`} required={entry.required}>
          <Input
            id={`education-${entry.id}-year`}
            inputMode="numeric"
            placeholder="e.g. 2020"
            value={entry.yearOfPassing}
            onChange={(e) => onChange({ ...entry, yearOfPassing: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField
          label="Grade / percentage / CGPA"
          htmlFor={`education-${entry.id}-grade`}
          required={entry.required}
          className="sm:col-span-2"
        >
          <Input
            id={`education-${entry.id}-grade`}
            value={entry.grade}
            onChange={(e) => onChange({ ...entry, grade: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
      </div>
    </div>
  );
}

export function EmployerBlock({
  employer,
  onChange,
  onRemove,
  canRemove,
}: {
  employer: EmployerEntry;
  onChange: (e: EmployerEntry) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFB] p-4 dark:bg-white/[0.02]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-text">{employer.company || "New employer"}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 gap-1 px-2 text-[12px] text-muted hover:text-red-600"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Remove
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Designation" htmlFor={`employer-${employer.id}-designation`}>
          <Input
            id={`employer-${employer.id}-designation`}
            value={employer.designation}
            onChange={(e) => onChange({ ...employer, designation: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField label="Company / business name" htmlFor={`employer-${employer.id}-company`}>
          <Input
            id={`employer-${employer.id}-company`}
            value={employer.company}
            onChange={(e) => onChange({ ...employer, company: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField label="From date" htmlFor={`employer-${employer.id}-from`}>
          <Input
            id={`employer-${employer.id}-from`}
            type="month"
            value={employer.fromDate}
            onChange={(e) => onChange({ ...employer, fromDate: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
        <FormField label="To date" htmlFor={`employer-${employer.id}-to`}>
          <Input
            id={`employer-${employer.id}-to`}
            type="month"
            value={employer.toDate}
            disabled={employer.current}
            onChange={(e) => onChange({ ...employer, toDate: e.target.value })}
            className={candidateFormInputClass}
          />
        </FormField>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Switch
          id={`current-${employer.id}`}
          checked={employer.current}
          onCheckedChange={(checked) =>
            onChange({ ...employer, current: checked, toDate: checked ? "" : employer.toDate })
          }
        />
        <label htmlFor={`current-${employer.id}`} className="text-[13px] text-text-secondary">
          Currently works here
        </label>
      </div>
      <FormField label="Summary" htmlFor={`employer-${employer.id}-summary`} className="mt-3">
        <Textarea
          id={`employer-${employer.id}-summary`}
          value={employer.summary}
          onChange={(e) => onChange({ ...employer, summary: e.target.value })}
          className="min-h-[80px] text-[13px] focus-visible:ring-2 focus-visible:ring-accent/25"
        />
      </FormField>
    </div>
  );
}
