import { HIRING_CANDIDATES } from "@/lib/hiring/mockData";
import type { ZeMeetSessionArtifact } from "./types";

/**
 * Post-session sync into Candidate Report (mock in-memory).
 * Production: POST /api/hiring/candidates/:id/interviews/:id/artifacts
 */
export function syncZeMeetArtifactToCandidateReport(artifact: ZeMeetSessionArtifact): boolean {
  const candidate = HIRING_CANDIDATES.find((c) => c.id === artifact.candidateId);
  if (!candidate) return false;

  const idx = candidate.interviews.findIndex((i) => i.id === artifact.interviewId);
  if (idx < 0) return false;

  const interview = candidate.interviews[idx];
  candidate.interviews[idx] = {
    ...interview,
    hasNotes: artifact.notes.length > 0 || interview.hasNotes,
    hasCodeChallenge: Boolean(artifact.codeChallenge) || interview.hasCodeChallenge,
    hasRecording: Boolean(artifact.recordingUrl) || interview.hasRecording,
    status: interview.status === "Scheduled" ? "Completed" : interview.status,
  };

  candidate.timeline = [
    {
      id: `t-zemeet-${Date.now()}`,
      label: "ZeMeet session completed",
      detail: `${artifact.durationSeconds}s · notes & artifacts synced to report`,
      at: "Just now",
    },
    ...candidate.timeline,
  ];

  return true;
}
