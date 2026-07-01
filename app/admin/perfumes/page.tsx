import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminDataTable from "@/components/admin/AdminDataTable";

export default async function PerfumesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: perfumes = [] } = await supabase
    .from("perfumes")
    .select("id, name, slug, gender, concentration, status, brand:brands(name)")
    .order("name");

  return (
    <AdminDataTable
      title="Perfumes"
      data={(perfumes ?? []) as unknown as { id: string; status: string }[]}
      newHref="/admin/perfumes/new"
      editHref={(r) => `/admin/perfumes/${r.id}/edit`}
      empty="Todavía no hay perfumes. Creá el primero."
      columns={[
        { key: "name", label: "Nombre" },
        { key: "brand", label: "Marca", render: (r: unknown) => {
          const row = r as { brand: { name: string } | null };
          return row.brand?.name ?? "—";
        }},
        { key: "gender", label: "Género", render: (r: unknown) => {
          const row = r as { gender: string };
          const map: Record<string, string> = { hombre: "Hombre", mujer: "Mujer", unisex: "Unisex" };
          return map[row.gender] ?? row.gender;
        }},
        { key: "slug", label: "Slug", render: (r: unknown) => {
          const row = r as { slug: string };
          return <span className="font-mono text-xs text-gray-400">{row.slug}</span>;
        }},
      ]}
    />
  );
}
