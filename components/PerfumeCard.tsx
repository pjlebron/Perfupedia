import Link from "next/link";

type Perfume = {
  name: string;
  slug: string;
  origin: string;
  gender: string;
  concentration: string | null;
  aroma_summary: string | null;
  price_range_ars: string | null;
  editorial_score: number | null;
  brand: { name: string; slug: string } | null;
  olfactive_family: { name: string } | null;
  main_image?: { storage_path: string; alt_text: string } | null;
};

const ORIGIN_COLOR: Record<string, string> = {
  arabe:     "var(--color-arabe-green)",
  nacional:  "var(--color-celeste)",
  disenador: "var(--color-gold)",
  importado: "var(--color-copper)",
  otro:      "var(--color-ink)",
};

const ORIGIN_LABEL: Record<string, string> = {
  arabe: "Árabe", nacional: "Nacional", disenador: "Diseñador",
  importado: "Importado", otro: "Otro",
};

export default function PerfumeCard({
  perfume,
  compact = false,
}: {
  perfume: Perfume;
  compact?: boolean;
}) {
  const accentColor = ORIGIN_COLOR[perfume.origin] ?? "var(--color-ink)";

  return (
    <Link
      href={`/perfume/${perfume.slug}`}
      className="group flex flex-col border border-[var(--color-line)] rounded-2xl overflow-hidden hover:border-[var(--color-gold)] hover:shadow-sm transition-all duration-200 bg-[var(--color-cream)]"
    >
      {/* Imagen */}
      <div className="aspect-[4/3] bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] overflow-hidden flex items-center justify-center relative">
        {perfume.main_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={perfume.main_image.storage_path}
            alt={perfume.main_image.alt_text || perfume.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <span className="text-2xl opacity-30">🧴</span>
        )}
        {/* Badge de origen */}
        <span
          className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {ORIGIN_LABEL[perfume.origin]}
        </span>
        {/* Score */}
        {perfume.editorial_score && (
          <span className="absolute top-3 right-3 font-display text-sm bg-[var(--color-cream)] rounded-lg px-2 py-1 border border-[var(--color-line)]">
            {perfume.editorial_score}
            <small className="text-[10px] text-[var(--color-ink)]/40">/10</small>
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <div
          className="text-[11px] uppercase tracking-wide font-medium mb-1"
          style={{ color: accentColor }}
        >
          {perfume.brand?.name}
        </div>
        <h3 className="font-display text-lg leading-tight mb-1 group-hover:text-[var(--color-amber)] transition-colors">
          {perfume.name}
        </h3>
        {!compact && perfume.aroma_summary && (
          <p className="text-xs text-[var(--color-ink)]/60 leading-relaxed mb-3 line-clamp-2">
            {perfume.aroma_summary}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[10px] border border-[var(--color-line)] rounded-full px-2 py-0.5 capitalize text-[var(--color-ink)]/55">
              {perfume.gender}
            </span>
            {perfume.concentration && (
              <span className="text-[10px] border border-[var(--color-line)] rounded-full px-2 py-0.5 uppercase text-[var(--color-ink)]/55">
                {perfume.concentration}
              </span>
            )}
          </div>
          {perfume.price_range_ars && (
            <span className="text-[11px] font-medium text-[var(--color-ink)]/70">
              {perfume.price_range_ars}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
