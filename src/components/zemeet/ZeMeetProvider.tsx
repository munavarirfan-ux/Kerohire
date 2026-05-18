"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  DEFAULT_DEVICE_SETTINGS,
  DEFAULT_PERMISSIONS,
  type ZeMeetChatMessage,
  type ZeMeetCodeChallenge,
  type ZeMeetDeviceSettings,
  type ZeMeetFeedbackDraft,
  type ZeMeetNoteEntry,
  type ZeMeetPermissionState,
  type ZeMeetInterviewerIntelPanel,
  type ZeMeetPhase,
  type ZeMeetSession,
} from "@/lib/zemeet/types";

const DEFAULT_CODE: ZeMeetCodeChallenge = {
  status: "idle",
  problemTitle: "Design a rate limiter",
  problemStatement:
    "Implement a token-bucket rate limiter API. Support `allow(key)` returning boolean and document tradeoffs.",
  language: "TypeScript",
  starterCode: `export function createRateLimiter(maxTokens: number, refillPerSec: number) {
  // your implementation
}`,
  candidateCode: `export function createRateLimiter(maxTokens: number, refillPerSec: number) {
  let tokens = maxTokens;
  let last = Date.now();
  return {
    allow(_key: string) {
      const now = Date.now();
      const elapsed = (now - last) / 1000;
      tokens = Math.min(maxTokens, tokens + elapsed * refillPerSec);
      last = now;
      if (tokens >= 1) {
        tokens -= 1;
        return true;
      }
      return false;
    },
  };
}`,
  testCases: [
    { id: "t1", label: "allows burst within limit", passed: true },
    { id: "t2", label: "refills over time", passed: undefined },
    { id: "t3", label: "rejects when empty", passed: undefined },
  ],
  consoleOutput: "> Running tests…\n✓ allows burst within limit\n⧗ refills over time (pending)",
  interviewerNotes: "",
};

type ZeMeetContextValue = {
  session: ZeMeetSession;
  phase: ZeMeetPhase;
  setPhase: (p: ZeMeetPhase) => void;
  devices: ZeMeetDeviceSettings;
  setDevices: React.Dispatch<React.SetStateAction<ZeMeetDeviceSettings>>;
  permissions: ZeMeetPermissionState;
  setPermissions: React.Dispatch<React.SetStateAction<ZeMeetPermissionState>>;
  elapsedSeconds: number;
  isRecording: boolean;
  setRecording: (v: boolean) => void;
  sidebarTab: "participants" | "chat" | "notes" | null;
  setSidebarTab: (t: "participants" | "chat" | "notes" | null) => void;
  notes: ZeMeetNoteEntry[];
  addNote: (body: string) => void;
  chat: ZeMeetChatMessage[];
  sendChat: (body: string) => void;
  codeChallenge: ZeMeetCodeChallenge;
  toggleCodeChallenge: () => void;
  inviteCodeChallenge: () => void;
  acceptCodeChallenge: () => void;
  declineCodeChallenge: () => void;
  updateCandidateCode: (code: string) => void;
  runCodeTests: () => void;
  closeCodeChallenge: () => void;
  interviewerIntelPanel: ZeMeetInterviewerIntelPanel;
  toggleInterviewerIntel: (panel: "resume" | "linkedin") => void;
  feedback: ZeMeetFeedbackDraft;
  setFeedback: React.Dispatch<React.SetStateAction<ZeMeetFeedbackDraft>>;
  sessionStartedAt: number | null;
  startSession: () => void;
};

const ZeMeetContext = createContext<ZeMeetContextValue | null>(null);

export function useZeMeet() {
  const ctx = useContext(ZeMeetContext);
  if (!ctx) throw new Error("useZeMeet must be used within ZeMeetProvider");
  return ctx;
}

const emptyFeedback = (): ZeMeetFeedbackDraft => ({
  recommendation: null,
  skillRatings: {},
  summary: "",
  technicalEvaluation: "",
  cultureFit: "",
  reInterview: false,
});

