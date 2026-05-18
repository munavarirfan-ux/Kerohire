"use client";

import { Play } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetLabel, zemeetPanel } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

/** Code challenge editor surface (embedded in layout, not fullscreen overlay) */
export function ZeMeetCodeEditor() {
  const { codeChallenge, updateCandidateCode, runCodeTests, session } = useZeMeet();
  const isCandidate = session.viewerRole === "candidate";

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className={cn(zemeetPanel, "m-3 flex min-h-0 flex-1 flex-col overflow-hidden lg:max-w-[42%]")}>
        <div className="border-b border-white/[0.06] px-4 py-3">
          <p className={zemeetLabel}>Problem</p>
          <p className="mt-1 text-[14px] font-semibold text-white">{codeChallenge.problemTitle}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-white/75">
            {codeChallenge.problemStatement}
          </p>
          <p className={cn(zemeetLabel, "mt-6")}>Test cases</p>
          <ul className="mt-2 space-y-1.5">
            {codeChallenge.testCases.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] px-2.5 py-1.5 text-[12px] text-white/70"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    t.passed === true && "bg-emerald-400",
                    t.passed === false && "bg-red-400",
                    t.passed === undefined && "bg-white/25",
                  )}
                />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative m-3 ml-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0d1118]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
          <span className="text-[11px] font-medium text-white/50">{codeChallenge.language}</span>
          {isCandidate ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
              onClick={runCodeTests}
            >
              <Play className="h-3.5 w-3.5" /> Run
            </button>
          ) : (
            <span className="text-[11px] font-medium text-amber-300/90">Observing live typing</span>
          )}
        </div>
        <textarea
          value={codeChallenge.candidateCode}
          onChange={(e) => isCandidate && updateCandidateCode(e.target.value)}
          readOnly={!isCandidate}
          spellCheck={false}
          className="min-h-[180px] flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-emerald-100/90 outline-none"
        />
        <div className="border-t border-white/[0.06] bg-[#080b10] p-3">
          <p className={zemeetLabel}>Console</p>
          <pre className="mt-2 max-h-[100px] overflow-auto font-mono text-[11px] text-white/60">
            {codeChallenge.consoleOutput}
          </pre>
        </div>
      </section>
    </div>
  );
}
