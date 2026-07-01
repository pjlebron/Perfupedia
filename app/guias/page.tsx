import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlot from "@/components/BannerSlot";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Guías y reseñas de perfumes | Blog de Perfumes Argentina",
  description: "Guías de compra, reseñas, rankings y educación olfativa para el mercado argentino. Todo sobre perfumes nacionales, árabes y accesibles.",
};

const ARTICLE_TYPES = [
  { value: "",          label: "Todos" },
  { value: "review",    label: "Reviews" },
  { value: "guia",      label: "Guías de compra" },
  { value: "ranking",   label: "Rankings" },
  { value: "educacion", label: "Educación olfativa" },
];

async function getArticles(categoria?: string) {
  let query = supabase
    .from("articles")
    .select(`title, slug, published_at, category:categories(name)`)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);

  if (categoria) {
    query = query.eq("category_id",
      supabase.from("categories").select("id").eq("slug", categoria)
    );
  }

  const { data } = await query;
  return (data ?? []) as unknown as Parameters<typeof ArticleCard>[0]["article"][];
}

export default async function GuiasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp       = await searchParams;
  const catSlug  = sp.categoria as string | undefined;
  const articles = await getArticles(catSlug);

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Guías y reseñas" },
          ]} />

          <div className="mt-6 mb-8">
            <h1 className="font-display text-4xl sm:text-5xl">Guías y reseñas</h1>
            <p className="mt-3 text-base text-[var(--color-ink)]/65 max-w-xl">
              Reviews, rankings, guías de compra y educación olfativa pensadas para el mercado argentino.
            </p>
          </div>

          {/* Filtros por tipo */}
          <div className="flex flex-wrap gap-2 mb-8">
            {ARTICLE_TYPES.map((t) => {
              const isActive = (catSlug ?? "") === t.value;
              const href     = t.value ? `/guias?categoria=${t.value}` : "/guias";
              return (
                <Link
                  key={t.value}
                  href={href}
                  className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                    isActive
                      ? "bg-[var(--color-amber)] text-white border-[var(--color-amber)]"
                      : "border-[var(--color-line)] hover:border-[var(--color-amber)]"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          <BannerSlot label="blog-top" />

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[var(--color-line)] rounded-2xl py-20 text-center text-[var(--color-ink)]/40">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm">Los primeros artículos están en camino.</p>
            </div>
          )}

          <BannerSlot label="blog-bottom" />
        </div>
      </main>
      <Footer />
    </>
  );
}
