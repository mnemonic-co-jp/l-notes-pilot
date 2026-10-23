"use client";

import { useState } from "react";
import Link from "next/link";
import { NoteCard } from "@/components/note-card";
import { RankStamp } from "@/components/rank-stamp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RANKS, nextRank, TRIAL_STEP } from "@/lib/ranks";
import { useStore } from "@/lib/store";
import { albumById } from "@/lib/catalog";

export function MeView() {
  const store = useStore();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const rank = store.selfRank;
  const upcoming = nextRank(store.receivedLikes, store.selfNotes.length);
  const criticUnlocked = rank.id === "critic" || rank.id === "selector";

  function exportNotes() {
    const text = store.userNotes
      .map((note) => {
        const album = albumById(note.albumId);
        return [
          note.title,
          album ? `${album.artist}『${album.title}』 ${album.catalog}` : "",
          store.penName,
          note.published,
          "",
          note.body,
        ].join("\n");
      })
      .join("\n\n----\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "orenote.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">あなたの書誌</p>
      <div className="mt-4 flex items-start gap-4">
        <RankStamp rank={rank} className="size-16 text-lg" />
        <div>
          <h1 className="font-mincho text-4xl font-medium">{store.penName || "まだ、無名"}</h1>
          <p className="mt-1 text-sm tracking-wider text-muted-foreground">
            {rank.name}
            {store.epithet ? ` / ${store.epithet}` : ""} / いいね {store.receivedLikes}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7">{rank.perk}</p>
      {upcoming ? (
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          次は{upcoming.name}。あと {Math.max(upcoming.minLikes - store.receivedLikes, 0)} いいね。
          {upcoming.perk}
        </p>
      ) : (
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          称号はここまでだ。帯は、まだ別の扉の向こうにある。
        </p>
      )}

      <section className="mt-8 border border-border bg-card p-4">
        <h2 className="font-mincho text-2xl">署名</h2>
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="me-name">筆名</Label>
            <Input
              id="me-name"
              value={store.penName}
              maxLength={16}
              className="h-11"
              onChange={(event) => store.setProfile({ penName: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="me-bio">一行の経歴</Label>
            <Input
              id="me-bio"
              value={store.bio}
              maxLength={80}
              className="h-11"
              onChange={(event) => store.setProfile({ bio: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="me-epithet">自分で名乗る肩書き</Label>
            <Input
              id="me-epithet"
              value={store.epithet}
              maxLength={16}
              disabled={!criticUnlocked}
              placeholder={criticUnlocked ? "例: 水平線の通訳" : "音楽評論家に届くまで閉じている"}
              className="h-11"
              onChange={(event) => store.setProfile({ epithet: event.target.value })}
            />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">入力は、そのままこのブラウザに残る。</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-mincho text-2xl">綴じた稿</h2>
          {store.userNotes.length > 0 ? (
            <Button type="button" variant="outline" className="h-9" onClick={exportNotes}>
              原稿を書き出す
            </Button>
          ) : null}
        </div>
        {store.userNotes.length === 0 ? (
          <div className="mt-4 border border-dashed border-border px-4 py-10 text-center">
            <p className="font-mincho text-2xl">書誌は、まだ白い。</p>
            <Link href="/albums" className="mt-3 inline-block text-sm text-primary">
              音盤を選んで、最初の稿を書く
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {store.selfNotes.map((note) => {
              const userNote = store.userNotes.find((item) => item.id === note.id);
              return (
                <li key={note.id} className="space-y-2">
                  <NoteCard note={note} showAlbum />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9"
                      onClick={() => store.addTrialReaders(note.id)}
                    >
                      試験読者を{TRIAL_STEP}人足す
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-9 text-destructive"
                      onClick={() => setPendingDelete(note.id)}
                    >
                      この稿を外す
                    </Button>
                  </div>
                  <p className="text-xs leading-6 text-muted-foreground">
                    試験読者は実在しない。いいねの数字と称号だけが動き、帯は動かない。
                    {userNote && userNote.trialLikes > 0 ? ` いま ${userNote.trialLikes}。` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-mincho text-2xl">称号</h2>
        <ol className="mt-4 space-y-3">
          {RANKS.slice(1).map((item) => (
            <li key={item.id} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-border pb-3">
              <span className="font-mincho text-primary">{item.stamp}</span>
              <span>
                <span className="font-medium">
                  {item.name}
                  <span className="ml-2 text-xs text-muted-foreground">いいね {item.minLikes}</span>
                </span>
                <span className="mt-1 block text-sm leading-7 text-muted-foreground">{item.perk}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Dialog open={pendingDelete != null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mincho text-xl">この稿を、書誌から外す</DialogTitle>
            <DialogDescription>このブラウザの中だけから消える。サーバには、最初から送っていない。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              残す
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDelete) store.removeNote(pendingDelete);
                setPendingDelete(null);
              }}
            >
              外す
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
