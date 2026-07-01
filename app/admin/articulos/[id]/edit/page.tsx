import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ArticleForm from "@/components/admin/ArticleForm";
export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);
  if (!article) notFound();
  return <ArticleForm articleId={id} categories={categories ?? []} defaultValues={article} />;
}
