import {
  createComment,
  stripMention,
  updateComment,
  removeComment,
  findThreadId,
  findComment,
} from "./commentUtils";

import { ACTIONS } from "./actionTypes";

export function commentsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_COMMENT: {
      const newComment = createComment(state.currentUser, action.content);
      return { ...state, comments: [...state.comments, newComment] };
    }

    case ACTIONS.ADD_REPLY: {
      const target = findComment(state.comments, action.targetId);
      const threadId = findThreadId(state.comments, action.targetId);
      if (!target || threadId === undefined) return state;

      const replyingTo = target.user.username;
      const content = stripMention(action.content, replyingTo);
      if (!content) return state;

      const newReply = createComment(state.currentUser, content, replyingTo);

      return {
        ...state,
        comments: updateComment(state.comments, threadId, (thread) => ({
          ...thread,
          replies: [...thread.replies, newReply],
        })),
      };
    }

    case ACTIONS.EDIT_COMMENT:
      return {
        ...state,
        comments: updateComment(state.comments, action.id, (comment) => ({
          ...comment,
          content: comment.replyingTo
            ? stripMention(action.content, comment.replyingTo)
            : action.content,
        })),
      };

    case ACTIONS.DELETE_COMMENT:
      return { ...state, comments: removeComment(state.comments, action.id) };

    case ACTIONS.UPVOTE:
      return {
        ...state,
        comments: updateComment(state.comments, action.id, (comment) => ({
          ...comment,
          score: comment.score + 1,
        })),
      };

    case ACTIONS.DOWNVOTE:
      return {
        ...state,
        comments: updateComment(state.comments, action.id, (comment) => ({
          ...comment,
          score: Math.max(0, comment.score - 1),
        })),
      };

    default:
      if (import.meta.env.DEV) {
        console.warn(`Unknown action type: ${action.type}`);
      }
      return state;
  }
}
