"use client";

import { Code2, MonitorUp } from "lucide-react";
import { ZeMeetCodeEditor } from "@/components/zemeet/code/ZeMeetCodeEditor";
import { ZeMeetInterviewerIntelPanel } from "@/components/zemeet/code/ZeMeetInterviewerIntelPanel";
import { ZeMeetControlBar } from "@/components/zemeet/room/ZeMeetControlBar";
import { ZeMeetVideoPipRail } from "@/components/zemeet/room/ZeMeetVideoPipRail";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetGlass, zemeetLabel } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

/** Code challenge mode — screen-share layout with ongoing video PiP */
export function ZeMeetCodeChallengeLayout({ onLeave }: { onLeave: () => void }) {
  const { codeChallenge, session } = useZeMeet();
  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          zemeetGlass,
          "mx-4 mt-3 flex shrink-0 items-center justify-between gap-3 rounded-[12px] px-4 py-2.5",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgb(var(--accent-rgb)/0.15)]">
            <Code2 className="h-4 w-4 text-[rgb(var(--accent-rgb))]" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className={zemeetLabel}>Screen share · Code challenge</p>
            <p className="truncate text-[14px] font-semibold text-white">
              {codeChallenge.problemTitle}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-[11px] text-white/50 sm:flex">
          <MonitorUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          Video call continues in panel
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ZeMeetCodeEditor />

          {/* Floating PiP — Meet-style, above control bar */}
          <div className="pointer-events-none absolute bottom-24 right-4 z-20 max-h-[min(50vh,360px)] overflow-hidden">
            <ZeMeetVideoPipRail />
          </div>
        </div>

        {isInterviewer ? <ZeMeetInterviewerIntelPanel /> : null}
      </div>

      <ZeMeetControlBar onLeave={onLeave} codeChallengeMode />
    </div>
  );
}
