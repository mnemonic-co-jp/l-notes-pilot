import { cn } from "cn";
import type { Album } from "@/lib/types";

export function Jacket({
  album,
  size = "md",
  className,
}: {
  album: Album;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden border border-black/25 shadow-[4px_4px_0_rgba(28,25,21,0.12)]",
        className,
      )}
      style={{ background: album.jacket.bg, color: album.jacket.fg }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(155deg, transparent 42%, ${album.jacket.accent}55 100%)`,
        }}
      />
      <div
        className={cn(
          "relative flex h-full flex-col justify-between",
          size === "sm" ? "p-2.5" : "p-4",
        )}
      >
        <div className="flex items-start justify-between gap-2 text-[10px] tracking-[0.18em]">
          <span>{album.format}</span>
          <span className="text-right leading-tight">{album.catalog}</span>
        </div>
        <div>
          <p className={cn("opacity-80", size === "sm" ? "text-[10px]" : "text-xs")}>
            {album.artist}
          </p>
          <p
            className={cn(
              "font-mincho leading-tight font-medium",
              size === "sm" ? "text-sm" : "text-2xl",
            )}
          >
            {album.title}
          </p>
        </div>
        <p
          className={cn(
            "font-mincho leading-none opacity-30",
            size === "sm" ? "text-lg" : "text-4xl",
          )}
        >
          {album.jacket.mark}
        </p>
      </div>
    </div>
  );
}
