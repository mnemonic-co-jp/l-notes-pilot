"use client";

import Link from "next/link";
import { Jacket } from "@/components/jacket";
import { LikeButton } from "@/components/like-button";
import { NoteCard } from "@/components/note-card";
import { RankStamp } from "@/components/rank-stamp";
import { Badge } from "@/components/ui/badge";
import { albumById, noteById } from "@/lib/catalog";
import { formatDate, glyphCount } from "@/lib/format";
import { OBI_LINE, rankFor } from "@/lib/ranks";
import { useStore, writerName } from "@/lib/store";

export function NoteView({ noteId }: { noteId: string }) {
  const store = useStore();
  const seeded = noteById(noteId);
  const note = store.allNotes.find((item) => item.id === noteId) ?? seeded;

  if (!store.ready && !seeded) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">原稿を開いています。</p>;
  }

  if (!note) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-mincho text-3xl">この稿は、もう棚にない。</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          削除したか、このブラウザには最初からなかった。
        </p>
        <Link href="/albums" className="mt-6 inline-block text-sm tracking-wider text-primary">
          音盤へ戻る
        </Link>
      </div>
    );
  }

  const album = albumById(note.albumId);
  const rank = rankFor(store.writerLikes(note.writerId), store.writerNoteCount(note.writerId));
  const name = writerName(note.writerId, store.penName);
  const userNote = store.userNotes.find((item) => item.id === note.id);
  const likes = store.likeCount({
    id: note.id,
    baseLikes: note.writerId === "self" ? 0 : note.baseLikes,
    trialLikes: userNote?.trialLikes ?? 0,
  });
  const candidate = !note.obi && glyphCount(note.body) >= OBI_LINE && likes >= 15;
  const others =
    album == null
      ? []
      : store.allNotes.filter((item) => item.albumId === album.id && item.id !== note.id);
  const paragraphs = note.body.split(/\n\n+/);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {album ? (
        <p className="text-xs tracking-[0.18em] text-muted-foreground">
          <Link href={`/albums/${album.id}`} className="hover:text-primary">
            {album.artist}『{album.title}』
          </Link>
          <span className="px-2">/</span>
          {album.catalog}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {note.obi ? <Badge className="tracking-[0.24em]">帯</Badge> : null}
        {candidate ? (
          <Badge variant="outline" className="border-primary text-primary">
            帯候補
          </Badge>
        ) : null}
        <span className="text-xs text-muted-foreground">{formatDate(note.published)}</span>
        <span className="text-xs text-muted-foreground">{glyphCount(note.body)}字</span>
      </div>
      <h1 className="mt-4 font-mincho text-3xl leading-tight font-medium sm:text-5xl">{note.title}</h1>
      <div className="mt-8 border-l-2 border-primary pl-5 sm:pl-8">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-6 font-mincho text-lg leading-9">
            {paragraph}
          </p>
        ))}
      </div>
      <footer className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={note.writerId === "self" ? "/me" : `/writers/${note.writerId}`}
          className="flex items-center gap-3 hover:text-primary"
        >
          <RankStamp rank={rank} />
          <span>
            <span className="block font-mincho text-xl">{name}</span>
            <span className="text-xs tracking-wider text-muted-foreground">
              {note.writerId === "self" && store.epithet ? store.epithet : rank.name}
            </span>
          </span>
        </Link>
        <LikeButton
          id={note.id}
          baseLikes={note.writerId === "self" ? 0 : note.baseLikes}
          trialLikes={userNote?.trialLikes ?? 0}
        />
      </footer>
      {userNote && userNote.trialLikes > 0 ? (
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          このいいね数には、試験読者 {userNote.trialLikes} が含まれる。試験読者は実在しない。帯は付かない。
        </p>
      ) : null}
      {note.obi ? (
        <p className="mt-6 bg-primary px-4 py-3 text-sm leading-7 text-primary-foreground">
          編集部が帯を付けた稿。いいねの順位とは別に、選集の創刊号へ綴じる。
        </p>
      ) : (
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          帯は付いていない。字数といいねが審査ラインを超えても、帯は編集部だけが付ける。
        </p>
      )}
      {album && others.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-mincho text-2xl">同じ盤の、別の稿</h2>
          <div className="mt-4 grid gap-3">
            {others.map((item) => (
              <NoteCard key={item.id} note={item} />
            ))}
          </div>
        </section>
      ) : null}
      {album ? (
        <div className="mt-8 flex items-center gap-4">
          <Jacket album={album} size="sm" className="w-24" />
          <div>
            <p className="text-sm">{album.artist}</p>
            <p className="font-mincho text-xl">{album.title}</p>
            <Link href={`/albums/${album.id}/write`} className="mt-2 inline-block text-sm text-primary">
              この筆致が甘いと思うなら、あなたの稿を。
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}
