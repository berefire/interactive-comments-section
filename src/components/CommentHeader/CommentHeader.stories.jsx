import { expect } from "storybook/test";
import data from "@/data/data.json";
import CommentHeader from "./CommentHeader";

const comment = data.comments[0];
const ownReply = data.comments[1].replies[1]; // juliusomo

export default {
  title: "Components/CommentHeader",
  component: CommentHeader,
  args: {
    user: comment.user,
    createdAt: comment.createdAt,
  },
};

export const Default = {
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("you")).not.toBeInTheDocument();
  },
};

export const CurrentUser = {
  args: {
    user: ownReply.user,
    createdAt: ownReply.createdAt,
    isCurrentUser: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("you")).toBeInTheDocument();
  },
};