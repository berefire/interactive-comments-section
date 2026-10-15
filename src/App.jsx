import { useReducer, useState, useEffect, useRef } from "react";
import data from "@/data/data.json";
import { commentsReducer } from "@/state/commentsReducer";
import { ACTIONS } from "@/state/actionTypes";
import CommentThread from "@/components/CommentThread/CommentThread";
import CommentForm from "@/components/CommentForm/CommentForm";
import Attribution from "@/components/Attribution/Attribution";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import { loadState, saveState } from "@/state/storage";

function App() {
  const [state, dispatch] = useReducer(commentsReducer, data, loadState);
  const [replyingToId, setReplyingToId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { currentUser, comments, votes = {} } = state;
  const headingRef = useRef(null);

  const handleUpvote = (id) => dispatch({ type: ACTIONS.UPVOTE, id });
  const handleDownvote = (id) => dispatch({ type: ACTIONS.DOWNVOTE, id });
  const handleEdit = (id) =>
    setEditingId((current) => (current === id ? null : id));
  const handleUpdate = (id, content) => {
    dispatch({ type: ACTIONS.EDIT_COMMENT, id, content });
    setEditingId(null);
  };

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

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <div className="min-h-dvh flex flex-col bg-grey-50">
      <main className="mx-auto flex w-full md:max-w-171 lg:max-w-182.5 flex-col gap-4 md:gap-6 px-4 py-8 md:py-16">
        <h1 ref={headingRef} tabIndex="-1" className="sr-only">Interactive comments section</h1>

        <ul className="flex flex-col gap-4 md:gap-6">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              replyingToId={replyingToId}
              votes={votes}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onReply={handleReply}
              onSubmitReply={handleSubmitReply}
              onDelete={setDeletingId}
              editingId={editingId}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
            />
          ))}
        </ul>

        <CommentForm currentUser={currentUser} onSubmit={handleAddComment} />

        <DeleteModal
          isOpen={deletingId !== null}
          onCancel={() => setDeletingId(null)}
          onDelete={handleConfirmDelete}
          fallbackFocusRef={headingRef}
        />
      </main>
      <Attribution />
    </div>
  );
}

export default App;
