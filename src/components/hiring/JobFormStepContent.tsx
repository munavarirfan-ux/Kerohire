"use client";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEPARTMENTS, LOCATIONS } from "@/lib/hiring/mockData";
import type { CustomFieldDef, JobVisibility } from "@/lib/hiring/types";
import { JobCustomFieldsStep } from "./JobCustomFieldsStep";

export const jobFormInputClass =
  "h-10 text-[14px] focus-visible:ring-2 focus-visible:ring-accent/25 aria-[invalid=true]:border-[#FCA5A5] aria-[invalid=true]:ring-red-500/20";

export const jobFormTextareaClass =
  "min-h-[72px] max-h-[120px] resize-y text-[14px] focus-visible:ring-2 focus-visible:ring-accent/25";

export type JobBasicDetails = {
  title: string;
  department: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  hiringManager: string;
  recruiterOwner: string;
};

export type JobAdditionalDetails = {
  description: string;
  responsibilities: string;
  requiredSkills: string;
  niceToHave: string;
  salaryRange: string;
  openings: string;
  deadline: string;
  visibility: JobVisibility;
};

export function JobFormStepContent({
  stepIndex,
  basic,
  onBasicChange,
  additional,
  onAdditionalChange,
  customFieldCatalog,
  selectedCustomFieldIds,
  onSelectedCustomFieldIdsChange,
  onAddCustomField,
  onRemoveCustomField,
  builtinCustomFieldIds,
  titleError,
}: {
  stepIndex: number;
  basic: JobBasicDetails;
  onBasicChange: (next: JobBasicDetails) => void;
  additional: JobAdditionalDetails;
  onAdditionalChange: (next: JobAdditionalDetails) => void;
  customFieldCatalog: CustomFieldDef[];
  selectedCustomFieldIds: string[];
  onSelectedCustomFieldIdsChange: (ids: string[]) => void;
  onAddCustomField: (field: CustomFieldDef) => void;
  onRemoveCustomField: (id: string) => void;
  builtinCustomFieldIds: Set<string>;
  titleError?: string;
}) {
  if (stepIndex === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Job title" className="sm:col-span-2" required error={titleError}>
          <Input
            id="job-title"
            value={basic.title}
            onChange={(e) => onBasicChange({ ...basic, title: e.target.value })}
            placeholder="e.g. Staff Product Designer"
            className={jobFormInputClass}
            aria-invalid={titleError ? true : undefined}
          />
        </FormField>
        <FormField label="Department">
          <Select value={basic.department} onValueChange={(v) => onBasicChange({ ...basic, department: v })}>
            <SelectTrigger className={jobFormInputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Location">
          <Select value={basic.location} onValueChange={(v) => onBasicChange({ ...basic, location: v })}>
            <SelectTrigger className={jobFormInputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Work mode">
          <Select value={basic.workMode} onValueChange={(v) => onBasicChange({ ...basic, workMode: v })}>
            <SelectTrigger className={jobFormInputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Remote", "Hybrid", "On-site"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Employment type">
          <Select
            value={basic.employmentType}
            onValueChange={(v) => onBasicChange({ ...basic, employmentType: v })}
          >
            <SelectTrigger className={jobFormInputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Full-time", "Contract", "Internship", "Part-time"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Experience level">
          <Input
            value={basic.experienceLevel}
            onChange={(e) => onBasicChange({ ...basic, experienceLevel: e.target.value })}
            className={jobFormInputClass}
          />
        </FormField>
        <FormField label="Hiring manager">
          <Input
            value={basic.hiringManager}
            onChange={(e) => onBasicChange({ ...basic, hiringManager: e.target.value })}
            className={jobFormInputClass}
          />
        </FormField>
        <FormField label="Recruiter owner">
          <Input
            value={basic.recruiterOwner}
            onChange={(e) => onBasicChange({ ...basic, recruiterOwner: e.target.value })}
            className={jobFormInputClass}
          />
        </FormField>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="space-y-3">
        <FormField label="Job description">
          <Textarea
            rows={3}
            value={additional.description}
            onChange={(e) => onAdditionalChange({ ...additional, description: e.target.value })}
            placeholder="Role overview and impact…"
            className={jobFormTextareaClass}
          />
        </FormField>
        <FormField label="Responsibilities">
          <Textarea
            rows={2}
            value={additional.responsibilities}
            onChange={(e) => onAdditionalChange({ ...additional, responsibilities: e.target.value })}
            className={jobFormTextareaClass}
          />
        </FormField>
        <FormField label="Required skills">
          <Input
            value={additional.requiredSkills}
            onChange={(e) => onAdditionalChange({ ...additional, requiredSkills: e.target.value })}
            placeholder="Comma-separated"
            className={jobFormInputClass}
          />
        </FormField>
        <FormField label="Good-to-have skills">
          <Input
            value={additional.niceToHave}
            onChange={(e) => onAdditionalChange({ ...additional, niceToHave: e.target.value })}
            className={jobFormInputClass}
          />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Salary range">
            <Input
              value={additional.salaryRange}
              onChange={(e) => onAdditionalChange({ ...additional, salaryRange: e.target.value })}
              className={jobFormInputClass}
            />
          </FormField>
          <FormField label="Openings">
            <Input
              type="number"
              min={1}
              value={additional.openings}
              onChange={(e) => onAdditionalChange({ ...additional, openings: e.target.value })}
              className={jobFormInputClass}
            />
          </FormField>
          <FormField label="Application deadline">
            <Input
              type="date"
              value={additional.deadline}
              onChange={(e) => onAdditionalChange({ ...additional, deadline: e.target.value })}
              className={jobFormInputClass}
            />
          </FormField>
          <FormField label="Visibility">
            <Select
              value={additional.visibility}
              onValueChange={(v) => onAdditionalChange({ ...additional, visibility: v as JobVisibility })}
            >
              <SelectTrigger className={jobFormInputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Internal", "External", "Internal + External"] as const).map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>
    );
  }

  return (
    <JobCustomFieldsStep
      catalog={customFieldCatalog}
      selectedIds={selectedCustomFieldIds}
      onSelectedIdsChange={onSelectedCustomFieldIdsChange}
      onAddField={onAddCustomField}
      onRemoveCustomField={onRemoveCustomField}
      builtinFieldIds={builtinCustomFieldIds}
    />
  );
}
