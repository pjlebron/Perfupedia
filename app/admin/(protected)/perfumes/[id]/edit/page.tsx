"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PerfumeForm from "@/components/admin/PerfumeForm";
import { Loader2 } from "lucide-react";

export default function EditPerfumePage() {
  const { id } = useParams<{ id: string }>();
  const [ready, setReady] = useState(false);
  const [perfume, setPerfume] = useState<Record<string,unknown> | null>(null);
  const [brands, setBrands] = useState<{ id:string;name:string }[]>([]);
  const [families, setFamilies] = useState<{ id:string;name:string }[]>([]);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    Promise.all([
      sb.from("perfumes").select("*").eq("id", id).single(),
      sb.from("perfume_editorial_scores").select("*").eq("perfume_id", id).single(),
      sb.from("brands").select("id,name").eq("status","published").order("name"),
      sb.from("olfactive_families").select("id,name").order("name"),
    ]).then(([p, s, b, f]) => {
      setPerfume({ ...p.data, ...s.data });
      setBrands(b.data ?? []);
      setFamilies(f.data ?? []);
      setReady(true);
    });
  }, [id]);

  if (!ready) return <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div>;
  return <PerfumeForm perfumeId={id} brands={brands} families={families} defaultValues={perfume as never} />;
}
