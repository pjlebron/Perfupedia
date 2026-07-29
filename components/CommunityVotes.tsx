"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const VOTE_THRESHOLD = 20;

type ScoreKey = "duration_score" | "projection_score" | "sillage_score" | "price_quality_score";

const SCORE_FIELDS: { key: ScoreKey; label: string }[] = [
  { key: "duration_score", label: "Duración" },
  { key: "projection_score", label: "Proyección" },
  { key: "sillage_score", label: "Sillage / estela" },
  { key: "price_quality_score", label: "Precio / calidad" },
];

const SEASONS = [
  { key: "attr_primavera", label: "Primavera", icon: "🌸" },
  { key: "attr_verano", label: "Verano", icon: "☀️" },
  { key: "attr_otono", label: "Otoño", icon: "🍂" },
  { key: "attr_invierno", label: "Invierno", icon: "❄️" },
] as const;

const OCCASIONS = [
  { key: "attr_diario", label: "Uso diario" },
  { key: "attr_oficina", label: "Oficina" },
  { key: "attr_casual", label: "Casual" },
  { key: "attr_formal", label: "Formal" },
  { key: "attr_noche", label: "Noche / salidas" },
  { key: "attr_cita", label: "Cita romántica" },
  { key: "attr_regalo", label: "Para regalo" },
] as const;

type AttrKey = (typeof SEASONS)[number]["key"] | (typeof OCCASIONS)[number]["key"];

type VoteState = Record<ScoreKey, number> & Record<AttrKey, boolean>;

const EMPTY_VOTE: VoteState = {
  duration_score: 0,
  projection_score: 0,
  sillage_score: 0,
  price_quality_score: 0,
  attr_primavera: false,
  attr_verano: false,
  attr_otono: false,
  attr_invierno: false,
  attr_diario: false,
  attr_oficina: false,
  attr_casual: false,
  attr_formal: false,
  attr_noche: false,
  attr_cita: false,
  attr_regalo: false,
};

function getVoterId() {
  const KEY = "perfupedia_voter_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function StarPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-1.5">{label}</div>
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
    </div>
  );
}

export default function CommunityVotes({
  perfumeId,
  initialTotalVotes,
}: {
  perfumeId: string;
  initialTotalVotes: number;
}) {
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);
  const [vote, setVote] = useState<VoteState>(EMPTY_VOTE);
  const [hasVoted, setHasVoted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`perfupedia_vote_${perfumeId}`);
    if (saved) {
      setVote(JSON.parse(saved));
      setHasVoted(true);
    } else {
      setEditing(true);
    }
  }, [perfumeId]);

  const setScore = (key: ScoreKey, value: number) => setVote((v) => ({ ...v, [key]: value }));
  const toggleAttr = (key: AttrKey) => setVote((v) => ({ ...v, [key]: !v[key] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (SCORE_FIELDS.some(({ key }) => !vote[key])) {
      setError("Completá los 4 puntajes con estrellas para poder votar.");
      return;
    }

    setSaving(true);
    const voterId = getVoterId();

    const { error: err } = await supabase.from("perfume_votes").upsert(
      {
        perfume_id: perfumeId,
        voter_id: voterId,
        ...vote,
      },
      { onConflict: "perfume_id,voter_id" },
    );

    setSaving(false);

    if (err) {
      setError("No pudimos guardar tu voto: " + err.message);
      return;
    }

    localStorage.setItem(`perfupedia_vote_${perfumeId}`, JSON.stringify(vote));
    setHasVoted(true);
    setEditing(false);
    setTotalVotes((n) => n + (hasVoted ? 0 : 1));
  };

  const remaining = Math.max(0, VOTE_THRESHOLD - totalVotes);

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-2 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Opiniones de la comunidad
      </h2>
      <p className="text-xs text-[var(--color-ink)]/40 mb-5">
        {totalVotes > 0
          ? `${totalVotes} ${totalVotes === 1 ? "voto" : "votos"} hasta ahora${
              remaining > 0 ? ` · faltan ${remaining} para reemplazar la puntuación editorial` : ""
            }`
          : "Sé el primero en calificar este perfume."}
      </p>

      {hasVoted && !editing ? (
        <div className="border border-[var(--color-line)] rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-[var(--color-ink)]/70">✅ Ya votaste este perfume. ¡Gracias por sumar tu opinión!</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm font-medium border border-[var(--color-line)] rounded-lg px-3 py-1.5 hover:border-[var(--color-amber)] transition-colors"
          >
            Editar mi voto
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="border border-[var(--color-line)] rounded-2xl p-6 flex flex-col gap-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {SCORE_FIELDS.map(({ key, label }) => (
              <StarPicker key={key} label={label} value={vote[key]} onChange={(v) => setScore(key, v)} />
            ))}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-2">¿Para qué estación te gusta?</div>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAttr(key)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border transition-colors"
                  style={{
                    borderColor: vote[key] ? "var(--color-amber)" : "var(--color-line)",
                    background: vote[key] ? "var(--color-amber)18" : "transparent",
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-2">¿Para qué ocasión lo usarías?</div>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAttr(key)}
                  className="rounded-full px-3 py-1.5 text-sm border transition-colors"
                  style={{
                    borderColor: vote[key] ? "var(--color-amber)" : "var(--color-line)",
                    background: vote[key] ? "var(--color-amber)18" : "transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              style={{ background: "var(--color-arabe-green)" }}
            >
              {saving ? "Guardando..." : hasVoted ? "Guardar cambios" : "Votar"}
            </button>
            {hasVoted && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl px-5 py-2.5 text-sm border border-[var(--color-line)]"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
