import {
  countCandidateAssessments,
  countCandidateInterviews,
} from "@/lib/hiring/directoryAccess";
import { getCandidateStage } from "@/lib/hiring/stages";
import type { HiringCandidate } from "@/lib/hiring/types";

export type CandidateReportShellMode = "overview" | "assessment" | "interview";

export type CandidateReportAvailability = {
  assessmentCount: number;
  interviewCount: number;
  hasAssessment: boolean;
  hasInterview: boolean;
  shellModes: CandidateReportShellMode[];
  defaultShellMode: CandidateReportShellMode;
};

export function getCandidateReportAvailability(
  candidate: HiringCandidate,
): CandidateReportAvailability {
  const assessmentCount = countCandidateAssessments(candidate);
  const interviewCount = countCandidateInterviews(candidate);
  const hasAssessment = assessmentCount > 0;
  const hasInterview =
    interviewCount > 0 || getCandidateStage(candidate) === "Interviews";

  const shellModes: CandidateReportShellMode[] = [];
  if (hasAssessment && hasInterview) {
    shellModes.push("overview", "assessment", "interview");
  } else if (hasAssessment) {
    shellModes.push("assessment");
  } else if (hasInterview) {
    shellModes.push("interview");
  } else {
    shellModes.push("overview");
  }

  const defaultShellMode = shellModes[0] ?? "overview";

  return {
    assessmentCount,
    interviewCount,
    hasAssessment,
    hasInterview,
    shellModes,
    defaultShellMode,
  };
}

export function shellModeToInitialTab(mode: CandidateReportShellMode): string {
  if (mode === "assessment") return "assessment";
  if (mode === "interview") return "feedback";
  return "overview";
}

export const SHELL_MODE_LABELS: Record<CandidateReportShellMode, string> = {
  overview: "Candidate Overview",
  assessment: "Assessment Report",
  interview: "Interview Report",
};
