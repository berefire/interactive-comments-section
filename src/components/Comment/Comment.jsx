import { useEffect, useRef } from "react";
import { getAssetUrl } from "@/utils/getAssetUrl";
import CommentHeader from "@/components/CommentHeader/CommentHeader";
import ScoreCounter from "@/components/ScoreCounter/ScoreCounter";
import ActionButton from "@/components/ActionButton/ActionButton";
import CommentEditForm from "@/components/CommentEditForm/CommentEditForm";

function Comment({
  comment,
  userVote,
  isCurrentUser,
  isEditing = false,
  onUpvote,
  onDownvote,
  onReply,
  onEdit,
  onUpdate,
  onDelete,
}) {
  const { user, createdAt, score, replyingTo, content } = comment;
  const editButtonRef = useRef(null);
  const wasEditing = useRef(isEditing);

  useEffect(() => {
    // Only when edit mode just CLOSED (true → false)
    if (wasEditing.current && !isEditing) {
      editButtonRef.current?.focus();
    }
    wasEditing.current = isEditing; // remember for the next change
  }, [isEditing]);

  return (
    <article
      className={[
        "grid gap-4 rounded-lg bg-white p-4 md:gap-x-6 md:p-6",
        // mobile: 2 columns
        "grid-cols-[minmax(0,1fr)_auto]",
        "[grid-template-areas:'header_header'_'content_content'_'score_actions']",
        // md+: 3 columns
        "md:grid-cols-[auto_minmax(0,1fr)_auto]",
        "md:[grid-template-areas:'score_header_actions'_'score_content_content']",
      ].join(" ")}
      aria-label={`Comment by ${user.username}`}
    >
      <div className="min-w-0 [grid-area:header]">
        <CommentHeader
          user={user}
          createdAt={createdAt}
          isCurrentUser={isCurrentUser}
        />
      </div>
      <div className="min-w-0 [grid-area:content]">
        {isEditing ? (
          <CommentEditForm
            initialValue={replyingTo ? `@${replyingTo} ${content}` : content}
            onSubmit={onUpdate}
            onCancel={onEdit}
          />
        ) : (
          <p className="wrap-break-words text-grey-500">
            {replyingTo && (
              <span className="font-medium text-purple-600">
                @{replyingTo}{" "}
              </span>
            )}
            {content}
          </p>
        )}
      </div>
      <div className="mt-6 md:mt-0 justify-self-start [grid-area:score] md:self-center">
        <ScoreCounter
          score={score}
          userVote={userVote}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />
      </div>
      <div className="mt-6 md:mt-0 flex items-center gap-6 justify-self-end [grid-area:actions]">
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
              ref={editButtonRef}
              aria-pressed={isEditing}
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
