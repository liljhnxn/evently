import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Evently — Find your next experience",
  description: "Lightweight, beginner-friendly on-chain event registration powered by BOT Chain.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased selection:bg-brand-purple selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

