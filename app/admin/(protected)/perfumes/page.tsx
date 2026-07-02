"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Pencil, Plus, Loader2, ImageOff, ImageIcon, Trash2 } from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const GENDER: Record<string, string> = { hombre: "Hombre", mujer: "Mujer", unisex: "Unisex" };

type Perfume = {
  id: string;
  name: string;
  slug: string;
  gender: string;
  status: string;
  main_image_path: string | null;
  brand: { name: string } | null;
};

export default function PerfumesPage() {
  const [data, setData] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    getSupabaseBrowser()
      .from("perfumes")
      .select("id,name,slug,gender,status,main_image_path,brand:brands(name)")
      .order("name")
      .then(({ data }) => { setData((data as never) ?? []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (p: Perfume) => {
    if (!confirm(`¿Seguro que querés borrar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(p.id);
    await getSupabaseBrowser().from("perfumes").delete().eq("id", p.id);
    setDeleting(null);
    load();
  };

  const conFoto = data.filter((p) => p.main_image_path).length;
  const sinFoto = data.filter((p) => !p.main_image_path).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl">Perfumes</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">{data.length} registros</span>
            <span className="flex items-center gap-1 text-xs text-green-600">
              <ImageIcon className="w-3 h-3" /> {conFoto} con foto
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <ImageOff className="w-3 h-3" /> {sinFoto} sin foto
            </span>
          </div>
        </div>
        <Link href="/admin/perfumes/new">
          <Button variant="primary"><Plus className="w-4 h-4" /> Nuevo</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-2 text-gray-400 py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide w-12">Foto</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Marca</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Género</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Estado</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {r.main_image_path && SUPABASE_URL ? (
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-100">
                        <Image
                          src={`${SUPABASE_URL}/storage/v1/object/public/perfumes/${r.main_image_path}`}
                          alt={r.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                        <ImageOff className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.brand?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{GENDER[r.gender] ?? r.gender}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/admin/perfumes/${r.id}/edit`}>
                        <Button variant="ghost" size="icon"><Pencil className="w-3.5 h-3.5" /></Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(r)}
                        disabled={deleting === r.id}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        {deleting === r.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
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
