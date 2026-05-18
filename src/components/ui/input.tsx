"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Native input styled for use with Radix `Label` — standard Radix form pattern. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full min-w-0 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-surface px-3 py-2 text-base text-text shadow-sm md:text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
