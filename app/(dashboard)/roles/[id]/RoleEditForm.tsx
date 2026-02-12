"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ConfigRow = {
  id: string;
  traitId: string;
  traitName: string;
  weight: number;
  targetMin: number;
  targetMax: number;
  riskBelow: number | null;
  riskAbove: number | null;
};

export function RoleEditForm({
  roleId,
  configs,
}: {
  roleId: string;
  configs: ConfigRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(configs);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/roles/${roleId}/config`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configs: rows.map((r) => ({
            id: r.id,
            weight: r.weight,
            targetMin: r.targetMin,
            targetMax: r.targetMax,
            riskBelow: r.riskBelow,
            riskAbove: r.riskAbove,
          })),
        }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 font-medium text-primary">Trait</th>
            <th className="text-left py-2 font-medium text-primary">Weight</th>
            <th className="text-left py-2 font-medium text-primary">Target min</th>
            <th className="text-left py-2 font-medium text-primary">Target max</th>
            <th className="text-left py-2 font-medium text-primary">Risk below</th>
            <th className="text-left py-2 font-medium text-primary">Risk above</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100">
              <td className="py-2">{r.traitName}</td>
              <td className="py-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={r.weight}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === r.id ? { ...x, weight: Number(e.target.value) } : x
                      )
                    )
                  }
                  className="w-20"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={r.targetMin}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === r.id ? { ...x, targetMin: Number(e.target.value) } : x
                      )
                    )
                  }
                  className="w-20"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={r.targetMax}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === r.id ? { ...x, targetMax: Number(e.target.value) } : x
                      )
                    )
                  }
                  className="w-20"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={r.riskBelow ?? ""}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === r.id
                          ? { ...x, riskBelow: e.target.value === "" ? null : Number(e.target.value) }
                          : x
                      )
                    )
                  }
                  className="w-20"
                  placeholder="—"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={r.riskAbove ?? ""}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === r.id
                          ? { ...x, riskAbove: e.target.value === "" ? null : Number(e.target.value) }
                          : x
                      )
                    )
                  }
                  className="w-20"
                  placeholder="—"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
