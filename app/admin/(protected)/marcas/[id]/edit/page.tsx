"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import BrandForm from "@/components/admin/BrandForm";
import { Loader2 } from "lucide-react";

export default function EditBrandPage() {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    getSupabaseBrowser().from("brands").select("*").eq("id", id).single()
      .then(({ data }) => setBrand(data));
  }, [id]);

  if (!brand) return <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div>;
  return <BrandForm brandId={id} defaultValues={brand as never} />;
}
