import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const gothic = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-gothic",
  display: "swap",
  preload: false,
});

const mincho = Shippori_Mincho({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mincho",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "俺のライナーノーツ",
    template: "%s — 俺のライナーノーツ",
  },
  description:
    "既存のレコードとCDに、自分のライナーノーツを署名して残す棚。いいねは数える。帯は編集部だけが付ける。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`${gothic.variable} ${mincho.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-gothic">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster theme="light" position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
