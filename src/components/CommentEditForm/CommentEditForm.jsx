// src/components/CommentEditForm/CommentEditForm.jsx
import { useEffect, useId, useRef, useState } from "react";
import Button from "@/components/Button/Button";

function CommentEditForm({ initialValue, onSubmit, onCancel }) {
  const [text, setText] = useState(initialValue);
  const textareaRef = useRef(null);
  const textareaId = useId();

  // Focus the textarea and put the cursor at the END of the text
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCancel(); // Esc cancels editing
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor={textareaId} className="sr-only">
        Edit comment
      </label>
      <textarea
        id={textareaId}
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        required
        className="min-h-32 w-full resize-none rounded-lg border border-grey-100 px-6 py-3 text-grey-800 outline-none focus:border-purple-600"
      />
      <Button type="submit" className="self-end">
        Update
      </Button>
    </form>
  );
}

export default CommentEditForm;