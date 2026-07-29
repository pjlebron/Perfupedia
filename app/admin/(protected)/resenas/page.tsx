"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";

type ReviewRow = {
  id: string;
  rating: number;
  body: string;
  status: string;
  created_at: string;
  perfume: { name: string; slug: string } | null;
  profile: { display_name: string } | null;
};

export default function ResenasPage() {
  const [data, setData] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    supabase
      .from("reviews")
      .select("id, rating, body, status, created_at, perfume:perfumes(name,slug), profile:profiles(display_name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setData((data as unknown as ReviewRow[]) ?? []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (r: ReviewRow) => {
    setBusyId(r.id);
    const nextStatus = r.status === "published" ? "hidden" : "published";
    await supabase.from("reviews").update({ status: nextStatus }).eq("id", r.id);
    setBusyId(null);
    load();
  };

  const handleDelete = async (r: ReviewRow) => {
    if (!confirm(`¿Borrar la reseña de "${r.profile?.display_name}" sobre "${r.perfume?.name}"? No se puede deshacer.`)) return;
    setBusyId(r.id);
    await supabase.from("reviews").delete().eq("id", r.id);
    setBusyId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl">Reseñas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.length} registros</p>
        </div>
      </div>
      {loading ? (
        <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin" />Cargando...</div>
      ) : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Perfume", "Autor", "★", "Reseña", "Estado", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 align-top">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.perfume?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.profile?.display_name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.rating}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-sm">
                    <p className="line-clamp-3">{r.body}</p>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "published"
                      ? <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Publicada</span>
                      : <span className="text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">Oculta</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost" size="icon"
                        title={r.status === "published" ? "Ocultar" : "Publicar"}
                        onClick={() => toggleStatus(r)}
                        disabled={busyId === r.id}
                      >
                        {r.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(r)}
                        disabled={busyId === r.id}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        {busyId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">Todavía no hay reseñas.</p>
          )}
        </div>
      )}
    </div>
  );
}
