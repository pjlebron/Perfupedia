export const revalidate = 3600; // Caché de 1 hora — se actualiza automáticamente

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlot from "@/components/BannerSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import PerfumeCard from "@/components/PerfumeCard";
import PerfumeFAQ from "@/components/PerfumeFAQ";
import { supabase } from "@/lib/supabase";

async function getRanking(slug: string) {
  const { data: ranking } = await supabase
    .from("rankings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!ranking) return null;

  const { data: items } = await supabase
    .from("ranking_items")
    .select(`position, short_comment, perfume:perfumes(name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, main_image_path, brand:brands(name,slug), olfactive_family:olfactive_families(name))`)
    .eq("ranking_id", ranking.id)
    .order("position", { ascending: true });

  const { data: faqs } = await supabase
    .from("faqs")
    .select("question, answer")
    .eq("entity_type", "ranking")
    .eq("entity_id", ranking.id)
    .order("display_order");

  return {
    ranking,
    items: (items ?? []) as unknown as {
      position: number;
      short_comment: string | null;
      perfume: Parameters<typeof PerfumeCard>[0]["perfume"];
    }[],
    faqs: faqs ?? [],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRanking(slug);
  if (!data) return {};
  const { ranking } = data;
  const title = ranking.meta_title || `${ranking.title} | Perfupedia`;
  const description = ranking.meta_description || ranking.description;
  return { title, description };
}

export default async function RankingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getRanking(slug);
  if (!data) notFound();

  const { ranking, items, faqs } = data;

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Rankings", href: "/rankings" },
            { label: ranking.title },
          ]} />

          <div className="mt-8 pb-8 border-b border-[var(--color-line)]">
            <h1 className="font-display text-3xl sm:text-4xl">{ranking.title}</h1>
            {ranking.description && (
              <p className="mt-3 text-base text-[var(--color-ink)]/65 max-w-xl">{ranking.description}</p>
            )}
          </div>

          {ranking.editorial_text && (
            <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-ink)]/80">
              {ranking.editorial_text}
            </p>
          )}

          <BannerSlot label="ranking-top" />

          {items.length > 0 ? (
            <div className="mt-8 flex flex-col gap-6">
              {items.map(({ position, short_comment, perfume }) => (
                <div key={position} className="flex gap-4 sm:gap-6 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[var(--color-line)] flex items-center justify-center font-display text-lg text-[var(--color-ink)]/50">
                    {position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <PerfumeCard perfume={perfume} />
                    {short_comment && (
                      <p className="mt-2 text-sm text-[var(--color-ink)]/60 italic px-1">
                        {short_comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-[var(--color-line)] rounded-2xl py-16 text-center text-[var(--color-ink)]/40">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-sm">Este ranking está en preparación.</p>
            </div>
          )}

          {faqs.length > 0 && (
            <div className="mt-12">
              <PerfumeFAQ faqs={faqs} />
            </div>
          )}

          <BannerSlot label="ranking-bottom" />
        </div>
      </main>
      <Footer />
    </>
  );
}
