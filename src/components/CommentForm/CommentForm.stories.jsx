import { expect, fn } from "storybook/test";
import data from "@/data/data.json";
import CommentForm from "./CommentForm";

export default {
  title: "Components/CommentForm",
  component: CommentForm,
  args: {
    currentUser: data.currentUser,
    onSubmit: fn(),
  },
};

// 1. Visual stories
export const NewComment = {};

export const Reply = {
  args: {
    submitLabel: "Reply",
    initialValue: "@maxblagun ",
  },
};

// 2. Submitting trims and clears the text
export const SubmitTest = {
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByLabelText("Add a comment");
    await userEvent.type(textarea, "  Hello!  ");
    await userEvent.click(canvas.getByRole("button", { name: /send/i }));

    await expect(args.onSubmit).toHaveBeenCalledWith("Hello!");
    await expect(textarea).toHaveValue("");
  },
};

// 3. Only spaces: nothing is submitted
export const EmptySubmitTest = {
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByLabelText("Add a comment");
    await userEvent.type(textarea, "     ");
    await userEvent.click(canvas.getByRole("button", { name: /send/i }));

    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

// 4. Reply starts with the mention
export const ReplyPrefilledTest = {
  args: {
    submitLabel: "Reply",
    initialValue: "@maxblagun ",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Add a comment")).toHaveValue("@maxblagun ");
    await expect(canvas.getByRole("button", { name: /reply/i })).toBeInTheDocument();
  },
};

// 5. Works with the keyboard
export const KeyboardTest = {
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByLabelText("Add a comment");
    await userEvent.click(textarea);
    await userEvent.keyboard("Great work!");
    await userEvent.tab(); // move focus to the button
    await expect(canvas.getByRole("button", { name: /send/i })).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    await expect(args.onSubmit).toHaveBeenCalledWith("Great work!");
  },
};