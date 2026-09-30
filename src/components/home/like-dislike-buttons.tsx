"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { toggleReaction } from "@/app/actions/reactions";
import type { ReactionType } from "@/lib/cities";

type Reaction = ReactionType | null;

const SAVE_FAILED_MESSAGE = "반응을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";

export function LikeDislikeButtons({
  cityId,
  initialLikeCount,
  initialDislikeCount,
  initialReaction,
  isLoggedIn,
}: {
  cityId: string;
  initialLikeCount: number;
  initialDislikeCount: number;
  initialReaction: Reaction;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [reaction, setOptimisticReaction] = useOptimistic<Reaction>(initialReaction);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const likeCount =
    initialLikeCount + (reaction === "like" ? 1 : 0) - (initialReaction === "like" ? 1 : 0);
  const dislikeCount =
    initialDislikeCount + (reaction === "dislike" ? 1 : 0) - (initialReaction === "dislike" ? 1 : 0);

  function handleClick(type: ReactionType) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const next = reaction === type ? null : type;
    setErrorMessage(null);
    startTransition(async () => {
      setOptimisticReaction(next);
      try {
        const result = await toggleReaction(cityId, type);
        if ("error" in result) {
          if (result.error === "unauthenticated") {
            router.push("/login");
          } else {
            setErrorMessage(SAVE_FAILED_MESSAGE);
          }
        }
      } catch {
        // The optimistic reaction rolls back on its own once the transition ends.
        setErrorMessage(SAVE_FAILED_MESSAGE);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={reaction === "like"}
          onClick={() => handleClick("like")}
          className={cn(
            "gap-1.5",
            reaction === "like" && "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
          )}
        >
          <ThumbsUp className="size-4" />
          {likeCount}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={reaction === "dislike"}
          onClick={() => handleClick("dislike")}
          className={cn("gap-1.5", reaction === "dislike" && "bg-destructive/10 text-destructive")}
        >
          <ThumbsDown className="size-4" />
          {dislikeCount}
        </Button>
      </div>
      {errorMessage && (
        <p role="alert" className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
