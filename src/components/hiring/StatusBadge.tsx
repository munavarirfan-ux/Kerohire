import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/hiring/types";

const STYLES: Record<JobStatus, string> = {
  Published:
    "border-emerald-500/12 bg-emerald-500/[0.07] text-emerald-800/90 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300/90",
  Internal:
    "border-sky-500/12 bg-sky-500/[0.07] text-sky-800/85 dark:border-sky-400/15 dark:bg-sky-400/10 dark:text-sky-300/90",
  External:
    "border-violet-500/12 bg-violet-500/[0.07] text-violet-800/85 dark:border-violet-400/15 dark:bg-violet-400/10 dark:text-violet-300/90",
  Draft:
    "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.03)] text-text-secondary/80 dark:border-white/[0.08] dark:bg-white/[0.04]",
  "On Hold":
    "border-amber-500/14 bg-amber-500/[0.08] text-amber-900/80 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300/90",
  Closed:
    "border-[rgba(15,23,42,0.05)] bg-[rgba(15,23,42,0.025)] text-muted dark:border-white/[0.06] dark:bg-white/[0.03]",
  Deleted:
    "border-red-500/12 bg-red-500/[0.07] text-red-800/85 dark:border-red-400/15 dark:bg-red-400/10 dark:text-red-300/90",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.03em]",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
