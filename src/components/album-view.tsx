"use client";

import Link from "next/link";
import { Jacket } from "@/components/jacket";
import { NoteCard } from "@/components/note-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { albumById } from "@/lib/catalog";
import { amazonSearchUrl, decadeOf, discogsSearchUrl, formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "cn";

export function AlbumView({ albumId }: { albumId: string }) {
  const album = albumById(albumId);
  const store = useStore();
  if (!album) return null;

  const notes = store.allNotes
    .filter((note) => note.albumId === album.id)
    .sort((a, b) => {
      if (a.obi !== b.obi) return a.obi ? -1 : 1;
      const weight = store.writerWeight(b.writerId) - store.writerWeight(a.writerId);
      if (weight) return weight;
      return store.likeCount(b) - store.likeCount(a);
    });
  const yours = notes.filter((note) => note.writerId === "self");
  const sides = album.tracks.reduce<{ side: string; titles: string[] }[]>((groups, track) => {
    const last = groups.at(-1);
    if (!last || last.side !== track.side) groups.push({ side: track.side, titles: [track.title] });
    else last.titles.push(track.title);
    return groups;
  }, []);
  const query = `${album.artist} ${album.title} ${album.catalog}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">
        <Link href="/albums" className="hover:text-primary">
          音盤
        </Link>
        <span className="px-2">/</span>
        {album.catalog}
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <Jacket album={album} />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            図版は書誌のための組版で、原盤のジャケットではない。
          </p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{album.format}</Badge>
            <Badge variant="outline">{decadeOf(album.year)}</Badge>
            <Badge variant="outline">{album.genre}</Badge>
          </div>
          <h1 className="mt-3 font-mincho text-4xl leading-tight font-medium sm:text-5xl">
            {album.title}
          </h1>
          <p className="mt-2 text-lg">{album.artist}</p>
          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-wider text-muted-foreground">発売</dt>
              <dd>{formatDate(album.released)}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wider text-muted-foreground">レーベル / 品番</dt>
              <dd>
                {album.label}　{album.catalog}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs tracking-wider text-muted-foreground">クレジット</dt>
              <dd>{album.credits}</dd>
            </div>
          </dl>
          <p className="mt-5 max-w-2xl leading-8">{album.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/albums/${album.id}/write`}
              className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}
            >
              この盤のライナーを書く
            </Link>
            <a
              href={amazonSearchUrl(query)}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}
            >
              Amazonでこの盤を探す
            </a>
            <a
              href={discogsSearchUrl(query)}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-10 px-4")}
            >
              Discogsで書誌を照合
            </a>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            購入リンクは検索結果への案内で、アソシエイト契約はない。書誌の正本は、店頭とDiscogsで照合してほしい。
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-mincho text-2xl">収録</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {sides.map((side) => (
            <div key={side.side}>
              <p className="text-xs tracking-[0.18em] text-muted-foreground">{side.side}</p>
              <ol className="mt-2 space-y-1">
                {side.titles.map((title, index) => (
                  <li key={title} className="flex gap-3 border-b border-border/70 py-1.5 text-sm">
                    <span className="w-6 text-muted-foreground">{index + 1}</span>
                    <span>{title}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-mincho text-2xl">この盤のライナー</h2>
          <p className="text-xs text-muted-foreground">帯、称号、いいねの順</p>
        </div>
        {yours.length > 0 ? (
          <div className="mt-4 border border-primary/40 bg-primary/5 p-4">
            <p className="text-xs tracking-[0.18em] text-primary">あなたの稿</p>
            <div className="mt-3 grid gap-3">
              {yours.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        ) : null}
        {notes.length === 0 ? (
          <div className="mt-4 border border-dashed border-border px-4 py-10 text-center">
            <p className="font-mincho text-2xl">まだ、帯がない。</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              {album.title === "氷の世界"
                ? "百万枚を超えた盤に、この場所の稿は一本もない。枚数は、文章の代わりをしない。"
                : "小沢と小山田の前で、筆が止まっている。止まっているあいだ、空欄が挑戦状になる。"}
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {notes
              .filter((note) => note.writerId !== "self")
              .map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
