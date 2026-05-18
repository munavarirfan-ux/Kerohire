import type { PreviewRole } from "@/config/previewRole";
import type { KpiDef } from "@/features/dashboard/data/dashboard.mock";

function kpi(
  id: string,
  label: string,
  value: string,
  subtitle: string,
  icon: KpiDef["icon"],
  trend?: string,
  trendUp?: boolean,
  insight?: string,
): KpiDef {
  return { id, label, value, subtitle, icon, trend, trendUp, insight };
}

export const dashboardKpisByRole: Record<PreviewRole, KpiDef[]> = {
  superAdmin: [
    kpi("activeJobs", "Active Jobs", "18", "Open requisitions", "briefcase", "+3 vs last week", true),
    kpi("newCandidates", "New Candidates", "1,824", "Across active pipelines", "users", "+6.2% vs last month", true),
    kpi("interviewsConducted", "Interviews Conducted", "182", "Completed sessions", "mic", "+3 vs last week", true),
    kpi("untouchedFeedback", "Untouched Feedback", "451", "feedback write-ups", "inbox", "12 due in 48h"),
    kpi("offerAcceptance", "Offer Acceptance Rate", "82%", "Rolling 90 days", "percent", "+4 pts vs target", true),
    kpi("hiredCandidates", "Hired Candidates", "46", "Closed wins", "check", "+9 this quarter", true),
  ],
  admin: [
    kpi("activeJobs", "Active Jobs", "18", "Open requisitions", "briefcase", "+3 vs last week", true),
    kpi("newCandidates", "New Candidates", "1,824", "Across active pipelines", "users", "+6.2% vs last month", true),
    kpi("interviewsConducted", "Interviews Conducted", "182", "Completed sessions", "mic", "+3 vs last week", true),
    kpi("untouchedFeedback", "Untouched Feedback", "451", "feedback write-ups", "inbox", "12 due in 48h"),
    kpi("offerAcceptance", "Offer Acceptance Rate", "82%", "Rolling 90 days", "percent", "+4 pts vs target", true),
    kpi("hiredCandidates", "Hired Candidates", "46", "Closed wins", "check", "+9 this quarter", true),
  ],
  curator: [
    kpi("questionsCreated", "Questions Created", "1,248", "Library total", "layers", "+42 this month", true),
    kpi("questionsUsed", "Questions Used", "18.4k", "Assessments & interviews", "clipboard", "+1.1k vs last month", true),
    kpi("lowQualityQuestions", "Low Quality Questions", "37", "Calibration / peer review", "flag", "Needs review"),
    kpi("archivedQuestions", "Archived Questions", "214", "Retired from active use", "archive", "+18 this quarter"),
  ],
  interviewer: [
    kpi("interviewsToday", "Interviews Today", "3", "Your calendar", "calendar", "Next at 2:30 PM"),
    kpi("feedbackDue", "Feedback Due", "5", "Write-ups owed", "inbox", "2 overdue", false),
    kpi("upcomingInterviews", "Upcoming Interviews", "11", "This week", "mic", "This week"),
    kpi("completedInterviews", "Completed Interviews", "42", "Trailing 30 days", "check", "+6 vs last month", true),
  ],
  evaluator: [
    kpi("ongoingAssessments", "Ongoing Assessments", "28", "Active reviews", "clipboard", "12 due this week"),
    kpi("pendingReviews", "Pending Reviews", "16", "Evaluator queue", "inbox", "5 high priority"),
    kpi("flaggedAssessments", "Flagged Assessments", "6", "Integrity / malpractice", "flag", "Needs escalation", false),
    kpi("completedEvaluations", "Completed Evaluations", "94", "Closed reviews", "shield", "+11 vs last month", true),
  ],
};

export type DashboardInsightTabId = "interviews" | "assessments" | "schedules";

export const insightTabsForUserRole: Record<
  PreviewRole,
  { id: DashboardInsightTabId; label: string; description: string }[]
> = {
  superAdmin: [
    { id: "interviews", label: "Interviews", description: "Pipeline health, interviewer load, and outcomes." },
    { id: "assessments", label: "Assessments", description: "Quality signals, calibration, and completion." },
    { id: "schedules", label: "Schedules", description: "Utilization, conflicts, and upcoming load." },
  ],
  admin: [
    { id: "interviews", label: "Interviews", description: "Pipeline health, interviewer load, and outcomes." },
    { id: "assessments", label: "Assessments", description: "Quality signals, calibration, and completion." },
    { id: "schedules", label: "Schedules", description: "Utilization, conflicts, and upcoming load." },
  ],
  curator: [{ id: "assessments", label: "Assessments", description: "Quality signals, calibration, and completion." }],
  interviewer: [
    { id: "interviews", label: "Interviews", description: "Pipeline health, interviewer load, and outcomes." },
    { id: "schedules", label: "Schedules", description: "Utilization, conflicts, and upcoming load." },
  ],
  evaluator: [{ id: "assessments", label: "Assessments", description: "Quality signals, calibration, and completion." }],
};

export function getDashboardKpisForRole(role: PreviewRole): KpiDef[] {
  return dashboardKpisByRole[role] ?? dashboardKpisByRole.admin;
}

export function getInsightTabsForRole(role: PreviewRole) {
  return insightTabsForUserRole[role] ?? insightTabsForUserRole.admin;
}

export function defaultInsightTabForRole(role: PreviewRole): DashboardInsightTabId {
  return getInsightTabsForRole(role)[0]?.id ?? "interviews";
}

const DASHBOARD_CONTEXT_LINE: Record<PreviewRole, string> = {
  superAdmin:
    "Enterprise-wide hiring intelligence — usage, risk, and throughput across your organization.",
  admin: "Operational command center for this workspace — keep interviews, assessments, and schedules moving.",
  curator: "Content intelligence for the question library and assessment quality signals.",
  interviewer: "Today-focused view — your schedule, feedback commitments, and upcoming panels.",
  evaluator: "Assessment review lane — throughput, flags, and calibration load.",
};

export function dashboardContextLineForRole(role: PreviewRole): string {
  return DASHBOARD_CONTEXT_LINE[role] ?? DASHBOARD_CONTEXT_LINE.admin;
}

/** @deprecated Prefer `DashboardInsightTabId` */
export type InsightTabKey = DashboardInsightTabId;
