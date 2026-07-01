"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import PerfumeForm from "@/components/admin/PerfumeForm";
import { Loader2 } from "lucide-react";

export default function NewPerfumePage() {
  const [brands, setBrands] = useState<{ id:string;name:string }[]>([]);
  const [families, setFamilies] = useState<{ id:string;name:string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    Promise.all([
      sb.from("brands").select("id,name").eq("status","published").order("name"),
      sb.from("olfactive_families").select("id,name").order("name"),
    ]).then(([b, f]) => { setBrands(b.data ?? []); setFamilies(f.data ?? []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div>;
  return <PerfumeForm brands={brands} families={families} />;
}
