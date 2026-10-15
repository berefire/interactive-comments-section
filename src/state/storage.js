export const STORAGE_KEY = "interactive-comments:v1";

const isObject = (value) => typeof value === "object" && value !== null;
const isPlainObject = (value) => isObject(value) && !Array.isArray(value);

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

function hasValidReplies(comment) {
  return (
    Array.isArray(comment.replies) &&
    comment.replies.every((reply) => isValidComment(reply, { isReply: true }))
  );
}

function isValidComment(comment, { isReply = false } = {}) {
  return (
    isObject(comment) &&
    (typeof comment.id === "number" || typeof comment.id === "string") &&
    typeof comment.content === "string" &&
    typeof comment.score === "number" &&
    isValidUser(comment.user) &&
    (isReply || hasValidReplies(comment))
  );
}

function isValidVotes(votes) {
  return (
    votes === undefined ||                      // older saved data has no votes
    (isPlainObject(votes) &&
      Object.values(votes).every((vote) => vote === 1 || vote === -1))
  );
}

export function isValidState(state) {
  return (
    isPlainObject(state) &&
    isValidUser(state.currentUser) &&
    Array.isArray(state.comments) &&
    state.comments.every((comment) => isValidComment(comment)) &&
    isValidVotes(state.votes)
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