import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadState, saveState, STORAGE_KEY } from "./storage";

const defaultState = { currentUser: { username: "juliusomo" }, comments: [] };
const savedState = {
  currentUser: { username: "juliusomo" },
  comments: [{ id: 1, content: "Saved comment", score: 5, replies: [] }],
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