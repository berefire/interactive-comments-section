import { describe, it, expect } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

const NOW = new Date("2026-10-10T12:00:00Z").getTime();
const ago = (ms) => new Date(NOW - ms).toISOString();

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatRelativeTime", () => {
  it("returns 'just now' for less than a minute", () => {
    expect(formatRelativeTime(ago(30 * 1000), NOW)).toBe("just now");
  });

  it("formats minutes, hours and days", () => {
    expect(formatRelativeTime(ago(5 * MINUTE), NOW)).toBe("5 minutes ago");
    expect(formatRelativeTime(ago(3 * HOUR), NOW)).toBe("3 hours ago");
    expect(formatRelativeTime(ago(2 * DAY), NOW)).toBe("2 days ago");
  });

  it("uses the singular for 1", () => {
    expect(formatRelativeTime(ago(1 * DAY), NOW)).toBe("1 day ago");
  });

  it("formats weeks and months", () => {
    expect(formatRelativeTime(ago(14 * DAY), NOW)).toBe("2 weeks ago");
    expect(formatRelativeTime(ago(60 * DAY), NOW)).toBe("2 months ago");
  });

  it("keeps text that is not a date", () => {
    expect(formatRelativeTime("1 month ago", NOW)).toBe("1 month ago");
  });
});