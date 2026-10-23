"use client";

import Link from "next/link";
import { NoteCard } from "@/components/note-card";
import { RankStamp } from "@/components/rank-stamp";
import { writerById } from "@/lib/catalog";
import { rankFor } from "@/lib/ranks";
import { useStore } from "@/lib/store";

export function WriterView({ writerId }: { writerId: string }) {
  const store = useStore();
  const writer = writerById(writerId);
  if (!writer) return null;
  const list = store.allNotes
    .filter((note) => note.writerId === writer.id)
    .sort((a, b) => store.likeCount(b) - store.likeCount(a));
  const likes = store.writerLikes(writer.id);
  const rank = rankFor(likes, list.length);
  const obi = list.filter((note) => note.obi).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">
        <Link href="/writers" className="hover:text-primary">
          書き手
        </Link>
      </p>
      <div className="mt-4 flex items-start gap-4">
        <RankStamp rank={rank} className="size-16 text-lg" />
        <div>
          <h1 className="font-mincho text-4xl font-medium">{writer.name}</h1>
          <p className="mt-1 text-sm tracking-wider text-muted-foreground">
            {rank.name} / いいね {likes} / 帯 {obi}
          </p>
        </div>
      </div>
      <p className="mt-6 max-w-2xl leading-8">{writer.bio}</p>
      {obi === 0 ? (
        <p className="mt-4 border border-border bg-card px-4 py-3 text-sm leading-7">
          帯は一本もない。いいねがどれだけ伸びても、選集の巻頭は別の基準で綴じる。
        </p>
      ) : null}
      <div className="mt-8 grid gap-3">
        {list.map((note) => (
          <NoteCard key={note.id} note={note} showAlbum />
        ))}
      </div>
    </div>
  );
}
