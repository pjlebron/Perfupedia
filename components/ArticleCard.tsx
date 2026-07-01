import Link from "next/link";

type Article = {
  title: string;
  slug: string;
  published_at: string | null;
  category: { name: string } | null;
  main_image?: { storage_path: string; alt_text: string } | null;
};

export default function ArticleCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("es-AR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/guias/${article.slug}`}
      className="group flex flex-col border border-[var(--color-line)] rounded-2xl overflow-hidden hover:border-[var(--color-gold)] hover:shadow-sm transition-all duration-200 bg-[var(--color-cream)]"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] overflow-hidden flex items-center justify-center">
        {article.main_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.main_image.storage_path}
            alt={article.main_image.alt_text || article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <span className="text-3xl opacity-20">📝</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {article.category && (
          <span className="text-[11px] uppercase tracking-wide text-[var(--color-amber)] font-medium mb-2">
            {article.category.name}
          </span>
        )}
        <h3 className="font-display text-base leading-snug group-hover:text-[var(--color-amber)] transition-colors">
          {article.title}
        </h3>
        {date && (
          <span className="mt-3 text-xs text-[var(--color-ink)]/45">{date}</span>
        )}
      </div>
    </Link>
  );
}
