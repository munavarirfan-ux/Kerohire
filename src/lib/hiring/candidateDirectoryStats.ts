import type { CandidateDirectoryRow } from "@/lib/hiring/candidateDirectory";
import { getCandidateStage } from "@/lib/hiring/stages";

export type CandidateDirectoryStats = {
  total: number;
  interviewsActive: number;
  assessmentPending: number;
  feedbackPending: number;
  offersSent: number;
};

export function getCandidateDirectoryStats(rows: CandidateDirectoryRow[]): CandidateDirectoryStats {
  let interviewsActive = 0;
  let assessmentPending = 0;
  let feedbackPending = 0;
  let offersSent = 0;

  for (const row of rows) {
    const stage = getCandidateStage(row);
    if (stage === "Interviews" || row.interviewCount > 0) interviewsActive += 1;
    if (stage === "Screening" && row.assessmentCount === 0) assessmentPending += 1;
    if (stage === "Hired & Offers") offersSent += 1;
    feedbackPending += row.interviews.filter((i) => i.feedbackStatus === "Pending").length;
  }

  return {
    total: rows.length,
    interviewsActive,
    assessmentPending,
    feedbackPending,
    offersSent,
  };
}
