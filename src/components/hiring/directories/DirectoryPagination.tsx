"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hiringTransition } from "../hiringTokens";

export function DirectoryPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  itemLabel = "items",
  className,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}) {
  if (totalCount === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.06)] px-3 py-2.5",
        "bg-[rgba(248,250,252,0.5)] dark:border-white/[0.06] dark:bg-white/[0.02]",
        className,
      )}
    >
      <p className="text-[11px] font-medium text-text-secondary/70">
        <span className="tabular-nums text-text">{start}</span>
        {"–"}
        <span className="tabular-nums text-text">{end}</span>
        {" of "}
        <span className="tabular-nums font-semibold text-text">{totalCount}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn("h-8 gap-1 rounded-[9px] px-2.5 text-[11px] font-medium", hiringTransition)}
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Previous
        </Button>

        <span className="min-w-[4.5rem] px-2 text-center text-[11px] font-medium tabular-nums text-text-secondary/80">
          Page {page} / {totalPages}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn("h-8 gap-1 rounded-[9px] px-2.5 text-[11px] font-medium", hiringTransition)}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
