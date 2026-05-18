import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoMock } from "@/features/demo/data/demo.mock";
import { ApplicantHubTabs } from "./ApplicantHubTabs";

function Metric({ label, value, tone }: { label: string; value: string; tone?: "accent" | "forest" }) {
  const valueCls = tone === "accent" ? "text-accent" : "text-text";
  return (
    <div className="text-center">
      <p className="text-[11px] font-semibold tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${valueCls}`}>{value}</p>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface/10 px-3 py-1 text-xs font-semibold text-white/90 border border-white/15">
      {children}
    </span>
  );
}

export default function EmmaSchneiderApplicantHubPage() {
  const c = demoMock.emma;

  return (
    <div className="space-y-6">
      <Card className="border-chrome-border">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-muted border border-chrome-border shadow-sm" />
              <div>
                <h1 className="text-chrome-active">{c.name}</h1>
                <p className="text-sm text-muted">{c.titleLine}</p>
                <div className="mt-2 flex items-center gap-6">
                  <Metric label="EVIDENCE COVERAGE" value={`${c.metrics.evidenceCoveragePct}%`} tone="accent" />
                  <Metric label="HIRING CONFIDENCE" value={`${c.metrics.hiringConfidencePct}%`} />
                  <Metric label="ATS SCORE" value={`${c.metrics.atsScorePct}%`} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="rounded-full border-chrome-border">
                View CV
              </Button>
              <Button variant="outline" className="rounded-full border-chrome-border">
                Move to Stage
              </Button>
              <Link href="/interviews/intelligence">
                <Button className="rounded-full bg-accent hover:bg-accent/90 text-white">Schedule Interview</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-chrome-border overflow-hidden">
        <CardContent className="p-0">
          <div className="rounded-3xl bg-forest text-white p-6 md:p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <p className="text-lg font-semibold">{c.intelligenceOverview.heading}</p>
                </div>
                <div className="space-y-3 text-sm text-white/80 leading-relaxed">
                  {c.intelligenceOverview.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface/5 p-5 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-white/60">STRONG EVIDENCE AREAS</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.intelligenceOverview.strongEvidenceAreas.map((x) => (
                      <Chip key={x}>{x}</Chip>
                    ))}
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-[11px] font-semibold tracking-wide text-white/60">MISSING EVIDENCE</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.intelligenceOverview.missingEvidence.map((x) => (
                      <span
                        key={x}
                        className="inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white/80 border border-white/10"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApplicantHubTabs workSignals={c.workSignals} />
    </div>
  );
}

