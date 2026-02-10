"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Announcement } from "@/lib/announcements";

type Props = {
  announcements: Announcement[];
};

const iconByType: Record<Announcement["type"], string> = {
  info: "📢",
  warning: "⚠️",
  success: "✨",
  event: "🎉",
};

const classByType: Record<Announcement["type"], string> = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-green-50 border-green-200 text-green-900",
  event: "bg-purple-50 border-purple-200 text-purple-900",
};

const storageKey = (id: string) => `announcement_dismissed_${id}`;

export default function AnnouncementBanner({ announcements }: Props) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const next = new Set<string>();
    announcements.forEach((item) => {
      try {
        if (localStorage.getItem(storageKey(item.id)) === "1") {
          next.add(item.id);
        }
      } catch {
        // Ignore storage errors (private mode, blocked storage, etc.)
      }
    });
    setDismissedIds(next);
  }, [announcements]);

  const visible = useMemo(
    () => announcements.filter((item) => !dismissedIds.has(item.id)),
    [announcements, dismissedIds]
  );

  if (visible.length === 0) return null;

  const current = visible[0];
  const type = current.type ?? "info";
  const icon = iconByType[type];
  const style = classByType[type];

  const handleDismiss = () => {
    try {
      localStorage.setItem(storageKey(current.id), "1");
    } catch {
      // Ignore storage errors
    }
    setDismissedIds((prev) => new Set(prev).add(current.id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${style}`}>
        <span className="text-lg leading-none">{icon}</span>
        <div className="flex-1 text-sm md:text-base">
          <span>{current.message}</span>
          {current.link && current.linkText && (
            <Link
              href={current.link}
              className="ml-2 underline underline-offset-2 hover:opacity-80"
            >
              {current.linkText}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="告知を閉じる"
          className="text-lg leading-none hover:opacity-60"
        >
          ×
        </button>
      </div>
    </div>
  );
}
