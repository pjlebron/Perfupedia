import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El login maneja su propia lógica, no necesita protección
  return <>{children}</>;
}
