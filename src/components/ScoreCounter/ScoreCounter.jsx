import ActionButton from "@/components/ActionButton/ActionButton";
import { getAssetUrl } from "@/utils/getAssetUrl";

function ScoreCounter({ score, onUpvote, onDownvote }) {
  const isMinScore = score <= 0;

  return (
    <div className="inline-flex md:flex-col items-center justify-center gap-4 p-2 bg-grey-50 rounded-[0.625rem]">
      <ActionButton aria-label="Upvote" onClick={onUpvote} icon={getAssetUrl("./assets/images/icons/icon-plus.svg")} />
      <span className="text-base font-body font-medium text-purple-600 min-w-[2ch] text-center tabular-nums" aria-live="polite">
        <span className="sr-only">Score: </span>
        {score}
      </span>
      <ActionButton aria-label="Downvote" onClick={isMinScore ? undefined : onDownvote} icon={getAssetUrl("./assets/images/icons/icon-minus.svg")} aria-disabled={isMinScore} />
    </div>
  );
}

export default ScoreCounter;
