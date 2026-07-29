type Attribute = { attribute: string; value: number };

const OCCASIONS = [
  { key: "noche",   label: "Noche / salidas" },
  { key: "cita",    label: "Cita romántica" },
  { key: "regalo",  label: "Para regalo" },
  { key: "formal",  label: "Formal" },
  { key: "casual",  label: "Casual" },
  { key: "diario",  label: "Uso diario" },
  { key: "oficina", label: "Oficina" },
];

export default function PerfumeOccasionBars({
  attributes,
  isEditorial = true,
}: {
  attributes: Attribute[];
  isEditorial?: boolean;
}) {
  if (!attributes || attributes.length === 0) return null;
  const map = Object.fromEntries(attributes.map((a) => [a.attribute, a.value]));

  const sorted = OCCASIONS
    .map((o) => ({ ...o, val: map[o.key] ?? 0 }))
    .sort((a, b) => b.val - a.val);

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-xl flex-shrink-0">Ocasiones de uso</h2>
        {isEditorial ? (
          <span className="text-[10px] bg-[var(--color-ink)]/8 text-[var(--color-ink)]/50 rounded px-2 py-0.5">Editorial</span>
        ) : (
          <span className="text-[10px] bg-[var(--color-amber)]/15 text-[var(--color-amber)] rounded px-2 py-0.5">Votos de la comunidad</span>
        )}
        <span className="flex-1 h-px bg-[var(--color-line)]" />
      </div>
      <div className="flex flex-col gap-3">
        {sorted.map(({ key, label, val }) => (
          <div key={key} className="grid items-center gap-3" style={{ gridTemplateColumns: "130px 1fr 36px" }}>
            <span className="text-sm text-[var(--color-ink)]">{label}</span>
            <div className="h-2 rounded-full bg-[var(--color-ink)]/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${val}%`,
                  background: "linear-gradient(90deg, var(--color-celeste), #2d6070)",
                }}
              />
            </div>
            <span className="text-xs text-[var(--color-ink)]/50 text-right">{val}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
