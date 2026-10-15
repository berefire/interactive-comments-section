import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import data from "@/data/data.json";
import Comment from "./Comment";

const { currentUser, comments } = data;

const otherUserComment = comments[0];
const replyComment = comments[1].replies[0];
const ownReply = comments[1].replies[1];

export default {
  title: "Components/Comment",
  component: Comment,
  args: {
    onUpvote: fn(),
    onDownvote: fn(),
    onReply: fn(),
    onEdit: fn(),
    onUpdate: fn(),
    onDelete: fn(),
  },
};

export const Default = {
  args: { comment: otherUserComment, isCurrentUser: false },
};

export const Reply = {
  args: { comment: replyComment, isCurrentUser: false },
};

export const CurrentUser = {
  args: {
    comment: ownReply,
    isCurrentUser: ownReply.user.username === currentUser.username,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: /reply/i })).not.toBeInTheDocument();
  },
};

export const Editing = {
  args: {
    comment: ownReply,
    isCurrentUser: true,
    isEditing: true,
    onUpdate: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Edit comment")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /update/i })).toBeInTheDocument();
  },
};

function EditableComment(args) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Comment
      {...args}
      isEditing={isEditing}
      onEdit={() => setIsEditing((current) => !current)}
      onUpdate={() => setIsEditing(false)}
    />
  );
}

export const FocusReturnsAfterEditing = {
  args: { comment: ownReply, isCurrentUser: true },
  render: (args) => <EditableComment {...args} />,
  play: async ({ canvas, userEvent }) => {
    const editButton = canvas.getByRole("button", { name: /edit/i });

    // Open edit mode → the textarea gets the focus
    await userEvent.click(editButton);
    await expect(canvas.getByLabelText("Edit comment")).toHaveFocus();

    // Press Esc → the focus returns to the Edit button
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: /edit/i })).toHaveFocus()
    );
  },
};