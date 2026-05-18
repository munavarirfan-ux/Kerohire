"use client";

import {
  Code2,
  FileText,
  LayoutGrid,
  Linkedin,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  StickyNote,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import {
  zemeetControlBtn,
  zemeetControlBtnActive,
  zemeetControlBtnDanger,
} from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

export function ZeMeetControlBar({
  onLeave,
  codeChallengeMode,
}: {
  onLeave: () => void;
  codeChallengeMode?: boolean;
}) {
  const {
    session,
    devices,
    setDevices,
    sidebarTab,
    setSidebarTab,
    toggleCodeChallenge,
    codeChallenge,
    interviewerIntelPanel,
    toggleInterviewerIntel,
  } = useZeMeet();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";
  const showIntelControls = isInterviewer && codeChallengeMode && codeChallenge.status === "active";

  function toggleSidebar(tab: "participants" | "chat" | "notes") {
    setSidebarTab(sidebarTab === tab ? null : tab);
  }

  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-white/[0.06] bg-[#0B0F14]/90 px-4 py-4 backdrop-blur-md">
      <ControlIcon
        label={devices.audioEnabled ? "Mute" : "Unmute"}
        active={!devices.audioEnabled}
        onClick={() => setDevices((d) => ({ ...d, audioEnabled: !d.audioEnabled }))}
      >
        {devices.audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </ControlIcon>
      <ControlIcon
        label={devices.videoEnabled ? "Stop video" : "Start video"}
        active={!devices.videoEnabled}
        onClick={() => setDevices((d) => ({ ...d, videoEnabled: !d.videoEnabled }))}
      >
        {devices.videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </ControlIcon>
      <ControlIcon label="Share screen">
        <MonitorUp className="h-5 w-5" />
      </ControlIcon>
      <ControlIcon
        label="Participants"
        pressed={sidebarTab === "participants"}
        onClick={() => toggleSidebar("participants")}
      >
        <Users className="h-5 w-5" />
      </ControlIcon>
      <ControlIcon
        label="Chat"
        pressed={sidebarTab === "chat"}
        onClick={() => toggleSidebar("chat")}
      >
        <MessageSquare className="h-5 w-5" />
      </ControlIcon>
      {isInterviewer ? (
        <ControlIcon
          label="Private notes"
          pressed={sidebarTab === "notes"}
          onClick={() => toggleSidebar("notes")}
        >
          <StickyNote className="h-5 w-5" />
        </ControlIcon>
      ) : null}
      {showIntelControls ? (
        <>
          <ControlIcon
            label="View resume (private)"
            pressed={interviewerIntelPanel === "resume"}
            onClick={() => toggleInterviewerIntel("resume")}
          >
            <FileText className="h-5 w-5" />
          </ControlIcon>
          <ControlIcon
            label="View LinkedIn (private)"
            pressed={interviewerIntelPanel === "linkedin"}
            onClick={() => toggleInterviewerIntel("linkedin")}
          >
            <Linkedin className="h-5 w-5" />
          </ControlIcon>
        </>
      ) : null}
      {isInterviewer && session.codeChallengeEnabled ? (
        <ControlIcon
          label={
            codeChallenge.status === "active"
              ? "Close code challenge"
              : "Open code challenge"
          }
          pressed={codeChallenge.status === "active"}
          onClick={() => toggleCodeChallenge()}
        >
          <Code2 className="h-5 w-5" />
        </ControlIcon>
      ) : null}
      <ControlIcon label="Layout">
        <LayoutGrid className="h-5 w-5" />
      </ControlIcon>
      <button
        type="button"
        aria-label="Leave interview"
        className={cn(zemeetControlBtnDanger, "h-12 w-14 rounded-[14px]")}
        onClick={onLeave}
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </footer>
  );
}

function ControlIcon({
  children,
  label,
  active,
  pressed,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  pressed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cn(
        pressed || active ? zemeetControlBtnActive : zemeetControlBtn,
      )}
    >
      {children}
    </button>
  );
}
