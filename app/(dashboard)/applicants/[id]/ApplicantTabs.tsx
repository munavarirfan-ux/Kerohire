"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseJson } from "@/lib/json";
import type { Prisma } from "@prisma/client";

type Candidate = Prisma.CandidateGetPayload<{
  include: {
    job: true;
    currentStage: true;
    role: true;
    assessmentResults: { include: { trait: true } };
    notes: { include: { author: true } };
    interviewSessions: {
      include: { transcript: true; summary: true; scorecard: true; translationRecords: true };
    };
    contentSubmissions: { include: { aiSignals: true } };
  };
}>;

type Fit = { roleFitScore: number; alignedTraits: string[]; risks: { traitName?: string; traitId: string; reason: string; value: number; threshold: number }[]; confidence: number };

type Session = Candidate["interviewSessions"][number];

function InterviewVideoPlaceholder() {
  return (
    <div className="aspect-video w-full max-w-md rounded-2xl border border-chrome-border bg-slate-100 flex items-center justify-center shrink-0">
      <button
        type="button"
        className="w-16 h-16 rounded-full bg-white/90 border border-chrome-border shadow-sm flex items-center justify-center text-chrome-active hover:bg-white hover:scale-105 transition-subtle"
        aria-label="Play recording"
      >
        <Play className="h-8 w-8 ml-1" fill="currentColor" />
      </button>
      <span className="sr-only">Interview recording</span>
    </div>
  );
}

function InterviewTabContent({ sessions, title, showVideo = false }: { sessions: Session[]; title: string; showVideo?: boolean }) {
  return (
    <Card className="border-chrome-border">
      <CardHeader><CardTitle className="text-forest">{title}</CardTitle></CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-600">No sessions yet.</p>
        ) : (
          <ul className="space-y-6">
            {sessions.map((s) => (
              <li key={s.id} className="border border-chrome-border rounded-2xl p-4">
                <div className={`flex gap-6 ${showVideo ? "flex-row" : ""}`}>
                  {showVideo && (
                    <div className="shrink-0">
                      <InterviewVideoPlaceholder />
                      <p className="text-xs text-slate-500 mt-1 text-center">Interview recording</p>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{s.title}</p>
                    {s.transcript && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-slate-500">Transcript</p>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap mt-0.5">{s.transcript.text.slice(0, 300)}{s.transcript.text.length > 300 ? "…" : ""}</p>
                      </div>
                    )}
                    {s.summary && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-slate-500">Summary</p>
                        <p className="text-sm text-slate-600 mt-0.5">{s.summary.summary}</p>
                        {s.summary.evidence && (
                          <ul className="mt-2 list-disc list-inside text-xs text-slate-500">
                            {parseJson<{ quote: string; timestamp: string }[]>(s.summary.evidence, []).map((e, i) => (
                              <li key={i}>&quot;{e.quote}&quot; ({e.timestamp})</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {s.scorecard && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-slate-500">Scorecard</p>
                        <p className="text-sm text-slate-600 mt-0.5">{s.scorecard.overallRecommendation}</p>
                        {s.scorecard.interviewerNotes && (
                          <p className="text-xs text-slate-500 mt-1">Notes: {s.scorecard.interviewerNotes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const TABS = [
  { id: "cv", label: "CV Report" },
  { id: "ats", label: "ATS Screening" },
  { id: "skill", label: "Skill Report" },
  { id: "psychometric", label: "Psychometric Report" },
  { id: "interview", label: "One-way Interview" },
  { id: "technical", label: "Technical Interview" },
  { id: "hr", label: "HR Interview" },
];

export function ApplicantTabs({ candidate, fit }: { candidate: Candidate; fit: Fit }) {
  const [tab, setTab] = useState("psychometric");

  return (
    <div>
      <nav className="flex gap-0 border-b border-chrome-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-subtle ${
              tab === t.id
                ? "text-chrome-active border-chrome-active"
                : "text-chrome-icon border-transparent hover:text-chrome-active"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 report-content">
        {tab === "cv" && (
          <Card className="border-chrome-border">
            <CardHeader><CardTitle className="text-forest">CV Report</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-slate-600">CV content and parsed fields (placeholder).</p></CardContent>
          </Card>
        )}
        {tab === "ats" && (
          <Card className="border-chrome-border">
            <CardHeader><CardTitle className="text-forest">ATS Screening</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Knockout results, screening score, parsed fields. Decision: Proceed / Hold / Reject (editable).</p>
            </CardContent>
          </Card>
        )}
        {tab === "skill" && (
          <Card className="border-chrome-border">
            <CardHeader><CardTitle className="text-forest">Skill Report</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-slate-600">Skill assessment results (placeholder).</p></CardContent>
          </Card>
        )}
        {tab === "psychometric" && (
          <>
            <Card className="border-chrome-border">
              <CardHeader><CardTitle className="text-forest">Role fit</CardTitle></CardHeader>
              <CardContent><p className="text-big-number text-forest">{fit.roleFitScore}%</p></CardContent>
            </Card>
            <Card className="border-chrome-border mt-4">
              <CardHeader><CardTitle className="text-forest">Strengths</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {fit.alignedTraits.length ? fit.alignedTraits.map((t) => <li key={t}>{t}</li>) : <li>None</li>}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-chrome-border mt-4">
              <CardHeader><CardTitle className="text-forest">Risks</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-slate-600">
                  {fit.risks.length ? fit.risks.map((r, i) => <li key={i}>{r.traitName ?? r.traitId}: {r.reason}</li>) : <li>None</li>}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-chrome-border mt-4">
              <CardHeader><CardTitle className="text-forest">Trait breakdown</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-chrome-border"><th className="text-left py-2 text-forest">Trait</th><th className="text-right py-2 text-forest">Percentile</th></tr></thead>
                  <tbody>
                    {candidate.assessmentResults.map((r) => (
                      <tr key={r.id} className="border-b border-chrome-border/50"><td className="py-2">{r.trait.name}</td><td className="py-2 text-right">{r.percentile}%</td></tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
        {tab === "interview" && (
          <InterviewTabContent
            sessions={candidate.interviewSessions.filter((s) => s.interviewType === "ONE_WAY")}
            title="One-way Interview"
            showVideo
          />
        )}
        {tab === "technical" && (
          <InterviewTabContent
            sessions={candidate.interviewSessions.filter((s) => s.interviewType === "TECHNICAL")}
            title="Technical Interview"
            showVideo
          />
        )}
        {tab === "hr" && (
          <InterviewTabContent
            sessions={candidate.interviewSessions.filter((s) => s.interviewType === "HR")}
            title="HR Interview"
          />
        )}
      </div>

      {/* AI content signals */}
      <Card className="border-chrome-border mt-6">
        <CardHeader><CardTitle className="text-forest">Content submissions & AI signals</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500 mb-2">Heuristic signal, not proof.</p>
          {candidate.contentSubmissions.length === 0 ? (
            <p className="text-sm text-slate-600">No submissions.</p>
          ) : (
            candidate.contentSubmissions.map((sub) => (
              <div key={sub.id} className="mb-3 p-3 rounded-xl bg-parchment border border-chrome-border">
                <p className="text-xs text-slate-500">{sub.type}</p>
                <p className="text-sm text-slate-600">{sub.text.slice(0, 150)}…</p>
                {sub.aiSignals.map((sig) => (
                  <div key={sig.id} className="mt-2">
                    <span className="text-xs font-medium text-forest">{sig.band}</span>
                    <ul className="list-disc list-inside text-xs text-slate-600">
                      {parseJson<string[]>(sig.reasons, []).map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
