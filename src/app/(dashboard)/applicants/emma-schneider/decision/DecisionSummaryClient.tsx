"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function tabSlug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export function DecisionSummaryClient({
  tabs,
  defaultReasoning,
}: {
  tabs: string[];
  defaultReasoning: string;
}) {
  const items = useMemo(() => tabs.map((label) => ({ label, id: tabSlug(label) })), [tabs]);
  const defaultTab = items[items.length - 1]?.id ?? "decision-summary";
  const [reasoning, setReasoning] = useState(defaultReasoning);

  return (
    <Tabs defaultValue={defaultTab} className="min-w-0 space-y-6">
      <TabsList>
        {items.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((t) => (
        <TabsContent key={t.id} value={t.id} className="mt-0 focus-visible:ring-0">
          {t.id === tabSlug("Decision Summary") ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-chrome-border bg-surface p-5 shadow-sm">
                <Label className="text-xs font-semibold tracking-wide text-muted">Decision Reasoning (editable)</Label>
                <Textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  className="mt-3 min-h-[120px] rounded-2xl border-chrome-border bg-parchment px-4 py-3 focus-visible:ring-accent/30"
                />
                <p className="mt-2 text-xs text-muted">Changes are local to the prototype (no backend save yet).</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-chrome-border bg-surface p-5 shadow-sm">
              <p className="font-semibold text-text">{t.label}</p>
              <p className="mt-1 text-sm text-muted">
                This tab is included for navigation realism in the prototype. The Decision Summary tab contains the full
                decision intelligence content.
              </p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
