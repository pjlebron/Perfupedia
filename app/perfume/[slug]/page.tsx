export const revalidate = 3600; // Caché de 1 hora — se actualiza automáticamente

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import BannerSlot from "@/components/BannerSlot";
import PerfumeAccords from "@/components/PerfumeAccords";
import PerfumePerformanceBars from "@/components/PerfumePerformanceBars";
import PerfumeSeasonBars from "@/components/PerfumeSeasonBars";
import { SeasonDistribution, TimeDistribution } from "@/components/PerfumeVoteDistribution";
import PerfumeOccasionBars from "@/components/PerfumeOccasionBars";
import PerfumeNotesPyramid from "@/components/PerfumeNotesPyramid";
import PerfumeVerdict from "@/components/PerfumeVerdict";
import PerfumeProsCons from "@/components/PerfumeProsCons";
import PerfumeSimilarList from "@/components/PerfumeSimilarList";
import ReviewPlaceholder from "@/components/ReviewPlaceholder";
import PerfumeFAQ from "@/components/PerfumeFAQ";
import { supabase } from "@/lib/supabase";

const VOTE_THRESHOLD = 20;

const ORIGIN_LABEL: Record<string, string> = {
  nacional: "Nacional", arabe: "Árabe", disenador: "Diseñador",
  importado: "Importado", otro: "Otro",
};

