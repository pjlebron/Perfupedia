export const revalidate = 3600; // Caché de 1 hora — se actualiza automáticamente

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import BannerSlot from "@/components/BannerSlot";
import PerfumeCard from "@/components/PerfumeCard";
import { supabase } from "@/lib/supabase";

const BRAND_TYPE_LABEL: Record<string, string> = {
  nacional: "Marca nacional argentina",
  arabe: "Marca árabe",
  disenador: "Diseñador internacional",
  independiente: "Marca independiente",
  importador: "Importador",
  otra: "Otra",
};

const BRAND_TYPE_COLOR: Record<string, string> = {
  nacional:      "var(--color-celeste)",
  arabe:         "var(--color-arabe-green)",
  disenador:     "var(--color-gold)",
  independiente: "var(--color-amber)",
  importador:    "var(--color-copper)",
  otra:          "var(--color-ink)",
};

async function getBrandData(slug: string) {
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!brand) return null;

  const { data: perfumes } = await supabase
    .from("perfumes")
    .select(`name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, main_image_path, brand:brands(name,slug), olfactive_family:olfactive_families(name)`)
    .eq("brand_id", brand.id)
    .eq("status", "published")
    .order("editorial_score", { ascending: false })
    .limit(12);

  return {
    brand,
    perfumes: (perfumes ?? []) as unknown as Parameters<typeof PerfumeCard>[0]["perfume"][],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBrandData(slug);
  if (!data) return {};
  const { brand } = data;
  const title = brand.meta_title || `${brand.name} | Perfumes en Argentina · Blog de Perfumes Argentina`;
  const description = brand.meta_description || brand.description?.slice(0, 155);
  return { title, description, openGraph: { title, description: description ?? undefined } };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBrandData(slug);
  if (!data) notFound();

  const { brand, perfumes } = data;
  const accent = BRAND_TYPE_COLOR[brand.type] ?? "var(--color-ink)";
  const typeLabel = BRAND_TYPE_LABEL[brand.type] ?? brand.type;

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

          {/* HERO DE MARCA */}
          <section className="mt-8 pb-8 border-b border-[var(--color-line)]">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">

              {/* Logo placeholder */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] flex items-center justify-center flex-shrink-0 text-3xl">
                🏷️
              </div>

              <div className="flex-1">
                {/* Tipo de marca */}
                <div
                  className="inline-block text-[11px] uppercase tracking-widest font-semibold mb-3 px-3 py-1 rounded-full"
                  style={{ color: accent, background: `${accent}15` }}
                >
                  {typeLabel} {brand.country ? `· ${brand.country}` : ""}
                </div>

                <h1 className="font-display text-4xl sm:text-5xl leading-tight">
                  {brand.name}
                </h1>

                {brand.general_style && (
                  <p className="mt-2 text-base italic font-display text-[var(--color-ink)]/60">
                    {brand.general_style}
                  </p>
                )}

                {brand.description && (
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink)]/80 max-w-2xl">
                    {brand.description}
                  </p>
                )}

                {/* Datos rápidos */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {brand.price_range && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2 text-sm">
                      <span className="text-[var(--color-ink)]/45 text-xs uppercase tracking-wide block mb-0.5">Rango de precio</span>
                      <span className="font-medium">{brand.price_range}</span>
                    </div>
                  )}
                  {brand.country && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2 text-sm">
                      <span className="text-[var(--color-ink)]/45 text-xs uppercase tracking-wide block mb-0.5">País</span>
                      <span className="font-medium">{brand.country}</span>
                    </div>
                  )}
                  {perfumes.length > 0 && (
                    <div className="border border-[var(--color-line)] rounded-xl px-4 py-2 text-sm">
                      <span className="text-[var(--color-ink)]/45 text-xs uppercase tracking-wide block mb-0.5">Fichas disponibles</span>
                      <span className="font-medium">{perfumes.length} perfumes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <BannerSlot label="brand-top" />

          {/* PERFUMES DE LA MARCA */}
          {perfumes.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl mb-6 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
                Perfumes de {brand.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {perfumes.map((p) => (
                  <PerfumeCard key={p.slug} perfume={p} />
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-10">
              <div className="border border-dashed border-[var(--color-line)] rounded-2xl p-12 text-center text-[var(--color-ink)]/40">
                <div className="text-4xl mb-3">🧴</div>
                <p className="text-sm">
                  Las fichas de {brand.name} están en preparación.
                </p>
              </div>
            </section>
          )}

          <BannerSlot label="brand-bottom" />

          {/* DISCLAIMER */}
          <p className="mt-8 text-xs text-[var(--color-ink)]/40 border-t border-[var(--color-line)] pt-6">
            {brand.name} es marca registrada de su respectivo titular. Este sitio no tiene relación comercial con la marca. Las fichas y reseñas son contenido editorial independiente.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
