"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AdminHeaderDynamic() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    sb.auth.getUser().then(({ data: { user } }) => { if (user) setEmail(user.email ?? ""); });
  }, []);

  const signOut = async () => {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="text-sm text-gray-500">Panel de administración</div>
      <div className="flex items-center gap-3">
        {email && <span className="text-sm text-gray-600">{email}</span>}
        <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-500">
          <LogOut className="w-4 h-4" /> Salir
        </Button>
      </div>
    </header>
  );
}
