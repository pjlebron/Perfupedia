import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminDataTable from "@/components/admin/AdminDataTable";

export default async function ArticulosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: articles = [] } = await supabase
    .from("articles")
    .select("id, title, slug, author, status, published_at, category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <AdminDataTable
      title="Artículos"
      data={(articles ?? []) as unknown as { id: string; status: string }[]}
      newHref="/admin/articulos/new"
      editHref={(r) => `/admin/articulos/${r.id}/edit`}
      empty="Todavía no hay artículos. Creá el primero."
      columns={[
        { key: "title",  label: "Título" },
        { key: "category", label: "Categoría", render: (r: unknown) => {
          const row = r as { category: { name: string } | null };
          return row.category?.name ?? "—";
        }},
        { key: "author", label: "Autor", render: (r: unknown) => {
          const row = r as { author: string | null };
          return row.author ?? "—";
        }},
        { key: "slug", label: "Slug", render: (r: unknown) => {
          const row = r as { slug: string };
          return <span className="font-mono text-xs text-gray-400">{row.slug}</span>;
        }},
      ]}
    />
  );
}
