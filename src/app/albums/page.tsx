import type { Metadata } from "next";
import { AlbumsBrowser } from "@/components/albums-browser";

export const metadata: Metadata = { title: "音盤" };

export default function Page() {
  return <AlbumsBrowser />;
}
