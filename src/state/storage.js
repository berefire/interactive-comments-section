export const STORAGE_KEY = "interactive-comments:v1";

export function loadState(defaultState) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch {
    return defaultState; // corrupt data or storage unavailable
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked (e.g., private mode): ignore
  }
}