async function getPerfumeData(slug: string) {
  const { data: perfume } = await supabase
    .from("perfumes")
    .select(`*, brand:brands(name,slug,type,country), olfactive_family:olfactive_families(name,slug), editorial_scores:perfume_editorial_scores(*)`)
    .eq("slug", slug).eq("status", "published").single();
  if (!perfume) return null;

  const [notes, accords, images, editorialScores, attributes, voteSummary, similars, faqs] =
    await Promise.all([
      supabase.from("perfume_notes").select("position, note:notes(name,slug)").eq("perfume_id", perfume.id),
      supabase.from("perfume_accords").select("accord:accords(name,slug,color_hex)").eq("perfume_id", perfume.id),
      supabase.from("perfume_images").select("display_order, image:image_assets(storage_path,alt_text)").eq("perfume_id", perfume.id).order("display_order").limit(1),
      supabase.from("perfume_editorial_scores").select("*").eq("perfume_id", perfume.id).single(),
      supabase.from("perfume_editorial_attributes").select("attribute,value").eq("perfume_id", perfume.id),
      supabase.from("perfume_vote_summary").select("*").eq("perfume_id", perfume.id).single(),
      supabase.from("perfume_similars").select("note, similar_perfume:perfumes!similar_perfume_id(name,slug,brand:brands(name),olfactive_family:olfactive_families(name))").eq("perfume_id", perfume.id).limit(6),
      supabase.from("faqs").select("question,answer").eq("entity_type","perfume").eq("entity_id", perfume.id).order("display_order"),
    ]);

  const totalVotes = voteSummary.data?.total_votes ?? 0;
  const useRealVotes = totalVotes >= VOTE_THRESHOLD;

  // Scores: primero intentamos el join directo, luego la query separada como fallback
  const editorialScoresData = (perfume as unknown as Record<string, unknown[]>).editorial_scores?.[0] as {
    duration_score: number | null;
    projection_score: number | null;
    sillage_score: number | null;
    price_quality_score: number | null;
  } | null ?? editorialScores.data ?? null;

  const scores = useRealVotes
    ? {
        duration_score: Math.round((voteSummary.data?.avg_duration ?? 0) * 5) || null,
        projection_score: Math.round((voteSummary.data?.avg_projection ?? 0) * 5) || null,
        sillage_score: Math.round((voteSummary.data?.avg_sillage ?? 0) * 5) || null,
        price_quality_score: Math.round((voteSummary.data?.avg_price_quality ?? 0) * 5) || null,
      }
    : editorialScoresData;

  return {
    perfume,
    notes: (notes.data as unknown as { position: string; note: { name: string; slug: string } }[]) ?? [],
    accords: (accords.data as unknown as { accord: { name: string; slug: string; color_hex: string | null } }[]) ?? [],
    mainImage: perfume.main_image_path
      ? { storage_path: "https://lbphepwhsyskustxmjue.supabase.co/storage/v1/object/public/perfumes/" + perfume.main_image_path, alt_text: perfume.name }
      : (images.data?.[0]?.image as unknown as { storage_path: string; alt_text: string } | null) ?? null,
    scores,
    attributes: attributes.data ?? [],
    similars: (similars.data ?? []) as unknown as {
      note: string | null;
      similar_perfume: { name: string; slug: string; brand: { name: string } | null; olfactive_family: { name: string } | null };
    }[],
    faqs: faqs.data ?? [],
    isEditorial: !useRealVotes,
    totalVotes,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPerfumeData(slug);
  if (!data) return {};
  const { perfume } = data;
  const title = perfume.meta_title || `${perfume.name} de ${perfume.brand?.name} | Blog de Perfumes Argentina`;
  const description = perfume.meta_description || perfume.aroma_summary || perfume.editorial_description?.slice(0, 155);
  return {
    title,
    description,
    openGraph: { title, description: description ?? undefined, type: "website" },
  };
}

export default async function PerfumePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPerfumeData(slug);
  if (!data) notFound();

  const { perfume, notes, accords, mainImage, scores, attributes, similars, faqs, isEditorial } = data;
  const isArabe = perfume.origin === "arabe";
  const accent = isArabe ? "var(--color-arabe-green)" : "var(--color-celeste)";

  // Usar campos de texto directos (recommended_season, recommended_occasion)
  const seasonAttrs = attributes.filter((a) => ["primavera","verano","otono","invierno"].includes(a.attribute));
  const occasionAttrs = attributes.filter((a) => ["diario","oficina","noche","cita","formal","casual","regalo"].includes(a.attribute));
  // Notas desde campos de texto nuevos
  const notesFromText = [
    ...((perfume as Record<string,string>).notes_top ?? "").split(",").filter(Boolean).map((n: string) => ({ position: "salida", note: { name: n.trim(), slug: n.trim().toLowerCase().replace(/\s+/g, "-") } })),
    ...((perfume as Record<string,string>).notes_heart ?? "").split(",").filter(Boolean).map((n: string) => ({ position: "corazon", note: { name: n.trim(), slug: n.trim().toLowerCase().replace(/\s+/g, "-") } })),
    ...((perfume as Record<string,string>).notes_base ?? "").split(",").filter(Boolean).map((n: string) => ({ position: "fondo", note: { name: n.trim(), slug: n.trim().toLowerCase().replace(/\s+/g, "-") } })),
  ];
  const allNotes = notes.length > 0 ? notes : notesFromText;

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Perfumes", href: "/perfumes" },
            { label: ORIGIN_LABEL[perfume.origin], href: isArabe ? "/perfumes-arabes" : "/perfumes-nacionales" },
            { label: perfume.brand?.name ?? "", href: `/marca/${perfume.brand?.slug}` },
            { label: perfume.name },
          ]} />

          {/* HERO */}
          <div className="mt-8 grid sm:grid-cols-[320px_1fr] gap-8 sm:gap-12 items-start">
            {/* Columna imagen */}
            <div className="sm:sticky sm:top-24">
              <div className="relative aspect-square rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-[#f1ead9] to-[#e7dac0] overflow-hidden flex items-center justify-center">
                {mainImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image src={mainImage.storage_path} alt={mainImage.alt_text || perfume.name} fill className="object-contain p-4" />
                ) : (
                  <span className="text-xs text-[var(--color-ink)]/30">Imagen pendiente</span>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <a href="#comprar" className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white" style={{ background: accent }}>
                  🛒 Ver dónde comprar
                </a>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm hover:border-[var(--color-amber)] transition-colors">
                  ⚖️ Comparar
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm hover:border-[var(--color-amber)] transition-colors">
                  🔖 Guardar
                </button>
              </div>
            </div>

            {/* Columna contenido */}
            <div>
              <div className="text-[11px] uppercase tracking-widest font-semibold mb-2 flex items-center gap-2" style={{ color: accent }}>
                <span className="bg-current/10 rounded px-2 py-0.5 opacity-100" style={{ background: `${accent}18` }}>{ORIGIN_LABEL[perfume.origin]}</span>
                <span>·</span>
                <span>{perfume.country ?? ""}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl leading-[1.05]">{perfume.name}</h1>
              <Link href={`/marca/${perfume.brand?.slug}`} className="inline-block mt-2 text-base font-medium border-b" style={{ color: accent, borderColor: `${accent}50` }}>
                {perfume.brand?.name}
              </Link>
              {perfume.aroma_summary && (
                <p className="mt-3 text-lg italic text-[var(--color-ink)]/65 font-display">{perfume.aroma_summary}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {perfume.gender && <span className="border border-[var(--color-line)] rounded-full px-3 py-1 capitalize text-[var(--color-ink)]/60">{perfume.gender}</span>}
                {perfume.concentration && <span className="border border-[var(--color-line)] rounded-full px-3 py-1 uppercase text-[var(--color-ink)]/60">{perfume.concentration}</span>}
                {perfume.available_sizes && <span className="border border-[var(--color-line)] rounded-full px-3 py-1 text-[var(--color-ink)]/60">{perfume.available_sizes}</span>}
                {perfume.olfactive_family?.name && <span className="border border-[var(--color-line)] rounded-full px-3 py-1 text-[var(--color-ink)]/60">{perfume.olfactive_family.name}</span>}
              </div>

              {/* Rating */}
              {perfume.editorial_score && (
                <div className="mt-5 flex items-center gap-4">
                  <span className="font-display text-5xl">{perfume.editorial_score}<small className="text-lg text-[var(--color-ink)]/40">/10</small></span>
                  <div>
                    <div className="flex gap-1 text-[var(--color-amber)]">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} style={{ opacity: s <= Math.round((perfume.editorial_score ?? 0) / 2) ? 1 : 0.25 }}>★</span>
                      ))}
                    </div>
                    <span className="text-xs bg-[var(--color-amber)]/15 text-[var(--color-amber)] rounded px-2 py-0.5 mt-1 inline-block font-medium">
                      Puntuación editorial
                    </span>
                  </div>
                </div>
              )}

              {/* Acordes dentro del hero en desktop */}
              <PerfumeAccords accords={accords} />
            </div>
          </div>

          <BannerSlot label="después del hero" />

          {/* RENDIMIENTO */}
          <PerfumePerformanceBars scores={scores} isEditorial={isEditorial} />

          {/* ESTACIONES */}
          {seasonAttrs.length > 0 ? (
            <PerfumeSeasonBars attributes={seasonAttrs} />
          ) : (perfume as Record<string,string>).recommended_season ? (
            <section className="mt-10">
              <h2 className="font-display text-xl mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">Estaciones recomendadas</h2>
              <div className="grid grid-cols-4 gap-3">
                {(["Primavera","Verano","Otoño","Invierno"]).map((s) => {
                  const icons: Record<string,string> = { "Primavera":"🌸", "Verano":"☀️", "Otoño":"🍂", "Invierno":"❄️" };
                  const seasonList = ((perfume as Record<string,string>).recommended_season ?? "").toLowerCase();
                  const active = seasonList.includes(s.toLowerCase()) || seasonList.includes(s === "Otoño" ? "otono" : s.toLowerCase());
                  return (
                    <div key={s} className={`rounded-xl p-3 text-center border transition-all ${active ? "border-[var(--color-amber)] bg-[var(--color-amber)]/8" : "border-[var(--color-line)] opacity-30"}`}>
                      <div className="text-2xl mb-1">{icons[s]}</div>
                      <div className="text-xs font-medium">{s}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* OCASIONES */}
          {/* MOMENTO DEL DÍA */}
          {(perfume as Record<string,string>).recommended_time_of_day ? (
            <section className="mt-8">
              <h2 className="font-display text-xl mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">Momento del día</h2>
              <div className="grid grid-cols-4 gap-3">
                {(["Mañana","Tarde","Noche","Cualquier momento"]).map((m) => {
                  const icons: Record<string,string> = { "Mañana":"🌅", "Tarde":"🌤️", "Noche":"🌙", "Cualquier momento":"✨" };
                  const timeList = ((perfume as Record<string,string>).recommended_time_of_day ?? "").toLowerCase();
                  const active = timeList.includes(m.toLowerCase()) || (m === "Cualquier momento" && timeList.includes("cualquier"));
                  return (
                    <div key={m} className={`rounded-xl p-3 text-center border transition-all ${active ? "border-[var(--color-amber)] bg-[var(--color-amber)]/8" : "border-[var(--color-line)] opacity-30"}`}>
                      <div className="text-2xl mb-1">{icons[m]}</div>
                      <div className="text-xs font-medium leading-tight">{m}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {occasionAttrs.length > 0 ? (
            <PerfumeOccasionBars attributes={occasionAttrs} />
          ) : (perfume as Record<string,string>).recommended_occasion ? (
            <section className="mt-10">
              <h2 className="font-display text-xl mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">Ocasiones de uso</h2>
              <div className="flex flex-wrap gap-2">
                {((perfume as Record<string,string>).recommended_occasion ?? "").split(",").filter(Boolean).map((s: string) => {
                  const icons: Record<string,string> = {
                    "uso diario":"🌿", "trabajo / oficina":"💼", "casual":"👟",
                    "citas":"🌹", "salidas / noche":"🌙", "formal / eventos":"🎩",
                    "deportivo":"⚡", "regalo":"🎁",
                  };
                  const key = s.trim().toLowerCase();
                  const icon = Object.entries(icons).find(([k]) => key.includes(k.split("/")[0].trim()))?.[1] ?? "✨";
                  return (
                    <span key={s} className="flex items-center gap-1.5 border border-[var(--color-arabe-green)]/30 bg-[var(--color-arabe-green)]/5 rounded-full px-3 py-1.5 text-sm text-[var(--color-ink)]/80">
                      {icon} {s.trim()}
                    </span>
                  );
                })}
              </div>
            </section>
          ) : null}

          <BannerSlot label="después del rendimiento" />

          {/* VEREDICTO */}
          <PerfumeVerdict perfume={perfume} accent={accent} />

          {/* DESCRIPCIÓN */}
          {perfume.editorial_description && (
            <section className="mt-10">
              <h2 className="font-display text-xl mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">Descripción</h2>
              <p className="text-[15px] leading-relaxed text-[var(--color-ink)]/85">{perfume.editorial_description}</p>
            </section>
          )}

          {/* PIRÁMIDE */}
          <PerfumeNotesPyramid notes={allNotes} />

          {/* PROS/CONTRAS */}
          <PerfumeProsCons pros={perfume.pros} cons={perfume.cons} />

          {/* SIMILARES */}
          <PerfumeSimilarList similars={similars} />

          <BannerSlot label="antes de reviews" />

          {/* REVIEWS */}
          <ReviewPlaceholder />

          {/* FAQ */}
          <PerfumeFAQ faqs={faqs} />

          {/* DISCLAIMER LEGAL */}
          <p className="mt-8 text-xs text-[var(--color-ink)]/40 border-t border-[var(--color-line)] pt-6">
            Las marcas mencionadas pertenecen a sus respectivos dueños. Las comparaciones son referencias olfativas y no implican relación comercial con las marcas originales. {perfume.brand?.name} es marca registrada de su titular.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
