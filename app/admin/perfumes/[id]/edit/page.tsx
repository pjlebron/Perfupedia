import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import PerfumeForm from "@/components/admin/PerfumeForm";

export default async function EditPerfumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: perfume }, { data: scores }, { data: brands }, { data: families }] = await Promise.all([
    supabase.from("perfumes").select("*").eq("id", id).single(),
    supabase.from("perfume_editorial_scores").select("*").eq("perfume_id", id).single(),
    supabase.from("brands").select("id, name").eq("status", "published").order("name"),
    supabase.from("olfactive_families").select("id, name").order("name"),
  ]);
  if (!perfume) notFound();
  return (
    <PerfumeForm
      perfumeId={id}
      brands={brands ?? []}
      families={families ?? []}
      defaultValues={{ ...perfume, ...scores }}
    />
  );
}
