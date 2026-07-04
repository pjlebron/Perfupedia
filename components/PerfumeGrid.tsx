import { supabase } from "@/lib/supabase";
import PerfumeCard from "@/components/PerfumeCard";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  lockedOrigin?: string;
};

export default async function PerfumeGrid({ searchParams, lockedOrigin }: Props) {
  const page   = Number(searchParams.pagina ?? 1);
  const orden  = String(searchParams.orden  ?? "recientes");
  const genero = searchParams.genero as string | undefined;
  const conc   = searchParams.concentracion as string | undefined;
  const origen = lockedOrigin ?? (searchParams.origen as string | undefined);

  // Traer total para paginación
  let countQuery = supabase
    .from("perfumes")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  if (origen)  countQuery = countQuery.eq("origin", origen);
  if (genero)  countQuery = countQuery.eq("gender", genero);
  if (conc)    countQuery = countQuery.eq("concentration", conc);

  const { count } = await countQuery;
  const total      = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from       = (page - 1) * PAGE_SIZE;
  const to         = from + PAGE_SIZE - 1;

  // Traer perfumes
  let query = supabase
    .from("perfumes")
    .select(`name, slug, origin, gender, concentration, aroma_summary, price_range_ars, editorial_score, main_image_path, brand:brands(name,slug), olfactive_family:olfactive_families(name)`)
    .eq("status", "published");

  if (origen)  query = query.eq("origin", origen);
  if (genero)  query = query.eq("gender", genero);
  if (conc)    query = query.eq("concentration", conc);

  if (orden === "puntuacion") {
    query = query.order("editorial_score", { ascending: false }).order("name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }).order("name", { ascending: true });
  }

  query = query.range(from, to);

  const { data: perfumes } = await query;
  const list = (perfumes ?? []) as unknown as Parameters<typeof PerfumeCard>[0]["perfume"][];

  if (list.length === 0) {
    return (
      <div className="border border-dashed border-[var(--color-line)] rounded-2xl py-20 text-center text-[var(--color-ink)]/40">
        <div className="text-4xl mb-3">🧴</div>
        <p className="text-sm">No encontramos perfumes con esos filtros.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-xs text-[var(--color-ink)]/45 mb-5">
        {total} perfume{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {list.map((p) => (
          <PerfumeCard key={p.slug} perfume={p} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}
