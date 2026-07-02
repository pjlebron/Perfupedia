export const revalidate = 3600; // Caché de 1 hora — se actualiza automáticamente

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlot from "@/components/BannerSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import PerfumeCard from "@/components/PerfumeCard";
import PerfumeFAQ from "@/components/PerfumeFAQ";
import { supabase } from "@/lib/supabase";

async function getArticle(slug: string) {
  const { data: article } = await supabase
    .from("articles")
    .select(`*, category:categories(name, slug)`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return null;

  const [relatedPerfumes, faqs] = await Promise.all([
    supabase
      .from("article_perfumes")
      .select("perfume:perfumes(name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, main_image_path, brand:brands(name,slug), olfactive_family:olfactive_families(name))")
      .eq("article_id", article.id)
      .limit(6),
    supabase
      .from("faqs")
      .select("question, answer")
      .eq("entity_type", "article")
      .eq("entity_id", article.id)
      .order("display_order"),
  ]);

  return {
    article,
    relatedPerfumes: (relatedPerfumes.data ?? []) as unknown as { perfume: Parameters<typeof PerfumeCard>[0]["perfume"] }[],
    faqs: faqs.data ?? [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);
  if (!data) return {};
  const { article } = data;

  const title       = article.meta_title || `${article.title} | Blog de Perfumes Argentina`;
  const description = article.meta_description || article.content?.slice(0, 155);
  const publishedAt = article.published_at ?? article.created_at;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: article.updated_at,
    },
  };
}

// Genera una tabla de contenidos simple a partir de H2s en el contenido
function extractHeadings(content: string): { id: string; text: string }[] {
  const regex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1];
    const id   = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
    headings.push({ id, text });
  }
  return headings;
}

// Renderiza markdown básico a HTML (sin dependencias extra)
function renderContent(content: string): string {
  return content
    .replace(/^## (.+)$/gm, (_, t) => {
      const id = t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
      return `<h2 id="${id}" class="font-display text-2xl mt-10 mb-4">${t}</h2>`;
    })
    .replace(/^### (.+)$/gm, '<h3 class="font-display text-xl mt-8 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="mb-4 space-y-1">${m}</ul>`)
    .replace(/^(?!<[hul]|$)(.+)$/gm, '<p class="mb-4 leading-relaxed text-[var(--color-ink)]/85">$1</p>')
    .replace(/\n{2,}/g, "");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArticle(slug);
  if (!data) notFound();

  const { article, relatedPerfumes, faqs } = data;
  const headings  = extractHeadings(article.content ?? "");
  const publishedAt = article.published_at
    ? new Date(article.published_at).toLocaleDateString("es-AR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  // Schema Article para SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description ?? article.content?.slice(0, 155),
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author ?? "Blog de Perfumes Argentina" },
    publisher: {
      "@type": "Organization",
      name: "Blog de Perfumes Argentina",
      url: "https://blogdeperfumesargentina.com",
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Guías y reseñas", href: "/guias" },
            ...(article.category ? [{ label: article.category.name, href: `/guias?categoria=${article.category.slug}` }] : []),
            { label: article.title },
          ]} />

          {/* CABECERA DEL ARTÍCULO */}
          <header className="mt-8 pb-8 border-b border-[var(--color-line)]">
            {article.category && (
              <Link
                href={`/guias?categoria=${article.category.slug}`}
                className="inline-block text-xs uppercase tracking-widest font-semibold text-[var(--color-amber)] mb-4 hover:underline"
              >
                {article.category.name}
              </Link>
            )}
            <h1 className="font-display text-3xl sm:text-4xl leading-[1.1]">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-ink)]/50">
              {article.author && <span>Por {article.author}</span>}
              {publishedAt && <span>{publishedAt}</span>}
              {article.updated_at && article.updated_at !== article.published_at && (
                <span className="text-xs bg-[var(--color-ink)]/[0.05] rounded px-2 py-0.5">
                  Actualizado: {new Date(article.updated_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            {/* Imagen principal */}
            {article.main_image_id && (
              <div className="mt-6 aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] overflow-hidden flex items-center justify-center text-4xl opacity-30">
                📝
              </div>
            )}
          </header>

          {/* TABLA DE CONTENIDOS */}
          {headings.length >= 3 && (
            <nav className="my-8 border border-[var(--color-line)] rounded-xl p-5">
              <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/45 font-medium mb-3">
                En este artículo
              </div>
              <ol className="flex flex-col gap-2">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="flex gap-3 text-sm hover:text-[var(--color-amber)] transition-colors group"
                    >
                      <span className="text-[var(--color-ink)]/30 font-display w-5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="group-hover:underline">{h.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <BannerSlot label="article-top" />

          {/* CONTENIDO */}
          <article
            className="mt-6 text-[15px]"
            dangerouslySetInnerHTML={{
              __html: renderContent(article.content ?? ""),
            }}
          />

          <BannerSlot label="article-mid" />

          {/* PERFUMES RELACIONADOS */}
          {relatedPerfumes.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-2xl mb-6 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
                Perfumes mencionados en este artículo
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedPerfumes.map((rp) => (
                  <PerfumeCard key={rp.perfume.slug} perfume={rp.perfume} compact />
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {faqs.length > 0 && <PerfumeFAQ faqs={faqs} />}

          <BannerSlot label="article-end" />

          {/* FOOTER DEL ARTÍCULO */}
          <div className="mt-10 pt-6 border-t border-[var(--color-line)] flex flex-wrap gap-4 justify-between items-center">
            <Link
              href="/guias"
              className="text-sm text-[var(--color-amber)] hover:underline"
            >
              ← Volver a guías y reseñas
            </Link>
            <Link
              href="/perfumes"
              className="text-sm border border-[var(--color-line)] rounded-xl px-4 py-2 hover:border-[var(--color-amber)] transition-colors"
            >
              Explorar perfumes →
            </Link>
          </div>

          <p className="mt-8 text-xs text-[var(--color-ink)]/40">
            Las marcas mencionadas pertenecen a sus respectivos dueños. Las comparaciones son referencias olfativas y no implican relación comercial con las marcas originales.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
