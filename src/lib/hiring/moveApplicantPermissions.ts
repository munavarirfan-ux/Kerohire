import type { PreviewRole } from "@/config/previewRole";

/** Super Admin may move applicants directly between jobs. */
export function canDirectMoveApplicant(role: PreviewRole): boolean {
  return role === "superAdmin";
}

/** Admin submits transfer requests for Super Admin approval. */
export function canRequestApplicantTransfer(role: PreviewRole): boolean {
  return role === "admin";
}

export function canUseMoveApplicantAction(role: PreviewRole): boolean {
  return canDirectMoveApplicant(role) || canRequestApplicantTransfer(role);
}

/** Admin and Super Admin can advance shortlisted candidates to interview. */
export function canMoveShortlistedToInterview(role: PreviewRole): boolean {
  return role === "superAdmin" || role === "admin";
}
