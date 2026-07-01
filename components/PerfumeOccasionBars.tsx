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

export default function PerfumeOccasionBars({ attributes }: { attributes: Attribute[] }) {
  if (!attributes || attributes.length === 0) return null;
  const map = Object.fromEntries(attributes.map((a) => [a.attribute, a.value]));

  const sorted = OCCASIONS
    .map((o) => ({ ...o, val: map[o.key] ?? 0 }))
    .sort((a, b) => b.val - a.val);

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Ocasiones de uso
      </h2>
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
