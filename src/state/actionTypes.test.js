import { describe, it, expect } from "vitest";
import { ACTIONS } from "./actionTypes";

describe("ACTIONS", () => {
  it("is frozen", () => {
    expect(Object.isFrozen(ACTIONS)).toBe(true);
  });

  it("each value matches its key", () => {
    for (const [key, value] of Object.entries(ACTIONS)) {
      expect(value).toBe(key);
    }
  });
});