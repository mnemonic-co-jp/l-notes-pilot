import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mincho text-base text-foreground">俺のライナーノーツ</p>
          <p className="mt-1 max-w-xl leading-relaxed">
            レコード会社の公式ライナーではない。ジャケットは書誌のための図版で、原盤の意匠ではない。原稿と筆名は、このブラウザの中だけに残る。
          </p>
        </div>
        <Link href="/colophon" className="tracking-wider hover:text-primary">
          編集後記を読む
        </Link>
      </div>
    </footer>
  );
}
