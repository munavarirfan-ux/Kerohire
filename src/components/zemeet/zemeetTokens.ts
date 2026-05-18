import { cn } from "@/lib/utils";

/** ZeMeet immersive shell — Meet × Linear × Vercel */
export const zemeetShell =
  "relative min-h-dvh overflow-hidden bg-[#0B0F14] text-[#E8EAED]";

export const zemeetGrain =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(var(--accent-rgb)/0.12),transparent_55%)]";

export const zemeetGlass = cn(
  "rounded-[16px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl",
  "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]",
);

export const zemeetGlassElevated = cn(
  zemeetGlass,
  "bg-white/[0.06] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.65)]",
);

export const zemeetPanel = cn(
  "rounded-[14px] border border-white/[0.06] bg-[#12171F]/90 backdrop-blur-md",
);

export const zemeetLabel =
  "text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45";

export const zemeetMeta = "text-[12px] text-white/55";

export const zemeetTitle = "text-[15px] font-semibold tracking-[-0.02em] text-white/95";

export const zemeetControlBtn = cn(
  "inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-150",
  "bg-white/[0.08] text-white/90 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
);

export const zemeetControlBtnDanger = cn(
  zemeetControlBtn,
  "bg-red-500/90 hover:bg-red-500 text-white",
);

export const zemeetControlBtnActive = cn(zemeetControlBtn, "bg-white text-[#0B0F14]");

export const zemeetPrimaryBtn = cn(
  "inline-flex h-11 items-center justify-center rounded-[12px] px-6 text-[14px] font-semibold",
  "bg-[rgb(var(--accent-rgb))] text-white shadow-[0_4px_24px_-4px_rgb(var(--accent-rgb)/0.5)]",
  "transition-all duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
);

export const zemeetVideoTile = cn(
  "relative overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#161B24]",
  "shadow-[0_12px_40px_-16px_rgba(0,0,0,0.6)]",
);
