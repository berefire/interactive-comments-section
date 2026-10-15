import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadState, saveState, STORAGE_KEY } from "./storage";

const defaultState = { currentUser: { username: "juliusomo" }, comments: [] };
const savedState = {
  currentUser: { username: "juliusomo" },
  comments: [
    {
      id: 1,
      content: "Saved comment",
      score: 5,
      user: { username: "amyrobson" },
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
    // New: votes must be an object if it exists
    [
      "votes that are not an object",
      JSON.stringify({ ...savedState, votes: "x" }),
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