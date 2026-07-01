import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlot from "@/components/BannerSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Rankings de perfumes en Argentina | Perfupedia",
  description: "Los mejores rankings de perfumes árabes, nacionales, low cost y mid cost para Argentina. Rankings editoriales con duración, proyección y relación precio/calidad.",
};

async function getRankings() {
  const { data } = await supabase
    .from("rankings")
    .select("title, slug, description")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return data ?? [];
}

const RANKING_EXAMPLES = [
  { emoji: "🌙", label: "Mejores perfumes árabes para hombre" },
  { emoji: "🌸", label: "Mejores perfumes árabes para mujer" },
  { emoji: "🇦🇷", label: "Mejores perfumes nacionales" },
  { emoji: "💰", label: "Perfumes low cost con mejor duración" },
  { emoji: "☀️", label: "Mejores perfumes para verano" },
  { emoji: "❄️", label: "Mejores perfumes para invierno" },
];

export default async function RankingsPage() {
  const rankings = await getRankings();

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Rankings" },
          ]} />

          <div className="mt-6 mb-8">
            <h1 className="font-display text-4xl sm:text-5xl">Rankings</h1>
            <p className="mt-3 text-base text-[var(--color-ink)]/65 max-w-xl">
              Selecciones editoriales de los mejores perfumes por categoría, estación, ocasión y presupuesto para el mercado argentino.
            </p>
          </div>

          <BannerSlot label="rankings-top" />

          {rankings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {rankings.map((r) => (
                <Link
                  key={r.slug}
                  href={`/rankings/${r.slug}`}
                  className="border border-[var(--color-line)] rounded-2xl p-6 hover:border-[var(--color-gold)] hover:shadow-sm transition-all group"
                >
                  <h2 className="font-display text-xl mb-2 group-hover:text-[var(--color-amber)] transition-colors">
                    {r.title}
                  </h2>
                  {r.description && (
                    <p className="text-sm text-[var(--color-ink)]/60 line-clamp-2">
                      {r.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-[var(--color-ink)]/50 mb-8">
                Los rankings editoriales están en preparación. Próximamente vas a encontrar aquí:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RANKING_EXAMPLES.map((r) => (
                  <div
                    key={r.label}
                    className="border border-dashed border-[var(--color-line)] rounded-2xl p-5 flex items-center gap-4 text-[var(--color-ink)]/40"
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-sm">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <BannerSlot label="rankings-bottom" />
        </div>
      </main>
      <Footer />
    </>
  );
}
