import type { HiringCandidate } from "./types";

export const HIRING_STAGES = [
  "Applied",
  "Screening",
  "Interviews",
  "Hired & Offers",
  "Rejected",
] as const;

export type HiringStageName = (typeof HIRING_STAGES)[number];

export const CANDIDATE_SOURCES = [
  "Careers Website",
  "LinkedIn",
  "Referral",
  "Direct Upload",
  "Agency",
  "Campus",
  "Naukri",
  "Internal Upload",
  "Walk-in",
  "Other",
] as const;

export type CandidateSource = (typeof CANDIDATE_SOURCES)[number];

export const SOURCE_CATEGORIES = [
  "Website",
  "Social",
  "Referral",
  "Agency",
  "Campus",
  "Direct",
  "Internal",
  "Other",
] as const;

export type SourceCategory = (typeof SOURCE_CATEGORIES)[number];

export type AddedBy = "external" | "admin" | "superAdmin";

/** Sub-stages shown on Applicants Stats (Screening pipeline) */
export const SCREENING_SUBSTAGES = ["Resume Review", "Applied", "Shortlisted"] as const;

export const APPLICANTS_STATS_COLUMNS = [
  { id: "applied", title: "Applied" },
  { id: "shortlisted", title: "Shortlisted" },
] as const;

export const APPLIED_SUBSTAGES = ["New Application"] as const;

export const STAGE_SUBSTAGES: Record<HiringStageName, readonly string[]> = {
  Applied: APPLIED_SUBSTAGES,
  Screening: SCREENING_SUBSTAGES,
  Interviews: ["Technical Round 1", "Technical Round 2", "HR Round"],
  "Hired & Offers": [
    "Offer Draft",
    "Offer Sent",
    "Offer Accepted",
    "Offer Declined",
    "Hired",
  ],
  Rejected: ["Rejected"],
};

const LEGACY_SCREENING_KANBAN = new Set([
  "resume-review",
  "recruiter-screening",
  "hm-review",
]);

const SUBSTAGE_TO_KANBAN: Record<string, string> = {
  "New Application": "new-application",
  Applied: "applied",
  Shortlisted: "shortlisted",
  "Resume Review": "applied",
  "Recruiter Screening": "applied",
  "Hiring Manager Review": "applied",
  "Technical Round 1": "tech-1",
  "Technical Round 2": "tech-2",
  "HR Round": "hr-round",
  "Portfolio Review": "portfolio",
  "Design Review": "design-review",
  "Offer Draft": "offer-draft",
  "Offer Sent": "offer-sent",
  "Offer Accepted": "offer-accepted",
  "Offer Declined": "offer-declined",
  Hired: "hired",
  Rejected: "rejected",
};

const LEGACY_SOURCE_MAP: Record<string, CandidateSource> = {
  Careers: "Careers Website",
  "Careers Website": "Careers Website",
  LinkedIn: "LinkedIn",
  Referral: "Referral",
  Direct: "Direct Upload",
  "Direct Upload": "Direct Upload",
  Agency: "Agency",
  Campus: "Campus",
  Naukri: "Naukri",
  "Internal Upload": "Internal Upload",
  "Walk-in": "Walk-in",
  Other: "Other",
};

export function legacyStageToStage(currentStage: string): HiringStageName {
  const s = currentStage.toLowerCase();
  if (s.includes("reject")) return "Rejected";
  if (s.includes("interview")) return "Interviews";
  if (s.includes("screen")) return "Screening";
  if (s.includes("hire") || s.includes("offer")) return "Hired & Offers";
  if (s.includes("applicant") || s.includes("applied")) return "Applied";
  return "Applied";
}

export function normalizeSource(source: string): CandidateSource {
  return LEGACY_SOURCE_MAP[source] ?? "Other";
}

export function inferSourceCategory(source: CandidateSource): SourceCategory {
  switch (source) {
    case "Careers Website":
    case "Naukri":
      return "Website";
    case "LinkedIn":
      return "Social";
    case "Referral":
      return "Referral";
    case "Agency":
      return "Agency";
    case "Campus":
      return "Campus";
    case "Internal Upload":
      return "Internal";
    case "Direct Upload":
    case "Walk-in":
      return "Direct";
    default:
      return "Other";
  }
}

