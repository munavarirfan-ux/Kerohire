"use client";

import { useState } from "react";
import type { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const DECISION_OPTIONS = ["In review", "Shortlisted", "Rejected"] as const;

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
  const [decision, setDecision] = useState<string>(DECISION_OPTIONS[0]);

  const isNotesView = notes !== undefined;

  if (isNotesView) {
    return (
      <div className="space-y-4">
        {notes && notes.length > 0 ? (
          <ul className="space-y-3 text-sm text-text-secondary">
            {notes.map((n) => (
              <li key={n.id} className="border-b border-border pb-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-primary">{n.type}</span>
                  <span className="text-xs text-muted">{n.author.email}</span>
                </div>
                <p>{n.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No notes yet.</p>
        )}
        <div className="flex items-center gap-2">
          <Label htmlFor="candidate-decision" className="text-sm font-medium text-text-secondary">
            Decision
          </Label>
          <Select value={decision} onValueChange={setDecision}>
            <SelectTrigger id="candidate-decision" className="h-9 w-[160px] rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DECISION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-muted">No interview sessions yet.</p>;
  }

  const openSession = sessions.find((s) => s.id === openSessionId);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li key={s.id}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpenSessionId(openSessionId === s.id ? null : s.id)}
              className="h-auto w-full justify-start rounded-xl bg-secondary/40 px-3 py-2 text-left text-sm font-medium text-primary hover:bg-secondary/60"
            >
              {s.title}
            </Button>
          </li>
        ))}
      </ul>

      {openSession && (
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-primary">Session details</h3>
            <Tabs value={lang} onValueChange={(v) => setLang(v as "en" | "de")}>
              <TabsList size="compact" className="w-auto border-0">
                <TabsTrigger value="en" size="compact">
                  EN
                </TabsTrigger>
                <TabsTrigger value="de" size="compact">
                  DE
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {openSession.transcript && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-primary">Transcript</h4>
              <p className="whitespace-pre-wrap text-sm text-text-secondary">{openSession.transcript.text}</p>
            </div>
          )}

          {openSession.summary && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-primary">Summary</h4>
              {lang === "de" ? (
                <p className="text-sm text-text-secondary">
                  {openSession.translationRecords?.find(
                    (t) =>
                      t.toLang === "de" &&
                      (t.summaryId === openSession.summary?.id || t.entityId === openSession.summary?.id),
                  )?.translatedText ?? openSession.summary.summary}
                </p>
              ) : (
                <p className="text-sm text-text-secondary">{openSession.summary.summary}</p>
              )}
              {(() => {
                const evidence = parseJson<{ quote: string; timestamp: string }[]>(openSession.summary?.evidence, []);
                return evidence.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-muted">
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
              <h4 className="mb-2 text-sm font-medium text-primary">Scorecard</h4>
              <p className="text-sm text-text-secondary">{openSession.scorecard.overallRecommendation}</p>
              {openSession.scorecard.interviewerNotes && (
                <p className="mt-1 text-xs text-muted">Notes: {openSession.scorecard.interviewerNotes}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
