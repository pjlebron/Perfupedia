"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Cliente a nivel de módulo: necesita procesar el token de recuperación de la URL
// apenas carga la página, antes de que el usuario haga nada.
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña tiene que tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await client.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(
        updateError.message.toLowerCase().includes("session")
          ? "El link ya expiró o no es válido. Pedí uno nuevo desde la pantalla de login."
          : "Error: " + updateError.message
      );
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 1200);
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
          <CardHeader><CardTitle>Elegir nueva contraseña</CardTitle></CardHeader>
          <CardContent>
            {done ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <p className="text-sm text-gray-600">Contraseña actualizada. Entrando al panel...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password" type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password" type="password" placeholder="••••••••"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  />
                </div>
                <Button type="submit" variant="primary" disabled={loading} className="mt-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : "Guardar contraseña"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
