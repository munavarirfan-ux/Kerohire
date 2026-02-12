"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

type Session = Prisma.InterviewSessionGetPayload<{ include: { candidate: true } }>;

export function InterviewList({ sessions }: { sessions: Session[] }) {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const filtered =
    statusFilter && statusFilter !== "all"
      ? sessions.filter((s) => s.status === statusFilter)
      : sessions;

  return (
    <ul className="space-y-2">
      {filtered.map((s) => (
        <li
          key={s.id}
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-white border border-slate-200 hover:bg-secondary/20"
        >
          <div>
            <span className="font-medium text-primary">{s.title}</span>
            <span className="text-sm text-slate-500 ml-2">— {s.candidate.name}</span>
            <span className="text-xs text-slate-400 ml-2">({s.status})</span>
          </div>
          <Link href={`/interviews/${s.id}`} className="text-accent font-medium hover:underline text-sm">
            Open
          </Link>
        </li>
      ))}
    </ul>
  );
}
