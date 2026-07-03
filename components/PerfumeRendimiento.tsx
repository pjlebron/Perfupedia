"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Scores = {
  duration_score: number | null;
  projection_score: number | null;
  sillage_score: number | null;
  price_quality_score: number | null;
};

const ITEMS = [
  { key: "duration_score",      label: "Duración",        opts: ["","Muy corta","Corta","Moderada","Larga","Excepcional"] },
  { key: "projection_score",    label: "Proyección",      opts: ["","Íntima","Discreta","Moderada","Fuerte","Bestial"] },
  { key: "sillage_score",       label: "Estela",          opts: ["","Discreta","Suave","Moderada","Fuerte","Legendaria"] },
  { key: "price_quality_score", label: "Precio / Calidad",opts: ["","Pobre","Aceptable","Buena","Muy buena","Excelente"] },
] as const;

export default function PerfumeRendimiento({ perfumeSlug }: { perfumeSlug: string }) {
  const [scores, setScores] = useState<Scores | null>(null);

  useEffect(() => {
    supabase
      .from("perfumes")
      .select("duration_score, projection_score, sillage_score, price_quality_score")
      .eq("slug", perfumeSlug)
      .single()
      .then(({ data }) => {
        if (data?.duration_score || data?.projection_score || data?.sillage_score || data?.price_quality_score) {
          setScores(data);
        }
      });
  }, [perfumeSlug]);

  if (!scores) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-2 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Rendimiento
      </h2>
      <p className="text-xs text-[var(--color-ink)]/40 mb-5">Puntuación editorial · Se actualizará con votos reales de usuarios.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ITEMS.map(({ key, label, opts }) => {
          const value = scores[key];
          if (!value) return null;
          return (
            <div key={key} className="border border-[var(--color-line)] rounded-xl p-4 text-center bg-white">
              <div className="text-4xl font-display font-bold text-[var(--color-amber)]">
                {value}
                <span className="text-base text-[var(--color-ink)]/30">/5</span>
              </div>
              <div className="text-sm font-medium mt-1 text-[var(--color-ink)]/80">{opts[value]}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40 mt-1.5">{label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
