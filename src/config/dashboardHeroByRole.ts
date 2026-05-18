import type { PreviewRole } from "@/config/previewRole";

export type DashboardHeroLayout = "design" | "workspace" | "interviewer" | "evaluator" | "curator";

export type DashboardHeroKpi = {
  id: string;
  label: string;
  value: string;
  caption: string;
  trend?: string;
  trendUp?: boolean;
};

export type DashboardHeroWorkspaceSummary = {
  brandLine: string;
  region: string;
  activeTeams: string;
  hiringHealth: string;
};

export type DashboardHeroBlock = {
  layout: DashboardHeroLayout;
  topLabel: string;
  subheading: string;
  kpis: DashboardHeroKpi[];
  chips: string[];
  workspaceSummary?: DashboardHeroWorkspaceSummary;
};

export function resolveOrgDisplayName(organizationName: string | null | undefined): string {
  return organizationName?.trim() || "NovaTech";
}

function designHeroBlock(): DashboardHeroBlock {
  return {
    layout: "design",
    topLabel: "",
    subheading: "You have 4 interviews today and 12 feedback items pending review.",
    kpis: [
      { id: "interviewsToday", label: "Interviews today", value: "15", caption: "Scheduled panels", trend: "+3 today", trendUp: true },
      { id: "feedbackDue", label: "Feedback due", value: "10", caption: "Write-ups owed", trend: "3 overdue", trendUp: false },
      { id: "assessmentsProgress", label: "In progress", value: "42", caption: "Active assessments", trend: "+8 this week", trendUp: true },
      { id: "offers", label: "Offers sent", value: "09", caption: "Awaiting response", trend: "2 expiring", trendUp: false },
    ],
    chips: [],
  };
}

export function getDashboardHeroBlock(role: PreviewRole, _organizationName: string | null | undefined): DashboardHeroBlock {
  if (role === "superAdmin" || role === "admin") {
    return designHeroBlock();
  }

  if (role === "interviewer") {
    return {
      layout: "interviewer",
      topLabel: "INTERVIEW OPERATIONS",
      subheading: "Your interview lane — today's panels, feedback you owe, and what's next on your calendar.",
      kpis: [
        { id: "today", label: "Interviews today", value: "3", caption: "Scheduled with you", trend: "Next 45m", trendUp: true },
        { id: "feedback", label: "Feedback due", value: "5", caption: "Write-ups outstanding", trend: "2 overdue", trendUp: false },
        { id: "upcoming", label: "Upcoming", value: "11", caption: "This week", trend: "+4 vs last week", trendUp: true },
        { id: "done", label: "Completed (30d)", value: "42", caption: "Panels finished", trend: "+6 month", trendUp: true },
      ],
      chips: ["Next panel in 45m", "2 candidates awaiting scorecard", "1 hold — needs reschedule"],
    };
  }

  if (role === "evaluator") {
    return {
      layout: "evaluator",
      topLabel: "ASSESSMENT OPERATIONS",
      subheading: "Your evaluation queue — reviews in flight, flags, and completions for today.",
      kpis: [
        { id: "ongoing", label: "Ongoing reviews", value: "28", caption: "Active assessments", trend: "12 due this week", trendUp: true },
        { id: "pending", label: "Pending decisions", value: "16", caption: "Awaiting verdict", trend: "5 priority", trendUp: false },
        { id: "flagged", label: "Flagged", value: "6", caption: "Integrity signals", trend: "Needs review", trendUp: false },
        { id: "done", label: "Completed today", value: "07", caption: "Closed evaluations", trend: "+2 vs yesterday", trendUp: true },
      ],
      chips: ["5 high-priority reviews due today", "2 bundles need second read", "Calibration window Thu 4pm"],
    };
  }

  if (role === "curator") {
    return {
      layout: "curator",
      topLabel: "CONTENT INTELLIGENCE",
      subheading: "Question library health — creation velocity, reuse, and quality signals at a glance.",
      kpis: [
        { id: "created", label: "New this week", value: "42", caption: "Questions authored", trend: "+12 vs prior", trendUp: true },
        { id: "reuse", label: "Reuse rate", value: "68%", caption: "Live assessments", trend: "+4 pts", trendUp: true },
        { id: "lowQ", label: "Low quality", value: "37", caption: "Flagged for review", trend: "8 new flags", trendUp: false },
        { id: "archived", label: "Archived", value: "214", caption: "Retired from library", trend: "+18 quarter", trendUp: true },
      ],
      chips: ["12 drafts pending publish", "3 tracks need coverage", "Peer review queue: 8 items"],
    };
  }

  return designHeroBlock();
}