export function ZeMeetProvider({
  session,
  children,
}: {
  session: ZeMeetSession;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<ZeMeetPhase>("lobby");
  const [devices, setDevices] = useState(DEFAULT_DEVICE_SETTINGS);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRecording, setRecording] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"participants" | "chat" | "notes" | null>(null);
  const [notes, setNotes] = useState<ZeMeetNoteEntry[]>([]);
  const [chat, setChat] = useState<ZeMeetChatMessage[]>([]);
  const [codeChallenge, setCodeChallenge] = useState<ZeMeetCodeChallenge>(DEFAULT_CODE);
  const [interviewerIntelPanel, setInterviewerIntelPanel] =
    useState<ZeMeetInterviewerIntelPanel>("none");
  const [feedback, setFeedback] = useState<ZeMeetFeedbackDraft>(emptyFeedback);
  const sessionStartedAt = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSession = useCallback(() => {
    sessionStartedAt.current = Date.now();
    setPhase("live");
    setRecording(session.recordingEnabled);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (sessionStartedAt.current) {
        setElapsedSeconds(Math.floor((Date.now() - sessionStartedAt.current) / 1000));
      }
    }, 1000);
  }, [session.recordingEnabled]);

  const addNote = useCallback((body: string) => {
    if (!body.trim()) return;
    const offset = sessionStartedAt.current
      ? Date.now() - sessionStartedAt.current
      : undefined;
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        body: body.trim(),
        createdAt: new Date().toISOString(),
        timestampMs: offset,
      },
      ...prev,
    ]);
  }, []);

  const sendChat = useCallback(
    (body: string) => {
      if (!body.trim()) return;
      const me = session.participants.find((p) => p.id === session.viewerId);
      setChat((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          authorId: session.viewerId,
          authorName: me?.name ?? "You",
          body: body.trim(),
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    },
    [session],
  );

  const inviteCodeChallenge = useCallback(() => {
    setCodeChallenge((c) => ({ ...c, status: "invite_pending" }));
  }, []);

  const acceptCodeChallenge = useCallback(() => {
    setCodeChallenge((c) => ({
      ...c,
      status: "active",
      startedAt: c.startedAt ?? new Date().toISOString(),
    }));
  }, []);

  const declineCodeChallenge = useCallback(() => {
    setCodeChallenge((c) => ({ ...c, status: "declined" }));
  }, []);

  const closeCodeChallenge = useCallback(() => {
    setInterviewerIntelPanel("none");
    setCodeChallenge((c) => ({
      ...c,
      status: "completed",
      durationSeconds: c.durationSeconds ?? 600,
    }));
  }, []);

  const toggleInterviewerIntel = useCallback((panel: "resume" | "linkedin") => {
    setInterviewerIntelPanel((current) => (current === panel ? "none" : panel));
  }, []);

  const toggleCodeChallenge = useCallback(() => {
    const isCandidate = session.viewerRole === "candidate";
    const { status } = codeChallenge;

    if (status === "active") {
      closeCodeChallenge();
      toast.message("Code challenge closed");
      return;
    }

    if (isCandidate) {
      if (status === "invite_pending") {
        acceptCodeChallenge();
        toast.success("Code challenge started");
      }
      return;
    }

    // Interviewer / observer — open coding workspace immediately
    if (status === "idle" || status === "declined") {
      acceptCodeChallenge();
      toast.success("Code challenge opened", {
        description: "Candidate receives accept / decline in their session · you observe live",
      });
      sendChat("Code challenge invitation sent — candidate can accept from their view.");
      return;
    }

    if (status === "invite_pending" || status === "completed") {
      acceptCodeChallenge();
      toast.success("Code challenge opened");
    }
  }, [
    session.viewerRole,
    codeChallenge.status,
    acceptCodeChallenge,
    closeCodeChallenge,
    sendChat,
  ]);

  const updateCandidateCode = useCallback((code: string) => {
    setCodeChallenge((c) => ({ ...c, candidateCode: code }));
  }, []);

  const runCodeTests = useCallback(() => {
    setCodeChallenge((c) => ({
      ...c,
      consoleOutput: `${c.consoleOutput}\n✓ refills over time\n✓ rejects when empty\n\nAll tests passed.`,
      testCases: c.testCases.map((t) => ({ ...t, passed: true })),
    }));
  }, []);

  const value = useMemo(
    () => ({
      session,
      phase,
      setPhase,
      devices,
      setDevices,
      permissions,
      setPermissions,
      elapsedSeconds,
      isRecording,
      setRecording,
      sidebarTab,
      setSidebarTab,
      notes,
      addNote,
      chat,
      sendChat,
      codeChallenge,
      toggleCodeChallenge,
      inviteCodeChallenge,
      acceptCodeChallenge,
      declineCodeChallenge,
      updateCandidateCode,
      runCodeTests,
      closeCodeChallenge,
      interviewerIntelPanel,
      toggleInterviewerIntel,
      feedback,
      setFeedback,
      sessionStartedAt: sessionStartedAt.current,
      startSession,
    }),
    [
      session,
      phase,
      devices,
      permissions,
      elapsedSeconds,
      isRecording,
      sidebarTab,
      notes,
      addNote,
      chat,
      sendChat,
      codeChallenge,
      toggleCodeChallenge,
      inviteCodeChallenge,
      acceptCodeChallenge,
      declineCodeChallenge,
      updateCandidateCode,
      runCodeTests,
      closeCodeChallenge,
      interviewerIntelPanel,
      toggleInterviewerIntel,
      feedback,
      setFeedback,
      startSession,
    ],
  );

  return <ZeMeetContext.Provider value={value}>{children}</ZeMeetContext.Provider>;
}
