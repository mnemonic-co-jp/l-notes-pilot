import type { Metadata } from "next";
import { AnthologyView } from "@/components/anthology-view";

export const metadata: Metadata = { title: "選集" };

export default function Page() {
  return <AnthologyView />;
}
