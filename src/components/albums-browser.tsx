"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Jacket } from "@/components/jacket";
import { Input } from "@/components/ui/input";
import { albums } from "@/lib/catalog";
import { decadeOf } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "cn";

const decades = ["すべて", "1950–60年代", "1970年代", "1980年代", "1990年代"];
const formats = ["すべて", "LP", "CD"] as const;

export function AlbumsBrowser() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [decade, setDecade] = useState("すべて");
  const [format, setFormat] = useState<(typeof formats)[number]>("すべて");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return albums.filter((album) => {
      if (decade !== "すべて" && decadeOf(album.year) !== decade) return false;
      if (format !== "すべて" && album.format !== format) return false;
      if (!needle) return true;
      const haystack = [album.artist, album.title, album.label, album.catalog, album.genre, album.credits]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [decade, format, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">目録</p>
      <h1 className="mt-2 font-mincho text-4xl font-medium">音盤</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        最初の棚は狭い。品番の合う盤だけを置いた。網羅は、書誌の正本をDiscogsへつなぐあとの仕事だ。
      </p>
      <div className="mt-6 space-y-3">
        <Input
          value={query}
          placeholder="アーティスト、題、レーベル、品番"
          className="h-11 max-w-xl"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {decades.map((item) => (
            <FilterButton key={item} active={decade === item} onClick={() => setDecade(item)}>
              {item}
            </FilterButton>
          ))}
        </div>
        <div className="flex gap-2">
          {formats.map((item) => (
            <FilterButton key={item} active={format === item} onClick={() => setFormat(item)}>
              {item}
            </FilterButton>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-border px-4 py-12 text-center text-sm leading-7">
          その条件の盤は、この棚にない。品番を短くして、もう一度。
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((album) => {
            const count = store.allNotes.filter((note) => note.albumId === album.id).length;
            return (
              <li key={album.id}>
                <Link href={`/albums/${album.id}`} className="group block">
                  <Jacket album={album} size="sm" className="transition-transform group-hover:-translate-y-0.5" />
                  <p className="mt-2 text-xs text-muted-foreground">{album.artist}</p>
                  <p className="font-mincho leading-snug group-hover:text-primary">{album.title}</p>
                  <p className="mt-1 text-[11px] tracking-wider text-muted-foreground">
                    {album.year} / {album.format} / 稿 {count}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 text-xs tracking-wider",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}
