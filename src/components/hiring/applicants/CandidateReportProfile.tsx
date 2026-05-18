"use client";

import { CandidateReportResume } from "./CandidateReportResume";
import type { CandidateEditProfile } from "@/lib/hiring/candidateProfile";
import type { HiringCandidate } from "@/lib/hiring/types";

export function CandidateReportProfile({
  candidate,
  profile,
  onCandidateUpdated,
}: {
  candidate: HiringCandidate;
  profile: CandidateEditProfile;
  onCandidateUpdated: (candidate: HiringCandidate) => void;
}) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl">
      <CandidateReportResume
        candidate={candidate}
        profile={profile}
        onCandidateUpdated={onCandidateUpdated}
      />
    </div>
  );
}
