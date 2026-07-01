import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminDataTable from "@/components/admin/AdminDataTable";

const TYPE_LABELS: Record<string, string> = {
  nacional: "Nacional", arabe: "Árabe", disenador: "Diseñador",
  independiente: "Independiente", importador: "Importador", otra: "Otra",
};

export default async function MarcasPage() {
  const supabase = await createSupabaseServerClient();
  const { data: brands = [] } = await supabase
    .from("brands")
    .select("id, name, slug, country, type, status")
    .order("name");

  return (
    <AdminDataTable
      title="Marcas"
      data={brands ?? []}
      newHref="/admin/marcas/new"
      editHref={(r) => `/admin/marcas/${r.id}/edit`}
      empty="Todavía no hay marcas. Creá la primera."
      columns={[
        { key: "name", label: "Nombre" },
        { key: "type", label: "Tipo", render: (r) => TYPE_LABELS[r.type] ?? r.type },
        { key: "country", label: "País", render: (r) => r.country ?? "—" },
        { key: "slug", label: "Slug", render: (r) => <span className="font-mono text-xs text-gray-400">{r.slug}</span> },
      ]}
    />
  );
}
