import type { Metadata } from "next";
import { WritersView } from "@/components/writers-view";

export const metadata: Metadata = { title: "書き手" };

export default function Page() {
  return <WritersView />;
}
