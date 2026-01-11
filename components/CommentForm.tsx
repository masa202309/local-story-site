"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Comment } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const MAX_COMMENT_LENGTH = 500;

type CommentFormProps = {
  storyId: string;
  parentId?: string;
  onSubmitted?: (comment: Comment) => void;
  onCancel?: () => void;
  variant?: "default" | "reply";
  lastSubmittedAt?: number | null;
  minIntervalMs?: number;
};

export function CommentForm({
  storyId,
  parentId,
  onSubmitted,
  onCancel,
  variant = "default",
  lastSubmittedAt = null,
  minIntervalMs = 0,
}: CommentFormProps) {
  const { user, loading } = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authorName && user?.user_metadata?.name) {
      setAuthorName(String(user.user_metadata.name));
    }
  }, [authorName, user]);

  if (loading) {
    return (
      <div className={`${variant === "reply" ? "mt-3" : "mt-4"} text-sm text-gray-500`}>
        ログイン状態を確認中...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${variant === "reply" ? "mt-3" : "mt-4"} rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-gray-700`}>
        コメントを投稿するには
        <Link href="/login" className="text-amber-700 hover:underline">
          ログイン
        </Link>
        が必要です。
      </div>
    );
  }

  const trimmedName = authorName.trim();
  const trimmedContent = content.trim();
  const remaining = MAX_COMMENT_LENGTH - content.length;
  const isInvalid =
    !trimmedName ||
    !trimmedContent ||
    content.length > MAX_COMMENT_LENGTH ||
    submitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isInvalid) return;

    if (minIntervalMs > 0 && lastSubmittedAt !== null) {
      const elapsed = Date.now() - lastSubmittedAt;
      if (elapsed < minIntervalMs) {
        const remainingSeconds = Math.ceil((minIntervalMs - elapsed) / 1000);
        setError(`投稿は${remainingSeconds}秒後に再度お試しください。`);
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("comments")
        .insert({
          story_id: storyId,
          user_id: user.id,
          parent_id: parentId ?? null,
          author_name: trimmedName,
          content: trimmedContent,
        })
        .select("id, story_id, user_id, parent_id, author_name, content, created_at, updated_at")
        .single();

      if (insertError || !data) {
        throw insertError || new Error("insert failed");
      }

      onSubmitted?.(data as Comment);
      setContent("");
    } catch (err) {
      console.error(err);
      setError("コメントの送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${variant === "reply" ? "mt-3" : "mt-4"} space-y-3`}>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          お名前
        </label>
        <input
          type="text"
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          maxLength={100}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="例: カフェ好きの田中さん"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          コメント
        </label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          rows={variant === "reply" ? 3 : 4}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="感想や思い出をシェアしてください"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>最大{MAX_COMMENT_LENGTH}文字</span>
          <span>{remaining}文字</span>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        {variant === "reply" && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isInvalid}
          className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-50"
        >
          {submitting ? "送信中..." : "送信"}
        </button>
      </div>
    </form>
  );
}
