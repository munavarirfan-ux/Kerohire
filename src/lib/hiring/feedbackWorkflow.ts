import type { HiringCandidate } from "./types";
import type { InterviewFeedbackBundle } from "./interviewFeedback";

export const FEEDBACK_SLA_HOURS = 48;

export type FeedbackWorkflowStatus =
  | "not_requested"
  | "requested"
  | "in_progress"
  | "submitted"
  | "overdue";

export type FeedbackActivityType =
  | "feedback_requested"
  | "email_sent"
  | "feedback_opened"
  | "draft_saved"
  | "feedback_submitted"
  | "admin_comment";

export type FeedbackActivityEntry = {
  id: string;
  type: FeedbackActivityType;
  label: string;
  detail: string;
  actor: string;
  at: string;
};

export type AdminFeedbackComment = {
  id: string;
  author: string;
  body: string;
  at: string;
};

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatAt(date = new Date()): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function appendActivity(
  bundle: InterviewFeedbackBundle,
  entry: Omit<FeedbackActivityEntry, "id" | "at"> & { at?: string },
): InterviewFeedbackBundle {
  const activity: FeedbackActivityEntry = {
    id: uid("act"),
    at: entry.at ?? formatAt(),
    type: entry.type,
    label: entry.label,
    detail: entry.detail,
    actor: entry.actor,
  };
  return { ...bundle, activity: [activity, ...(bundle.activity ?? [])] };
}

export function resolveWorkflowStatus(bundle: InterviewFeedbackBundle): FeedbackWorkflowStatus {
  if (bundle.status === "submitted" || bundle.workflowStatus === "submitted") {
    return "submitted";
  }

  const requestedAt = bundle.requestedAt ? new Date(bundle.requestedAt).getTime() : null;
  const slaMs = FEEDBACK_SLA_HOURS * 60 * 60 * 1000;

  if (requestedAt && Date.now() - requestedAt > slaMs) {
    return "overdue";
  }

  if (bundle.workflowStatus === "requested" || bundle.requestedAt) {
    if (bundle.status === "draft" && bundle.openedAt) return "in_progress";
    if (bundle.status === "draft") return "requested";
    return "requested";
  }

  if (bundle.status === "draft" && bundle.openedAt) return "in_progress";

  return bundle.workflowStatus ?? "not_requested";
}

export function isFeedbackOverdue(bundle: InterviewFeedbackBundle): boolean {
  return resolveWorkflowStatus(bundle) === "overdue";
}

export function getPendingInterviewers(bundle: InterviewFeedbackBundle): string[] {
  if (bundle.status === "submitted") return [];
  return [bundle.interviewer.interviewerName];
}

export function requestInterviewFeedback(
  bundle: InterviewFeedbackBundle,
  input: {
    actorName: string;
    message?: string;
    sendEmail: boolean;
    candidate: HiringCandidate;
    jobTitle: string;
  },
): InterviewFeedbackBundle {
  let next: InterviewFeedbackBundle = {
    ...bundle,
    workflowStatus: "requested",
    requestedBy: input.actorName,
    requestedAt: new Date().toISOString(),
    requestMessage: input.message?.trim() || undefined,
    roleTitle: input.jobTitle,
  };

  next = appendActivity(next, {
    type: "feedback_requested",
    label: "Feedback requested",
    detail: `Requested for ${bundle.interviewer.interviewerName} · ${bundle.interviewer.interviewRound}`,
    actor: input.actorName,
  });

  if (input.sendEmail) {
    next = {
      ...next,
      lastEmailSentAt: new Date().toISOString(),
    };
    next = appendActivity(next, {
      type: "email_sent",
      label: "Email sent",
      detail: `Feedback request email sent to ${bundle.interviewer.interviewerName}`,
      actor: input.actorName,
    });
  }

  return next;
}

export function markFeedbackOpened(
  bundle: InterviewFeedbackBundle,
  actorName: string,
): InterviewFeedbackBundle {
  if (bundle.openedAt) return bundle;

  let next: InterviewFeedbackBundle = {
    ...bundle,
    openedAt: new Date().toISOString(),
    workflowStatus: bundle.status === "submitted" ? "submitted" : "in_progress",
  };

  next = appendActivity(next, {
    type: "feedback_opened",
    label: "Feedback opened",
    detail: `${actorName} opened the evaluation workspace`,
    actor: actorName,
  });

  return next;
}

export function markDraftSaved(
  bundle: InterviewFeedbackBundle,
  actorName: string,
): InterviewFeedbackBundle {
  const last = bundle.activity?.[0];
  if (last?.type === "draft_saved" && Date.now() - new Date(last.at).getTime() < 60_000) {
    return bundle;
  }

  return appendActivity(
    {
      ...bundle,
      workflowStatus: bundle.status === "submitted" ? "submitted" : "in_progress",
    },
    {
      type: "draft_saved",
      label: "Draft saved",
      detail: "Interviewer feedback draft updated",
      actor: actorName,
    },
  );
}

export function markFeedbackSubmitted(
  bundle: InterviewFeedbackBundle,
  actorName: string,
): InterviewFeedbackBundle {
  let next: InterviewFeedbackBundle = {
    ...bundle,
    status: "submitted",
    workflowStatus: "submitted",
    submittedBy: actorName,
    submittedAt: new Date().toISOString(),
  };

  next = appendActivity(next, {
    type: "feedback_submitted",
    label: "Feedback submitted",
    detail: `${actorName} submitted interview evaluation`,
    actor: actorName,
  });

  return next;
}

export function addAdminComment(
  bundle: InterviewFeedbackBundle,
  input: { author: string; body: string },
): InterviewFeedbackBundle {
  const comment: AdminFeedbackComment = {
    id: uid("comment"),
    author: input.author,
    body: input.body.trim(),
    at: formatAt(),
  };

  let next: InterviewFeedbackBundle = {
    ...bundle,
    adminComments: [...(bundle.adminComments ?? []), comment],
  };

  next = appendActivity(next, {
    type: "admin_comment",
    label: "Mention",
    detail: input.body.trim().slice(0, 120),
    actor: input.author,
  });

  return next;
}

export const WORKFLOW_STATUS_LABELS: Record<FeedbackWorkflowStatus, string> = {
  not_requested: "Not Requested",
  requested: "Requested",
  in_progress: "In Progress",
  submitted: "Submitted",
  overdue: "Overdue",
};
