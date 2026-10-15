import Avatar from "@/components/Avatar/Avatar";
import { formatRelativeTime, isValidDate } from "@/utils/formatRelativeTime";
import { useNow } from "@/hooks/useNow";

function CommentHeader({ user, createdAt, isCurrentUser = false }) {
  const now = useNow();

  return (
    <header className="flex flex-wrap items-center gap-4 gap-y-1 font-body text-base">
      <Avatar user={user} />

      <div className="flex items-center gap-2">
        <span className="font-medium text-grey-800">{user.username}</span>

        {isCurrentUser && (
          <span className="rounded-sm bg-purple-600 px-1.5 text-sm font-medium lowercase text-white">
            <span className="sr-only">(</span>
            you
            <span className="sr-only">)</span>
          </span>
        )}
      </div>

      {isValidDate(createdAt) ? (
        <time dateTime={createdAt} className="text-grey-500">
          {formatRelativeTime(createdAt, now)}
        </time>
      ) : (
        <span className="text-grey-500">{createdAt}</span>
      )}
    </header>
  );
}

export default CommentHeader;
