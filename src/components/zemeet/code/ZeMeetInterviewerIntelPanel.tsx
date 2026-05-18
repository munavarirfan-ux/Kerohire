"use client";

import { ExternalLink, FileText, Linkedin, Lock, X } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetGlass, zemeetLabel, zemeetPanel } from "@/components/zemeet/zemeetTokens";
import type { ZeMeetCandidateIntel } from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";

/** Interviewer-only side panel — hidden from candidate UI entirely */
export function ZeMeetInterviewerIntelPanel() {
  const { session, interviewerIntelPanel, toggleInterviewerIntel } = useZeMeet();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  if (!isInterviewer || interviewerIntelPanel === "none") return null;

  const intel = session.context.candidateIntel;

  return (
    <aside
      className={cn(
        zemeetPanel,
        "flex w-[min(100%,340px)] shrink-0 flex-col border-l border-white/[0.08]",
      )}
    >
      <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-amber-400/90" strokeWidth={1.5} aria-hidden />
          <div>
            <p className={zemeetLabel}>Interviewer only</p>
            <p className="text-[13px] font-semibold text-white">
              {interviewerIntelPanel === "resume" ? "Resume" : "LinkedIn"}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close panel"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/15"
          onClick={() => toggleInterviewerIntel(interviewerIntelPanel)}
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {interviewerIntelPanel === "resume" ? (
          <ResumePanel name={session.context.candidateName} intel={intel} />
        ) : (
          <LinkedInPanel name={session.context.candidateName} intel={intel} />
        )}
      </div>
    </aside>
  );
}

function ResumePanel({
  name,
  intel,
}: {
  name: string;
  intel?: ZeMeetCandidateIntel;
}) {
  return (
    <div className="space-y-4">
      <div className={cn(zemeetGlass, "p-4")}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10">
            <FileText className="h-5 w-5 text-white/70" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">{name}</p>
            <p className="text-[11px] text-white/50">{intel?.resumeStatus ?? "Reviewed"} resume</p>
          </div>
        </div>
      </div>

      <Section title="Experience" body={intel?.experience ?? "—"} />
      <Section title="Education" body={intel?.education ?? "—"} />
      <Section title="Skills" body={intel?.skills?.join(" · ") ?? "—"} />

      <div className={cn(zemeetGlass, "space-y-2 p-4 text-[12px] leading-relaxed text-white/65")}>
        <p className="font-medium text-white/90">Summary</p>
        <p>
          {name} brings strong systems thinking and hands-on delivery in enterprise SaaS. Recent
          work emphasizes operational density, design systems, and cross-functional collaboration
          with engineering and product.
        </p>
      </div>

      {intel?.resumeUrl ? (
        <a
          href={intel.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[rgb(var(--accent-rgb))] hover:underline"
        >
          Open full PDF <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </div>
  );
}

function LinkedInPanel({
  name,
  intel,
}: {
  name: string;
  intel?: ZeMeetCandidateIntel;
}) {
  const linkedinUrl = intel?.linkedin
    ? intel.linkedin.startsWith("http")
      ? intel.linkedin
      : `https://${intel.linkedin}`
    : null;

  return (
    <div className="space-y-4">
      <div className={cn(zemeetGlass, "p-4")}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0A66C2]/25">
            <Linkedin className="h-5 w-5 text-[#70B5F9]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">{name}</p>
            <p className="text-[12px] text-white/55">{intel?.experience ?? "Professional profile"}</p>
          </div>
        </div>
      </div>

      <Section title="Headline" body="Senior Product Designer · Design systems & complex workflows" />
      <Section title="Recent" body="Staff Product Designer @ Enterprise SaaS · 2021 — Present" />
      <Section title="Endorsements" body="Figma · Prototyping · UX Research · Design Systems" />

      {linkedinUrl ? (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0A66C2]/20 py-2.5 text-[13px] font-semibold text-[#93C5FD] hover:bg-[#0A66C2]/30"
        >
          <Linkedin className="h-4 w-4" /> Open LinkedIn profile
        </a>
      ) : null}

      <p className="text-[10px] text-white/40">
        Candidate cannot see that you opened LinkedIn during the session.
      </p>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className={zemeetLabel}>{title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{body}</p>
    </div>
  );
}
