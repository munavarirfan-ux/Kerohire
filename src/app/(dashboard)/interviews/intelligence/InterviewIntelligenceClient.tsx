"use client";

import { useMemo, useState } from "react";

export function InterviewIntelligenceClient({
  transcript,
}: {
  transcript: Array<{ speaker: string; time: string; text: string; highlight?: boolean }>;
}) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<"en" | "de">("en");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transcript;
    return transcript.filter((t) => (t.speaker + " " + t.text).toLowerCase().includes(q));
  }, [query, transcript]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-2xl border border-chrome-border bg-surface px-4 py-2">
          <span className="text-muted text-sm">Search transcript…</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-muted"
            placeholder="Type to filter"
          />
        </div>
        <div className="flex items-center rounded-full border border-chrome-border bg-surface p-1">
          <button
            onClick={() => setLang("en")}
            className={[
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-subtle",
              lang === "en" ? "bg-parchment text-text" : "text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            Original (EN)
          </button>
          <button
            onClick={() => setLang("de")}
            className={[
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-subtle",
              lang === "de" ? "bg-parchment text-text" : "text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            Translated (DE)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-chrome-border bg-surface overflow-hidden">
        <div className="max-h-[520px] overflow-auto divide-y divide-chrome-border">
          {filtered.map((t, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary">{t.speaker}</p>
                <p className="text-xs text-muted">{t.time}</p>
              </div>
              <p
                className={[
                  "mt-2 text-sm leading-relaxed",
                  t.highlight ? "bg-sage/30 border border-sage/60 rounded-xl p-3 text-text" : "text-text-secondary",
                ].join(" ")}
              >
                {lang === "en" ? t.text : mockTranslateToDe(t.text)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function mockTranslateToDe(en: string) {
  // Deliberately simple for the prototype (keeps UX interactive).
  // In production this would be a real translation pipeline.
  return en
    .replace("Certainly.", "Gerne.")
    .replace("The biggest challenge was data consistency.", "Die größte Herausforderung war die Datenkonsistenz.")
    .replace("I advocated for an eventual consistency model", "Ich habe ein eventual-consistency Modell vorgeschlagen")
    .replace("because our primary concern was high availability", "weil unsere wichtigste Priorität hohe Verfügbarkeit war")
    .replace("over strict ACID properties", "und nicht strikte ACID-Eigenschaften")
    .replace("in the logging layer.", "im Logging-Layer.");
}

