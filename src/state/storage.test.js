import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadState, saveState, STORAGE_KEY } from "./storage";

const image = {
  png: "./assets/images/avatars/image-juliusomo.png",
  webp: "./assets/images/avatars/image-juliusomo.webp",
};
const defaultState = {
  currentUser: { username: "juliusomo", image },
  comments: [],
};
const savedState = {
  currentUser: { username: "juliusomo", image },
  comments: [
    {
      id: 1,
      content: "Saved comment",
      score: 5,
      user: { username: "amyrobson", image },
      replies: [],
    },
  ],
};

beforeEach(() => {
  localStorage.clear(); // each test starts with empty storage
});

afterEach(() => {
  vi.restoreAllMocks(); // undo any spyOn from the test
});

describe("loadState", () => {
  it("returns the default state when nothing is saved", () => {
    expect(loadState(defaultState)).toBe(defaultState);
  });

  it("returns the saved state when it exists", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    expect(loadState(defaultState)).toEqual(savedState);
  });

  it("returns the default state when the saved data is corrupted", () => {
    localStorage.setItem(STORAGE_KEY, "{broken json");
    expect(loadState(defaultState)).toBe(defaultState);
  });

  it("returns the default state when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });
    expect(loadState(defaultState)).toBe(defaultState);
  });

  it.each([
    ["null", "null"],
    ["an empty object", "{}"],
    [
      "comments that are not an array",
      JSON.stringify({ ...savedState, comments: "hello" }),
    ],
    [
      "a comment without replies",
      JSON.stringify({
        ...savedState,
        comments: [{ ...savedState.comments[0], replies: undefined }],
      }),
    ],
    ["a missing currentUser", JSON.stringify({ comments: [] })],
    // New: a reply with an invalid shape (deep validation)
    [
      "a reply without a user",
      JSON.stringify({
        ...savedState,
        comments: [
          {
            ...savedState.comments[0],
            replies: [
              { id: 2, content: "Hi", score: 0, replyingTo: "amyrobson" },
            ],
          },
        ],
      }),
    ],
    [
      "votes that are an array",
      JSON.stringify({ ...savedState, votes: [1, -1] }),
    ],
    [
      "a vote value that is not 1 or -1",
      JSON.stringify({ ...savedState, votes: { 1: 5 } }),
    ],
    [
      "a vote value that is a string",
      JSON.stringify({ ...savedState, votes: { 1: "1" } }),
    ],
    [
      "a user without an image",
      JSON.stringify({
        ...savedState,
        comments: [{ ...savedState.comments[0], user: { username: "x" } }],
      }),
    ],
  ])("returns the default state when the saved data is %s", (_label, value) => {
    localStorage.setItem(STORAGE_KEY, value);
    expect(loadState(defaultState)).toBe(defaultState);
  });
});

describe("saveState", () => {
  it("saves the state as JSON", () => {
    saveState(savedState);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(savedState);
  });

  it("does not throw when storage is full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });
    expect(() => saveState(savedState)).not.toThrow();
  });
});

describe("saveState + loadState", () => {
  it("loads exactly what was saved", () => {
    saveState(savedState);
    expect(loadState(defaultState)).toEqual(savedState);
  });
});
