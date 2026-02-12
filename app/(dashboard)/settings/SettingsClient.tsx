"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsClient({
  orgId,
  dataRetentionMonths,
  anonymizedScreening,
  isHr,
}: {
  orgId: string;
  dataRetentionMonths: number | null;
  anonymizedScreening: boolean;
  isHr: boolean;
}) {
  const router = useRouter();
  const [retention, setRetention] = useState(String(dataRetentionMonths ?? ""));
  const [anonymized, setAnonymized] = useState(anonymizedScreening);
  const [saving, setSaving] = useState(false);

  async function saveRetention() {
    setSaving(true);
    try {
      await fetch(`/api/settings/retention`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          months: retention === "" ? null : parseInt(retention, 10),
        }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function saveAnonymized() {
    setSaving(true);
    try {
      await fetch(`/api/settings/anonymized`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: anonymized }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data retention (mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-2">
            Auto-delete candidate data after X months. No cron runs in MVP; UI only.
          </p>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="0"
              placeholder="No auto-delete"
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-slate-500">months</span>
            <Button onClick={saveRetention} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isHr && (
        <Card>
          <CardHeader>
            <CardTitle>Anonymized screening</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-2">
              When enabled, candidate name and email are hidden in the candidates list for HR users.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={anonymized}
                onChange={async (e) => {
                  const next = e.target.checked;
                  setAnonymized(next);
                  setSaving(true);
                  try {
                    await fetch(`/api/settings/anonymized`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ enabled: next }),
                    });
                    router.refresh();
                  } finally {
                    setSaving(false);
                  }
                }}
                className="rounded border-slate-300"
              />
              <span className="text-sm">Hide candidate name/email in list</span>
            </label>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
