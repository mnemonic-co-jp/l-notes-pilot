import { cn } from "cn";
import type { Rank } from "@/lib/ranks";

export function RankStamp({ rank, className }: { rank: Rank; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 rotate-[-8deg] items-center justify-center rounded-full border-2 border-primary font-mincho text-sm text-primary",
        className,
      )}
      title={rank.name}
    >
      {rank.stamp}
    </span>
  );
}
