// @vitest-environment node
import { describe, it, expect } from "vitest";
import data from "@/data/data.json";
import {
  createComment,
  stripMention,
  updateComment,
  removeComment,
  findThreadId,
  findComment,
} from "./commentUtils";

const { currentUser, comments } = data;

describe("createComment", () => {
  it("creates a top-level comment with an empty replies array", () => {
    const comment = createComment(currentUser, "Hello");
    expect(comment).toMatchObject({ content: "Hello", score: 0, user: currentUser, replies: [] });
    expect(comment).not.toHaveProperty("replyingTo");
  });

  it("creates a reply with replyingTo and no replies array", () => {
    const reply = createComment(currentUser, "Hi", "amyrobson");
    expect(reply.replyingTo).toBe("amyrobson");
    expect(reply).not.toHaveProperty("replies");
  });

  it("generates a unique id and a valid date", () => {
    const a = createComment(currentUser, "A");
    const b = createComment(currentUser, "B");
    expect(a.id).not.toBe(b.id);
    expect(new Date(a.createdAt).toString()).not.toBe("Invalid Date");
  });
});

describe("stripMention", () => {
  it("removes the mention at the start", () => {
    expect(stripMention("@maxblagun Hello", "maxblagun")).toBe("Hello");
  });

  it("keeps text without a mention", () => {
    expect(stripMention("Hello", "maxblagun")).toBe("Hello");
  });

  it("returns an empty string if there is only the mention", () => {
    expect(stripMention("@maxblagun ", "maxblagun")).toBe("");
  });

  it("does not remove a mention of another user", () => {
    expect(stripMention("@amyrobson Hi", "maxblagun")).toBe("@amyrobson Hi");
  });
});

describe("updateComment", () => {
  const addOne = (c) => ({ ...c, score: c.score + 1 });

  it("updates a top-level comment", () => {
    const result = updateComment(comments, 1, addOne);
    expect(result[0].score).toBe(13);
  });

  it("updates a reply", () => {
    const result = updateComment(comments, 3, addOne);
    expect(result[1].replies[0].score).toBe(5);
  });

  it("changes nothing if the id does not exist", () => {
    const result = updateComment(comments, 999, addOne);
    expect(result).toEqual(comments);
  });
});

describe("removeComment", () => {
  it("removes a top-level comment", () => {
    const result = removeComment(comments, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("removes a reply and keeps its thread", () => {
    const result = removeComment(comments, 4);
    expect(result).toHaveLength(2);
    expect(result[1].replies).toHaveLength(1);
  });
});

describe("findThreadId", () => {
  it("returns its own id for a top-level comment", () => {
    expect(findThreadId(comments, 2)).toBe(2);
  });

  it("returns the parent id for a reply", () => {
    expect(findThreadId(comments, 4)).toBe(2);
  });

  it("returns undefined for an unknown id", () => {
    expect(findThreadId(comments, 999)).toBeUndefined();
  });
});

describe("findComment", () => {
  it("finds a top-level comment", () => {
    expect(findComment(comments, 1).user.username).toBe("amyrobson");
  });

  it("finds a reply", () => {
    expect(findComment(comments, 3).user.username).toBe("ramsesmiron");
  });
});