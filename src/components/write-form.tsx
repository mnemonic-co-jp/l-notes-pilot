"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Jacket } from "@/components/jacket";
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
import { Textarea } from "@/components/ui/textarea";
import { albumById } from "@/lib/catalog";
import { glyphCount } from "@/lib/format";
import { OBI_LINE, PUBLISH_MIN } from "@/lib/ranks";
import { useStore } from "@/lib/store";

export function WriteForm({ albumId }: { albumId: string }) {
  const album = albumById(albumId);
  const store = useStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [penOpen, setPenOpen] = useState(false);
  const [penName, setPenName] = useState("");
  const [bio, setBio] = useState("");
  const glyphs = glyphCount(body);

  if (!album) return null;

  function publish() {
    if (!store.penName.trim()) {
      setPenName(store.penName);
      setBio(store.bio);
      setPenOpen(true);
      return;
    }
    if (title.trim().length === 0 || glyphs < PUBLISH_MIN) return;
    const id = store.publish({ albumId: album!.id, title, body });
    toast.success("稿を、あなたの書誌に綴じた。");
    router.push(`/notes/${id}`);
  }

  function savePen() {
    const name = penName.trim();
    if (!name) return;
    store.setProfile({ penName: name, bio: bio.trim() });
    setPenOpen(false);
  }

  const remain = Math.max(PUBLISH_MIN - glyphs, 0);
  const obiRemain = Math.max(OBI_LINE - glyphs, 0);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
      <aside>
        <Jacket album={album} />
        <p className="mt-3 text-sm">
          <Link href={`/albums/${album.id}`} className="hover:text-primary">
            {album.artist}
            <br />
            <span className="font-mincho text-lg">{album.title}</span>
          </Link>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {album.label} / {album.catalog}
        </p>
      </aside>
      <div>
        <p className="text-xs tracking-[0.22em] text-muted-foreground">新しい稿</p>
        <h1 className="mt-2 font-mincho text-3xl">この盤に、署名を残す</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          星は置かない。既存のライナーの引き写し、歌詞の全文、人格への攻撃は掲載しない。公開は{PUBLISH_MIN}
          字から。帯の審査ラインは{OBI_LINE}字で、ラインを超えても帯は編集部だけが付ける。
        </p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">稿の題</Label>
            <Input
              id="title"
              value={title}
              maxLength={40}
              placeholder="曲名の繰り返しではなく、この文章の題"
              className="h-11 font-mincho text-base"
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">本文</Label>
            <Textarea
              id="body"
              value={body}
              maxLength={8000}
              placeholder="段落のあいだは、空行を一つ。"
              className="min-h-80 font-mincho text-base leading-8"
              onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <p className="text-sm leading-7" aria-live="polite">
            {glyphs}字。
            {remain > 0
              ? ` 公開まであと${remain}字。`
              : obiRemain > 0
                ? ` 公開できる。帯の審査ラインまであと${obiRemain}字。`
                : " 帯の審査ラインは超えた。帯そのものは、編集部の仕事だ。"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="h-10 px-4"
              disabled={title.trim().length === 0 || glyphs < PUBLISH_MIN}
              onClick={publish}
            >
              書誌に綴じる
            </Button>
            <Button variant="outline" className="h-10 px-4" render={<Link href={`/albums/${album.id}`} />}>
              戻る
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={penOpen} onOpenChange={setPenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mincho text-xl">先に、筆名を定める</DialogTitle>
            <DialogDescription>
              匿名のままでは綴じない。この名前は、このブラウザの書誌にだけ残る。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="pen-name">筆名</Label>
              <Input
                id="pen-name"
                value={penName}
                maxLength={16}
                className="h-11"
                onChange={(event) => setPenName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pen-bio">一行の経歴</Label>
              <Input
                id="pen-bio"
                value={bio}
                maxLength={80}
                className="h-11"
                onChange={(event) => setBio(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" className="h-10" disabled={!penName.trim()} onClick={savePen}>
              この名前で書く
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
