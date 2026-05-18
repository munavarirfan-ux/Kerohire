"use client";

import { MonitorUp } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { ZeMeetVideoTile } from "@/components/zemeet/room/ZeMeetVideoTile";
import { zemeetGlass } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

/** Floating video rail — call continues during code challenge (Meet screen-share style) */
export function ZeMeetVideoPipRail({ className }: { className?: string }) {
  const { session } = useZeMeet();
  const visible = session.participants.filter(
    (p) => !p.isObserver || session.viewerRole === "observer",
  );

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-[min(100%,280px)] flex-col gap-2",
        className,
      )}
    >
      <div
        className={cn(
          zemeetGlass,
          "flex items-center gap-2 rounded-[12px] px-3 py-2",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <MonitorUp className="h-3.5 w-3.5 text-white/55" strokeWidth={1.5} aria-hidden />
        <span className="text-[11px] font-medium text-white/80">Call continues</span>
      </div>

      <div className="space-y-2">
        {visible.map((p) => (
          <ZeMeetVideoTile
            key={p.id}
            participant={p}
            compact
            speaking={p.role === "candidate"}
          />
        ))}
      </div>
    </div>
  );
}
