type Scores = {
  duration_score: number | null;
  projection_score: number | null;
  sillage_score: number | null;
  price_quality_score: number | null;
};

const DURATION_LABELS = ["", "Muy corta", "Corta", "Moderada", "Larga", "Excepcional"];
const PROJECTION_LABELS = ["", "Íntima", "Discreta", "Moderada", "Fuerte", "Bestial"];
const SILLAGE_LABELS = ["", "Discreta", "Suave", "Moderada", "Fuerte", "Legendaria"];
const PRICE_LABELS = ["", "Pobre", "Aceptable", "Buena", "Muy buena", "Excelente"];

const OPTS_DURATION = ["Corta", "Moderada", "Larga", "Excepcional"];
const OPTS_PROJECTION = ["Íntima", "Moderada", "Fuerte", "Bestial"];
const OPTS_SILLAGE = ["Discreta", "Moderada", "Fuerte", "Legendaria"];
const OPTS_PRICE = ["Pobre", "Aceptable", "Buena", "Excelente"];

function PerformanceBar({
  label,
  score,
  valueLabel,
  opts,
  accent = "var(--color-gold)",
}: {
  label: string;
  score: number | null;
  valueLabel: string;
  opts: string[];
  accent?: string;
}) {
  const pct = score ? (score / 5) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50">{label}</span>
        <span className="text-sm font-semibold text-[var(--color-ink)]">{valueLabel}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-ink)]/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}99, ${accent})`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        {opts.map((o) => (
          <span key={o} className="text-[10px] text-[var(--color-ink)]/30">{o}</span>
        ))}
      </div>
    </div>
  );
}

export default function PerfumePerformanceBars({
  scores,
  isEditorial = true,
}: {
  scores: Scores | null;
  isEditorial?: boolean;
}) {
  if (!scores) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-2 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Rendimiento
      </h2>
      {isEditorial && (
        <p className="text-xs text-[var(--color-ink)]/40 mb-5">
          Datos editoriales · Se actualizarán con votos reales cuando haya suficientes opiniones.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PerformanceBar
          label="Duración"
          score={scores.duration_score}
          valueLabel={DURATION_LABELS[scores.duration_score ?? 0]}
          opts={OPTS_DURATION}
          accent="var(--color-amber)"
        />
        <PerformanceBar
          label="Proyección"
          score={scores.projection_score}
          valueLabel={PROJECTION_LABELS[scores.projection_score ?? 0]}
          opts={OPTS_PROJECTION}
          accent="var(--color-amber)"
        />
        <PerformanceBar
          label="Estela"
          score={scores.sillage_score}
          valueLabel={SILLAGE_LABELS[scores.sillage_score ?? 0]}
          opts={OPTS_SILLAGE}
          accent="var(--color-amber)"
        />
        <PerformanceBar
          label="Precio / Calidad"
          score={scores.price_quality_score}
          valueLabel={PRICE_LABELS[scores.price_quality_score ?? 0]}
          opts={OPTS_PRICE}
          accent="var(--color-celeste)"
        />
      </div>
    </section>
  );
}
