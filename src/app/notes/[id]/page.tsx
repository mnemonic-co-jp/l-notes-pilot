import type { Metadata } from "next";
import { Suspense } from "react";
import { NoteView } from "@/components/note-view";
import { ShelfFallback } from "@/components/shelf-fallback";
import { noteById, notes } from "@/lib/catalog";

export function generateStaticParams() {
  return notes.map((note) => ({ id: note.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = noteById(id);
  if (!note) return { title: "稿" };
  return { title: note.title };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ShelfFallback />}>
      <NoteRoute params={params} />
    </Suspense>
  );
}

async function NoteRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoteView noteId={id} />;
}
