"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JobCreateForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: "",
    level: "",
  });

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, orgId }),
      });
      if (!res.ok) throw new Error("Failed");
      const { id } = await res.json();
      router.push(`/jobs/${id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-chrome-border">
      <CardHeader>
        <CardTitle className="text-chrome-active">Step 1: Job basics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Business Development Manager"
            className="border-chrome-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <Input
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            placeholder="e.g. Sales"
            className="border-chrome-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <Input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="City / Remote / Hybrid"
            className="border-chrome-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Employment type</label>
          <Input
            value={form.employmentType}
            onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
            placeholder="Full-time / Part-time"
            className="border-chrome-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
          <Input
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            placeholder="e.g. Senior"
            className="border-chrome-border"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} disabled={!form.title || loading} className="bg-accent text-white">
            {loading ? "Creating…" : "Create job"}
          </Button>
          <Button variant="outline" onClick={() => setStep(2)} className="border-chrome-active text-chrome-active">
            Next: Post content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
