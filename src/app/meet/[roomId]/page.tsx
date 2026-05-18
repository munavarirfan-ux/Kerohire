"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ZeMeetExperience } from "@/components/zemeet/ZeMeetExperience";
import { resolveZeMeetSession } from "@/lib/zemeet/session";
import type { ZeMeetParticipantRole } from "@/lib/zemeet/types";

export default function ZeMeetRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = typeof params.roomId === "string" ? params.roomId : "";

  const role = (searchParams.get("role") ?? "interviewer") as ZeMeetParticipantRole;
  const session = useMemo(
    () => (roomId ? resolveZeMeetSession(roomId, role) : null),
    [roomId, role],
  );

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0B0F14] px-4 text-center text-white/70">
        <p>Invalid or missing meeting room.</p>
      </div>
    );
  }

  return <ZeMeetExperience session={session} />;
}
