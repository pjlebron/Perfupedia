"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Pencil, Plus, Loader2 } from "lucide-react";

const GENDER: Record<string,string> = { hombre:"Hombre", mujer:"Mujer", unisex:"Unisex" };

export default function PerfumesPage() {
  const [data, setData] = useState<{ id:string;name:string;slug:string;gender:string;status:string;brand:{ name:string }|null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupabaseBrowser().from("perfumes").select("id,name,slug,gender,status,brand:brands(name)").order("name")
      .then(({ data }) => { setData((data as never) ?? []); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div><h1 className="font-display text-2xl">Perfumes</h1><p className="text-sm text-gray-500 mt-0.5">{data.length} registros</p></div>
        <Link href="/admin/perfumes/new"><Button variant="primary"><Plus className="w-4 h-4"/>Nuevo</Button></Link>
      </div>
      {loading ? <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div> : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Nombre","Marca","Género","Slug","Estado",""].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.brand?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{GENDER[r.gender] ?? r.gender}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status}/></td>
                  <td className="px-4 py-3"><Link href={`/admin/perfumes/${r.id}/edit`}><Button variant="ghost" size="icon"><Pencil className="w-3.5 h-3.5"/></Button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
