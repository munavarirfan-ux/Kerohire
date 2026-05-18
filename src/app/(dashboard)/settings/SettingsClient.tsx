"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

  async function saveAnonymized(enabled: boolean) {
    setSaving(true);
    try {
      await fetch(`/api/settings/anonymized`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
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
          <p className="mb-3 text-sm text-text-secondary">
            Auto-delete candidate data after X months. No cron runs in MVP; UI only.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="retention-months">Retention period</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="retention-months"
                  type="number"
                  min="0"
                  placeholder="No auto-delete"
                  value={retention}
                  onChange={(e) => setRetention(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-muted">months</span>
              </div>
            </div>
            <Button onClick={saveRetention} disabled={saving} className="mt-6">
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isHr ? (
        <Card>
          <CardHeader>
            <CardTitle>Anonymized screening</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-text-secondary">
              When enabled, candidate name and email are hidden in the candidates list for HR users.
            </p>
            <div className="flex items-center gap-3">
              <Switch
                id="anonymized-screening"
                checked={anonymized}
                onCheckedChange={async (next) => {
                  setAnonymized(next);
                  await saveAnonymized(next);
                }}
                disabled={saving}
              />
              <Label htmlFor="anonymized-screening" className="cursor-pointer font-normal text-sm text-text">
                Hide candidate name/email in list
              </Label>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
