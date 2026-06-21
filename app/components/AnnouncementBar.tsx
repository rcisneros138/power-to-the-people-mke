"use client";

import { useEffect, useState } from "react";
import { shouldShow, type AnnouncementUrgency, type WPAnnouncement } from "../lib/announcement";

const STORAGE_KEY = "pttp-dismissed-announcement";

const URGENCY_CLASSES: Record<AnnouncementUrgency, string> = {
  info: "bg-navy text-cream",
  event: "bg-coral text-navy",
  urgent: "bg-urgent text-white",
};

export default function AnnouncementBar({
  announcement,
}: {
  announcement: WPAnnouncement | null;
}) {
  // Start hidden; the client-side check below decides whether to reveal. This
  // avoids a flash of a banner that's actually expired, scheduled, or dismissed.
  const [visible, setVisible] = useState(false);

  const currentKey = announcement
    ? `${announcement.id}:${announcement.contentHash}`
    : "";

  useEffect(() => {
    if (!announcement) {
      return;
    }
    let dismissedValue: string | null = null;
    try {
      dismissedValue = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (private mode / blocked) — treat as not dismissed.
    }
    setVisible(
      shouldShow({
        now: Date.now(),
        currentKey,
        showFrom: announcement.showFrom,
        showUntil: announcement.showUntil,
        dismissible: announcement.dismissible,
        dismissedValue,
      })
    );
  }, [announcement, currentKey]);

  if (!announcement || !visible) {
    return null;
  }

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, currentKey);
    } catch {
      // Ignore — worst case the banner reappears on next load.
    }
    setVisible(false);
  };

  const hasButton = Boolean(announcement.buttonLabel && announcement.buttonUrl);
  const isExternal = /^https?:\/\//i.test(announcement.buttonUrl ?? "");
  const colorClass = URGENCY_CLASSES[announcement.urgency] ?? URGENCY_CLASSES.info;

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className={`${colorClass} relative w-full`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-2.5 pr-10 text-center text-sm font-medium sm:px-6 lg:px-8">
        <p className="m-0">{announcement.message}</p>

        {hasButton && (
          <a
            href={announcement.buttonUrl!}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-1 font-bold uppercase tracking-wider transition-colors hover:bg-white/30"
          >
            {announcement.buttonLabel}
          </a>
        )}
      </div>

      {announcement.dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none opacity-80 transition-opacity hover:opacity-100"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
}
