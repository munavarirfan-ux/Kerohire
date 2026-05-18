"use client";

import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { ZeMeetVideoTile } from "@/components/zemeet/room/ZeMeetVideoTile";

export function ZeMeetVideoStage() {
  const { session } = useZeMeet();
  const visible = session.participants.filter((p) => !p.isObserver || session.viewerRole === "observer");
  const candidate = visible.find((p) => p.role === "candidate");
  const interviewers = visible.filter((p) => p.role === "interviewer");

  return (
    <div className="grid min-h-0 flex-1 gap-3 p-4 lg:grid-cols-[1.4fr_1fr]">
      {candidate ? (
        <ZeMeetVideoTile participant={candidate} large speaking />
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {interviewers.map((p) => (
          <ZeMeetVideoTile key={p.id} participant={p} />
        ))}
      </div>
    </div>
  );
}
