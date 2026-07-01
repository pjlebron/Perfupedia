"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Cliente creado inline para evitar cualquier problema de importación
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const noPermission = params.get("error") === "no-permission";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setError("Error de configuración: variables de entorno no cargadas. URL: " + (SUPABASE_URL || "vacía"));
      setLoading(false);
      return;
    }

    const client = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { error: authError } = await client.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Error: " + authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image src="/logo.png" alt="Perfupedia" width={36} height={36} className="rounded-sm" />
          <span className="font-display text-2xl">
            Perfu<span className="italic text-[var(--color-amber)]">pedia</span>
          </span>
        </div>
        <Card>
          <CardHeader><CardTitle>Acceso al panel</CardTitle></CardHeader>
          <CardContent>
            {noPermission && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Tu cuenta no tiene permisos de administrador.
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" variant="primary" disabled={loading} className="mt-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</> : "Ingresar"}
              </Button>
            </form>

            {/* Debug info — lo sacamos después */}
            <p className="text-[10px] text-gray-300 mt-4 text-center">
              URL: {SUPABASE_URL ? "✓" : "✗"} · KEY: {SUPABASE_KEY ? "✓" : "✗"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
