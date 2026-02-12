"use client";

import { useState } from "react";
import type { Prisma } from "@prisma/client";
import { parseJson } from "@/lib/json";

type SessionWithRelations = Prisma.InterviewSessionGetPayload<{
  include: {
    transcript: true;
    summary: true;
    scorecard: true;
    translationRecords: true;
  };
}>;

type NoteWithAuthor = Prisma.NoteGetPayload<{ include: { author: true } }>;

export function CandidateIntelligenceClient({
  sessions,
  candidateId,
  notes,
  role,
}: {
  sessions: SessionWithRelations[];
  candidateId: string;
  notes?: NoteWithAuthor[];
  role?: string | null;
}) {
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "de">("en");

  const isNotesView = notes !== undefined;

  if (isNotesView) {
    return (
      <div className="space-y-4">
        {notes && notes.length > 0 ? (
          <ul className="space-y-3 text-sm text-slate-600">
            {notes.map((n) => (
              <li key={n.id} className="border-b border-slate-100 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-primary">{n.type}</span>
                  <span className="text-xs text-slate-400">{n.author.email}</span>
                </div>
                <p>{n.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No notes yet.</p>
        )}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Decision</label>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-white">
            <option>In review</option>
            <option>Shortlisted</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-slate-500">No interview sessions yet.</p>;
  }

  const openSession = sessions.find((s) => s.id === openSessionId);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setOpenSessionId(openSessionId === s.id ? null : s.id)}
              className="w-full text-left rounded-xl px-3 py-2 bg-secondary/40 hover:bg-secondary/60 transition-colors text-sm font-medium text-primary"
            >
              {s.title}
            </button>
          </li>
        ))}
      </ul>

      {openSession && (
        <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-primary">Session details</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-lg text-sm ${lang === "en" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("de")}
                className={`px-3 py-1 rounded-lg text-sm ${lang === "de" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}
              >
                DE
              </button>
            </div>
          </div>

          {openSession.transcript && (
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Transcript</h4>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {openSession.transcript.text}
              </p>
            </div>
          )}

          {openSession.summary && (
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Summary</h4>
              {lang === "de" ? (
                <p className="text-sm text-slate-600">
                  {openSession.translationRecords?.find(
                    (t) => t.toLang === "de" && (t.summaryId === openSession.summary?.id || t.entityId === openSession.summary?.id)
                  )?.translatedText ?? openSession.summary.summary}
                </p>
              ) : (
                <p className="text-sm text-slate-600">{openSession.summary.summary}</p>
              )}
              {(() => {
                const evidence = parseJson<{ quote: string; timestamp: string }[]>(
                  openSession.summary?.evidence,
                  []
                );
                return evidence.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-xs text-slate-500">
                    {evidence.map((e, i) => (
                      <li key={i}>
                        &quot;{e.quote}&quot; ({e.timestamp})
                      </li>
                    ))}
                  </ul>
                ) : null;
              })()}
            </div>
          )}

          {openSession.scorecard && (
            <div>
              <h4 className="text-sm font-medium text-primary mb-2">Scorecard</h4>
              <p className="text-sm text-slate-600">{openSession.scorecard.overallRecommendation}</p>
              {openSession.scorecard.interviewerNotes && (
                <p className="text-xs text-slate-500 mt-1">
                  Notes: {openSession.scorecard.interviewerNotes}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
