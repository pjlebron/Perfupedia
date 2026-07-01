import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlot from "@/components/BannerSlot";
import PerfumeCard from "@/components/PerfumeCard";
import ArticleCard from "@/components/ArticleCard";
import { supabase } from "@/lib/supabase";

async function getHomeData() {
  const [perfumes, articles] = await Promise.all([
    supabase
      .from("perfumes")
      .select(`name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, brand:brands(name,slug), olfactive_family:olfactive_families(name)`)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("articles")
      .select(`title, slug, published_at, category:categories(name)`)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);
  return {
    perfumes: (perfumes.data ?? []) as unknown as Parameters<typeof PerfumeCard>[0]["perfume"][],
    articles: (articles.data ?? []) as unknown as Parameters<typeof ArticleCard>[0]["article"][],
  };
}

const CATEGORIES = [
  { label: "Perfumes Árabes",     href: "/perfumes-arabes",    emoji: "🌙", desc: "Lattafa, Armaf, Afnan y más", color: "var(--color-arabe-green)" },
  { label: "Perfumes Nacionales", href: "/perfumes-nacionales", emoji: "🇦🇷", desc: "Ona, Sarkany, Bensimon y más",  color: "var(--color-celeste)" },
  { label: "Low Cost",            href: "/perfumes-low-cost",   emoji: "💰", desc: "Los mejores sin gastar de más", color: "var(--color-amber)" },
  { label: "Mid Cost",            href: "/perfumes-mid-cost",   emoji: "✨", desc: "Calidad premium a buen precio", color: "var(--color-gold)" },
];

export default async function HomePage() {
  const { perfumes, articles } = await getHomeData();

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[var(--color-line)]">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-28 text-center">
            <p className="text-xs uppercase tracking-[.2em] text-[var(--color-amber)] font-medium mb-5">
              La guía argentina de perfumes
            </p>
            <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] max-w-3xl mx-auto">
              Descubrí perfumes nacionales, árabes y accesibles
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--color-ink)]/65 max-w-xl mx-auto leading-relaxed">
              Fichas, reseñas, rankings y guías de compra pensadas para el mercado argentino.
              Encontrá tu próximo perfume según aroma, duración, ocasión y presupuesto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/perfumes"
                className="rounded-xl px-6 py-3 text-sm font-medium text-white"
                style={{ background: "var(--color-arabe-green)" }}
              >
                Explorar perfumes
              </Link>
              <Link
                href="/rankings"
                className="rounded-xl px-6 py-3 text-sm font-medium border border-[var(--color-line)] hover:border-[var(--color-amber)] transition-colors"
              >
                Ver rankings
              </Link>
            </div>
          </div>
          {/* Decoración de fondo sutil */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(183,147,95,0.08) 0%, transparent 70%)",
            }}
          />
        </section>

        {/* CATEGORÍAS */}
        <section className="mx-auto max-w-5xl px-5 sm:px-8 py-14">
          <h2 className="font-display text-2xl mb-8 text-center">¿Qué estás buscando?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group border border-[var(--color-line)] rounded-2xl p-5 text-center hover:border-[var(--color-gold)] hover:shadow-sm transition-all duration-200"
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <div
                  className="font-display text-base mb-1 group-hover:underline"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </div>
                <div className="text-xs text-[var(--color-ink)]/55 leading-snug">{cat.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <BannerSlot label="home-mid" />

        {/* PERFUMES RECIENTES */}
        <section className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl">Últimas fichas</h2>
            <Link
              href="/perfumes"
              className="text-sm text-[var(--color-amber)] hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          {perfumes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {perfumes.map((p) => (
                <PerfumeCard key={p.slug} perfume={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[var(--color-line)] rounded-2xl text-[var(--color-ink)]/40">
              <div className="text-4xl mb-3">🧴</div>
              <p className="text-sm">Las primeras fichas están en camino.</p>
            </div>
          )}
        </section>

        {/* PROPUESTA DE VALOR */}
        <section className="border-y border-[var(--color-line)] bg-[var(--color-ink)]/[0.015] py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: "🔍", title: "Fichas completas", desc: "Duración, proyección, ocasión, notas, acordes y mucho más para cada perfume." },
                { icon: "🏆", title: "Rankings editoriales", desc: "Los mejores perfumes árabes, nacionales y low cost según aroma, precio y rendimiento." },
                { icon: "🇦🇷", title: "Enfocado en Argentina", desc: "Precios en pesos, disponibilidad local y alternativas económicas accesibles." },
              ].map((item) => (
                <div key={item.title}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-display text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-ink)]/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BannerSlot label="home-bottom" />

        {/* ARTÍCULOS */}
        {articles.length > 0 && (
          <section className="mx-auto max-w-5xl px-5 sm:px-8 py-14">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl">Guías y reseñas</h2>
              <Link href="/guias" className="text-sm text-[var(--color-amber)] hover:underline">
                Ver todas →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        <section className="border-t border-[var(--color-line)] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
            <h2 className="font-display text-3xl mb-4">¿No encontrás lo que buscás?</h2>
            <p className="text-[var(--color-ink)]/60 mb-7 max-w-md mx-auto">
              Usá el buscador para encontrar perfumes por nombre, marca, nota o familia olfativa.
            </p>
            <Link
              href="/perfumes"
              className="inline-flex rounded-xl px-7 py-3 text-sm font-medium text-white"
              style={{ background: "var(--color-amber)" }}
            >
              Ir al buscador completo →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
