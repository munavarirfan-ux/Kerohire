"use client";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  EMPTY_INTERVIEW_LIST_FILTERS,
  type InterviewListFilters,
} from "@/lib/hiring/interviewListData";
import { hiringTransition } from "../hiringTokens";

const INTERVIEW_STATUSES = ["Pending", "Scheduled", "Ongoing", "Completed", "Cancelled"] as const;
const FEEDBACK_STATUSES = ["Not Requested", "Requested", "Pending", "Submitted", "Overdue"] as const;

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const display = value || "All";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-1.5 rounded-[11px] border-[rgba(15,23,42,0.06)] px-3 text-xs font-medium shadow-none",
            hiringTransition,
          )}
        >
          <span className="text-text-secondary/70">{label}:</span>
          <span className="max-w-[100px] truncate text-text">{display}</span>
          <ChevronDown className="h-3 w-3 text-muted/70" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt} value={opt}>
              {opt}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InterviewListFiltersBar({
  filters,
  onChange,
  roundOptions,
  interviewerOptions,
}: {
  filters: InterviewListFilters;
  onChange: (filters: InterviewListFilters) => void;
  roundOptions: string[];
  interviewerOptions: string[];
}) {
  const set = (patch: Partial<InterviewListFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/60" />
        <Input
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Search candidates…"
          className="h-9 rounded-[11px] border-[rgba(15,23,42,0.06)] pl-9 text-[12px] shadow-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterSelect label="Round" value={filters.round} options={roundOptions} onChange={(round) => set({ round })} />
        <FilterSelect
          label="Interviewer"
          value={filters.interviewer}
          options={interviewerOptions}
          onChange={(interviewer) => set({ interviewer })}
        />
        <FilterSelect
          label="Interview"
          value={filters.interviewStatus}
          options={[...INTERVIEW_STATUSES]}
          onChange={(interviewStatus) => set({ interviewStatus })}
        />
        <FilterSelect
          label="Feedback"
          value={filters.feedbackStatus}
          options={[...FEEDBACK_STATUSES]}
          onChange={(feedbackStatus) => set({ feedbackStatus })}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-xs"
          onClick={() => onChange(EMPTY_INTERVIEW_LIST_FILTERS)}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
