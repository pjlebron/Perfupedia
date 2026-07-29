"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Loader2, Trash2 } from "lucide-react";

type Banner = {
  id: string;
  internal_name: string;
  location: string;
  advertiser: string | null;
  is_active: boolean;
  priority: number;
  start_date: string | null;
  end_date: string | null;
};

export default function BannersPage() {
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    supabase
      .from("banners")
      .select("id,internal_name,location,advertiser,is_active,priority,start_date,end_date")
      .order("location")
      .order("priority", { ascending: false })
      .then(({ data }) => { setData(data ?? []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`¿Seguro que querés borrar "${banner.internal_name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(banner.id);
    await supabase.from("banners").delete().eq("id", banner.id);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl">Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.length} registros</p>
        </div>
        <Link href="/admin/banners/new"><Button variant="primary"><Plus className="w-4 h-4"/>Nuevo</Button></Link>
      </div>
      {loading ? <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div> : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Nombre","Ubicación","Anunciante","Prioridad","Vigencia","Estado",""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.internal_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.location}</td>
                  <td className="px-4 py-3 text-gray-600">{r.advertiser ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.priority}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {r.start_date || r.end_date
                      ? `${r.start_date ?? "…"} → ${r.end_date ?? "…"}`
                      : "Sin límite"}
                  </td>
                  <td className="px-4 py-3">
                    {r.is_active
                      ? <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Activo</span>
                      : <span className="text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">Inactivo</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/admin/banners/${r.id}/edit`}>
                        <Button variant="ghost" size="icon"><Pencil className="w-3.5 h-3.5"/></Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(r)}
                        disabled={deleting === r.id}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        {deleting === r.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                          : <Trash2 className="w-3.5 h-3.5"/>
                        }
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">Todavía no cargaste ningún banner.</p>
          )}
        </div>
      )}
    </div>
  );
}
