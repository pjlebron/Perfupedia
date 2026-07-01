import Link from "next/link";

type NoteEntry = {
  position: string;
  note: { name: string; slug: string };
};

const POSITIONS = [
  { key: "salida",  label: "Notas de salida",  icon: "🌿" },
  { key: "corazon", label: "Notas de corazón", icon: "🌸" },
  { key: "fondo",   label: "Notas de fondo",   icon: "🪵" },
];

export default function PerfumeNotesPyramid({ notes }: { notes: NoteEntry[] }) {
  if (!notes || notes.length === 0) return null;

  const byPosition: Record<string, { name: string; slug: string }[]> = {};
  for (const n of notes) {
    if (!byPosition[n.position]) byPosition[n.position] = [];
    byPosition[n.position].push(n.note);
  }

  const hasAny = POSITIONS.some((p) => byPosition[p.key]?.length);
  if (!hasAny) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Pirámide olfativa
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {POSITIONS.map(({ key, label, icon }) =>
          byPosition[key]?.length ? (
            <div key={key} className="border border-[var(--color-line)] rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-3 font-semibold">
                {icon} {label}
              </div>
              <div className="flex flex-wrap gap-2">
                {byPosition[key].map((n) => (
                  <Link
                    key={n.slug}
                    href={`/notas/${n.slug}`}
                    className="inline-flex border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/[0.08] rounded-full px-3 py-1 text-sm hover:bg-[var(--color-gold)]/20 hover:border-[var(--color-gold)] transition-colors"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
