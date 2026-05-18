import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoMock } from "@/features/demo/data/demo.mock";
import { DecisionSummaryClient } from "./DecisionSummaryClient";

export default function EmmaDecisionSummaryPage() {
  const d = demoMock.emma.decisionSummary;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-chrome-active">Decision Summary</h1>
          <p className="text-sm text-muted">Evidence-led decision intelligence · defensible hiring rationale</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/applicants/emma-schneider">
            <Button variant="outline" className="rounded-full border-chrome-border">
              Back to Candidate
            </Button>
          </Link>
          <Button className="rounded-full bg-accent hover:bg-accent/90 text-white">Export decision report</Button>
        </div>
      </div>

      <DecisionSummaryClient tabs={d.tabs} defaultReasoning={d.editableReasoning} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-chrome-border">
          <CardHeader>
            <CardTitle className="text-chrome-active">Decision Intelligence Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-chrome-border bg-parchment p-4">
              <p className="text-xs font-semibold tracking-wide text-muted">Recommended Action</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  {d.recommendedAction}
                </span>
                <span className="text-sm text-muted">
                  Confidence: <span className="font-semibold text-text">{d.confidencePct}%</span>
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-chrome-border bg-surface p-4">
              <p className="text-xs font-semibold tracking-wide text-muted">Evidence-Backed Justification</p>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {d.evidenceBackedJustification.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-0.5 text-muted">•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chrome-border">
          <CardHeader>
            <CardTitle className="text-chrome-active">Decision Reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-chrome-border bg-surface p-4">
              <p className="text-sm text-text-secondary leading-relaxed">{d.editableReasoning}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/interviews/intelligence">
                <Button variant="outline" className="rounded-full border-chrome-border">
                  Review interview evidence
                </Button>
              </Link>
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-white">Proceed to final round</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

