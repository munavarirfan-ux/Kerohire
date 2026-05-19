"use client";

import { getJobById, moveApplicantToJob, prependCandidateTimeline } from "./mockData";
import {
  addTransferRequestNotification,
  addTransferResolvedNotification,
  sendTransferNotificationEmail,
} from "./transferNotifications";

export type TransferRequestStatus = "pending" | "approved" | "rejected";

export type TransferRequest = {
  id: string;
  candidateId: string;
  candidateName: string;
  fromJobId: string;
  fromJobTitle: string;
  toJobId: string;
  toJobTitle: string;
  reason: string;
  requestedBy: string;
  status: TransferRequestStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  rejectionNote?: string;
};

const STORAGE_KEY = "zecode-transfer-requests";
const GLOBAL_KEY = "__zecode_transfer_requests_store__";

type RequestStore = {
  version: number;
  items: TransferRequest[];
  listeners: Set<() => void>;
};

function getStore(): RequestStore {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: RequestStore };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { version: 0, items: hydrateFromSession(), listeners: new Set() };
  }
  return g[GLOBAL_KEY];
}

function hydrateFromSession(): TransferRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TransferRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistToSession(items: TransferRequest[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

function notify() {
  const store = getStore();
  store.version += 1;
  persistToSession(store.items);
  store.listeners.forEach((l) => l());
}

export function subscribeTransferRequests(listener: () => void): () => void {
  const store = getStore();
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function getTransferRequest(id: string): TransferRequest | undefined {
  return getStore().items.find((r) => r.id === id);
}

export function getPendingTransferRequests(): TransferRequest[] {
  return getStore().items.filter((r) => r.status === "pending");
}

export type SubmitTransferRequestInput = {
  candidateId: string;
  candidateName: string;
  fromJobId: string;
  fromJobTitle: string;
  toJobId: string;
  toJobTitle: string;
  reason: string;
  requestedBy: string;
};

export type SubmitTransferRequestResult =
  | { ok: true; request: TransferRequest }
  | { ok: false; error: string };

export function submitTransferRequest(input: SubmitTransferRequestInput): SubmitTransferRequestResult {
  const toJob = getJobById(input.toJobId);
  if (!toJob) return { ok: false, error: "Destination job not found" };

  const pending = getStore().items.find(
    (r) =>
      r.candidateId === input.candidateId &&
      r.status === "pending" &&
      r.toJobId === input.toJobId,
  );
  if (pending) {
    return { ok: false, error: "A pending transfer to this job already exists" };
  }

  const request: TransferRequest = {
    id: `tr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    fromJobId: input.fromJobId,
    fromJobTitle: input.fromJobTitle,
    toJobId: input.toJobId,
    toJobTitle: input.toJobTitle,
    reason: input.reason.trim(),
    requestedBy: input.requestedBy,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  getStore().items.unshift(request);
  notify();

  prependCandidateTimeline(
    input.candidateId,
    "Transfer request submitted",
    `Transfer request submitted by ${input.requestedBy} · ${input.fromJobTitle} → ${input.toJobTitle}`,
  );

  addTransferRequestNotification({
    transferRequestId: request.id,
    candidateId: input.candidateId,
    candidateName: input.candidateName,
    fromJobTitle: input.fromJobTitle,
    toJobTitle: input.toJobTitle,
    requestedBy: input.requestedBy,
  });

  void sendTransferNotificationEmail({
    to: "super-admin@zecode.internal",
    subject: `Transfer request — ${input.candidateName}`,
    body: `${input.requestedBy} requested to move ${input.candidateName} from ${input.fromJobTitle} to ${input.toJobTitle}.`,
  });

  return { ok: true, request };
}

export type ResolveTransferResult =
  | { ok: true; request: TransferRequest }
  | { ok: false; error: string };

export function approveTransferRequest(
  requestId: string,
  resolvedBy: string,
): ResolveTransferResult {
  const store = getStore();
  const request = store.items.find((r) => r.id === requestId);
  if (!request) return { ok: false, error: "Request not found" };
  if (request.status !== "pending") return { ok: false, error: "Request already resolved" };

  prependCandidateTimeline(
    request.candidateId,
    "Transfer approved",
    `Approved by ${resolvedBy} · moving to ${request.toJobTitle}`,
  );

  const moveResult = moveApplicantToJob(request.candidateId, request.toJobId, {
    detailOverride: `Approved transfer · moved from ${request.fromJobTitle} to ${request.toJobTitle}`,
  });

  if (!moveResult.ok) {
    return { ok: false, error: moveResult.error };
  }

  request.status = "approved";
  request.resolvedAt = new Date().toISOString();
  request.resolvedBy = resolvedBy;
  notify();

  addTransferResolvedNotification({
    transferRequestId: request.id,
    candidateId: request.candidateId,
    candidateName: request.candidateName,
    fromJobTitle: request.fromJobTitle,
    toJobTitle: request.toJobTitle,
    approved: true,
    resolvedBy,
    requestedBy: request.requestedBy,
  });

  void sendTransferNotificationEmail({
    to: "admin@zecode.internal",
    subject: `Transfer approved — ${request.candidateName}`,
    body: `${request.candidateName} was moved to ${request.toJobTitle}.`,
  });

  return { ok: true, request };
}

export function rejectTransferRequest(
  requestId: string,
  resolvedBy: string,
  rejectionNote?: string,
): ResolveTransferResult {
  const store = getStore();
  const request = store.items.find((r) => r.id === requestId);
  if (!request) return { ok: false, error: "Request not found" };
  if (request.status !== "pending") return { ok: false, error: "Request already resolved" };

  request.status = "rejected";
  request.resolvedAt = new Date().toISOString();
  request.resolvedBy = resolvedBy;
  request.rejectionNote = rejectionNote?.trim() || undefined;
  notify();

  const noteSuffix = request.rejectionNote ? ` · ${request.rejectionNote}` : "";
  prependCandidateTimeline(
    request.candidateId,
    "Transfer request rejected",
    `Rejected by ${resolvedBy}${noteSuffix}`,
  );

  addTransferResolvedNotification({
    transferRequestId: request.id,
    candidateId: request.candidateId,
    candidateName: request.candidateName,
    fromJobTitle: request.fromJobTitle,
    toJobTitle: request.toJobTitle,
    approved: false,
    resolvedBy,
    requestedBy: request.requestedBy,
  });

  void sendTransferNotificationEmail({
    to: "admin@zecode.internal",
    subject: `Transfer rejected — ${request.candidateName}`,
    body: `Transfer request to ${request.toJobTitle} was rejected.${noteSuffix}`,
  });

  return { ok: true, request };
}
