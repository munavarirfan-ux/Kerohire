"use client";

import { Code2 } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetGlassElevated, zemeetPrimaryBtn } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

export function CodeChallengeInviteModal() {
  const { codeChallenge, acceptCodeChallenge, declineCodeChallenge, session } = useZeMeet();

  if (codeChallenge.status !== "invite_pending" || session.viewerRole !== "candidate") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={cn(zemeetGlassElevated, "max-w-md p-6")}>
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgb(var(--accent-rgb)/0.15)] text-[rgb(var(--accent-rgb))]">
          <Code2 className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-[1.125rem] font-semibold text-white">Code challenge request</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          Your interviewer invited you to a live coding session:{" "}
          <span className="font-medium text-white/90">{codeChallenge.problemTitle}</span>
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-white/10 text-[13px] font-medium text-white/70 hover:bg-white/5"
            onClick={declineCodeChallenge}
          >
            Decline
          </button>
          <button type="button" className={cn(zemeetPrimaryBtn, "flex-1")} onClick={acceptCodeChallenge}>
            Accept & open
          </button>
        </div>
      </div>
    </div>
  );
}
