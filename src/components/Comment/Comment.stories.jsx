import { expect, fn } from "storybook/test";
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