"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="mb-4 flex items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="interview-status-filter">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="interview-status-filter" className="w-[200px] rounded-[10px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="UPLOADED">Uploaded</SelectItem>
            <SelectItem value="TRANSCRIBED">Transcribed</SelectItem>
            <SelectItem value="SUMMARIZED">Summarized</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
