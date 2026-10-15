import { expect, fn } from "storybook/test";
import data from "@/data/data.json";
import CommentEditForm from "./CommentEditForm";

const ownReply = data.comments[1].replies[1]; // juliusomo
const replyText = `@${ownReply.replyingTo} ${ownReply.content}`;

export default {
  title: "Components/CommentEditForm",
  component: CommentEditForm,
  args: {
    initialValue: replyText,
    onSubmit: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-182.5 bg-white p-6">
        <Story />
      </div>
    ),
  ],
};

// 1. Visual story
export const Default = {};

// 2. Focus goes to the textarea, with the cursor at the end
export const FocusAtEnd = {
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Edit comment");
    await expect(textarea).toHaveFocus();
    await expect(textarea.selectionStart).toBe(replyText.length);
  },
};

// 3. Update sends the trimmed text
export const SubmitTest = {
  args: { initialValue: "Old text" },
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByLabelText("Edit comment");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "  New text  ");
    await userEvent.click(canvas.getByRole("button", { name: /update/i }));

    await expect(args.onSubmit).toHaveBeenCalledWith("New text");
  },
};

// 4. Only spaces: nothing is submitted
export const EmptySubmitTest = {
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByLabelText("Edit comment");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "   ");
    await userEvent.click(canvas.getByRole("button", { name: /update/i }));

    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

// 5. Esc cancels editing
export const EscapeTest = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText("Edit comment"));
    await userEvent.keyboard("{Escape}");

    await expect(args.onCancel).toHaveBeenCalledTimes(1);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};