/**
 * ZeMeet — collaborative interview workspace domain model.
 *
 * Architecture layers:
 * 1. Scheduling (Hiring OS) → creates ZeMeetRoom + notifications
 * 2. Lobby → device setup + interview context
 * 3. Live room → video, chat, private notes, code challenge
 * 4. Post-session → feedback modal + auto-sync to Candidate Report
 *
 * Future: WebRTC provider (LiveKit/Daily), CRDT notes, real editor (Monaco/CodeMirror).
 */

export type ZeMeetParticipantRole = "candidate" | "interviewer" | "observer";

export type ZeMeetPhase = "lobby" | "live" | "feedback" | "ended";

export type ZeMeetConnectionQuality = "excellent" | "good" | "fair" | "poor";

export type ZeMeetCodeChallengeStatus =
  | "idle"
  | "invite_pending"
  | "declined"
  | "active"
  | "completed";

export type ZeMeetRecommendation =
  | "Strong Hire"
  | "Hire"
  | "Hold"
  | "No Hire"
  | "Re-interview";

export type ZeMeetParticipant = {
  id: string;
  name: string;
  role: ZeMeetParticipantRole;
  title?: string;
  initials: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking?: boolean;
  /** Admin / superAdmin silent monitor */
  isObserver?: boolean;
};

export type ZeMeetCandidateIntel = {
  email?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  portfolioUrl?: string;
  linkedin?: string;
  resumeUrl?: string;
  resumeStatus?: string;
};

export type ZeMeetInterviewerIntelPanel = "none" | "resume" | "linkedin";

export type ZeMeetInterviewContext = {
  roomId: string;
  jobTitle: string;
  jobId: string;
  roundTitle: string;
  interviewType: string;
  scheduledAt: string;
  timezone: string;
  durationMinutes: number;
  candidateId: string;
  candidateName: string;
  interviewId: string;
  /** Interviewer-only — never exposed in candidate UI */
  candidateIntel?: ZeMeetCandidateIntel;
};

export type ZeMeetSession = {
  context: ZeMeetInterviewContext;
  participants: ZeMeetParticipant[];
  /** Current viewer role (from auth / join link) */
  viewerRole: ZeMeetParticipantRole;
  viewerId: string;
  recordingEnabled: boolean;
  codeChallengeEnabled: boolean;
};

export type ZeMeetDeviceSettings = {
  cameraId: string;
  microphoneId: string;
  speakerId: string;
  blurBackground: boolean;
  virtualBackground: "none" | "office" | "gradient" | "brand";
  noiseCancellation: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
};

export type ZeMeetPermissionState = {
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
};

export type ZeMeetNoteEntry = {
  id: string;
  body: string;
  createdAt: string;
  /** Offset ms from session start */
  timestampMs?: number;
};

export type ZeMeetChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  at: string;
};

export type ZeMeetCodeChallenge = {
  status: ZeMeetCodeChallengeStatus;
  problemTitle: string;
  problemStatement: string;
  language: string;
  starterCode: string;
  candidateCode: string;
  testCases: { id: string; label: string; passed?: boolean }[];
  consoleOutput: string;
  startedAt?: string;
  durationSeconds?: number;
  interviewerNotes: string;
};

export type ZeMeetFeedbackDraft = {
  recommendation: ZeMeetRecommendation | null;
  skillRatings: Record<string, number>;
  summary: string;
  technicalEvaluation: string;
  cultureFit: string;
  reInterview: boolean;
};

export type ZeMeetSessionArtifact = {
  roomId: string;
  candidateId: string;
  interviewId: string;
  notes: ZeMeetNoteEntry[];
  codeChallenge?: ZeMeetCodeChallenge;
  feedback?: ZeMeetFeedbackDraft;
  recordingUrl?: string;
  endedAt: string;
  durationSeconds: number;
};

export const DEFAULT_DEVICE_SETTINGS: ZeMeetDeviceSettings = {
  cameraId: "default",
  microphoneId: "default",
  speakerId: "default",
  blurBackground: true,
  virtualBackground: "gradient",
  noiseCancellation: true,
  videoEnabled: true,
  audioEnabled: true,
};

export const DEFAULT_PERMISSIONS: ZeMeetPermissionState = {
  camera: true,
  microphone: true,
  notifications: true,
};

export const SKILL_RATING_LABELS = [
  "Problem solving",
  "System design",
  "Code quality",
  "Communication",
  "Collaboration",
] as const;
