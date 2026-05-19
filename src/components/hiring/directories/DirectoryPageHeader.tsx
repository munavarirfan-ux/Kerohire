"use client";

import { cn } from "@/lib/utils";

export function DirectoryPageHeader({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("space-y-1", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-text sm:text-[2rem]">{title}</h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-text-secondary/75">{subtitle}</p>
        </div>
        {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
      </div>
    </header>
  );
}
