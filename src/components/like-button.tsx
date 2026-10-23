"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function LikeButton({
  id,
  baseLikes,
  trialLikes = 0,
}: {
  id: string;
  baseLikes: number;
  trialLikes?: number;
}) {
  const store = useStore();
  const liked = store.liked(id);
  const count = store.likeCount({ id, baseLikes, trialLikes });

  return (
    <Button
      type="button"
      variant={liked ? "default" : "outline"}
      className="h-10 px-3"
      aria-pressed={liked}
      onClick={() => store.toggleLike(id)}
    >
      <span className="font-mincho">{liked ? "推した" : "推す"}</span>
      <span className="text-xs tracking-wider">{count} いいね</span>
    </Button>
  );
}
