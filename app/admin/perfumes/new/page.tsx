import { createSupabaseServerClient } from "@/lib/supabase-server";
import PerfumeForm from "@/components/admin/PerfumeForm";

export default async function NewPerfumePage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: brands }, { data: families }] = await Promise.all([
    supabase.from("brands").select("id, name").eq("status", "published").order("name"),
    supabase.from("olfactive_families").select("id, name").order("name"),
  ]);
  return <PerfumeForm brands={brands ?? []} families={families ?? []} />;
}
