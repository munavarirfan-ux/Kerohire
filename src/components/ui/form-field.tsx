"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export function FormField({
  label,
  htmlFor,
  children,
  className,
  description,
  error,
  required,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  error?: string;
  required?: boolean;
}) {
  const errorId = error && htmlFor ? `${htmlFor}-error` : undefined;

  const child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        "aria-invalid": error ? true : undefined,
        "aria-describedby": errorId ?? undefined,
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className={cn(error && "text-[#991B1B]")}>
        {label}
        {required ? (
          <>
            <span className="ml-0.5 text-[#DC2626]" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </Label>
      {child}
      {description ? <p className="text-[11px] text-muted">{description}</p> : null}
      {error ? (
        <p id={errorId} role="alert" className="text-[12px] font-medium text-[#B91C1C]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
