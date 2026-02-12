"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function InterviewFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";

  function setStatus(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("status");
    else next.set("status", value);
    router.push(`/interviews?${next.toString()}`);
  }

  return (
    <div className="flex gap-2 mb-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm bg-white"
      >
        <option value="all">All statuses</option>
        <option value="UPLOADED">Uploaded</option>
        <option value="TRANSCRIBED">Transcribed</option>
        <option value="SUMMARIZED">Summarized</option>
      </select>
    </div>
  );
}
