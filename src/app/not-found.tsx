import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">404</p>
      <h1 className="mt-2 font-mincho text-4xl">その棚は、ない。</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        品番が違うか、稿がすでに外れている。
      </p>
      <Link href="/albums" className="mt-6 inline-block text-sm tracking-wider text-primary">
        音盤へ戻る
      </Link>
    </div>
  );
}
