import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import BrandForm from "@/components/admin/BrandForm";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: brand } = await supabase.from("brands").select("*").eq("id", id).single();
  if (!brand) notFound();
  return <BrandForm brandId={id} defaultValues={brand} />;
}
