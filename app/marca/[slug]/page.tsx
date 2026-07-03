export const revalidate = 0;

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import BannerSlot from "@/components/BannerSlot";
import PerfumeCard from "@/components/PerfumeCard";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const TYPE_LABEL: Record<string, string> = {
  nacional: "Marca nacional argentina",
  arabe: "Marca árabe",
  disenador: "Diseñador internacional",
  independiente: "Marca independiente",
  importador: "Importador",
  otra: "Otra",
};

const TYPE_COLOR: Record<string, string> = {
  nacional:      "var(--color-celeste)",
  arabe:         "var(--color-arabe-green)",
  disenador:     "var(--color-gold)",
  independiente: "var(--color-amber)",
  importador:    "var(--color-copper)",
  otra:          "var(--color-ink)",
};

async function getBrandData(slug: string) {
  const { data: brand } = await supabase
    .from("brands").select("*").eq("slug", slug).eq("status", "published").single();
  if (!brand) return null;

  const { data: perfumes } = await supabase
    .from("perfumes")
    .select(`name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, main_image_path, brand:brands(name,slug), olfactive_family:olfactive_families(name)`)
    .eq("brand_id", brand.id).eq("status", "published")
    .order("editorial_score", { ascending: false });

  return { brand, perfumes: (perfumes ?? []) as unknown as Parameters<typeof PerfumeCard>[0]["perfume"][] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBrandData(slug);
  if (!data) return {};
  const { brand } = data;
  const title = brand.meta_title || `${brand.name} — Perfumes en Argentina | Perfupedia`;
  const description = brand.meta_description || brand.description?.slice(0, 155);
  return { title, description };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBrandData(slug);
  if (!data) notFound();

  const { brand, perfumes } = data;
  const accent = TYPE_COLOR[brand.type] ?? "var(--color-ink)";

  // Stats calculados
  const withScore = perfumes.filter((p) => (p as unknown as { editorial_score: number }).editorial_score);
  const avgScore = withScore.length
    ? (withScore.reduce((s, p) => s + ((p as unknown as { editorial_score: number }).editorial_score ?? 0), 0) / withScore.length).toFixed(1)
    : null;

  const hombres = perfumes.filter((p) => p.gender === "hombre");
  const mujeres = perfumes.filter((p) => p.gender === "mujer");
  const unisex  = perfumes.filter((p) => p.gender === "unisex");

  // Top 3 mejor puntuados
  const top3 = [...perfumes]
    .sort((a, b) => ((b as unknown as { editorial_score: number }).editorial_score ?? 0) - ((a as unknown as { editorial_score: number }).editorial_score ?? 0))
    .slice(0, 3);

  const logoSrc = (brand as unknown as { main_image_path: string | null }).main_image_path && SUPABASE_URL
    ? `${SUPABASE_URL}/storage/v1/object/public/marcas/${(brand as unknown as { main_image_path: string }).main_image_path}`
    : null;

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Perfumes", href: "/perfumes" },
            { label: brand.name },
          ]} />

          {/* HERO */}
          <section className="mt-8 pb-8 border-b border-[var(--color-line)]">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">

              {/* Logo */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                {logoSrc
                  ? <Image src={logoSrc} alt={brand.name} fill className="object-contain p-3" />
                  : <span className="text-4xl">🏷️</span>
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-block text-[11px] uppercase tracking-widest font-semibold mb-3 px-3 py-1 rounded-full"
                  style={{ color: accent, background: `${accent}18` }}>
                  {TYPE_LABEL[brand.type] ?? brand.type}{brand.country ? ` · ${brand.country}` : ""}
                </div>

                <h1 className="font-display text-4xl sm:text-5xl leading-tight">{brand.name}</h1>

                {brand.general_style && (
                  <p className="mt-2 text-base italic font-display text-[var(--color-ink)]/60">{brand.general_style}</p>
                )}

                {brand.description && (
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink)]/80 max-w-2xl">{brand.description}</p>
                )}

                {/* Stats rápidos */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {perfumes.length > 0 && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xl font-display font-bold text-[var(--color-amber)]">{perfumes.length}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-0.5">Perfumes</div>
                    </div>
                  )}
                  {avgScore && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xl font-display font-bold text-[var(--color-amber)]">{avgScore}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-0.5">Score promedio</div>
                    </div>
                  )}
                  {brand.price_range && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-center">
                      <div className="text-sm font-medium capitalize">{brand.price_range}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-0.5">Precio</div>
                    </div>
                  )}
                  {hombres.length > 0 && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xl font-display font-bold">♂ {hombres.length}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-0.5">Hombre</div>
                    </div>
                  )}
                  {mujeres.length > 0 && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xl font-display font-bold">♀ {mujeres.length}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-0.5">Mujer</div>
                    </div>
                  )}
                  {unisex.length > 0 && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-center">
                      <div className="text-xl font-display font-bold">⚥ {unisex.length}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-0.5">Unisex</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <BannerSlot label="brand-top" />

          {/* TOP 3 */}
          {top3.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
                🏆 Los mejores de {brand.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {top3.map((p, i) => (
                  <Link key={p.slug} href={`/perfume/${p.slug}`}
                    className="flex items-center gap-3 border border-[var(--color-line)] rounded-xl p-4 hover:border-[var(--color-amber)] hover:shadow-sm transition-all group bg-white">
                    <span className="font-display text-3xl text-[var(--color-amber)]/30 w-8 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate group-hover:text-[var(--color-amber)] transition-colors">{p.name}</div>
                      <div className="text-xs text-[var(--color-ink)]/50 mt-0.5 capitalize">{p.gender} · {p.concentration?.toUpperCase()}</div>
                    </div>
                    {(p as unknown as { editorial_score: number }).editorial_score && (
                      <span className="ml-auto font-display text-sm text-[var(--color-amber)] flex-shrink-0">
                        {(p as unknown as { editorial_score: number }).editorial_score}/10
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* TODOS LOS PERFUMES */}
          {perfumes.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
                Todos los perfumes de {brand.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {perfumes.map((p) => <PerfumeCard key={p.slug} perfume={p} />)}
              </div>
            </section>
          ) : (
            <section className="mt-10">
              <div className="border border-dashed border-[var(--color-line)] rounded-2xl p-12 text-center text-[var(--color-ink)]/40">
                <div className="text-4xl mb-3">🧴</div>
                <p className="text-sm">Las fichas de {brand.name} están en preparación.</p>
              </div>
            </section>
          )}

          <BannerSlot label="brand-bottom" />

          <p className="mt-8 text-xs text-[var(--color-ink)]/40 border-t border-[var(--color-line)] pt-6">
            {brand.name} es marca registrada de su respectivo titular. Este sitio no tiene relación comercial con la marca. Las fichas y reseñas son contenido editorial independiente.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
