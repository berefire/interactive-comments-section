import Comment from "@/components/Comment/Comment";
import CommentForm from "@/components/CommentForm/CommentForm";

function CommentThread({
  comment,
  currentUser,
  votes = {},
  replyingToId,
  editingId,
  onUpvote,
  onDownvote,
  onReply,
  onSubmitReply,
  onEdit,
  onUpdate,
  onDelete,
}) {
  const renderComment = (c) => (
    <div className="flex flex-col gap-4 md:gap-6">
      <Comment
        comment={c}
        userVote={votes[c.id] ?? 0}
        isCurrentUser={c.user.username === currentUser.username}
        isEditing={editingId === c.id}
        onUpvote={() => onUpvote(c.id)}
        onDownvote={() => onDownvote(c.id)}
        onReply={() => onReply(c.id)}
        onEdit={() => onEdit(c.id)}
        onUpdate={(content) => onUpdate(c.id, content)}
        onDelete={() => onDelete(c.id)}
      />

      {replyingToId === c.id && (
        <CommentForm
          currentUser={currentUser}
          submitLabel="Reply"
          initialValue={`@${c.user.username} `}
          onSubmit={(content) => onSubmitReply(c.id, content)}
          autoFocus
        />
      )}
    </div>
  );

  return (
    <li className="flex flex-col gap-4 md:gap-6">
      {renderComment(comment)}

      {comment.replies.length > 0 && (
        <ul className="flex flex-col gap-4 md:gap-6 border-l-2 border-grey-100 pl-4 md:ml-10 md:pl-10">
          {comment.replies.map((reply) => (
            <li key={reply.id}>{renderComment(reply)}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default CommentThread;