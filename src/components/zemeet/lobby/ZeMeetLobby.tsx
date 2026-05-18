"use client";

import {
  Check,
  Mic,
  MicOff,
  Shield,
  Sparkles,
  Video,
  VideoOff,
  Volume2,
} from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import {
  zemeetGlass,
  zemeetGlassElevated,
  zemeetLabel,
  zemeetMeta,
  zemeetPrimaryBtn,
  zemeetTitle,
  zemeetVideoTile,
} from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

const DEVICE_OPTIONS = {
  cameras: ["FaceTime HD Camera", "External Webcam"],
  mics: ["MacBook Pro Microphone", "USB Condenser Mic"],
  speakers: ["MacBook Pro Speakers", "AirPods Pro"],
};

export function ZeMeetLobby() {
  const { session, devices, setDevices, permissions, setPermissions, startSession } = useZeMeet();
  const { context } = session;

  const checklist = [
    { key: "camera" as const, label: "Camera access", ok: permissions.camera },
    { key: "microphone" as const, label: "Microphone access", ok: permissions.microphone },
    { key: "notifications" as const, label: "Session notifications", ok: permissions.notifications },
  ];

  return (
    <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8">
      <div className="space-y-5">
        <div>
          <p className={zemeetLabel}>ZeMeet · Pre-join</p>
          <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.04em] text-white">
            Ready to join?
          </h1>
          <p className={cn(zemeetMeta, "mt-2 max-w-md")}>
            Check your devices before entering the collaborative interview room.
          </p>
        </div>

        <div className={cn(zemeetVideoTile, "aspect-video max-h-[340px]")}>
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-[#1a2230] via-[#12171f] to-[#0b0f14]",
              devices.virtualBackground === "gradient" && "from-[rgb(var(--accent-rgb)/0.15)] via-[#161b24]",
            )}
          />
          {devices.blurBackground ? (
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20" aria-hidden />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center">
            {devices.videoEnabled ? (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-[2rem] font-semibold text-white/90">
                {session.participants.find((p) => p.id === session.viewerId)?.initials ?? "You"}
              </div>
            ) : (
              <VideoOff className="h-10 w-10 text-white/40" strokeWidth={1.5} />
            )}
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
              Preview
            </span>
            {devices.noiseCancellation ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-300">
                <Sparkles className="h-3 w-3" /> Noise cancellation
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <DeviceSelect
            label="Camera"
            value={devices.cameraId}
            options={DEVICE_OPTIONS.cameras}
            onChange={(v) => setDevices((d) => ({ ...d, cameraId: v }))}
          />
          <DeviceSelect
            label="Microphone"
            value={devices.microphoneId}
            options={DEVICE_OPTIONS.mics}
            onChange={(v) => setDevices((d) => ({ ...d, microphoneId: v }))}
          />
          <DeviceSelect
            label="Speaker"
            value={devices.speakerId}
            options={DEVICE_OPTIONS.speakers}
            onChange={(v) => setDevices((d) => ({ ...d, speakerId: v }))}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <ToggleChip
            active={devices.blurBackground}
            onClick={() => setDevices((d) => ({ ...d, blurBackground: !d.blurBackground }))}
          >
            Blur background
          </ToggleChip>
          <ToggleChip
            active={devices.noiseCancellation}
            onClick={() => setDevices((d) => ({ ...d, noiseCancellation: !d.noiseCancellation }))}
          >
            Noise cancellation
          </ToggleChip>
          {(["none", "office", "gradient", "brand"] as const).map((bg) => (
            <ToggleChip
              key={bg}
              active={devices.virtualBackground === bg}
              onClick={() => setDevices((d) => ({ ...d, virtualBackground: bg }))}
            >
              {bg === "none" ? "No BG" : bg}
            </ToggleChip>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-[13px] font-medium",
              devices.videoEnabled ? "bg-white/10 text-white" : "bg-red-500/20 text-red-300",
            )}
            onClick={() => setDevices((d) => ({ ...d, videoEnabled: !d.videoEnabled }))}
          >
            {devices.videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            Camera
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-[13px] font-medium",
              devices.audioEnabled ? "bg-white/10 text-white" : "bg-red-500/20 text-red-300",
            )}
            onClick={() => setDevices((d) => ({ ...d, audioEnabled: !d.audioEnabled }))}
          >
            {devices.audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            Mic
          </button>
        </div>

        <div className={cn(zemeetGlass, "p-4")}>
          <p className={zemeetLabel}>Permissions</p>
          <ul className="mt-3 space-y-2">
            {checklist.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3">
                <span className={zemeetMeta}>{item.label}</span>
                <button
                  type="button"
                  onClick={() => setPermissions((p) => ({ ...p, [item.key]: !p[item.key] }))}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    item.ok
                      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                      : "border-white/15 bg-white/5 text-white/40",
                  )}
                >
                  {item.ok ? <Check className="h-3.5 w-3.5" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className={cn(zemeetGlassElevated, "flex flex-col p-6")}>
        <p className={zemeetLabel}>Interview</p>
        <h2 className={cn(zemeetTitle, "mt-2")}>{context.jobTitle}</h2>
        <p className="mt-1 text-[13px] text-white/70">{context.roundTitle}</p>

        <dl className="mt-6 space-y-4">
          <SummaryRow label="Candidate" value={context.candidateName} />
          <SummaryRow
            label="Interviewers"
            value={session.participants.filter((p) => p.role === "interviewer").map((p) => p.name).join(", ")}
          />
          <SummaryRow label="When" value={context.scheduledAt} />
          <SummaryRow label="Timezone" value={context.timezone} />
          <SummaryRow label="Type" value={context.interviewType} />
          <SummaryRow label="Duration" value={`${context.durationMinutes} min`} />
        </dl>

        <div className="mt-auto space-y-3 pt-8">
          <div className="flex items-start gap-2 rounded-[10px] border border-white/[0.06] bg-white/[0.03] p-3">
            <Shield className="h-4 w-4 shrink-0 text-white/50" strokeWidth={1.5} />
            <p className="text-[11px] leading-relaxed text-white/55">
              Interviewer notes are private. Candidates never see evaluation notes or live code
              annotations.
            </p>
          </div>
          <button type="button" className={cn(zemeetPrimaryBtn, "w-full")} onClick={startSession}>
            Join Interview
          </button>
          <p className="text-center text-[10px] text-white/40">
            By joining you agree to recording & data sync to the candidate report.
          </p>
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={zemeetLabel}>{label}</dt>
      <dd className="mt-1 text-[14px] font-medium text-white/90">{value}</dd>
    </div>
  );
}

function DeviceSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className={zemeetLabel}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-[10px] border border-white/[0.08] bg-[#12171F] px-2.5 py-2 text-[12px] text-white/90 outline-none focus:ring-2 focus:ring-white/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
        active
          ? "border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.15)] text-white"
          : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08]",
      )}
    >
      {children}
    </button>
  );
}
