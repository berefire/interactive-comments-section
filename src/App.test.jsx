import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Finds the <article> of a comment by its author's username
function getCommentBy(username) {
  return screen
    .getAllByRole("article")
    .find((article) => within(article).queryByText(username));
}

beforeEach(() => {
  localStorage.clear(); // each test starts from data.json
});

describe("App", () => {
  it("renders the initial comments and replies", () => {
    render(<App />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("upvotes a comment", async () => {
    const user = userEvent.setup();
    render(<App />);
    const comment = getCommentBy("amyrobson");

    await user.click(within(comment).getByRole("button", { name: "Upvote" }));

    expect(within(comment).getByText("13")).toBeInTheDocument();
  });

  it("adds a new comment", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Add a comment"), "My new comment");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByText("My new comment")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });

  it("replies to a comment", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      within(getCommentBy("amyrobson")).getByRole("button", { name: /reply/i }),
    );

    const textarea = screen.getByDisplayValue("@amyrobson");
    await user.type(textarea, "Thanks for the feedback!");
    const form = textarea.closest("form");
    await user.click(within(form).getByRole("button", { name: /reply/i }));

    expect(screen.getByText("Thanks for the feedback!")).toBeInTheDocument();
  });

  it("edits own comment", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /edit/i }));
    const textarea = screen.getByLabelText("Edit comment");
    await user.clear(textarea);
    await user.type(textarea, "Edited text");
    await user.click(screen.getByRole("button", { name: /update/i }));

    expect(screen.getByText("Edited text")).toBeInTheDocument();
  });

  it("deletes own comment after confirming", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(
      await screen.findByRole("button", { name: /yes, delete/i }),
    );

    expect(
      screen.queryByText(/I couldn't agree more/i),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("keeps changes after reloading", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(
      screen.getByLabelText("Add a comment"),
      "Persisted comment",
    );
    await user.click(screen.getByRole("button", { name: /send/i }));

    unmount(); // "close" the app
    render(<App />); // "reload": it loads from localStorage

    expect(screen.getByText("Persisted comment")).toBeInTheDocument();
  });

  it("returns focus to the Edit button after updating", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /update/i }));

    expect(screen.getByRole("button", { name: /edit/i })).toHaveFocus();
  });

  it("upvoting twice undoes the vote", async () => {
    const user = userEvent.setup();
    render(<App />);
    const comment = getCommentBy("amyrobson");
    const upvote = within(comment).getByRole("button", { name: "Upvote" });

    await user.click(upvote);
    expect(within(comment).getByText("13")).toBeInTheDocument();
    expect(upvote).toHaveAttribute("aria-pressed", "true");

    await user.click(upvote);
    expect(within(comment).getByText("12")).toBeInTheDocument();
    expect(upvote).toHaveAttribute("aria-pressed", "false");
  });
});
