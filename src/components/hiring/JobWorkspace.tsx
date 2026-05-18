"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCandidatesForJob } from "@/lib/hiring/mockData";
import type { HiringJob } from "@/lib/hiring/types";
import {
  APPLICANTS_STATS_COLUMNS,
  applicantsStatsColumnId,
  filterCandidatesByStage,
  type HiringStageName,
} from "@/lib/hiring/stages";
import { AddCandidateDialog } from "./applicants/AddCandidateDialog";
import { CandidateReportDialog } from "./applicants/CandidateReportDialog";
import { JobApplicantsTab } from "./applicants/JobApplicantsTab";
import { HiringKanban } from "./HiringKanban";
import { InterviewKanbanBoard } from "./InterviewKanbanBoard";
import type { HiringCandidate } from "@/lib/hiring/types";
import { hiringCanvas } from "./hiringTokens";
import { JobWorkspaceHero } from "./workspace/JobWorkspaceHero";
import { JobWorkspaceOverview } from "./workspace/JobWorkspaceOverview";
import { getJobWorkspaceMetrics } from "./workspace/jobWorkspaceUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { id: "overview", label: "Job overview" },
  { id: "applicants", label: "Applicants" },
  { id: "applicants-stats", label: "Applicants stats" },
  { id: "interviews", label: "Interviews" },
  { id: "hired-offers", label: "Hired & offers" },
  { id: "rejected", label: "Rejected" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const OFFER_COLS = [
  { id: "offer-draft", title: "Offer draft" },
  { id: "offer-sent", title: "Offer sent" },
  { id: "offer-accepted", title: "Offer accepted" },
  { id: "offer-declined", title: "Offer declined" },
  { id: "hired", title: "Hired" },
];

const REJECTED_COLS = [{ id: "rejected", title: "Rejected" }];

export function JobWorkspace({ job }: { job: HiringJob }) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>("overview");
  const [highlightCandidateId, setHighlightCandidateId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState(() => getCandidatesForJob(job.id));
  const [kanbanReportCandidate, setKanbanReportCandidate] = useState<HiringCandidate | null>(null);
  const [kanbanReportOpen, setKanbanReportOpen] = useState(false);
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const addCandidateButtonRef = useRef<HTMLButtonElement | null>(null);

  const openKanbanReport = useCallback((candidate: HiringCandidate) => {
    setKanbanReportCandidate(candidate);
    setKanbanReportOpen(true);
  }, []);

  const refreshCandidates = useCallback(() => {
    setCandidates(getCandidatesForJob(job.id));
  }, [job.id]);

  const metrics = useMemo(() => getJobWorkspaceMetrics(job, candidates), [job, candidates]);

  const byStage = useCallback(
    (stage: HiringStageName) => filterCandidatesByStage(candidates, stage),
    [candidates],
  );

  const screeningCandidates = useMemo(() => byStage("Screening"), [byStage]);
  const interviewCandidates = useMemo(() => byStage("Interviews"), [byStage]);
  const hiredCandidates = useMemo(() => byStage("Hired & Offers"), [byStage]);
  const rejectedCandidates = useMemo(() => byStage("Rejected"), [byStage]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const candidateParam = searchParams.get("candidate");
    if (tabParam === "screening") {
      setTab("applicants-stats");
    } else if (tabParam === "offers") {
      setTab("hired-offers");
    } else if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setTab(tabParam as TabId);
    }
    if (candidateParam) {
      setHighlightCandidateId(candidateParam);
    }
  }, [searchParams]);

  return (
    <div className={hiringCanvas}>
      <div className="mx-auto max-w-shell space-y-5 pb-8 sm:space-y-6">
        <JobWorkspaceHero
          job={job}
          metrics={metrics}
          candidates={candidates}
          onAddCandidate={() => setAddCandidateOpen(true)}
          addCandidateButtonRef={addCandidateButtonRef}
        />

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="min-w-0">
          <div className="sticky top-0 z-10 -mx-0.5 bg-[#F8FAFC]/90 px-0.5 pb-0 pt-1 backdrop-blur-md dark:bg-app-bg/90">
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6 focus-visible:ring-0 data-[state=inactive]:hidden">
            <JobWorkspaceOverview job={job} candidates={candidates} />
          </TabsContent>

          <TabsContent value="applicants" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <JobApplicantsTab
              job={job}
              candidates={candidates}
              variant="directory"
              onCandidatesChange={refreshCandidates}
              openCandidateId={highlightCandidateId}
              onOpenCandidateHandled={() => setHighlightCandidateId(null)}
            />
          </TabsContent>

          <TabsContent value="applicants-stats" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <div className="mb-4">
              <p className="text-[13px] text-[#71717A]">
                <span className="text-[1.25rem] font-semibold tabular-nums tracking-[-0.03em] text-[#18181B] dark:text-text">
                  {screeningCandidates.length}
                </span>
                <span className="ml-1.5 font-medium text-[#52525B]">in screening</span>
              </p>
              <p className="mt-1 text-[12px] text-[#A1A1AA]">
                Track candidates under review and those shortlisted for the next step.
              </p>
            </div>
            <HiringKanban
              columns={[...APPLICANTS_STATS_COLUMNS]}
              candidates={screeningCandidates}
              pipelineStage="Screening"
              columnResolver={applicantsStatsColumnId}
              onCardClick={openKanbanReport}
              onCandidateMoved={refreshCandidates}
            />
          </TabsContent>

          <TabsContent value="interviews" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <InterviewKanbanBoard
              jobId={job.id}
              candidates={interviewCandidates}
              onCardClick={openKanbanReport}
              onCandidateMoved={refreshCandidates}
            />
          </TabsContent>

          <TabsContent value="hired-offers" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <HiringKanban
              columns={OFFER_COLS}
              candidates={hiredCandidates}
              pipelineStage="Hired & Offers"
              onCardClick={openKanbanReport}
              onCandidateMoved={refreshCandidates}
            />
          </TabsContent>

          <TabsContent value="rejected" className="mt-5 focus-visible:ring-0 data-[state=inactive]:hidden">
            <HiringKanban
              columns={REJECTED_COLS}
              candidates={rejectedCandidates}
              pipelineStage="Rejected"
              onCardClick={openKanbanReport}
              onCandidateMoved={refreshCandidates}
              enableDragDrop={false}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CandidateReportDialog
        candidate={kanbanReportCandidate}
        job={job}
        open={kanbanReportOpen}
        onOpenChange={(open) => {
          setKanbanReportOpen(open);
          if (!open) setKanbanReportCandidate(null);
        }}
        onCandidateUpdated={(updated) => {
          setKanbanReportCandidate(updated);
          refreshCandidates();
        }}
      />

      <AddCandidateDialog
        open={addCandidateOpen}
        onOpenChange={setAddCandidateOpen}
        job={job}
        returnFocusRef={addCandidateButtonRef}
        onAdded={() => refreshCandidates()}
      />
    </div>
  );
}
