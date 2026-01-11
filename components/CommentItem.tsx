import type { Comment } from "@/lib/supabase";

type CommentItemProps = {
  comment: Comment;
  isReply?: boolean;
  replyCount?: number;
  isReplying?: boolean;
  onReplyClick?: () => void;
};

function formatCommentDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  });
}

export default function CommentItem({
  comment,
  isReply = false,
  replyCount = 0,
  isReplying = false,
  onReplyClick,
}: CommentItemProps) {
  const initial = comment.author_name.trim().charAt(0) || "？";
  const formattedDate = formatCommentDate(comment.created_at);
  const avatarClass = isReply ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";

  return (
    <div className="flex gap-3">
      <div className={`${avatarClass} rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center`}>
        {initial}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-semibold text-gray-900">{comment.author_name}</span>
          {formattedDate && (
            <span className="text-gray-400">({formattedDate})</span>
          )}
        </div>
        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
        {!isReply && onReplyClick && (
          <div className="mt-2">
            <button
              type="button"
              onClick={onReplyClick}
              className="text-xs text-amber-700 hover:underline"
            >
              返信{replyCount > 0 ? ` (${replyCount})` : ""}{isReplying ? "を閉じる" : "する"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
