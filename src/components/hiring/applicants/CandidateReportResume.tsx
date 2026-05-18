"use client";

import { useRef, useState } from "react";
import { Download, ExternalLink, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CandidateEditProfile } from "@/lib/hiring/candidateProfile";
import { deleteCandidateResume, uploadCandidateResume } from "@/lib/hiring/candidateProfile";
import { parseResumeFile } from "@/lib/hiring/parseResume";
import {
  candidateHasResume,
  resumeDisplayStatus,
  resumeFileName,
} from "@/lib/hiring/candidateReportView";
import type { HiringCandidate } from "@/lib/hiring/types";
import {
  dashboardLabel,
  dashboardPanel,
  dashboardPanelInteractive,
  dashboardSectionSub,
  dashboardSectionTitle,
} from "@/components/dashboard/dashboardTokens";
import { DeleteResumeAlertDialog } from "./DeleteResumeAlertDialog";

const bentoCardBase =
  "min-w-0 rounded-2xl border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_28px_-12px_rgba(15,23,42,0.08)] dark:border-white/[0.06] dark:bg-surface";

function resumeExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function ResumeDocumentPlaceholder({ fileName }: { fileName: string }) {
  const ext = resumeExtension(fileName);
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center"
      aria-label={`Document preview for ${fileName}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white shadow-sm">
        <FileText className="h-7 w-7 text-[#A1A1AA]" strokeWidth={1.5} aria-hidden />
      </div>
      <div className="max-w-sm space-y-1">
        <p className="text-[14px] font-medium text-[#18181B] dark:text-text">{fileName}</p>
        <p className="text-[13px] leading-relaxed text-[#71717A]">
          {ext === "pdf"
            ? "Preview is loading or unavailable for this file. Use Open full or Download to view the resume."
            : "Inline preview is available for PDF files. Use Open full or Download for Word documents."}
        </p>
      </div>
      <div className="w-full max-w-md space-y-2 opacity-40" aria-hidden>
        {[88, 100, 72, 94, 60].map((w) => (
          <div
            key={w}
            className="mx-auto h-2 rounded-full bg-[#E4E4E7]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ResumePreviewFrame({
  fileName,
  resumeUrl,
  className,
}: {
  fileName: string;
  resumeUrl?: string;
  className?: string;
}) {
  const isPdf = resumeExtension(fileName) === "pdf";
  const src = resumeUrl?.startsWith("http") ? resumeUrl : resumeUrl;

  return (
    <div
      className={cn(
        "relative flex min-h-[min(520px,58vh)] flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5]",
        className,
      )}
    >
      {isPdf && src ? (
        <iframe
          src={src}
          title={`Resume preview: ${fileName}`}
          className="h-full min-h-[min(520px,58vh)] w-full flex-1 border-0 bg-white"
        />
      ) : (
        <ResumeDocumentPlaceholder fileName={fileName} />
      )}
    </div>
  );
}

export function CandidateReportResume({
  candidate,
  profile,
  onCandidateUpdated,
  cardClassName,
  titleClassName,
}: {
  candidate: HiringCandidate;
  profile: CandidateEditProfile;
  onCandidateUpdated: (candidate: HiringCandidate) => void;
  cardClassName?: string;
  titleClassName?: string;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const uploadAreaRef = useRef<HTMLLabelElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skipDeleteFocusReturnRef = useRef(false);

  const hasResume = candidateHasResume(profile, candidate);
  const file = resumeFileName(profile, candidate);
  const parsedStatus = resumeDisplayStatus(profile, candidate);
  const resumeUrl = candidate.resumeUrl;

  const shellClass =
    cardClassName ?? cn(bentoCardBase, dashboardPanelInteractive, "flex flex-col p-5 sm:p-6");
  const headingClass = titleClassName ?? dashboardSectionTitle;

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    const updated = deleteCandidateResume(candidate.id, profile);
    setDeleting(false);
    if (!updated) {
      toast.error("Could not delete resume");
      return;
    }
    toast.success("Resume deleted successfully");
    onCandidateUpdated(updated);
    skipDeleteFocusReturnRef.current = true;
    setDeleteOpen(false);
    setFullOpen(false);
    requestAnimationFrame(() => uploadAreaRef.current?.focus());
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) {
      if (skipDeleteFocusReturnRef.current) {
        skipDeleteFocusReturnRef.current = false;
        return;
      }
      requestAnimationFrame(() => deleteTriggerRef.current?.focus());
    }
  };

  const handleFile = async (picked: File) => {
    if (hasResume) return;
    setUploading(true);
    try {
      const updated = uploadCandidateResume(candidate.id, profile, picked.name);
      if (!updated) {
        toast.error("Could not upload resume");
        return;
      }
      try {
        await parseResumeFile(picked.name);
      } catch {
        /* optional parse */
      }
      toast.success("New resume uploaded successfully");
      onCandidateUpdated(updated);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!resumeUrl && !file) {
      toast.error("No resume file available");
      return;
    }
    const link = document.createElement("a");
    link.href = resumeUrl ?? "#";
    link.download = file;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleOpenFull = () => {
    if (resumeUrl?.startsWith("http")) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setFullOpen(true);
  };

  const actionButtons = hasResume ? (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1 rounded-[8px] px-2.5 text-[12px]"
        onClick={handleDownload}
      >
        <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Download
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1 rounded-[8px] px-2.5 text-[12px]"
        onClick={handleOpenFull}
      >
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Open full
      </Button>
      <Button
        ref={deleteTriggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1 rounded-[8px] px-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        Delete resume
      </Button>
    </div>
  ) : null;

  return (
    <>
      <section className={shellClass}>
        <header className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className={headingClass}>Resume</h3>
            {hasResume ? (
              <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#71717A]">
                <div>
                  <dt className={cn(dashboardLabel, "normal-case tracking-normal")}>File</dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#52525B]">{file}</dd>
                </div>
                {candidate.resumeUploadedAt ? (
                  <div>
                    <dt className={cn(dashboardLabel, "normal-case tracking-normal")}>Uploaded</dt>
                    <dd className="mt-0.5 text-[13px] font-medium text-[#52525B]">
                      {candidate.resumeUploadedAt}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className={cn(dashboardLabel, "normal-case tracking-normal")}>Status</dt>
                  <dd className="mt-0.5 text-[13px] font-medium text-[#52525B]">{parsedStatus}</dd>
                </div>
              </dl>
            ) : (
              <p className={cn(dashboardSectionSub, "mt-1")}>{parsedStatus}</p>
            )}
          </div>
          {actionButtons}
        </header>

        {hasResume ? (
          <ResumePreviewFrame fileName={file} resumeUrl={resumeUrl} />
        ) : (
          <div className="space-y-4">
            <div
              className={cn(
                dashboardPanel,
                "flex min-h-[min(320px,45vh)] flex-col items-center justify-center px-6 py-10 text-center",
              )}
            >
              <FileText className="h-10 w-10 text-[#D4D4D8]" strokeWidth={1.5} aria-hidden />
              <p className="mt-3 text-[15px] font-medium text-[#18181B] dark:text-text">No resume uploaded</p>
              <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#71717A]">
                Upload a resume to preview it here. Supported formats: PDF, DOC, and DOCX.
              </p>
            </div>
            <label
              ref={uploadAreaRef}
              tabIndex={0}
              htmlFor={`resume-upload-report-${candidate.id}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors",
                "border-[rgba(15,23,42,0.1)] bg-[#FAFAFB] hover:border-accent/30 hover:bg-accent/5",
                "focus-visible:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20",
                "dark:bg-white/[0.02]",
                uploading && "pointer-events-none opacity-70",
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-accent" aria-hidden />
                  <span className="text-[14px] font-medium text-text">Uploading…</span>
                </>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted" strokeWidth={1.5} aria-hidden />
                  <span className="text-[14px] font-medium text-text">Drag and drop resume here</span>
                  <span className="mt-1 text-[12px] text-muted">PDF, DOC, or DOCX — up to 10MB</span>
                </>
              )}
              <input
                ref={fileInputRef}
                id={`resume-upload-report-${candidate.id}`}
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx"
                disabled={uploading}
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (picked) void handleFile(picked);
                }}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-[10px] text-[13px]"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Upload resume
            </Button>
          </div>
        )}
      </section>

      <Dialog open={fullOpen} onOpenChange={setFullOpen}>
        <DialogContent overlayClassName="z-[230]" className="z-[230] flex max-h-[min(92vh,900px)] max-w-4xl flex-col gap-0 p-0">
          <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
            <DialogTitle className="truncate pr-8 text-[1.0625rem]">{file}</DialogTitle>
            <DialogDescription className="text-[13px]">
              {parsedStatus}
              {candidate.resumeUploadedAt ? ` · Uploaded ${candidate.resumeUploadedAt}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-hidden p-4">
            <ResumePreviewFrame fileName={file} resumeUrl={resumeUrl} className="min-h-[min(70vh,720px)]" />
          </div>
          <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFullOpen(false)}>
              Close
            </Button>
            <Button type="button" size="sm" className="gap-1" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteResumeAlertDialog
        open={deleteOpen}
        onOpenChange={handleDeleteOpenChange}
        onConfirm={() => void handleDeleteConfirm()}
        confirming={deleting}
      />
    </>
  );
}
