"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import ArticleForm from "@/components/admin/ArticleForm";
import { Loader2 } from "lucide-react";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Record<string,unknown> | null>(null);
  const [categories, setCategories] = useState<{ id:string;name:string }[]>([]);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    Promise.all([
      sb.from("articles").select("*").eq("id", id).single(),
      sb.from("categories").select("id,name").order("name"),
    ]).then(([a, c]) => { setArticle(a.data); setCategories(c.data ?? []); });
  }, [id]);

  if (!article) return <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin"/>Cargando...</div>;
  return <ArticleForm articleId={id} categories={categories} defaultValues={article as never} />;
}
