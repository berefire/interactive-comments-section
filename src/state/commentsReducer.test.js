import { describe, it, expect } from "vitest";
import data from "@/data/data.json";
import { commentsReducer } from "./commentsReducer";
import { ACTIONS } from "./actionTypes";

// Freezes every object deeply: any mutation throws an error
function deepFreeze(obj) {
  Object.values(obj).forEach((value) => {
    if (typeof value === "object" && value !== null) deepFreeze(value);
  });
  return Object.freeze(obj);
}

const initialState = deepFreeze(structuredClone(data));

describe("UPVOTE / DOWNVOTE", () => {
  it("UPVOTE increases a comment's score", () => {
    const state = commentsReducer(initialState, { type: ACTIONS.UPVOTE, id: 1 });
    expect(state.comments[0].score).toBe(13);
  });

  it("DOWNVOTE decreases a reply's score", () => {
    const state = commentsReducer(initialState, { type: ACTIONS.DOWNVOTE, id: 3 });
    expect(state.comments[1].replies[0].score).toBe(3);
  });

  it("DOWNVOTE never goes below 0", () => {
    let state = initialState;
    for (let i = 0; i < 10; i++) {
      state = commentsReducer(state, { type: ACTIONS.DOWNVOTE, id: 4 }); // score starts at 2
    }
    expect(state.comments[1].replies[1].score).toBe(0);
  });
});

describe("ADD_COMMENT", () => {
  it("adds a comment by the current user at the end", () => {
    const state = commentsReducer(initialState, { type: ACTIONS.ADD_COMMENT, content: "Hi!" });
    expect(state.comments).toHaveLength(3);
    expect(state.comments.at(-1)).toMatchObject({
      content: "Hi!",
      score: 0,
      replies: [],
      user: { username: "juliusomo" },
    });
  });
});

describe("ADD_REPLY", () => {
  it("replying to a top-level comment adds to its replies", () => {
    const state = commentsReducer(initialState, {
      type: ACTIONS.ADD_REPLY,
      targetId: 1,
      content: "@amyrobson Thanks!",
    });
    const reply = state.comments[0].replies[0];
    expect(reply.replyingTo).toBe("amyrobson");
    expect(reply.content).toBe("Thanks!");
  });

  it("replying to a reply adds to the same thread", () => {
    const state = commentsReducer(initialState, {
      type: ACTIONS.ADD_REPLY,
      targetId: 3,
      content: "@ramsesmiron Agreed!",
    });
    const replies = state.comments[1].replies;
    expect(replies).toHaveLength(3);
    expect(replies.at(-1).replyingTo).toBe("ramsesmiron");
  });

  it("ignores a reply that only contains the mention", () => {
    const state = commentsReducer(initialState, {
      type: ACTIONS.ADD_REPLY,
      targetId: 1,
      content: "@amyrobson ",
    });
    expect(state).toBe(initialState); // same object = nothing changed
  });

  it("ignores an unknown targetId", () => {
    const state = commentsReducer(initialState, {
      type: ACTIONS.ADD_REPLY,
      targetId: 999,
      content: "Hello",
    });
    expect(state).toBe(initialState);
  });
});

describe("EDIT_COMMENT", () => {
  it("updates the content and strips the mention", () => {
    const state = commentsReducer(initialState, {
      type: ACTIONS.EDIT_COMMENT,
      id: 4,
      content: "@ramsesmiron Updated text",
    });
    expect(state.comments[1].replies[1].content).toBe("Updated text");
  });
});

describe("DELETE_COMMENT", () => {
  it("removes a reply", () => {
    const state = commentsReducer(initialState, { type: ACTIONS.DELETE_COMMENT, id: 4 });
    expect(state.comments[1].replies).toHaveLength(1);
  });

  it("removes a top-level comment with its replies", () => {
    const state = commentsReducer(initialState, { type: ACTIONS.DELETE_COMMENT, id: 2 });
    expect(state.comments).toHaveLength(1);
  });
});

describe("unknown action", () => {
  it("returns the same state", () => {
    const state = commentsReducer(initialState, { type: "UNKNOWN" });
    expect(state).toBe(initialState);
  });
});