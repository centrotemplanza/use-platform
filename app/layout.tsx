import "./globals.css";
import type { Metadata } from "next";
import MarketingNavbar from "@/components/marketing/navbar";

export const metadata: Metadata = {
  title: "Unified Self Evolution",
  description: "Structured platform for growth, learning, practice, and progression",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900">
        <MarketingNavbar />
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
