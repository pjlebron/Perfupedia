"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Filter = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

const FILTERS: Filter[] = [
  {
    key: "origen",
    label: "Origen",
    options: [
      { value: "arabe",     label: "Árabe" },
      { value: "nacional",  label: "Nacional" },
      { value: "disenador", label: "Diseñador" },
      { value: "importado", label: "Importado" },
    ],
  },
  {
    key: "genero",
    label: "Género",
    options: [
      { value: "hombre", label: "Hombre" },
      { value: "mujer",  label: "Mujer" },
      { value: "unisex", label: "Unisex" },
    ],
  },
  {
    key: "concentracion",
    label: "Concentración",
    options: [
      { value: "edp",        label: "EDP" },
      { value: "edt",        label: "EDT" },
      { value: "extrait",    label: "Extrait" },
      { value: "body_splash",label: "Body Splash" },
    ],
  },
];

const ORDER_OPTIONS = [
  { value: "recientes",  label: "Más recientes" },
  { value: "puntuacion", label: "Mejor puntuación" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
];

export default function PerfumeFilters({ lockedOrigin }: { lockedOrigin?: string }) {
  const router   = useRouter();
  const params   = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (next.get(key) === value) {
        next.delete(key);
      } else {
        next.set(key, value);
        next.delete("pagina");
      }
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [params, router]
  );

  const clearAll = () => {
    router.push("?", { scroll: false });
  };

  const activeCount = FILTERS.filter((f) => params.has(f.key)).length + (params.has("orden") ? 1 : 0);

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Filtros</span>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[var(--color-amber)] hover:underline"
          >
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      {/* Orden */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/45 mb-2 font-medium">
          Ordenar por
        </div>
        <div className="flex flex-col gap-1.5">
          {ORDER_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => update("orden", o.value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                params.get("orden") === o.value
                  ? "bg-[var(--color-amber)]/15 text-[var(--color-amber)] font-medium"
                  : "hover:bg-[var(--color-ink)]/[0.04]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros dinámicos */}
      {FILTERS.filter((f) => !(lockedOrigin && f.key === "origen")).map((filter) => (
        <div key={filter.key} className="mb-6">
          <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/45 mb-2 font-medium">
            {filter.label}
          </div>
          <div className="flex flex-col gap-1.5">
            {filter.options.map((opt) => {
              const active = params.get(filter.key) === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => update(filter.key, opt.value)}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                    active
                      ? "bg-[var(--color-amber)]/15 text-[var(--color-amber)] font-medium"
                      : "hover:bg-[var(--color-ink)]/[0.04]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] ${
                      active
                        ? "border-[var(--color-amber)] bg-[var(--color-amber)] text-white"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    {active ? "✓" : ""}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
