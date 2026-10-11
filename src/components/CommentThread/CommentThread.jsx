import Comment from "@/components/Comment/Comment";
import CommentForm from "@/components/CommentForm/CommentForm";

function CommentThread({
  comment,
  currentUser,
  replyingToId,
  onUpvote,
  onDownvote,
  onReply,
  onSubmitReply,
  onDelete,
}) {
  const renderComment = (c) => (
    <div className="flex flex-col gap-2">
      <Comment
        comment={c}
        isCurrentUser={c.user.username === currentUser.username}
        onUpvote={() => onUpvote(c.id)}
        onDownvote={() => onDownvote(c.id)}
        onReply={() => onReply(c.id)}
        onDelete={() => onDelete(c.id)}
      />

      {replyingToId === c.id && (
        <CommentForm
          currentUser={currentUser}
          submitLabel="Reply"
          initialValue={`@${c.user.username} `}
          onSubmit={(content) => onSubmitReply(c.id, content)}
        />
      )}
    </div>
  );

  return (
    <li className="flex flex-col gap-4">
      {renderComment(comment)}

      {comment.replies.length > 0 && (
        <ul className="flex flex-col gap-4 border-l-2 border-grey-100 pl-4 md:ml-10 md:pl-10">
          {comment.replies.map((reply) => (
            <li key={reply.id}>{renderComment(reply)}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default CommentThread;