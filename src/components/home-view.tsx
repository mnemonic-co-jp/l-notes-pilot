"use client";

import Link from "next/link";
import { Jacket } from "@/components/jacket";
import { NoteCard } from "@/components/note-card";
import { RankStamp } from "@/components/rank-stamp";
import { albums, noteById, writers } from "@/lib/catalog";
import { excerpt } from "@/lib/format";
import { rankFor } from "@/lib/ranks";
import { useStore } from "@/lib/store";

export function HomeView() {
  const store = useStore();
  const featured = noteById("note-vacation-fuyuki");
  const popular = noteById("note-for-you");
  const featuredAlbum = albums.find((album) => album.id === featured?.albumId);
  const popularAlbum = albums.find((album) => album.id === popular?.albumId);
  const recent = [...store.allNotes].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 4);
  const rankedWriters = [...writers].sort((a, b) => store.writerLikes(b.id) - store.writerLikes(a.id));

  if (!featured || !popular || !featuredAlbum || !popularAlbum) return null;

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs tracking-[0.28em] text-primary">創刊の帯</p>
            <h1 className="mt-3 font-mincho text-4xl leading-tight font-medium sm:text-6xl">
              署名された自尊心のための、音盤の余白。
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground">
              ライナーノーツを読みすぎて、自分のほうが書けると思ってしまった人の棚。星は置かない。いいねは数える。帯は、編集部だけが付ける。
            </p>
          </div>
          <Link href={`/notes/${featured.id}`} className="group block border border-border bg-card p-4">
            <p className="text-[11px] tracking-[0.2em] text-primary">巻頭</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {featuredAlbum.artist}『{featuredAlbum.title}』
            </p>
            <p className="mt-1 font-mincho text-2xl leading-snug group-hover:text-primary">{featured.title}</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{excerpt(featured.body, 70)}</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[180px_1fr]">
        <Jacket album={popularAlbum} />
        <div className="border border-primary/30 bg-primary/5 p-5">
          <p className="text-xs tracking-[0.2em] text-primary">いいねは最多で、帯はない</p>
          <h2 className="mt-2 font-mincho text-3xl leading-snug">
            <Link href={`/notes/${popular.id}`} className="hover:text-primary">
              {popular.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-8">
            {store.likeCount(popular)} のいいね。岸辺アンリの稿は、水平線の記憶として正しく伸びる。編集部はそれでも帯を付けない。人気と、残す文章は、ここで分かれる。
          </p>
          <Link href="/colophon" className="mt-4 inline-block text-sm tracking-wider text-primary">
            なぜ分けるのか
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-mincho text-2xl">近い稿</h2>
          <Link href="/anthology" className="text-sm tracking-wider hover:text-primary">
            選集を開く
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {recent.map((note) => (
            <NoteCard key={note.id} note={note} showAlbum />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-mincho text-2xl">棚</h2>
          <Link href="/albums" className="text-sm tracking-wider hover:text-primary">
            目録をすべて
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {albums.slice(0, 6).map((album) => (
            <li key={album.id}>
              <Link href={`/albums/${album.id}`} className="group block">
                <Jacket album={album} size="sm" />
                <p className="mt-2 font-mincho text-sm leading-snug group-hover:text-primary">{album.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-mincho text-2xl">書き手</h2>
          <Link href="/writers" className="text-sm tracking-wider hover:text-primary">
            一覧
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {rankedWriters.slice(0, 4).map((writer) => {
            const likes = store.writerLikes(writer.id);
            const count = store.writerNoteCount(writer.id);
            const rank = rankFor(likes, count);
            return (
              <li key={writer.id}>
                <Link href={`/writers/${writer.id}`} className="flex items-center gap-4 py-3 hover:text-primary">
                  <RankStamp rank={rank} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mincho text-lg">{writer.name}</span>
                    <span className="text-xs tracking-wider text-muted-foreground">{rank.name}</span>
                  </span>
                  <span className="text-sm">{likes} いいね</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
