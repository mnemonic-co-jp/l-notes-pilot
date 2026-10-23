"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RankStamp } from "@/components/rank-stamp";
import { albumById } from "@/lib/catalog";
import { excerpt, formatDate, glyphCount } from "@/lib/format";
import { OBI_LINE, rankFor } from "@/lib/ranks";
import { useStore, writerName } from "@/lib/store";
import type { Note } from "@/lib/types";

export function NoteCard({ note, showAlbum = false }: { note: Note; showAlbum?: boolean }) {
  const store = useStore();
  const album = albumById(note.albumId);
  const likes = store.likeCount(note);
  const rank = rankFor(store.writerLikes(note.writerId), store.writerNoteCount(note.writerId));
  const candidate = !note.obi && glyphCount(note.body) >= OBI_LINE && likes >= 15;
  const name = writerName(note.writerId, store.penName);

  return (
    <article className="border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {note.obi ? (
              <Badge className="tracking-[0.2em]">帯</Badge>
            ) : candidate ? (
              <Badge variant="outline" className="border-primary text-primary">
                帯候補
              </Badge>
            ) : null}
            {showAlbum && album ? (
              <Link href={`/albums/${album.id}`} className="text-xs tracking-wider text-muted-foreground hover:text-primary">
                {album.artist}『{album.title}』
              </Link>
            ) : null}
          </div>
          <h3 className="font-mincho text-xl leading-snug">
            <Link href={`/notes/${note.id}`} className="hover:text-primary">
              {note.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{excerpt(note.body)}</p>
        </div>
        <RankStamp rank={rank} />
      </div>
      <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs tracking-wider text-muted-foreground">
        <Link href={note.writerId === "self" ? "/me" : `/writers/${note.writerId}`} className="hover:text-primary">
          {name}
        </Link>
        <span>{rank.name}</span>
        <span>{formatDate(note.published)}</span>
        <span>{likes} いいね</span>
      </p>
    </article>
  );
}
