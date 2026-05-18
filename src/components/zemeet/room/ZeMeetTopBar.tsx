"use client";

import { Circle, Radio, Wifi } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetLabel, zemeetMeta } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ZeMeetTopBar({ codeChallengeActive }: { codeChallengeActive?: boolean }) {
  const { session, elapsedSeconds, isRecording } = useZeMeet();
  const { context } = session;

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#0B0F14]/80 px-4 py-3 backdrop-blur-md">
      <div className="min-w-0">
        <p className={zemeetLabel}>{codeChallengeActive ? "ZeMeet · Code share" : "ZeMeet"}</p>
        <p className="truncate text-[14px] font-semibold text-white/95">
          {context.jobTitle} · {context.roundTitle}
        </p>
        <p className={cn(zemeetMeta, "truncate")}>{context.candidateName}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/70 sm:inline-flex">
          <Wifi className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.5} />
          Excellent
        </span>
        <span className="tabular-nums rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white/90">
          {formatElapsed(elapsedSeconds)}
        </span>
        {isRecording ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/60" />
              <Circle className="relative h-2 w-2 fill-red-400 text-red-400" />
            </span>
            REC
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
          <Radio className="h-3 w-3" strokeWidth={2} />
          Live
        </span>
      </div>
    </header>
  );
}
