"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRole } from "@/context/RoleContext";
import type { PreviewRole } from "@/config/previewRole";
import {
  getNotificationsSnapshot,
  markFeedbackNotificationRead,
  subscribeFeedbackNotifications,
  type FeedbackNotificationsSnapshot,
} from "@/lib/hiring/feedbackNotifications";
import { cn } from "@/lib/utils";

const EMPTY_SNAPSHOT: FeedbackNotificationsSnapshot = {
  version: 0,
  notifications: [],
  unread: 0,
};

function useFeedbackNotifications(role: PreviewRole) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeFeedbackNotifications(onStoreChange),
    [],
  );

  const getSnapshot = useCallback(() => getNotificationsSnapshot(role), [role]);
  const getServerSnapshot = useCallback(() => EMPTY_SNAPSHOT, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function FeedbackNotificationsMenu() {
  const { selectedRole } = useRole();
  const { notifications, unread } = useFeedbackNotifications(selectedRole);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.05)] bg-transparent px-0"
          aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        >
          <Bell className="h-4 w-4 text-text" strokeWidth={1.5} />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-2 min-w-[8px] items-center justify-center rounded-full bg-accent ring-2 ring-surface" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(100vw-2rem,360px)] p-0">
        <div className="border-b border-[rgba(15,23,42,0.06)] px-3 py-2.5">
          <p className="text-[13px] font-semibold text-[#18181B]">Notifications</p>
          {selectedRole === "superAdmin" || selectedRole === "admin" ? (
            <p className="mt-0.5 text-[11px] text-[#71717A]">
              Switch to Interviewer to preview assignee notifications.
            </p>
          ) : null}
        </div>
        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-[12px] text-[#71717A]">No notifications yet.</p>
        ) : (
          <ul className="max-h-[min(360px,50vh)] overflow-y-auto p-1.5" role="list">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-lg px-2.5 py-2.5 text-left transition-colors",
                    "hover:bg-[rgba(15,23,42,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
                    !n.read && "bg-accent/[0.04]",
                  )}
                  onClick={() => markFeedbackNotificationRead(n.id)}
                >
                  <p className="text-[12px] font-semibold text-[#18181B]">{n.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#52525B]">
                    Please submit interview feedback for: <strong>{n.candidateName}</strong>
                  </p>
                  <dl className="mt-2 space-y-0.5 text-[11px] text-[#71717A]">
                    <div>
                      <span className="font-medium">Role: </span>
                      {n.roleTitle}
                    </div>
                    <div>
                      <span className="font-medium">Round: </span>
                      {n.round}
                    </div>
                    <div>
                      <span className="font-medium">Requested by: </span>
                      {n.requestedBy}
                    </div>
                  </dl>
                  <span className="mt-2 inline-flex text-[11px] font-medium text-accent">{n.ctaLabel} →</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
