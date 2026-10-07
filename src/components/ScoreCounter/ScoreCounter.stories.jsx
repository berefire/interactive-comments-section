import { useState } from "react";
import ScoreCounter from "./ScoreCounter";
import { expect, fn } from "storybook/test";

export default {
    title: "Components/ScoreCounter",
    component: ScoreCounter,
    args: {
        score: 12,
        onUpvote: fn(),
        onDownvote: fn()
    }
};

export const Default = {};

export const ZeroScore = {
    args: {
        score: 0
    }
};

export const HighScore = {
    args: { score: 1000 }, 
};

export const ClickCallsHandlers = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Upvote" }));
    await expect(args.onUpvote).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "Downvote" }));
    await expect(args.onDownvote).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardAccessible = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Upvote" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onUpvote).toHaveBeenCalledTimes(1);

    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Downvote" })).toHaveFocus();
    await userEvent.keyboard(" "); // Space also activates buttons
    await expect(args.onDownvote).toHaveBeenCalledTimes(1);
  },
};

export const DownvoteAtZero = {
  args: { score: 0 },
  play: async ({ args, canvas, userEvent }) => {
    const downvote = canvas.getByRole("button", { name: "Downvote" });
    await expect(downvote).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(downvote);
    await expect(args.onDownvote).not.toHaveBeenCalled();
  },
};

function InteractiveScoreCounter() {
  const [score, setScore] = useState(12);
  return (
    <ScoreCounter
      score={score}
      onUpvote={() => setScore((s) => s + 1)}
      onDownvote={() => setScore((s) => s - 1)}
    />
  );
}

export const Interactive = {
  render: () => <InteractiveScoreCounter />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Upvote" }));
    await expect(canvas.getByText("13")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Downvote" }));
    await userEvent.click(canvas.getByRole("button", { name: "Downvote" }));
    await expect(canvas.getByText("11")).toBeInTheDocument();
  },
};