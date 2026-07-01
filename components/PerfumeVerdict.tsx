type PerfumeData = {
  verdict: string | null;
  editorial_score: number | null;
  quick_opinion: string | null;
  recommended_occasion: string | null;
  recommended_season: string | null;
  price_quality_ratio: string | null;
};

export default function PerfumeVerdict({ perfume, accent }: { perfume: PerfumeData; accent: string }) {
  if (!perfume.verdict && !perfume.quick_opinion) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Veredicto editorial
      </h2>
      <div
        className="rounded-xl p-6 border-l-4"
        style={{ borderColor: accent, background: `${accent}08` }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 font-medium">
            Puntuación editorial
          </span>
          {perfume.editorial_score && (
            <span className="font-display text-3xl">
              {perfume.editorial_score}
              <small className="text-sm text-[var(--color-ink)]/40">/10</small>
            </span>
          )}
        </div>

        {perfume.verdict && (
          <p className="text-[15px] leading-relaxed text-[var(--color-ink)]/85 mb-5">
            {perfume.verdict}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {perfume.quick_opinion && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink)]/45 mb-1">
                Opinión rápida
              </div>
              <p className="text-sm text-[var(--color-ink)]/80">{perfume.quick_opinion}</p>
            </div>
          )}
          {perfume.recommended_occasion && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink)]/45 mb-1">
                Cuándo usarlo
              </div>
              <p className="text-sm text-[var(--color-ink)]/80">{perfume.recommended_occasion}</p>
            </div>
          )}
          {perfume.recommended_season && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink)]/45 mb-1">
                Estación ideal
              </div>
              <p className="text-sm text-[var(--color-ink)]/80">{perfume.recommended_season}</p>
            </div>
          )}
          {perfume.price_quality_ratio && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink)]/45 mb-1">
                Precio / Calidad
              </div>
              <p className="text-sm text-[var(--color-ink)]/80">{perfume.price_quality_ratio}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
