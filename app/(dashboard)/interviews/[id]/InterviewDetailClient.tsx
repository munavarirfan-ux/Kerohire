"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseJson } from "@/lib/json";
import type { Prisma } from "@prisma/client";

type Interview = Prisma.InterviewSessionGetPayload<{
  include: {
    candidate: true;
    transcript: true;
    summary: true;
    scorecard: true;
    translationRecords: true;
  };
}>;

export function InterviewDetailClient({ interview }: { interview: Interview }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [translateLang, setTranslateLang] = useState<"en" | "de">("en");

  async function handleGenerateTranscript() {
    setGenerating("transcript");
    try {
      await fetch(`/api/interviews/${interview.id}/transcribe`, { method: "POST" });
      router.refresh();
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateSummary() {
    setGenerating("summary");
    try {
      await fetch(`/api/interviews/${interview.id}/summarize`, { method: "POST" });
      router.refresh();
    } finally {
      setGenerating(null);
    }
  }

  async function handleTranslate() {
    setGenerating("translate");
    try {
      await fetch(`/api/interviews/${interview.id}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromLang: "en", toLang: "de" }),
      });
      router.refresh();
    } finally {
      setGenerating(null);
    }
  }

  const summaryTrans = interview.translationRecords?.find(
    (t) => t.toLang === "de" && (t.summaryId === interview.summary?.id || t.entityId === interview.summary?.id)
  );

  return (
    <div className="space-y-6">
      {/* Upload (MVP: simple file upload) */}
      <Card>
        <CardHeader>
          <CardTitle>Upload audio</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="audio/*"
            className="text-sm text-slate-600"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const form = new FormData();
                form.set("file", file);
                await fetch(`/api/interviews/${interview.id}/upload`, {
                  method: "POST",
                  body: form,
                });
                router.refresh();
              } finally {
                setUploading(false);
              }
            }}
          />
          {uploading && <p className="text-sm text-slate-500 mt-2">Uploading…</p>}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerateTranscript}
              disabled={!!interview.transcript || generating !== null}
            >
              {generating === "transcript" ? "Generating…" : "Generate transcript"}
            </Button>
            <Button
              onClick={handleGenerateSummary}
              disabled={!interview.transcript || !!interview.summary || generating !== null}
            >
              {generating === "summary" ? "Generating…" : "Generate summary + scorecard"}
            </Button>
            <Button
              variant="outline"
              onClick={handleTranslate}
              disabled={!interview.summary || generating !== null}
            >
              {generating === "translate" ? "Translating…" : "Translate (EN → DE)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transcript */}
      {interview.transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">
              {interview.transcript.text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary + evidence + scorecard */}
      {interview.summary && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setTranslateLang("en")}
                  className={`px-3 py-1 rounded-lg text-sm ${translateLang === "en" ? "bg-primary text-white" : "bg-slate-100"}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setTranslateLang("de")}
                  className={`px-3 py-1 rounded-lg text-sm ${translateLang === "de" ? "bg-primary text-white" : "bg-slate-100"}`}
                >
                  DE
                </button>
              </div>
              <p className="text-sm text-slate-600">
                {translateLang === "de" && summaryTrans
                  ? summaryTrans.translatedText
                  : interview.summary.summary}
              </p>
              {(() => {
                const evidence = parseJson<{ quote: string; timestamp: string }[]>(
                  interview.summary?.evidence,
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
            </CardContent>
          </Card>
          {interview.scorecard && (
            <Card>
              <CardHeader>
                <CardTitle>Scorecard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  {interview.scorecard.overallRecommendation}
                </p>
                {interview.scorecard.interviewerNotes && (
                  <p className="text-xs text-slate-500 mt-2">
                    Notes: {interview.scorecard.interviewerNotes}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
