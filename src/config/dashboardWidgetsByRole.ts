import type { PreviewRole } from "@/config/previewRole";

export type DashboardWidgetId =
  | "interviewVolume"
  | "assessmentQuality"
  | "scheduleUtilization"
  | "hiringFunnel"
  | "interviewOutcomes";

export type InterviewsPanelMode = "enterprise" | "interviewer";
export type AssessmentsPanelMode = "enterprise" | "curator" | "evaluator";
export type SchedulesPanelMode = "enterprise" | "interviewer";

export const dashboardWidgetsByRole: Record<PreviewRole, DashboardWidgetId[]> = {
  superAdmin: ["interviewVolume", "assessmentQuality", "scheduleUtilization", "hiringFunnel", "interviewOutcomes"],
  admin: ["interviewVolume", "assessmentQuality", "scheduleUtilization", "hiringFunnel", "interviewOutcomes"],
  curator: ["assessmentQuality"],
  interviewer: ["interviewVolume", "scheduleUtilization", "interviewOutcomes"],
  evaluator: ["assessmentQuality"],
};

export function getDashboardWidgetsForRole(role: PreviewRole): DashboardWidgetId[] {
  return dashboardWidgetsByRole[role] ?? dashboardWidgetsByRole.admin;
}

export function interviewsPanelMode(role: PreviewRole): InterviewsPanelMode {
  return role === "interviewer" ? "interviewer" : "enterprise";
}

export function assessmentsPanelMode(role: PreviewRole): AssessmentsPanelMode {
  if (role === "curator") return "curator";
  if (role === "evaluator") return "evaluator";
  return "enterprise";
}

export function schedulesPanelMode(role: PreviewRole): SchedulesPanelMode {
  return role === "interviewer" ? "interviewer" : "enterprise";
}
