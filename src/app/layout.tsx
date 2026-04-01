import type { Metadata, Viewport } from "next";
import { jakarta, mono } from "@/lib/fonts";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SholatKu — Teman Ibadah Harian",
  description:
    "Aplikasi ibadah harian untuk Muslim Indonesia. Jadwal sholat akurat, arah kiblat, Al-Quran, doa & dzikir, tasbih digital, kalkulator zakat, dan kalender Hijriah.",
  keywords: [
    "sholat",
    "jadwal sholat",
    "kiblat",
    "quran",
    "doa",
    "dzikir",
    "tasbih",
    "zakat",
    "muslim indonesia",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SholatKu",
  },
};

export const viewport: Viewport = {
  themeColor: "#111318",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col islamic-pattern-bg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
