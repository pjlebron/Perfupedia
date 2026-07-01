type Attribute = { attribute: string; value: number };

const SEASONS = [
  { key: "primavera", label: "Primavera", icon: "🌸", color: "#7a9e60" },
  { key: "verano",    label: "Verano",    icon: "☀️", color: "#d4a020" },
  { key: "otono",     label: "Otoño",     icon: "🍂", color: "#C97A3C" },
  { key: "invierno",  label: "Invierno",  icon: "❄️", color: "#4E7C8C" },
];

export default function PerfumeSeasonBars({ attributes }: { attributes: Attribute[] }) {
  if (!attributes || attributes.length === 0) return null;
  const map = Object.fromEntries(attributes.map((a) => [a.attribute, a.value]));

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Estaciones recomendadas
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SEASONS.map(({ key, label, icon, color }) => {
          const val = map[key] ?? 0;
          return (
            <div
              key={key}
              className="border border-[var(--color-line)] rounded-xl p-4 text-center"
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50 mb-2">{label}</div>
              <div className="h-1.5 rounded-full bg-[var(--color-ink)]/[0.06] overflow-hidden mb-2">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${val}%`, background: color }}
                />
              </div>
              <div className="text-sm font-semibold" style={{ color }}>{val}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
