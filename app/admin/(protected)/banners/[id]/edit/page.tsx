"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BannerForm from "@/components/admin/BannerForm";
import { Loader2 } from "lucide-react";

export default function EditBannerPage() {
  const { id } = useParams<{ id: string }>();
  const [banner, setBanner] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    supabase.from("banners").select("*").eq("id", id).single()
      .then(({ data }) => setBanner(data));
  }, [id]);

  if (!banner) return <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div>;
  return <BannerForm bannerId={id} defaultValues={banner as never} />;
}
