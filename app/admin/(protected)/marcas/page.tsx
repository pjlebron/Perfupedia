"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Pencil, Plus, Loader2, Trash2 } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  nacional:"Nacional", arabe:"Árabe", disenador:"Diseñador",
  independiente:"Independiente", importador:"Importador", otra:"Otra",
};

type Brand = { id: string; name: string; slug: string; country: string | null; type: string; status: string };

export default function MarcasPage() {
  const [data, setData] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    supabase.from("brands").select("id,name,slug,country,type,status").order("name")
      .then(({ data }) => { setData(data ?? []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (brand: Brand) => {
    if (!confirm(`¿Seguro que querés borrar "${brand.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(brand.id);
    await supabase.from("brands").delete().eq("id", brand.id);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl">Marcas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.length} registros</p>
        </div>
        <Link href="/admin/marcas/new"><Button variant="primary"><Plus className="w-4 h-4"/>Nueva</Button></Link>
      </div>
      {loading ? <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div> : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Nombre","Tipo","País","Slug","Estado",""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{TYPE_LABELS[r.type] ?? r.type}</td>
                  <td className="px-4 py-3 text-gray-600">{r.country ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/admin/marcas/${r.id}/edit`}>
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
        </div>
      )}
    </div>
  );
}
