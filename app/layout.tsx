export const revalidate = 3600; // Caché de 1 hora — se actualiza automáticamente

import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
