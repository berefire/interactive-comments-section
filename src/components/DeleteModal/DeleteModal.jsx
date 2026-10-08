import { useEffect, useRef, useId } from "react";
import Button from "@/components/Button/Button";

function DeleteModal({ isOpen, onCancel, onDelete }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto hidden font-body open:flex flex-col gap-4 md:gap-6 w-[calc(100%-2rem)] max-w-100 backdrop:bg-black/50 py-5.25 px-6.25 rounded-lg"
      aria-labelledby={titleId}
    >
      <h2
        id={titleId}
        className="text-grey-800 font-medium leading-[1.2] text-2xl"
      >
        Delete comment
      </h2>
      <p className="text-base font-normal text-grey-500 max-w-[30ch] md:max-w-[34ch]">
        Are you sure you want to delete this comment? This will remove the
        comment and can't be undone.
      </p>
      <div className="flex gap-4">
        <Button
          variant="neutral"
          className="flex-1"
          autoFocus
          onClick={onCancel}
        >
          No, cancel
        </Button>
        <Button variant="danger" className="flex-1" onClick={onDelete}>
          Yes, delete
        </Button>
      </div>
    </dialog>
  );
}

export default DeleteModal;
