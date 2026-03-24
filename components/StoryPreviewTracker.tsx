"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const SESSION_STORAGE_KEY = "table-novel-session-id";
const PREVIEW_DELAY_MS = 1800;

function getOrCreateSessionId() {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const nextId = typeof window.crypto?.randomUUID === "function"
    ? window.crypto.randomUUID()
    : String(Date.now()) + "-" + Math.random().toString(36).slice(2);

  window.localStorage.setItem(SESSION_STORAGE_KEY, nextId);
  return nextId;
}

type StoryPreviewTrackerProps = {
  storyId: string;
  initialCount: number;
  className?: string;
};

export default function StoryPreviewTracker({
  storyId,
  initialCount,
  className,
}: StoryPreviewTrackerProps) {
  const [previewCount, setPreviewCount] = useState(initialCount);
  const sentRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!storyId || typeof document === "undefined") {
      return;
    }

    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const recordPreview = async () => {
      if (sentRef.current || document.visibilityState !== "visible") {
        return;
      }

      const sessionId = getOrCreateSessionId();
      if (!sessionId) {
        return;
      }

      sentRef.current = true;

      const { data, error } = await supabase.rpc("record_story_preview", {
        p_story_id: storyId,
        p_session_id: sessionId,
      });

      if (error) {
        console.error("Failed to record story preview:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        sentRef.current = false;
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;

      if (result && typeof result.preview_count === "number") {
        setPreviewCount(result.preview_count);
      }
    };

    const scheduleRecord = () => {
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        void recordPreview();
      }, PREVIEW_DELAY_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !sentRef.current) {
        scheduleRecord();
        return;
      }

      clearTimer();
    };

    if (document.visibilityState === "visible") {
      scheduleRecord();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimer();
    };
  }, [storyId]);

  return (
    <span className={className ?? "flex items-center gap-1"}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
      </svg>
      {new Intl.NumberFormat("ja-JP").format(previewCount)}
    </span>
  );
}
