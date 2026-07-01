import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminDataTable from "@/components/admin/AdminDataTable";
export default async function RankingsAdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: rankings = [] } = await supabase.from("rankings").select("id, title, slug, status").order("title");
  return (
    <AdminDataTable
      title="Rankings"
      data={(rankings ?? []) as unknown as { id: string; status: string }[]}
      newHref="/admin/rankings/new"
      editHref={(r) => `/admin/rankings/${r.id}/edit`}
      empty="Todavía no hay rankings. Creá el primero."
      columns={[
        { key: "title", label: "Título" },
        { key: "slug",  label: "Slug", render: (r: unknown) => {
          const row = r as { slug: string };
          return <span className="font-mono text-xs text-gray-400">{row.slug}</span>;
        }},
      ]}
    />
  );
}
