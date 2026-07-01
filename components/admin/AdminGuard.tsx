"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const check = async () => {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { router.replace("/admin/login"); return; }
      const { data: role } = await sb.from("user_roles").select("role").eq("user_id", user.id).single();
      if (role?.role !== "admin") { router.replace("/admin/login?error=no-permission"); return; }
      setOk(true);
    };
    check();
  }, [router]);

  if (!ok) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Verificando acceso...</span>
      </div>
    </div>
  );

  return <>{children}</>;
}
