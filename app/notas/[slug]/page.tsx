export const revalidate = 0;

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PerfumeCard from "@/components/PerfumeCard";
import { supabase } from "@/lib/supabase";
import { splitNotes, toSlug } from "@/lib/utils";

type PerfumeRow = {
  name: string;
  slug: string;
  origin: string;
  gender: string;
  concentration: string | null;
  aroma_summary: string | null;
  price_range_ars: string | null;
  editorial_score: number | null;
  main_image_path: string | null;
  notes_top: string | null;
  notes_heart: string | null;
  notes_base: string | null;
  brand: { name: string; slug: string } | null;
  olfactive_family: { name: string } | null;
  perfume_notes: { note: { slug: string } | null }[];
};

async function getNoteData(slug: string) {
  const [noteRow, perfumesRes] = await Promise.all([
    supabase.from("notes").select("*").eq("slug", slug).maybeSingle(),
    supabase
      .from("perfumes")
      .select(
        `name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, main_image_path,
         notes_top, notes_heart, notes_base,
         brand:brands(name,slug), olfactive_family:olfactive_families(name),
         perfume_notes(note:notes(slug))`,
      )
      .eq("status", "published"),
  ]);

  const allPerfumes = (perfumesRes.data ?? []) as unknown as PerfumeRow[];

  const perfumes = allPerfumes.filter((p) => {
    const relSlugs = (p.perfume_notes ?? []).map((pn) => pn.note?.slug).filter(Boolean);
    if (relSlugs.includes(slug)) return true;
    const textNotes = [...splitNotes(p.notes_top), ...splitNotes(p.notes_heart), ...splitNotes(p.notes_base)];
    return textNotes.some((n) => toSlug(n) === slug);
  });

  if (!noteRow.data && perfumes.length === 0) return null;

  let displayName = noteRow.data?.name ?? null;
  if (!displayName) {
    for (const p of perfumes) {
      const textNotes = [...splitNotes(p.notes_top), ...splitNotes(p.notes_heart), ...splitNotes(p.notes_base)];
      const match = textNotes.find((n) => toSlug(n) === slug);
      if (match) { displayName = match; break; }
    }
  }

  return { note: noteRow.data, displayName: displayName ?? slug, perfumes };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getNoteData(slug);
  if (!data) return {};
  const title = data.note?.meta_title || `Perfumes con nota de ${data.displayName} | Blog de Perfumes Argentina`;
  const description =
    data.note?.meta_description ||
    data.note?.description ||
    `Descubrí perfumes disponibles en Argentina con nota de ${data.displayName}: ${data.perfumes.length} fichas con reseña completa.`;
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getNoteData(slug);
  if (!data) notFound();

  const { note, displayName, perfumes } = data;

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Perfumes", href: "/perfumes" },
              { label: displayName },
            ]}
          />

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-2 text-[var(--color-amber)]">
              Nota olfativa
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] capitalize">{displayName}</h1>
            {note?.description && (
              <p className="mt-4 text-base text-[var(--color-ink)]/70 max-w-2xl leading-relaxed">{note.description}</p>
            )}
            {note?.how_it_smells && (
              <p className="mt-3 text-sm text-[var(--color-ink)]/60 max-w-2xl leading-relaxed">
                <strong className="text-[var(--color-ink)]/80">¿A qué huele? </strong>
                {note.how_it_smells}
              </p>
            )}
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
              Perfumes con {displayName}
            </h2>
            {perfumes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {perfumes.map((p) => (
                  <PerfumeCard key={p.slug} perfume={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[var(--color-line)] rounded-2xl text-[var(--color-ink)]/40">
                Todavía no hay fichas publicadas con esta nota.
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
