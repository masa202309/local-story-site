"use client";

import { useState } from "react";
import type { Comment } from "@/lib/supabase";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";

type CommentSectionProps = {
  storyId: string;
  initialComments: Comment[];
};

export default function CommentSection({
  storyId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);
  const minIntervalMs = 10000;

  const handleSubmitted = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
    setActiveReplyId(null);
    setLastSubmittedAt(Date.now());
  };

  const handleReplyToggle = (commentId: string) => {
    setActiveReplyId((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          コメント ({comments.length}件)
        </h2>
      </div>
      <CommentList
        comments={comments}
        storyId={storyId}
        activeReplyId={activeReplyId}
        onReplyToggle={handleReplyToggle}
        onReplySubmitted={handleSubmitted}
        lastSubmittedAt={lastSubmittedAt}
        minIntervalMs={minIntervalMs}
      />
      <CommentForm
        storyId={storyId}
        onSubmitted={handleSubmitted}
        lastSubmittedAt={lastSubmittedAt}
        minIntervalMs={minIntervalMs}
      />
    </section>
  );
}
