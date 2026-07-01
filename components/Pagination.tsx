"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router  = useRouter();
  const params  = useSearchParams();

  if (totalPages <= 1) return null;

  const go = (page: number) => {
    const next = new URLSearchParams(params.toString());
    if (page === 1) next.delete("pagina");
    else next.set("pagina", String(page));
    router.push(`?${next.toString()}`, { scroll: true });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-[var(--color-line)] text-sm disabled:opacity-30 hover:border-[var(--color-amber)] transition-colors"
      >
        ← Anterior
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage
              ? "bg-[var(--color-amber)] text-white"
              : "border border-[var(--color-line)] hover:border-[var(--color-amber)]"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-[var(--color-line)] text-sm disabled:opacity-30 hover:border-[var(--color-amber)] transition-colors"
      >
        Siguiente →
      </button>
    </div>
  );
}
