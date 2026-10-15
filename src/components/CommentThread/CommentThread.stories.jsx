import { expect, within, fn } from "storybook/test";
import data from "@/data/data.json";
import CommentThread from "./CommentThread";

const { currentUser, comments } = data;

export default {
  title: "Components/CommentThread",
  component: CommentThread,
  args: { 
    currentUser,
    replyingToId: null,
    editingId: null,
    onUpvote: fn(),
    onDownvote: fn(),
    onReply: fn(),
    onSubmitReply: fn(),
    onEdit: fn(),
    onUpdate: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <ul className="max-w-182.5 bg-grey-50 p-4">
        <Story />
      </ul>
    ),
  ],
};

// 1. A comment without replies
export const WithoutReplies = {
  args: { comment: comments[0] }, // amyrobson
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("article")).toHaveLength(1);
    // no nested list of replies
    await expect(canvas.getAllByRole("list")).toHaveLength(1); // only the decorator's <ul>
  },
};

// 2. A comment with replies
export const WithReplies = {
  args: { comment: comments[1] }, // maxblagun + 2 replies
  play: async ({ canvas }) => {
    // 1 comment + 2 replies = 3 articles
    await expect(canvas.getAllByRole("article")).toHaveLength(3);

    // the replies are in their own list
    const lists = canvas.getAllByRole("list");
    const repliesList = lists[1];
    await expect(within(repliesList).getAllByRole("listitem")).toHaveLength(2);
  },
};

// 3. The current user's reply shows Edit and Delete
export const OwnReplyActions = {
  args: { comment: comments[1] },
  play: async ({ canvas }) => {
    const ownReply = canvas.getAllByRole("article")[2]; // juliusomo's reply
    await expect(within(ownReply).getByRole("button", { name: /edit/i })).toBeInTheDocument();
    await expect(within(ownReply).getByRole("button", { name: /delete/i })).toBeInTheDocument();
    await expect(within(ownReply).queryByRole("button", { name: /reply/i })).not.toBeInTheDocument();
  },
};

export const ReplyFormOpen = {
  args: { comment: comments[0], replyingToId: comments[0].id },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue("@amyrobson")).toHaveFocus();
  },
};

export const ClickCallsHandlerWithId = {
  args: { comment: comments[0] },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /reply/i }));
    await expect(args.onReply).toHaveBeenCalledWith(comments[0].id);
  },
};