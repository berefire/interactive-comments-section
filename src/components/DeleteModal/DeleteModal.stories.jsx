import { expect, fn } from "storybook/test";
import DeleteModal from "./DeleteModal";

const meta = {
  title: "Components/DeleteModal",
  component: DeleteModal,
  args: {
    isOpen: true,
    onCancel: fn(),
    onDelete: fn(),
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

// 1. Visual stories
export const Open = {};

export const Closed = {
  args: { isOpen: false },
};

// 2. Focus starts on the safe option
export const FocusOnCancel = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /no, cancel/i })
    ).toHaveFocus();
  },
};

// 3. Cancel button
export const CancelTest = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /no, cancel/i }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
    await expect(args.onDelete).not.toHaveBeenCalled();
  },
};

// 4. Delete button
export const DeleteTest = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /yes, delete/i }));
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

// 5. Esc key closes it
export const EscapeTest = {
  play: async ({ args, userEvent }) => {
    await userEvent.keyboard("{Escape}");
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

// 6. The dialog has an accessible name
export const AccessibleName = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("dialog", { name: /delete comment/i })
    ).toBeInTheDocument();
  },
};