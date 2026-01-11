import type { Comment } from "@/lib/supabase";
import CommentItem from "@/components/CommentItem";
import { CommentForm } from "@/components/CommentForm";

type CommentListProps = {
  comments: Comment[];
  storyId: string;
  activeReplyId: string | null;
  onReplyToggle: (commentId: string) => void;
  onReplySubmitted: (comment: Comment) => void;
  lastSubmittedAt: number | null;
  minIntervalMs: number;
};

const toTimestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function CommentList({
  comments,
  storyId,
  activeReplyId,
  onReplyToggle,
  onReplySubmitted,
  lastSubmittedAt,
  minIntervalMs,
}: CommentListProps) {
  const topLevel = comments.filter((comment) => !comment.parent_id);
  const repliesByParent = new Map<string, Comment[]>();

  for (const comment of comments) {
    if (!comment.parent_id) continue;
    const list = repliesByParent.get(comment.parent_id) ?? [];
    list.push(comment);
    repliesByParent.set(comment.parent_id, list);
  }

  topLevel.sort((a, b) => toTimestamp(b.created_at) - toTimestamp(a.created_at));
  for (const [key, replies] of repliesByParent.entries()) {
    replies.sort((a, b) => toTimestamp(b.created_at) - toTimestamp(a.created_at));
    repliesByParent.set(key, replies);
  }

  return (
    <div className="border-y border-amber-100 py-4">
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">
          まだコメントがありません。最初のコメントを書いてみませんか？
        </p>
      ) : (
        <div className="space-y-6">
          {topLevel.map((comment) => {
            const replies = repliesByParent.get(comment.id) ?? [];
            const isReplying = activeReplyId === comment.id;

            return (
              <div key={comment.id} className="space-y-3">
                <CommentItem
                  comment={comment}
                  replyCount={replies.length}
                  isReplying={isReplying}
                  onReplyClick={() => onReplyToggle(comment.id)}
                />
                {replies.length > 0 && (
                  <div className="space-y-3 border-l border-amber-100 pl-5">
                    {replies.map((reply) => (
                      <CommentItem key={reply.id} comment={reply} isReply />
                    ))}
                  </div>
                )}
                {isReplying && (
                  <div className="border-l border-amber-100 pl-5">
                    <CommentForm
                      storyId={storyId}
                      parentId={comment.id}
                      onSubmitted={onReplySubmitted}
                      onCancel={() => onReplyToggle(comment.id)}
                      variant="reply"
                      lastSubmittedAt={lastSubmittedAt}
                      minIntervalMs={minIntervalMs}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
