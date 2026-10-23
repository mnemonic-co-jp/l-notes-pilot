"use client";

import Link from "next/link";
import { RankStamp } from "@/components/rank-stamp";
import { writers } from "@/lib/catalog";
import { rankFor } from "@/lib/ranks";
import { useStore } from "@/lib/store";

export function WritersView() {
  const store = useStore();
  const ranked = [...writers].sort((a, b) => store.writerLikes(b.id) - store.writerLikes(a.id));
  const selfCount = store.writerNoteCount("self");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">署名</p>
      <h1 className="mt-2 font-mincho text-4xl font-medium">書き手</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        並びは、受け取ったいいねの数。帯の本数は別に数える。多い人ほど、残すべき文章を書いているわけではない。
      </p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {selfCount > 0 ? (
          <WriterRow
            href="/me"
            name={store.penName || "無名"}
            bio={store.bio || "このブラウザの書き手。"}
            likes={store.receivedLikes}
            notes={selfCount}
            obi={0}
          />
        ) : null}
        {ranked.map((writer) => {
          const list = store.allNotes.filter((note) => note.writerId === writer.id);
          return (
            <WriterRow
              key={writer.id}
              href={`/writers/${writer.id}`}
              name={writer.name}
              bio={writer.bio}
              likes={store.writerLikes(writer.id)}
              notes={list.length}
              obi={list.filter((note) => note.obi).length}
            />
          );
        })}
      </ul>
    </div>
  );
}

function WriterRow({
  href,
  name,
  bio,
  likes,
  notes,
  obi,
}: {
  href: string;
  name: string;
  bio: string;
  likes: number;
  notes: number;
  obi: number;
}) {
  const rank = rankFor(likes, notes);
  return (
    <li>
      <Link href={href} className="flex items-start gap-4 py-4 hover:text-primary">
        <RankStamp rank={rank} className="mt-1" />
        <span className="min-w-0 flex-1">
          <span className="block font-mincho text-2xl">{name}</span>
          <span className="mt-1 block text-xs tracking-wider text-muted-foreground">
            {rank.name} / 稿 {notes} / 帯 {obi}
          </span>
          <span className="mt-2 block text-sm leading-7 text-foreground">{bio}</span>
        </span>
        <span className="shrink-0 text-sm">{likes}</span>
      </Link>
    </li>
  );
}
