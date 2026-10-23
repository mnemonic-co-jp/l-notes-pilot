import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WriterView } from "@/components/writer-view";
import { ShelfFallback } from "@/components/shelf-fallback";
import { writerById, writers } from "@/lib/catalog";

export function generateStaticParams() {
  return writers.map((writer) => ({ id: writer.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const writer = writerById(id);
  if (!writer) return { title: "書き手" };
  return { title: writer.name, description: writer.bio };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ShelfFallback />}>
      <WriterRoute params={params} />
    </Suspense>
  );
}

async function WriterRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!writerById(id)) notFound();
  return <WriterView writerId={id} />;
}
