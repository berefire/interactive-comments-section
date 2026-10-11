const UNITS = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "always" });

export function isValidDate(value) {
  return !Number.isNaN(new Date(value).getTime());
}

export function formatRelativeTime(value, now = Date.now()) {
  // Original data.json values are already text ("1 month ago"), so keep them
  if (!isValidDate(value)) return value;

  const seconds = (new Date(value).getTime() - now) / 1000; // negative = in the past

  if (Math.abs(seconds) < 60) return "just now";

  for (const [unit, secondsInUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(Math.trunc(seconds / secondsInUnit), unit);
    }
  }
}