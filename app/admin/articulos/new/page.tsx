import { createSupabaseServerClient } from "@/lib/supabase-server";
import ArticleForm from "@/components/admin/ArticleForm";
export default async function NewArticlePage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");
  return <ArticleForm categories={categories ?? []} />;
}
