"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";

export default function RankingsAdminPage() {
  const [data, setData] = useState<{ id:string;title:string;slug:string;status:string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupabaseBrowser().from("rankings").select("id,title,slug,status").order("title")
      .then(({ data }) => { setData(data ?? []); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="font-display text-2xl">Rankings</h1><p className="text-sm text-gray-500 mt-0.5">{data.length} registros</p></div>
        <Link href="/admin/rankings/new"><Button variant="primary"><Plus className="w-4 h-4"/>Nuevo</Button></Link>
      </div>
      {loading ? <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div> : (
        data.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center text-gray-400 text-sm">
            No hay rankings todavía.
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                {["Título","Slug","Estado"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.slug}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
