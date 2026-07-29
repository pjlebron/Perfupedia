"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReviewComposer from "./ReviewComposer";

type ReviewRow = {
  id: string;
  rating: number;
  body: string;
  created_at: string;
  profiles: { display_name: string } | null;
};

export default function Reviews({ perfumeId }: { perfumeId: string }) {
  const [reviews, setReviews] = useState<ReviewRow[] | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, body, created_at, profiles(display_name)")
      .eq("perfume_id", perfumeId)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    setReviews((data as unknown as ReviewRow[]) ?? []);
  }, [perfumeId]);

  useEffect(() => {
    load();
  }, [load]);

  const avg =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-2 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Reseñas
      </h2>
      <p className="text-xs text-[var(--color-ink)]/40 mb-5">
        {reviews === null
          ? "Cargando..."
          : reviews.length > 0
            ? `${avg} ★ · ${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"}`
            : "Todavía no hay reseñas escritas. Sé el primero."}
      </p>

      <div className="mb-6">
        <ReviewComposer perfumeId={perfumeId} onSaved={load} />
      </div>

      {reviews && reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-[var(--color-line)] rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{r.profiles?.display_name ?? "Anónimo"}</span>
                <span className="text-[var(--color-amber)] text-sm">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p className="text-sm text-[var(--color-ink)]/80 leading-relaxed whitespace-pre-line">{r.body}</p>
              <p className="text-[10px] text-[var(--color-ink)]/30 mt-3">
                {new Date(r.created_at).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
