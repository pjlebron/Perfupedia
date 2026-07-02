export const revalidate = 3600;

import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Perfupedia | La guía argentina de perfumes",
  description:
    "Perfupedia: la guía argentina de perfumes nacionales, árabes y accesibles. Fichas, rankings, reseñas y guías de compra.",
  verification: {
    google: "WcevrURuOVJ8ldEbOUWYh6jh3RTEuDSd7A7jaqzAEpQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <GoogleTagManager gtmId="G-30695V86P1" />
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
