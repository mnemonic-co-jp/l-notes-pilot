"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { useStore } from "@/lib/store";

const links = [
  { href: "/albums", label: "音盤" },
  { href: "/anthology", label: "選集" },
  { href: "/writers", label: "書き手" },
  { href: "/colophon", label: "編集後記" },
  { href: "/me", label: "書誌" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const store = useStore();
  const signed = store.ready && store.penName;

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="h-1.5 bg-primary" />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <Link href="/" className="group">
          <p className="text-[10px] tracking-[0.28em] text-muted-foreground">
            A MARGIN FOR A SIGNED NAME
          </p>
          <p className="font-mincho text-2xl leading-tight font-medium group-hover:text-primary sm:text-3xl">
            俺のライナーノーツ
          </p>
        </Link>
        <nav className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 px-2.5 py-1.5 text-sm tracking-wider",
                  active ? "bg-primary text-primary-foreground" : "hover:text-primary",
                )}
              >
                {link.href === "/me" && signed ? store.penName : link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
