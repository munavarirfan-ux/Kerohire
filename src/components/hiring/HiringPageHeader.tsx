import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hiringTransition } from "./hiringTokens";

export type HiringBreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
};

export function HiringPageHeader({
  title,
  subtitle,
  action,
  breadcrumb,
  backHref,
  backLabel = "Back to jobs",
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: HiringBreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  className?: string;
}) {
  const showNav = Boolean(backHref || breadcrumb?.length);

  return (
    <div className={cn("space-y-4", className)}>
      {showNav ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-surface/80 px-2.5 py-1.5 text-xs font-medium text-text-secondary",
                  hiringTransition,
                  "hover:border-[rgba(15,23,42,0.12)] hover:bg-surface hover:text-text dark:border-white/[0.08] dark:hover:border-white/[0.12]",
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                {backLabel}
              </Link>
            ) : null}
            {breadcrumb?.length ? (
              <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1 text-[11px]">
                {breadcrumb.map((b, i) => (
                  <span key={`${b.label}-${i}`} className="flex min-w-0 items-center gap-1">
                    {i > 0 ? <ChevronRight className="h-3 w-3 shrink-0 text-muted/50" strokeWidth={2} /> : null}
                    {b.current ? (
                      <span className="truncate font-medium text-text" aria-current="page">
                        {b.label}
                      </span>
                    ) : b.href ? (
                      <Link
                        href={b.href}
                        className={cn(
                          "truncate font-medium text-muted/80",
                          hiringTransition,
                          "hover:text-text-secondary",
                        )}
                      >
                        {b.label}
                      </Link>
                    ) : b.onClick ? (
                      <button
                        type="button"
                        onClick={b.onClick}
                        className={cn(
                          "truncate font-medium text-muted/80",
                          hiringTransition,
                          "hover:text-text-secondary",
                        )}
                      >
                        {b.label}
                      </button>
                    ) : (
                      <span className="truncate font-medium text-muted/80">{b.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-text sm:text-[2rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-[13px] leading-relaxed text-text-secondary/70">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
      </div>
    </div>
  );
}
