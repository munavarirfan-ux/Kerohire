export type KpiDef = {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  /** e.g. "+12% from yesterday" */
  trend?: string;
  trendUp?: boolean;
  /** Secondary operational line */
  insight?: string;
  icon: "briefcase" | "users" | "mic" | "percent" | "inbox" | "check" | "calendar" | "clipboard" | "flag" | "layers" | "archive" | "shield";
};

export const dashboardGreeting = {
  /** Shown when no session name */
  fallbackName: "Irfan",
  stats: {
    interviewsToday: 4,
    feedbackPending: 12,
    assessmentsAwaitingReview: 3,
  },
};

/** Interview funnel for Recharts */
export const interviewStatusChart = [
  { name: "Invited", value: 22, fill: "#71717A" },
  { name: "Upcoming", value: 31, fill: "#FF6B2C" },
  { name: "Ongoing", value: 6, fill: "#F97316" },
  { name: "Completed", value: 58, fill: "#16A34A" },
  { name: "No Show", value: 4, fill: "#EF4444" },
  { name: "Rescheduled", value: 3, fill: "#F59E0B" },
];

export const interviewerProductivityRows = [
  { name: "Marcus Chen", conducted: 18, totalHours: 22.5, avgRating: 4.7, barPct: 100 },
  { name: "Ava Patel", conducted: 14, totalHours: 16.0, avgRating: 4.5, barPct: 78 },
  { name: "Noah Singh", conducted: 12, totalHours: 15.25, avgRating: 4.6, barPct: 67 },
  { name: "Lina Hoffmann", conducted: 9, totalHours: 11.0, avgRating: 4.4, barPct: 50 },
  { name: "Maya Torres", conducted: 7, totalHours: 8.25, avgRating: 4.3, barPct: 39 },
];

export type ScheduleRow = {
  candidate: string;
  role: string;
  interviewer: string;
  interviewerInitials: string;
  timeLabel: string;
  timezone: string;
  durationMin: number;
  stage: string;
  status: "Confirmed" | "Hold" | "Rescheduled";
  join: string;
};

export const upcomingScheduleRows: ScheduleRow[] = [
  {
    candidate: "Sarah Jenkins",
    role: "Senior business analyst",
    interviewer: "Ava Patel",
    interviewerInitials: "AP",
    timeLabel: "10:30",
    timezone: "CET",
    durationMin: 60,
    stage: "Technical",
    status: "Confirmed",
    join: "Join",
  },
  {
    candidate: "Morgen Hill",
    role: "Staff Backend Engineer",
    interviewer: "Noah Singh",
    interviewerInitials: "NS",
    timeLabel: "15:00",
    timezone: "CET",
    durationMin: 90,
    stage: "System design",
    status: "Confirmed",
    join: "Join",
  },
  {
    candidate: "Elena Rodriguez",
    role: "Principal PM",
    interviewer: "Marcus Chen",
    interviewerInitials: "MC",
    timeLabel: "17:15",
    timezone: "EST",
    durationMin: 45,
    stage: "Culture",
    status: "Hold",
    join: "Join",
  },
];

/** Design mock: four green bars, shared axis label "90 – 100", heights ~45 / 30 / 65 / 20 */
export const assessmentQualification = [
  { range: "90 – 100", count: 45 },
  { range: "90 – 100", count: 30 },
  { range: "90 – 100", count: 65 },
  { range: "90 – 100", count: 20 },
];

export const malpracticeSignals = [
  { label: "Copy / paste attempts", pct: 9, note: "Median 2 events per session" },
  { label: "Tab visibility changes", pct: 21, note: "Often paired with research tasks" },
  { label: "Window minimize / blur", pct: 16, note: "Within expected range" },
  { label: "AI-generated answer risk", pct: 6, note: "Style + timing heuristics" },
];

export const evaluationQueue = [
  { candidate: "Jamie Fox", assessment: "System Design — Senior", score: "—", wait: "2h" },
  { candidate: "Alex Chen", assessment: "Backend Systems", score: "82%", wait: "5h" },
  { candidate: "Priya Nair", assessment: "SQL + Analytics", score: "74%", wait: "1d" },
];

export const topTechnologies = [
  { name: "TypeScript", pct: 31, assessments: 69, barMuted: false },
  { name: "Python", pct: 34, assessments: 69, barMuted: false },
  { name: "GO", pct: 33, assessments: 69, barMuted: false },
  { name: "JAVA", pct: 29, assessments: 69, barMuted: true },
];

export const scheduleCalendarDays = [
  { day: "Mon", interviews: 6, conflicts: 0 },
  { day: "Tue", interviews: 9, conflicts: 1 },
  { day: "Wed", interviews: 11, conflicts: 0 },
  { day: "Thu", interviews: 14, conflicts: 2 },
  { day: "Fri", interviews: 8, conflicts: 0 },
];

export const evaluatorAvailability = [
  { name: "Marcus Chen", slots: "12 / 20", status: "Available" },
  { name: "Raj Mehta", slots: "6 / 20", status: "Limited" },
  { name: "Charlie Dubois", slots: "18 / 20", status: "Available" },
  { name: "Chandu", slots: "10 / 20", status: "Limited" },
  { name: "Praveen", slots: "14 / 20", status: "Available" },
  { name: "Supriya", slots: "8 / 20", status: "Limited" },
  { name: "Anuradha", slots: "16 / 20", status: "Available" },
  { name: "Kavya", slots: "11 / 20", status: "Available" },
];

export const schedulingConflicts = [
  { id: "1", detail: "Ava Patel — double-booked 14:00–15:00 Thu", severity: "medium" as const },
  { id: "2", detail: "Berlin panel room — overlap 11:00 Tue", severity: "low" as const },
];

export type OperationalActivityTone = "default" | "success" | "warning" | "accent";

export type OperationalActivityItem = {
  id: string;
  initials: string;
  headline: string;
  detail: string;
  timeLabel: string;
  tone: OperationalActivityTone;
};

export const recentOperationalActivity: OperationalActivityItem[] = [
  {
    id: "a1",
    initials: "MC",
    headline: "Marcus Chen submitted interview feedback",
    detail: "Senior Product Designer · Round 2",
    timeLabel: "2m ago",
    tone: "default",
  },
  {
    id: "a2",
    initials: "SJ",
    headline: "Sarah Jenkins moved to Round 3",
    detail: "Staff Backend Engineer · Pipeline",
    timeLabel: "14m ago",
    tone: "accent",
  },
  {
    id: "a3",
    initials: "AI",
    headline: "Assessment flagged for AI-risk review",
    detail: "SQL + Analytics · Heuristic match",
    timeLabel: "32m ago",
    tone: "warning",
  },
  {
    id: "a4",
    initials: "AP",
    headline: "Offer sent to Noah Singh",
    detail: "Principal PM · Compensation band B",
    timeLabel: "1h ago",
    tone: "default",
  },
  {
    id: "a5",
    initials: "NS",
    headline: "Candidate accepted offer",
    detail: "Platform Engineer · London",
    timeLabel: "2h ago",
    tone: "success",
  },
];
