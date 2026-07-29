"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type Review = { id: string; rating: number; body: string };

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
          style={{ color: "var(--color-amber)", opacity: s <= value ? 1 : 0.25 }}
          aria-label={`${s} de 5`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewComposer({
  perfumeId,
  onSaved,
}: {
  perfumeId: string;
  onSaved: () => void;
}) {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPending, setConfirmPending] = useState(false);

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMyReview = async (uid: string) => {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, body")
      .eq("perfume_id", perfumeId)
      .eq("user_id", uid)
      .maybeSingle();
    if (data) {
      setMyReview(data);
      setRating(data.rating);
      setBody(data.body);
    } else {
      setEditing(true);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
      if (user) loadMyReview(user.id);
      setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      if (session?.user) loadMyReview(session.user.id);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfumeId]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authMode === "signup") {
      if (!displayName.trim()) {
        setError("Ponele un nombre para mostrar en tus reseñas.");
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName.trim() } },
      });
      setLoading(false);
      if (err) { setError(err.message); return; }
      if (!data.session) { setConfirmPending(true); return; }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (err) { setError(err.message); return; }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating < 1) { setError("Elegí una calificación con estrellas."); return; }
    if (body.trim().length < 20) { setError("La reseña tiene que tener al menos 20 caracteres."); return; }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); setError("Se cerró tu sesión, iniciá sesión de nuevo."); return; }

    const { error: err } = await supabase.from("reviews").upsert(
      { perfume_id: perfumeId, user_id: user.id, rating, body: body.trim() },
      { onConflict: "perfume_id,user_id" },
    );
    setLoading(false);

    if (err) { setError("No pudimos guardar tu reseña: " + err.message); return; }

    setMyReview({ id: myReview?.id ?? "", rating, body: body.trim() });
    setEditing(false);
    onSaved();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setMyReview(null);
    setEditing(true);
    setRating(0);
    setBody("");
  };

  if (checking) {
    return <div className="flex gap-2 text-sm text-[var(--color-ink)]/40 py-4"><Loader2 className="w-4 h-4 animate-spin" /> Cargando...</div>;
  }

  if (confirmPending) {
    return (
      <div className="border border-[var(--color-line)] rounded-2xl p-6 text-center flex flex-col items-center gap-2">
        <CheckCircle2 className="w-7 h-7 text-green-600" />
        <p className="text-sm text-[var(--color-ink)]/70">
          Te mandamos un mail a <strong>{email}</strong> para confirmar tu cuenta. Confirmalo y volvé para dejar tu reseña.
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="border border-[var(--color-line)] rounded-2xl p-6">
        <div className="flex gap-4 mb-4 text-sm font-medium">
          <button type="button" onClick={() => setAuthMode("login")} className={authMode === "login" ? "text-[var(--color-amber)]" : "text-[var(--color-ink)]/40"}>
            Iniciar sesión
          </button>
          <button type="button" onClick={() => setAuthMode("signup")} className={authMode === "signup" ? "text-[var(--color-amber)]" : "text-[var(--color-ink)]/40"}>
            Crear cuenta
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}
        <form onSubmit={handleAuth} className="flex flex-col gap-3 max-w-sm">
          {authMode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <Label>Nombre para mostrar</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="ej: Juan P." />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Contraseña</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" variant="primary" disabled={loading} className="mt-1">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Un momento...</> : authMode === "signup" ? "Crear cuenta y reseñar" : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    );
  }

  if (myReview && !editing) {
    return (
      <div className="border border-[var(--color-line)] rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[var(--color-ink)]/70">✅ Ya dejaste tu reseña de este perfume.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setEditing(true)} className="text-sm font-medium border border-[var(--color-line)] rounded-lg px-3 py-1.5 hover:border-[var(--color-amber)] transition-colors">
            Editar
          </button>
          <button type="button" onClick={handleLogout} className="text-sm text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitReview} className="border border-[var(--color-line)] rounded-2xl p-6 flex flex-col gap-4">
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1.5">Tu calificación</div>
        <Stars value={rating} onChange={setRating} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Tu reseña</Label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="Contá tu experiencia: duración, proyección, para qué ocasión lo usás, si vale la pena..."
        />
        <p className="text-xs text-[var(--color-ink)]/40">{body.trim().length}/3000 · mínimo 20 caracteres</p>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : myReview ? "Guardar cambios" : "Publicar reseña"}
        </Button>
        {myReview && (
          <Button type="button" variant="outline" onClick={() => { setEditing(false); setRating(myReview.rating); setBody(myReview.body); }}>
            Cancelar
          </Button>
        )}
        <button type="button" onClick={handleLogout} className="ml-auto text-sm text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70">
          Cerrar sesión
        </button>
      </div>
    </form>
  );
}
