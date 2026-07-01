import Link from "next/link";

type Similar = {
  similar_perfume: {
    name: string;
    slug: string;
    brand: { name: string } | null;
    olfactive_family: { name: string } | null;
  };
  note: string | null;
};

export default function PerfumeSimilarList({ similars }: { similars: Similar[] }) {
  if (!similars || similars.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-2 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Puede gustarte si buscás algo en la línea de...
      </h2>
      <p className="text-sm text-[var(--color-ink)]/55 mb-5">
        Referencias olfativas, no afiliaciones comerciales.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {similars.map((s, i) => (
          <Link
            key={i}
            href={`/perfume/${s.similar_perfume.slug}`}
            className="border border-[var(--color-line)] rounded-xl p-4 hover:border-[var(--color-gold)] transition-colors"
          >
            <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink)]/45 mb-1">
              {s.similar_perfume.brand?.name}
            </div>
            <div className="font-semibold text-sm mb-1">{s.similar_perfume.name}</div>
            {(s.note || s.similar_perfume.olfactive_family?.name) && (
              <div className="text-xs text-[var(--color-amber)]">
                {s.note || s.similar_perfume.olfactive_family?.name}
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-4 p-3 bg-[var(--color-ink)]/[0.03] border-l-2 border-[var(--color-line)] rounded text-xs text-[var(--color-ink)]/50">
        ⚠️ Las comparaciones son referencias olfativas. No indican relación comercial ni filiación con las marcas mencionadas.
      </div>
    </section>
  );
}
