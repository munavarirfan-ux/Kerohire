import type {
  CandidateInterview,
  HiringCandidate,
  InterviewPipelineStep,
  InterviewSummaryStats,
} from "./types";
import { getInterviewFeedback } from "./interviewFeedback";

export function groupCandidateInterviews(interviews: CandidateInterview[]) {
  return {
    upcoming: interviews.filter((i) => i.status === "Scheduled"),
    completed: interviews.filter((i) => i.status === "Completed"),
    cancelled: interviews.filter((i) => i.status === "Cancelled"),
  };
}

export function getFeedbackCounts(interview: CandidateInterview) {
  const total = interview.interviewers.length;
  const submitted =
    interview.feedbackSubmittedCount ??
    (interview.feedbackStatus === "Submitted" ? Math.max(1, total) : 0);
  const pending =
    interview.feedbackPendingCount ??
    (interview.feedbackStatus === "Pending" && interview.status === "Completed"
      ? Math.max(0, total - submitted)
      : interview.status === "Scheduled"
        ? total
        : 0);
  return { submitted, pending, total };
}

export function computeInterviewSummary(candidate: HiringCandidate): InterviewSummaryStats {
  const { upcoming, completed } = groupCandidateInterviews(candidate.interviews);

  let feedbackPending = 0;
  for (const interview of candidate.interviews) {
    const { pending } = getFeedbackCounts(interview);
    if (interview.status === "Completed" && interview.feedbackStatus === "Pending") {
      feedbackPending += pending || 1;
    } else if (interview.status === "Scheduled") {
      feedbackPending += pending;
    }
  }

  const bundle = getInterviewFeedback(candidate);
  if (bundle.status !== "submitted" && bundle.requestedAt && feedbackPending === 0) {
    feedbackPending = 1;
  }

  const ratings = completed
    .map((i) => i.overallRating)
    .filter((r): r is number => typeof r === "number");
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;

  return {
    total: candidate.interviews.length,
    upcoming: upcoming.length,
    feedbackPending,
    averageRating,
  };
}

export function buildInterviewPipeline(candidate: HiringCandidate): InterviewPipelineStep[] {
  if (candidate.interviewPipeline?.length) return candidate.interviewPipeline;

  const steps: InterviewPipelineStep[] = [];
  const completed = candidate.interviews.filter((i) => i.status === "Completed");
  const scheduled = candidate.interviews.find((i) => i.status === "Scheduled");

  completed.forEach((i, idx) => {
    steps.push({
      id: `pipe-${i.id}`,
      label: i.round,
      state: idx === completed.length - 1 && !scheduled ? "completed" : "completed",
    });
  });

  if (scheduled) {
    steps.push({
      id: `pipe-${scheduled.id}`,
      label: scheduled.round,
      state: "active",
    });
  }

  if (steps.length === 0 && candidate.currentSubstage) {
    steps.push({
      id: "pipe-current",
      label: candidate.currentSubstage,
      state: "active",
    });
  }

  return steps;
}

export function formatFeedbackRequestedLabel(requestedAt?: string): string | null {
  if (!requestedAt) return null;
  const ts = new Date(requestedAt).getTime();
  if (Number.isNaN(ts)) return null;
  const diffMs = Date.now() - ts;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Feedback requested just now";
  if (hours < 24) return `Feedback requested ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Feedback requested ${days}d ago`;
}

export function enrichInterviewDefaults(interview: CandidateInterview): CandidateInterview {
  return {
    interviewType: interview.interviewType ?? "Video",
    durationMinutes: interview.durationMinutes ?? 45,
    platform: interview.platform ?? "Google Meet",
    hasNotes: interview.hasNotes ?? interview.status === "Completed",
    hasRecording: interview.hasRecording ?? interview.status === "Completed",
    hasCodeChallenge:
      interview.hasCodeChallenge ??
      interview.round.toLowerCase().includes("technical"),
    overallRating:
      interview.overallRating ??
      (interview.status === "Completed" && interview.result
        ? interview.result === "Strong Hire"
          ? 4.5
          : interview.result === "Hire"
            ? 4
            : interview.result === "Hold"
              ? 3.2
              : 2.5
        : undefined),
    ...interview,
  };
}
