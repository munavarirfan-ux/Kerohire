"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DashboardTabKey = "Interviews" | "Assessments" | "Schedules";

const TAB_VALUES: Record<DashboardTabKey, string> = {
  Interviews: "interviews",
  Assessments: "assessments",
  Schedules: "schedules",
};

const TAB_LABELS: Record<string, DashboardTabKey> = {
  interviews: "Interviews",
  assessments: "Assessments",
  schedules: "Schedules",
};

/** Legacy tab strip — prefer role-aware tabs in `DashboardExperience`. */
export function DashboardTabs({
  defaultTab = "Interviews",
  render,
}: {
  defaultTab?: DashboardTabKey;
  render: (tab: DashboardTabKey) => React.ReactNode;
}) {
  const tabs = useMemo<DashboardTabKey[]>(() => ["Interviews", "Assessments", "Schedules"], []);
  const [active, setActive] = useState(TAB_VALUES[defaultTab]);

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v)} className="space-y-3">
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t} value={TAB_VALUES[t]}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={active} className="min-w-0 focus-visible:ring-0">
        {render(TAB_LABELS[active])}
      </TabsContent>
    </Tabs>
  );
}
