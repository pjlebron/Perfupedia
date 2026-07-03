"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

type Result = {
  name: string;
  slug: string;
  gender: string;
  concentration: string | null;
  main_image_path: string | null;
  brand: { name: string; slug: string } | null;
};

const GENDER_ICON: Record<string, string> = {
  hombre: "♂", mujer: "♀", unisex: "⚥",
};

export default function PerfumeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);

    // Buscar por nombre de perfume
    const { data: byName } = await supabase
      .from("perfumes")
      .select("name, slug, gender, concentration, main_image_path, brand:brands(name, slug)")
      .ilike("name", `%${q}%`)
      .eq("status", "published")
      .order("name")
      .limit(8);

    // Buscar marcas que coincidan con la búsqueda
    const { data: brands } = await supabase
      .from("brands")
      .select("id")
      .ilike("name", `%${q}%`)
      .limit(5);

    // Si hay marcas que coinciden, buscar sus perfumes
    let byBrand: Result[] = [];
    if (brands && brands.length > 0) {
      const brandIds = brands.map((b: { id: string }) => b.id);
      const { data: brandPerf } = await supabase
        .from("perfumes")
        .select("name, slug, gender, concentration, main_image_path, brand:brands(name, slug)")
        .in("brand_id", brandIds)
        .eq("status", "published")
        .order("name")
        .limit(8);
      byBrand = (brandPerf as never) ?? [];
    }

    // Combinar y deduplicar por slug
    const all = [...(byName ?? []), ...byBrand] as Result[];
    const seen = new Set<string>();
    const deduped = all.filter(r => {
      if (seen.has(r.slug)) return false;
      seen.add(r.slug);
      return true;
    }).slice(0, 8);

    setResults(deduped);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (slug: string) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    router.push(`/perfume/${slug}`);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[var(--color-ink)]/40 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar perfumes, marcas…"
          className="w-full h-11 pl-10 pr-10 rounded-xl border border-[var(--color-line)] bg-white text-sm placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-amber)]/40 focus:border-[var(--color-amber)] transition-all shadow-sm"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 text-[var(--color-ink)]/30 hover:text-[var(--color-ink)]/60 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[var(--color-line)] rounded-2xl shadow-lg z-50 overflow-hidden">
          {results.length === 0 && !loading ? (
            <div className="px-4 py-5 text-sm text-[var(--color-ink)]/40 text-center">
              No encontramos perfumes para <strong>"{query}"</strong>
            </div>
          ) : (
            <ul>
              {results.map((r) => {
                const imgSrc = r.main_image_path && SUPABASE_URL
                  ? `${SUPABASE_URL}/storage/v1/object/public/perfumes/${r.main_image_path}`
                  : null;
                return (
                  <li key={r.slug}>
                    <button
                      onClick={() => handleSelect(r.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-amber)]/5 transition-colors text-left group"
                    >
                      {/* Miniatura */}
                      <div className="w-12 h-12 rounded-lg border border-[var(--color-line)] bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] flex-shrink-0 overflow-hidden relative">
                        {imgSrc ? (
                          <Image src={imgSrc} alt={r.name} fill className="object-contain p-1" />
                        ) : (
                          <span className="flex items-center justify-center h-full text-lg opacity-20">🧴</span>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[var(--color-ink)] truncate group-hover:text-[var(--color-amber)] transition-colors">
                          {r.name}
                        </div>
                        <div className="text-xs text-[var(--color-ink)]/50 flex items-center gap-1.5 mt-0.5">
                          <span>{r.brand?.name}</span>
                          {r.concentration && (
                            <><span>·</span><span className="uppercase">{r.concentration}</span></>
                          )}
                          {r.gender && (
                            <><span>·</span><span>{GENDER_ICON[r.gender]}</span></>
                          )}
                        </div>
                      </div>
                      <span className="text-[var(--color-ink)]/20 text-xs group-hover:text-[var(--color-amber)] transition-colors">→</span>
                    </button>
                  </li>
                );
              })}
              {results.length === 8 && (
                <li className="border-t border-[var(--color-line)]">
                  <button
                    onClick={() => { router.push(`/perfumes?q=${encodeURIComponent(query)}`); setOpen(false); }}
                    className="w-full px-4 py-3 text-xs text-[var(--color-amber)] hover:bg-[var(--color-amber)]/5 transition-colors text-center"
                  >
                    Ver todos los resultados para "{query}" →
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
