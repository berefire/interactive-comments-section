import { getAssetUrl } from "@/utils/getAssetUrl";
import CommentHeader from "@/components/CommentHeader/CommentHeader";
import ScoreCounter from "@/components/ScoreCounter/ScoreCounter";
import ActionButton from "@/components/ActionButton/ActionButton";

function Comment({
  comment,
  isCurrentUser,
  onUpvote,
  onDownvote,
  onReply,
  onEdit,
  onDelete,
}) {
  const { user, createdAt, score, replyingTo, content } = comment;

  return (
    <article
      className={[
        "grid gap-4 rounded-lg bg-white p-4 md:gap-x-6 md:p-6",
        // mobile: 2 columns
        "grid-cols-[1fr_auto]",
        "[grid-template-areas:'header_header'_'content_content'_'score_actions']",
        // md+: 3 columns
        "md:grid-cols-[auto_1fr_auto]",
        "md:[grid-template-areas:'score_header_actions'_'score_content_content']",
      ].join(" ")}
      aria-label={`Comment by ${user.username}`}
    >
      <div className="[grid-area:header]">
        <CommentHeader
          user={user}
          createdAt={createdAt}
          isCurrentUser={isCurrentUser}
        />
      </div>
      <p className="[grid-area:content] text-grey-500">
        {replyingTo && (
          <span className="font-medium text-purple-600">@{replyingTo} </span>
        )}
        {content}
      </p>
      <div className="justify-self-start [grid-area:score] md:self-start">
        <ScoreCounter
          score={score}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />
      </div>
      <div className="flex items-center gap-6 justify-self-end [grid-area:actions]">
        {isCurrentUser ? (
          <>
            <ActionButton
              variant="danger"
              icon={getAssetUrl("./assets/images/icons/icon-delete.svg")}
              onClick={onDelete}
            >
              Delete
            </ActionButton>
            <ActionButton
              icon={getAssetUrl("./assets/images/icons/icon-edit.svg")}
              onClick={onEdit}
            >
              Edit
            </ActionButton>
          </>
        ) : (
          <ActionButton
            icon={getAssetUrl("./assets/images/icons/icon-reply.svg")}
            onClick={onReply}
          >
            Reply
          </ActionButton>
        )}
      </div>
    </article>
  );
}

export default Comment;
