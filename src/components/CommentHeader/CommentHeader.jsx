import Avatar from "@/components/Avatar/Avatar";

function CommentHeader({ user, createdAt, isCurrentUser = false }) {
  return (
    <header className="flex items-center gap-4 font-body text-base">
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

      <span className="text-grey-500">{createdAt}</span>
    </header>
  );
}

export default CommentHeader;
