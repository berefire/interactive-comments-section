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
      canvas.getByRole("button", { name: /no, cancel/i }),
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
    const deleteButton = await canvas.findByRole("button", {
      name: /yes, delete/i,
    });
    await userEvent.click(deleteButton);
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

// 5. Esc key closes it
export const EscapeTest = {
  play: async ({ args, canvas }) => {
    const dialog = await canvas.findByRole("dialog", {
      name: /delete comment/i,
    });

    // Simulate what the browser does when the user presses Esc
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));

    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

// 6. The dialog has an accessible name
export const AccessibleName = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("dialog", { name: /delete comment/i }),
    ).toBeInTheDocument();
  },
};
