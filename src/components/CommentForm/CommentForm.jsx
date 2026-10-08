import { useState, useId } from "react";
import Button from "@/components/Button/Button";
import Avatar from "@/components/Avatar/Avatar";

function CommentForm({
  currentUser,
  onSubmit,
  submitLabel = "Send",
  initialValue = "",
}) {
  const [text, setText] = useState(initialValue);
  const textareaId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        "font-body text-base grid gap-4 rounded-lg bg-white p-4 md:p-6",
        "grid-cols-[1fr_auto]",
        "[grid-template-areas:'comment_comment'_'avatar_button']",
        "md:grid-cols-[auto_1fr_auto]",
        "md:[grid-template-areas:'avatar_comment_button']",
      ].join(" ")}
    >
      <label htmlFor={textareaId} className="sr-only">
        Add a comment
      </label>
      <textarea
        id={textareaId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        required
        className="[grid-area:comment] min-h-24 w-full resize-none appearance-none rounded-lg border border-grey-100 px-6 py-3 text-grey-800 placeholder:text-grey-500 focus-ring focus-ring-purple-600"
      />
      <div className="[grid-area:avatar] self-center md:self-start">
        <Avatar user={currentUser} />
      </div>
      <Button type="submit" className="[grid-area:button] self-center justify-self-end md:self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export default CommentForm;
