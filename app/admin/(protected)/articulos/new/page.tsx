"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import ArticleForm from "@/components/admin/ArticleForm";
import { Loader2 } from "lucide-react";

export default function NewArticlePage() {
  const [categories, setCategories] = useState<{ id:string;name:string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupabaseBrowser().from("categories").select("id,name").order("name")
      .then(({ data }) => { setCategories(data ?? []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div>;
  return <ArticleForm categories={categories} />;
}
