// Muestra estaciones/momentos del día con barras de porcentaje
// Por ahora usa datos editoriales; cuando haya votos usa datos reales
type DistributionItem = {
  label: string;
  icon: string;
  pct: number;    // 0-100
  active: boolean;
};

function DistributionBar({ item }: { item: DistributionItem }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-7 text-center flex-shrink-0">{item.icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm ${item.active ? "font-medium text-[var(--color-ink)]" : "text-[var(--color-ink)]/50"}`}>
            {item.label}
          </span>
          <span className="text-xs text-[var(--color-ink)]/50">{item.pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-ink)]/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${item.pct}%`,
              background: item.pct > 40
                ? "var(--color-amber)"
                : "var(--color-ink)",
              opacity: item.pct > 0 ? 1 : 0.15,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function SeasonDistribution({
  recommended_season,
  isEditorial,
}: {
  recommended_season: string;
  isEditorial: boolean;
}) {
  const seasons = recommended_season.toLowerCase();
  
  // Calcular porcentajes: si es editorial, las activas se reparten 100%
  const DEFS = [
    { label: "Primavera", icon: "🌸", key: "primavera" },
    { label: "Verano",    icon: "☀️", key: "verano" },
    { label: "Otoño",     icon: "🍂", key: "otoño" },
    { label: "Invierno",  icon: "❄️", key: "invierno" },
  ];

  const activeCount = DEFS.filter(d => seasons.includes(d.key) || (d.key === "otoño" && seasons.includes("otono"))).length || 1;
  const pctActive = Math.round(100 / activeCount);

  const items: DistributionItem[] = DEFS.map((d) => {
    const active = seasons.includes(d.key) || (d.key === "otoño" && seasons.includes("otono"));
    return { label: d.label, icon: d.icon, pct: active ? pctActive : 0, active };
  });

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-xl">Estaciones recomendadas</h2>
        {isEditorial && (
          <span className="text-[10px] bg-[var(--color-ink)]/8 text-[var(--color-ink)]/50 rounded px-2 py-0.5">Editorial</span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => <DistributionBar key={item.label} item={item} />)}
      </div>
    </section>
  );
}

export function TimeDistribution({
  recommended_time,
  isEditorial,
}: {
  recommended_time: string;
  isEditorial: boolean;
}) {
  const time = recommended_time.toLowerCase();

  const DEFS = [
    { label: "Mañana",           icon: "🌅", key: "mañana" },
    { label: "Tarde",            icon: "🌤️",  key: "tarde" },
    { label: "Noche",            icon: "🌙", key: "noche" },
    { label: "Cualquier momento",icon: "✨",  key: "cualquier" },
  ];

  const activeCount = DEFS.filter(d => time.includes(d.key)).length || 1;
  const pctActive = Math.round(100 / activeCount);

  const items: DistributionItem[] = DEFS.map((d) => {
    const active = time.includes(d.key);
    return { label: d.label, icon: d.icon, pct: active ? pctActive : 0, active };
  });

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-xl">Momento del día</h2>
        {isEditorial && (
          <span className="text-[10px] bg-[var(--color-ink)]/8 text-[var(--color-ink)]/50 rounded px-2 py-0.5">Editorial</span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => <DistributionBar key={item.label} item={item} />)}
      </div>
    </section>
  );
}
