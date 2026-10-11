// ---------- Helpers ----------

// Creates a new comment or reply object
export function createComment(user, content, replyingTo) {
  const base = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    score: 0,
    user,
  };

  // Replies have "replyingTo"; top-level comments have "replies"
  return replyingTo ? { ...base, replyingTo } : { ...base, replies: [] };
}

// Removes "@username " from the start of a reply (the form pre-fills it)
export function stripMention(content, username) {
  const mention = `@${username}`;
  return content.startsWith(mention)
    ? content.slice(mention.length).trim()
    : content;
}

// Returns a new array where the comment/reply with this id is updated
export function updateComment(comments, id, updater) {
  return comments.map((comment) => {
    if (comment.id === id) return updater(comment);
    if (!comment.replies) return comment;
    return { ...comment, replies: updateComment(comment.replies, id, updater) };
  });
}

// Returns a new array without the comment/reply with this id
export function removeComment(comments, id) {
  return comments
    .filter((comment) => comment.id !== id)
    .map((comment) =>
      comment.replies
        ? { ...comment, replies: removeComment(comment.replies, id) }
        : comment
    );
}

// Finds the top-level comment (thread) that contains this id
export function findThreadId(comments, id) {
  const thread = comments.find(
    (comment) =>
      comment.id === id || comment.replies.some((reply) => reply.id === id)
  );
  return thread?.id;
}

// Finds any comment or reply by id
export function findComment(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    const reply = comment.replies?.find((r) => r.id === id);
    if (reply) return reply;
  }
  return undefined;
}