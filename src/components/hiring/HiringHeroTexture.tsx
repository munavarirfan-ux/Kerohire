"use client";

import { cn } from "@/lib/utils";
import { hiringHeroTopo, hiringHeroTopoPatternStyle } from "./hiringTokens";

/** Subtle [] bracket grid above hero gradient, below content */
export function HiringHeroTexture({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(hiringHeroTopo, className)}
      style={hiringHeroTopoPatternStyle}
    />
  );
}
