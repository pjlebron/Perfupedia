"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "recovery">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
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

    const { error: authError } = await client.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Error: " + authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setError("Error de configuración: variables de entorno no cargadas.");
      setLoading(false);
      return;
    }

    const { error: recoveryError } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setLoading(false);

    if (recoveryError) {
      setError("Error: " + recoveryError.message);
      return;
    }

    setRecoverySent(true);
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
          <CardHeader>
            <CardTitle>{mode === "login" ? "Acceso al panel" : "Recuperar contraseña"}</CardTitle>
          </CardHeader>
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

            {mode === "recovery" && recoverySent ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <p className="text-sm text-gray-600">
                  Si <strong>{email}</strong> tiene una cuenta, te enviamos un link para elegir
                  una contraseña nueva. Revisá tu correo (y la carpeta de spam).
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setMode("login"); setRecoverySent(false); setError(""); }}
                  className="mt-2"
                >
                  Volver al login
                </Button>
              </div>
            ) : mode === "recovery" ? (
              <form onSubmit={handleRecovery} className="flex flex-col gap-4">
                <p className="text-sm text-gray-500">
                  Ingresá tu email y te mandamos un link para elegir una contraseña nueva.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="recovery-email">Email</Label>
                  <Input
                    id="recovery-email" type="email" placeholder="tu@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
                  />
                </div>
                <Button type="submit" variant="primary" disabled={loading} className="mt-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : "Enviar link de recuperación"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-xs text-gray-500 hover:text-[var(--color-amber)] text-center"
                >
                  Volver al login
                </button>
              </form>
            ) : (
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
                <button
                  type="button"
                  onClick={() => { setMode("recovery"); setError(""); }}
                  className="text-xs text-gray-500 hover:text-[var(--color-amber)] text-center"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </form>
            )}

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
