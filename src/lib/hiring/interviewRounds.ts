import type { HiringCandidate } from "./types";
import { kanbanColumnForSubstage } from "./stages";

export type InterviewRound = {
  id: string;
  title: string;
};

export const DEFAULT_INTERVIEW_ROUNDS: InterviewRound[] = [
  { id: "tech-1", title: "Technical Round 1" },
  { id: "tech-2", title: "Technical Round 2" },
  { id: "hr-round", title: "HR Round" },
];

const STORAGE_PREFIX = "kerohire-interview-rounds";

/** Legacy kanban columns map into the default three-round pipeline */
const LEGACY_INTERVIEW_COLUMN_MAP: Record<string, string> = {
  portfolio: "tech-1",
  assignment: "tech-1",
  "design-review": "tech-2",
  culture: "hr-round",
  "system-design": "tech-2",
};

export function canManageInterviewRounds(role: string): boolean {
  return role === "superAdmin" || role === "admin";
}

export function getInterviewRounds(jobId: string): InterviewRound[] {
  if (typeof window === "undefined") return [...DEFAULT_INTERVIEW_ROUNDS];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${jobId}`);
    if (!raw) return [...DEFAULT_INTERVIEW_ROUNDS];
    const parsed = JSON.parse(raw) as InterviewRound[];
    return parsed.length > 0 ? parsed : [...DEFAULT_INTERVIEW_ROUNDS];
  } catch {
    return [...DEFAULT_INTERVIEW_ROUNDS];
  }
}

export function saveInterviewRounds(jobId: string, rounds: InterviewRound[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}:${jobId}`, JSON.stringify(rounds));
}

export function slugifyInterviewRoundId(title: string, existingIds: Set<string>): string {
  const base =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "interview-round";
  if (!existingIds.has(base)) return base;
  let n = 2;
  while (existingIds.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function substageForInterviewColumn(columnId: string, rounds: InterviewRound[]): string {
  const round = rounds.find((r) => r.id === columnId);
  if (round) return round.title;
  return rounds[0]?.title ?? DEFAULT_INTERVIEW_ROUNDS[0].title;
}

export function resolveInterviewColumnId(
  candidate: HiringCandidate,
  rounds: InterviewRound[],
): string {
  const roundIds = new Set(rounds.map((r) => r.id));

  if (candidate.kanbanColumn) {
    if (roundIds.has(candidate.kanbanColumn)) return candidate.kanbanColumn;
    const mapped = LEGACY_INTERVIEW_COLUMN_MAP[candidate.kanbanColumn];
    if (mapped && roundIds.has(mapped)) return mapped;
  }

  if (candidate.currentSubstage) {
    const byTitle = rounds.find((r) => r.title === candidate.currentSubstage);
    if (byTitle) return byTitle.id;
    const legacyCol = kanbanColumnForSubstage(candidate.currentSubstage);
    if (roundIds.has(legacyCol)) return legacyCol;
    const mapped = LEGACY_INTERVIEW_COLUMN_MAP[legacyCol];
    if (mapped && roundIds.has(mapped)) return mapped;
  }

  return rounds[0]?.id ?? DEFAULT_INTERVIEW_ROUNDS[0].id;
}

export function createInterviewRound(title: string, rounds: InterviewRound[]): InterviewRound {
  const trimmed = title.trim();
  const existingIds = new Set(rounds.map((r) => r.id));
  return {
    id: slugifyInterviewRoundId(trimmed, existingIds),
    title: trimmed,
  };
}
