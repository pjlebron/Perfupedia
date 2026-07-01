import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perfupedia | La guía argentina de perfumes",
  description:
    "Perfupedia: la guía argentina de perfumes nacionales, árabes y accesibles. Fichas, rankings, reseñas y guías de compra.",
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
