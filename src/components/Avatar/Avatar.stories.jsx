import { expect } from "storybook/test"; 
import data from "@/data/data.json";
import Avatar from "./Avatar";

export default {
    title: "Components/Avatar",
    component: Avatar,
    args: { user: data.currentUser },
};

export const Default = {};

export const Large = {
  args: { className: "size-10" },
};

export const WithAltText = {
  args: { alt: "Your avatar" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Your avatar" })).toBeInTheDocument();
  },
};