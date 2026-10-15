export const STORAGE_KEY = "interactive-comments:v1";

const isObject = (value) => typeof value === "object" && value !== null;

function isValidImage(image) {
  return (
    isObject(image) &&
    typeof image.png === "string" &&
    typeof image.webp === "string"
  );
}

function isValidUser(user) {
  return (
    isObject(user) &&
    typeof user.username === "string" &&
    isValidImage(user.image)
  );
}

function isValidComment(comment, { isReply = false } = {}) {
  return (
    isObject(comment) &&
    comment.id !== undefined &&
    typeof comment.content === "string" &&
    typeof comment.score === "number" &&
    isValidUser(comment.user) &&
    (isReply || (Array.isArray(comment.replies) &&
      comment.replies.every((reply) => isValidComment(reply, { isReply: true }))))
  );
}

export function isValidState(state) {
  return (
    isObject(state) &&
    isValidUser(state.currentUser) &&
    Array.isArray(state.comments) &&
    state.comments.every((comment) => isValidComment(comment)) &&
    (state.votes === undefined || isObject(state.votes))
  );
}

export function loadState(defaultState) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);
    return isValidState(parsed) ? parsed : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked (e.g., private mode): ignore
  }
}