"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function AdminHeader({ user }: { user: User }) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">
        Panel de administración
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user.email}</span>
        <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-500">
          <LogOut className="w-4 h-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
