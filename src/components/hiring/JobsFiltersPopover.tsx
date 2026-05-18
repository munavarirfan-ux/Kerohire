"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DEPARTMENTS,
  HIRING_MANAGERS,
  LOCATIONS,
} from "@/lib/hiring/mockData";
import type { EmploymentType, JobStatus, JobVisibility, WorkMode } from "@/lib/hiring/types";
import { hiringTransition } from "./hiringTokens";

const ALL = "__all__";

const STATUSES: JobStatus[] = ["Published", "Internal", "External", "Draft", "On Hold", "Closed"];
const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "On-site"];
const EMP_TYPES: EmploymentType[] = ["Full-time", "Contract", "Internship", "Part-time"];
const VISIBILITIES: JobVisibility[] = ["Internal", "External", "Internal + External"];

export type JobsFilterState = {
  status: string;
  department: string;
  location: string;
  workMode: string;
  employmentType: string;
  visibility: string;
  hiringManager: string;
};

export const EMPTY_JOBS_FILTERS: JobsFilterState = {
  status: "",
  department: "",
  location: "",
  workMode: "",
  employmentType: "",
  visibility: "",
  hiringManager: "",
};

export function countActiveFilters(filters: JobsFilterState): number {
  return Object.values(filters).filter(Boolean).length;
}

function FilterField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  const selectValue = value || ALL;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-text-secondary/80">{label}</label>
      <Select value={selectValue} onValueChange={(v) => onChange(v === ALL ? "" : v)}>
        <SelectTrigger className="h-9 w-full rounded-[10px] border-[rgba(15,23,42,0.06)] bg-surface text-xs font-medium shadow-none focus:ring-forest/12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function JobsFiltersPopover({
  filters,
  onApply,
}: {
  filters: JobsFilterState;
  onApply: (next: JobsFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<JobsFilterState>(filters);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const setDraftField = <K extends keyof JobsFilterState>(key: K, value: JobsFilterState[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft(EMPTY_JOBS_FILTERS);
    onApply(EMPTY_JOBS_FILTERS);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "h-9 gap-2 rounded-[11px] border-[rgba(15,23,42,0.06)] px-3 text-xs font-medium shadow-none",
            hiringTransition,
            activeCount > 0 && "border-forest/25 bg-forest/[0.04] text-forest",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.5} />
          Filters
          {activeCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1.5 text-[10px] font-semibold tabular-nums text-white">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(100vw-2rem,22rem)] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
          <p className="text-sm font-semibold tracking-tight text-text">Filter jobs</p>
          <p className="mt-0.5 text-[11px] text-text-secondary/75">Refine active hiring workflows</p>
        </div>
        <div className="grid max-h-[min(60vh,420px)] gap-3 overflow-y-auto p-4">
          <FilterField label="Status" value={draft.status} onChange={(v) => setDraftField("status", v)} options={STATUSES} placeholder="All statuses" />
          <FilterField label="Department" value={draft.department} onChange={(v) => setDraftField("department", v)} options={DEPARTMENTS} placeholder="All departments" />
          <FilterField label="Location" value={draft.location} onChange={(v) => setDraftField("location", v)} options={LOCATIONS} placeholder="All locations" />
          <FilterField label="Work mode" value={draft.workMode} onChange={(v) => setDraftField("workMode", v)} options={WORK_MODES} placeholder="All work modes" />
          <FilterField label="Employment" value={draft.employmentType} onChange={(v) => setDraftField("employmentType", v)} options={EMP_TYPES} placeholder="All types" />
          <FilterField label="Visibility" value={draft.visibility} onChange={(v) => setDraftField("visibility", v)} options={VISIBILITIES} placeholder="All visibility" />
          <FilterField label="Hiring manager" value={draft.hiringManager} onChange={(v) => setDraftField("hiringManager", v)} options={HIRING_MANAGERS} placeholder="All managers" />
        </div>
        <div className="flex gap-2 border-t border-[rgba(15,23,42,0.06)] p-3 dark:border-white/[0.06]">
          <Button type="button" variant="outline" size="sm" className="h-9 flex-1 rounded-[10px] text-xs font-medium" onClick={handleClear}>
            Clear all
          </Button>
          <Button type="button" size="sm" className="h-9 flex-1 rounded-[10px] bg-forest text-xs font-medium text-white hover:bg-forest/92" onClick={handleApply}>
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
