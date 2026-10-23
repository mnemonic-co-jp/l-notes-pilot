"use client";

import Link from "next/link";
import { NoteCard } from "@/components/note-card";
import { anthologyOrder, noteById } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function AnthologyView() {
  const store = useStore();
  const pieces = anthologyOrder
    .map((id) => noteById(id))
    .filter((note) => note != null);
  const popular = noteById("note-for-you");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-primary">選集　創刊号</p>
      <h1 className="mt-2 font-mincho text-4xl leading-tight font-medium">帯だけを、綴じる。</h1>
      <p className="mt-4 text-sm leading-8 text-muted-foreground">
        この号の順は、いいねの順ではない。編集部が帯を付けた稿だけを、読む順序のまま置いた。あなたの稿が帯候補になっても、この号には入らない。入るのは、次の号を編集部が綴じるときだ。
      </p>
      <ol className="mt-8 space-y-3">
        {pieces.map((note, index) => (
          <li key={note.id} className="grid grid-cols-[2.5rem_1fr] gap-2">
            <span className="pt-4 font-mincho text-2xl text-primary">{String(index + 1).padStart(2, "0")}</span>
            <NoteCard note={note} showAlbum />
          </li>
        ))}
      </ol>
      {popular ? (
        <aside className="mt-10 border border-border p-4">
          <p className="text-xs tracking-[0.18em] text-muted-foreground">この号に入らなかった、最多の稿</p>
          <p className="mt-2 font-mincho text-2xl">
            <Link href={`/notes/${popular.id}`} className="hover:text-primary">
              {popular.title}
            </Link>
          </p>
          <p className="mt-2 text-sm leading-7">
            {store.likeCount(popular)} いいね。選集の外に置くことが、この号の編集だ。
          </p>
        </aside>
      ) : null}
    </div>
  );
}