export function defaultSubstageForStage(stage: HiringStageName): string {
  return STAGE_SUBSTAGES[stage][0] ?? "New Application";
}

export function kanbanColumnForSubstage(substage: string): string {
  return SUBSTAGE_TO_KANBAN[substage] ?? substage.toLowerCase().replace(/\s+/g, "-");
}

/** Resolve sub-stage label from a kanban column id within a pipeline stage */
export function substageForKanbanColumn(columnId: string, stage: HiringStageName): string {
  for (const [substage, colId] of Object.entries(SUBSTAGE_TO_KANBAN)) {
    if (colId === columnId) return substage;
  }
  for (const sub of STAGE_SUBSTAGES[stage]) {
    if (kanbanColumnForSubstage(sub) === columnId) return sub;
  }
  return defaultSubstageForStage(stage);
}

export function getDefaultStageForAddedBy(addedBy: AddedBy): HiringStageName {
  return addedBy === "external" ? "Applied" : "Screening";
}

export function getDefaultStageReason(addedBy: AddedBy): string {
  if (addedBy === "external") {
    return "Externally sourced applicants start in Applied.";
  }
  return "Manually added candidates start in Screening by default.";
}

export function getDefaultSubstageForAddedBy(addedBy: AddedBy): string {
  return addedBy === "external" ? "New Application" : "Resume Review";
}

export function addedByFromPreviewRole(role: string): AddedBy {
  if (role === "superAdmin") return "superAdmin";
  if (role === "admin") return "admin";
  return "admin";
}

/** Maps a Screening-stage candidate to Applicants Stats board: applied | shortlisted */
export function applicantsStatsColumnId(candidate: HiringCandidate): "applied" | "shortlisted" {
  if (
    candidate.kanbanColumn === "shortlisted" ||
    candidate.currentSubstage === "Shortlisted"
  ) {
    return "shortlisted";
  }
  if (candidate.kanbanColumn === "applied" || candidate.currentSubstage === "Applied") {
    return "applied";
  }
  if (candidate.kanbanColumn && LEGACY_SCREENING_KANBAN.has(candidate.kanbanColumn)) {
    return "applied";
  }
  return "applied";
}

/** Enrich legacy mock rows with canonical stage / source fields */
export function enrichCandidate(candidate: HiringCandidate): HiringCandidate {
  const stage = candidate.stage ?? legacyStageToStage(candidate.currentStage);
  const source = candidate.source
    ? normalizeSource(candidate.source as string)
    : "Other";
  const sourceCategory =
    candidate.sourceCategory ?? inferSourceCategory(source as CandidateSource);
  const addedBy = candidate.addedBy ?? "external";
  const defaultStageReason =
    candidate.defaultStageReason ?? getDefaultStageReason(addedBy);

  return {
    ...candidate,
    stage,
    currentStage: stage,
    source: source as HiringCandidate["source"],
    sourceCategory,
    addedBy,
    defaultStageReason,
  };
}

export function getCandidateStage(candidate: HiringCandidate): HiringStageName {
  return candidate.stage ?? legacyStageToStage(candidate.currentStage);
}

export function syncCandidateStageFields(
  candidate: HiringCandidate,
  stage: HiringStageName,
  substage?: string,
): void {
  const nextSubstage = substage ?? defaultSubstageForStage(stage);
  candidate.stage = stage;
  candidate.currentStage = stage;
  candidate.currentSubstage = nextSubstage;
  candidate.kanbanColumn = kanbanColumnForSubstage(nextSubstage);
}

export function filterCandidatesByStage(
  candidates: HiringCandidate[],
  stage: HiringStageName,
): HiringCandidate[] {
  return candidates.filter((c) => getCandidateStage(c) === stage);
}

export function isCandidateInRejectedStage(candidate: HiringCandidate): boolean {
  return getCandidateStage(candidate) === "Rejected";
}

export type MoveStageResult =
  | { ok: true; candidate: HiringCandidate; fromStage: HiringStageName; toStage: HiringStageName }
  | { ok: false; error: string };

export function buildStageTimelineDetail(
  fromStage: HiringStageName,
  toStage: HiringStageName,
  substage: string,
): string {
  return `Candidate moved from ${fromStage} to ${toStage}${substage ? ` · ${substage}` : ""}`;
}
