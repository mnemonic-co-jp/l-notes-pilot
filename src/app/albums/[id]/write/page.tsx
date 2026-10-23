import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WriteForm } from "@/components/write-form";
import { ShelfFallback } from "@/components/shelf-fallback";
import { albumById, albums } from "@/lib/catalog";

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
  if (!album) return { title: "書けない" };
  return { title: `${album.title}に書く` };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ShelfFallback />}>
      <WriteRoute params={params} />
    </Suspense>
  );
}

async function WriteRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!albumById(id)) notFound();
  return <WriteForm albumId={id} />;
}
