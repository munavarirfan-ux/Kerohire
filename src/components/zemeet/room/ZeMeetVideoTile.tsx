"use client";

import { MicOff } from "lucide-react";
import { zemeetVideoTile } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

export type VideoTileParticipant = {
  name: string;
  initials: string;
  title?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking?: boolean;
  isObserver?: boolean;
};

export function ZeMeetVideoTile({
  participant,
  large,
  compact,
  speaking,
}: {
  participant: VideoTileParticipant;
  large?: boolean;
  compact?: boolean;
  speaking?: boolean;
}) {
  return (
    <div
      className={cn(
        zemeetVideoTile,
        large && "min-h-[220px] lg:min-h-0 lg:h-full",
        compact && "min-h-0 h-[88px]",
        !large && !compact && "min-h-[120px]",
        speaking && "ring-2 ring-[rgb(var(--accent-rgb)/0.45)]",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e2636] to-[#12171f]" />
      {participant.isVideoOn ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "font-semibold text-white/25",
              large && "text-[5rem]",
              compact && "text-[1.75rem]",
              !large && !compact && "text-[2.5rem]",
            )}
          >
            {participant.initials}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1118]">
          <span className={cn("text-white/40", compact ? "text-[10px]" : "text-[13px]")}>
            Camera off
          </span>
        </div>
      )}
      <div
        className={cn(
          "absolute flex items-end justify-between gap-2",
          compact ? "bottom-1.5 left-1.5 right-1.5" : "bottom-3 left-3 right-3",
        )}
      >
        <div className="min-w-0">
          <p className={cn("truncate font-semibold text-white", compact ? "text-[10px]" : "text-[13px]")}>
            {participant.name}
          </p>
          {!compact && participant.title ? (
            <p className="text-[11px] text-white/50">{participant.title}</p>
          ) : null}
        </div>
        {participant.isMuted ? (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-black/50 text-white/80",
              compact ? "h-5 w-5" : "h-7 w-7",
            )}
          >
            <MicOff className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} strokeWidth={1.5} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
