import type { CandidateEmail } from "./types";

const CLOSINGS: Record<CandidateEmail["type"], string> = {
  "Interview Invite":
    "Please reply to confirm your attendance. If you need to reschedule, let us know at least 24 hours in advance.\n\nBest regards",
  "Follow-up":
    "Feel free to reply with any questions. We're happy to help before your next step.\n\nBest regards",
  Assessment:
    "Complete the exercise at your earliest convenience. If you need an extension, reply to this thread.\n\nBest regards",
  Offer:
    "We're excited about the possibility of you joining the team. Please review the details and let us know if you'd like to discuss.\n\nBest regards",
  Rejection:
    "We appreciate the time you invested in our process and wish you success in your search.\n\nBest regards",
  Recruiter:
    "Reply to this email if you have any questions — I'm here to help.\n\nBest regards",
};

export function resolveEmailBody(email: CandidateEmail): string {
  if (email.body?.trim()) return email.body.trim();

  const greeting = email.recipient ? `Hi ${email.recipient},` : "Hi,";
  const lead = email.preview.replace(/…$/, "").trim();
  const closing = `${CLOSINGS[email.type]}\n${email.sender}`;

  return `${greeting}\n\n${lead}.\n\n${closing}`;
}
