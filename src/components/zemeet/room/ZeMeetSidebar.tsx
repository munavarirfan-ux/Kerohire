"use client";

import { useState } from "react";
import { Lock, Send } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { zemeetLabel, zemeetPanel } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

export function ZeMeetSidebar() {
  const { sidebarTab, session, chat, sendChat, notes, addNote } = useZeMeet();
  const [chatDraft, setChatDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  if (!sidebarTab) return null;

  return (
    <aside
      className={cn(
        zemeetPanel,
        "flex w-full shrink-0 flex-col border-l border-white/[0.06] sm:w-[320px]",
      )}
    >
      <header className="border-b border-white/[0.06] px-4 py-3">
        <p className={zemeetLabel}>
          {sidebarTab === "participants"
            ? "Participants"
            : sidebarTab === "chat"
              ? "Chat"
              : "Private notes"}
        </p>
      </header>

      {sidebarTab === "participants" ? (
        <ul className="flex-1 space-y-2 overflow-y-auto p-3">
          {session.participants.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-[10px] border border-white/[0.05] bg-white/[0.03] px-3 py-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold">
                {p.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white/90">{p.name}</p>
                <p className="text-[10px] capitalize text-white/45">{p.role}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {sidebarTab === "chat" ? (
        <>
          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {chat.length === 0 ? (
              <p className="text-center text-[12px] text-white/40">No messages yet</p>
            ) : (
              chat.map((m) => (
                <li key={m.id} className="rounded-[10px] bg-white/[0.04] px-3 py-2">
                  <p className="text-[10px] font-medium text-white/50">
                    {m.authorName} · {m.at}
                  </p>
                  <p className="mt-0.5 text-[13px] text-white/85">{m.body}</p>
                </li>
              ))
            )}
          </ul>
          <form
            className="flex gap-2 border-t border-white/[0.06] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendChat(chatDraft);
              setChatDraft("");
            }}
          >
            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              placeholder="Message everyone…"
              className="min-w-0 flex-1 rounded-[10px] border border-white/[0.08] bg-[#0d1118] px-3 py-2 text-[13px] text-white outline-none focus:ring-2 focus:ring-white/15"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10 text-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      ) : null}

      {sidebarTab === "notes" ? (
        <>
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2 text-[10px] text-amber-300/90">
            <Lock className="h-3 w-3" strokeWidth={1.5} />
            Candidate cannot see these notes
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-[10px] border border-white/[0.05] bg-white/[0.03] p-2">
                {n.timestampMs != null ? (
                  <p className="text-[10px] tabular-nums text-white/40">
                    +{Math.floor(n.timestampMs / 1000)}s
                  </p>
                ) : null}
                <p className="mt-0.5 whitespace-pre-wrap text-[12px] text-white/80">{n.body}</p>
              </li>
            ))}
          </ul>
          <form
            className="border-t border-white/[0.06] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              addNote(noteDraft);
              setNoteDraft("");
            }}
          >
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Quick note… supports **markdown**"
              rows={3}
              className="w-full resize-none rounded-[10px] border border-white/[0.08] bg-[#0d1118] px-3 py-2 text-[13px] text-white outline-none focus:ring-2 focus:ring-white/15"
            />
            <p className="mt-1 text-[10px] text-white/35">Auto-saves to Candidate Report → Notes</p>
          </form>
        </>
      ) : null}
    </aside>
  );
}
