"use client";

import { CodeChallengeInviteModal } from "@/components/zemeet/code/CodeChallengeInviteModal";
import { ZeMeetCodeChallengeLayout } from "@/components/zemeet/code/ZeMeetCodeChallengeLayout";
import { ZeMeetControlBar } from "@/components/zemeet/room/ZeMeetControlBar";
import { ZeMeetSidebar } from "@/components/zemeet/room/ZeMeetSidebar";
import { ZeMeetTopBar } from "@/components/zemeet/room/ZeMeetTopBar";
import { ZeMeetVideoStage } from "@/components/zemeet/room/ZeMeetVideoStage";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";

export function ZeMeetRoom({ onLeave }: { onLeave: () => void }) {
  const { codeChallenge } = useZeMeet();
  const codeActive = codeChallenge.status === "active";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <ZeMeetTopBar codeChallengeActive={codeActive} />

      {codeActive ? (
        <ZeMeetCodeChallengeLayout onLeave={onLeave} />
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <ZeMeetVideoStage />
            <ZeMeetControlBar onLeave={onLeave} />
          </div>
          <ZeMeetSidebar />
        </div>
      )}

      <CodeChallengeInviteModal />
    </div>
  );
}
