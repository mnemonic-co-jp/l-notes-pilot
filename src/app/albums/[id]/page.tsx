import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AlbumView } from "@/components/album-view";
import { albumById, albums } from "@/lib/catalog";
import { ShelfFallback } from "@/components/shelf-fallback";

export function generateStaticParams() {
  return albums.map((album) => ({ id: album.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = albumById(id);
  if (!album) return { title: "音盤が見つからない" };
  return { title: `${album.title} / ${album.artist}`, description: album.blurb };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ShelfFallback />}>
      <AlbumRoute params={params} />
    </Suspense>
  );
}

async function AlbumRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!albumById(id)) notFound();
  return <AlbumView albumId={id} />;
}
