type Accord = {
  accord: { name: string; slug: string; color_hex: string | null };
  intensity?: number;
};

const DEFAULT_COLORS = [
  "#C97A3C", "#7C5C3A", "#B7935F", "#8B4513",
  "#D4A96A", "#4E7C8C", "#3D4A3A", "#A85C36",
];

export default function PerfumeAccords({ accords }: { accords: Accord[] }) {
  if (!accords || accords.length === 0) return null;

  // Intensidades por defecto decrecientes si no vienen del backend
  const intensities = [88, 75, 70, 65, 58, 50, 44, 38];

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Acordes principales
      </h2>
      <div className="flex flex-col gap-3">
        {accords.map((a, i) => {
          const color = a.accord.color_hex || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = a.intensity ?? intensities[i] ?? 40;
          return (
            <div key={a.accord.slug} className="grid items-center gap-3" style={{ gridTemplateColumns: "130px 1fr 36px" }}>
              <span className="text-sm font-medium capitalize">{a.accord.name}</span>
              <div className="h-2.5 rounded-full bg-[var(--color-ink)]/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }}
                />
              </div>
              <span className="text-xs text-[var(--color-ink)]/50 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
