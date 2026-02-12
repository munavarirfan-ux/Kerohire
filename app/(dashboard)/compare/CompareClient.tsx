"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CandidateRow = {
  id: string;
  name: string;
  roleName: string;
  roleFitScore: number;
  riskCount: number;
  confidence: number;
  alignedTraits: string[];
};

export function CompareClient({ candidates }: { candidates: CandidateRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  }

  const selectedList = candidates.filter((c) => selected.has(c.id));
  const scores = selectedList.map((c) => c.roleFitScore);
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const worstScore = scores.length ? Math.min(...scores) : 0;
  const exportUrl =
    selectedList.length >= 2
      ? `/api/export/compare?ids=${selectedList.map((c) => c.id).join(",")}`
      : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select 2–4 candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {candidates.map((c) => (
              <li key={c.id}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggle(c.id)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm font-medium text-primary">{c.name}</span>
                  <span className="text-xs text-slate-500">{c.roleName}</span>
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selectedList.length >= 2 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Comparison</CardTitle>
            {exportUrl && (
              <a href={exportUrl} download>
                <button
                  type="button"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Export PDF
                </button>
              </a>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-medium text-primary">Candidate</th>
                    <th className="text-left py-2 font-medium text-primary">Role fit %</th>
                    <th className="text-left py-2 font-medium text-primary">Risks</th>
                    <th className="text-left py-2 font-medium text-primary">Confidence</th>
                    <th className="text-left py-2 font-medium text-primary">Top strengths</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedList.map((c) => (
                    <tr
                      key={c.id}
                      className={cn(
                        "border-b border-slate-100",
                        c.roleFitScore === bestScore && bestScore !== worstScore && "bg-secondary/20",
                        c.roleFitScore === worstScore && bestScore !== worstScore && "bg-slate-50"
                      )}
                    >
                      <td className="py-3 font-medium text-primary">{c.name}</td>
                      <td className="py-3">{c.roleFitScore}%</td>
                      <td className="py-3">{c.riskCount}</td>
                      <td className="py-3">{c.confidence}%</td>
                      <td className="py-3 text-slate-600">
                        {c.alignedTraits.slice(0, 3).join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
