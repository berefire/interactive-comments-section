import { useReducer, useState } from "react";
import data from "@/data/data.json";
import { commentsReducer } from "@/state/commentsReducer";
import { ACTIONS } from "@/state/actionTypes";
import CommentThread from "@/components/CommentThread/CommentThread";
import CommentForm from "@/components/CommentForm/CommentForm";
import Attribution from "@/components/Attribution/Attribution";
import DeleteModal from "@/components/DeleteModal/DeleteModal";

function App() {
  const [state, dispatch] = useReducer(commentsReducer, data);
  const [replyingToId, setReplyingToId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { currentUser, comments } = state;

  const handleUpvote = (id) => dispatch({ type: ACTIONS.UPVOTE, id });
  const handleDownvote = (id) => dispatch({ type: ACTIONS.DOWNVOTE, id });

  const handleReply = (id) =>
    setReplyingToId((current) => (current === id ? null : id)); // click again = close

  const handleSubmitReply = (targetId, content) => {
    dispatch({ type: ACTIONS.ADD_REPLY, targetId, content });
    setReplyingToId(null);
  };

  const handleAddComment = (content) =>
    dispatch({ type: ACTIONS.ADD_COMMENT, content });

  const handleConfirmDelete = () => {
    dispatch({ type: ACTIONS.DELETE_COMMENT, id: deletingId });
    setDeletingId(null);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-grey-50">
      <main className="mx-auto flex max-w-171 lg:max-w-182.5 flex-col gap-4 px-4 py-8 md:py-16">
        <h1 className="sr-only">Interactive comments section</h1>

        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              replyingToId={replyingToId}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onReply={handleReply}
              onSubmitReply={handleSubmitReply}
              onDelete={setDeletingId}
            />
          ))}
        </ul>

        <CommentForm currentUser={currentUser} onSubmit={handleAddComment} />

        <DeleteModal
          isOpen={deletingId !== null}
          onCancel={() => setDeletingId(null)}
          onDelete={handleConfirmDelete}
        />
      </main>
      <Attribution />
    </div>
  );
}

export default App;
