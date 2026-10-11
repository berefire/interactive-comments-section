import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScoreCounter from "./ScoreCounter";

describe("ScoreCounter", () => {
  it("shows the score", () => {
    render(<ScoreCounter score={12} onUpvote={() => {}} onDownvote={() => {}} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("calls onUpvote when clicking Upvote", async () => {
    const user = userEvent.setup();
    const onUpvote = vi.fn(); // in Jest: jest.fn()
    render(<ScoreCounter score={12} onUpvote={onUpvote} onDownvote={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Upvote" }));
    expect(onUpvote).toHaveBeenCalledTimes(1);
  });
});