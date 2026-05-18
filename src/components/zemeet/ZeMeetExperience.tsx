"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ZeMeetFeedbackModal } from "@/components/zemeet/feedback/ZeMeetFeedbackModal";
import { ZeMeetLobby } from "@/components/zemeet/lobby/ZeMeetLobby";
import { ZeMeetRoom } from "@/components/zemeet/room/ZeMeetRoom";
import { ZeMeetProvider, useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetGrain, zemeetShell } from "@/components/zemeet/zemeetTokens";
import { syncZeMeetArtifactToCandidateReport } from "@/lib/zemeet/sync";
import type { ZeMeetSession, ZeMeetSessionArtifact } from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";

function ZeMeetFlow() {
  const { phase, setPhase, session, notes, codeChallenge, feedback, elapsedSeconds } = useZeMeet();

  const handleLeave = useCallback(() => {
    if (session.viewerRole === "candidate") {
      setPhase("ended");
      toast.success("You left the interview");
      return;
    }
    setPhase("feedback");
  }, [session.viewerRole, setPhase]);

  const handleFeedbackSubmit = useCallback(() => {
    const artifact: ZeMeetSessionArtifact = {
      roomId: session.context.roomId,
      candidateId: session.context.candidateId,
      interviewId: session.context.interviewId,
      notes,
      codeChallenge: codeChallenge.status !== "idle" ? codeChallenge : undefined,
      feedback,
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
    };
    syncZeMeetArtifactToCandidateReport(artifact);
    setPhase("ended");
    toast.success("Feedback saved to candidate report");
  }, [session, notes, codeChallenge, feedback, elapsedSeconds, setPhase]);

  if (phase === "ended") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">ZeMeet</p>
        <h1 className="mt-2 text-[1.5rem] font-semibold text-white">Session ended</h1>
        <p className="mt-2 max-w-sm text-[14px] text-white/55">
          Interview artifacts have been synced to the candidate report in Ze[code] Hiring
          Intelligence.
        </p>
        <a
          href={`/hiring/jobs/${session.context.jobId}`}
          className="mt-8 inline-flex h-11 items-center rounded-[12px] bg-white/10 px-5 text-[14px] font-medium text-white hover:bg-white/15"
        >
          Back to job workspace
        </a>
      </div>
    );
  }

  return (
    <>
      {phase === "lobby" ? <ZeMeetLobby /> : null}
      {phase === "live" ? <ZeMeetRoom onLeave={handleLeave} /> : null}
      <ZeMeetFeedbackModal onSubmit={handleFeedbackSubmit} />
    </>
  );
}

export function ZeMeetExperience({ session }: { session: ZeMeetSession }) {
  const searchParams = useSearchParams();
  const skipLobby = searchParams.get("join") === "1";

  return (
    <ZeMeetProvider session={session}>
      <ZeMeetExperienceInner skipLobby={skipLobby} />
    </ZeMeetProvider>
  );
}

function ZeMeetExperienceInner({ skipLobby }: { skipLobby: boolean }) {
  const { phase, startSession } = useZeMeet();

  useEffect(() => {
    if (skipLobby && phase === "lobby") startSession();
  }, [skipLobby, phase, startSession]);

  return (
    <div className={cn(zemeetShell, "flex min-h-dvh flex-col")}>
      <div className={zemeetGrain} aria-hidden />
      <ZeMeetFlow />
    </div>
  );
}
