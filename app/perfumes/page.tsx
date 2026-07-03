export const revalidate = 0; // Caché de 1 hora — se actualiza automáticamente

import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlot from "@/components/BannerSlot";
import PerfumeFilters from "@/components/PerfumeFilters";
import PerfumeGrid from "@/components/PerfumeGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Todos los perfumes | Blog de Perfumes Argentina",
  description: "Explorá nuestra base de datos de perfumes nacionales, árabes, low cost y mid cost. Filtrá por origen, género, concentración y más.",
};

export default async function PerfumesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Breadcrumbs items={[
            { label: "Inicio", href: "/" },
            { label: "Perfumes" },
          ]} />

          <div className="mt-6 mb-8">
            <h1 className="font-display text-4xl sm:text-5xl">Perfumes</h1>
            <p className="mt-3 text-base text-[var(--color-ink)]/65 max-w-xl">
              Base de datos editorial de perfumes nacionales, árabes y accesibles para el mercado argentino.
            </p>
          </div>

          <BannerSlot label="listado-top" />

          <div className="flex flex-col sm:flex-row gap-8 mt-6">
            {/* Sidebar filtros */}
            <div className="w-full sm:w-52 flex-shrink-0">
              <Suspense>
                <PerfumeFilters />
              </Suspense>
            </div>

            {/* Grid resultados */}
            <div className="flex-1 min-w-0">
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="border border-[var(--color-line)] rounded-2xl aspect-[3/4] animate-pulse bg-[var(--color-ink)]/[0.03]" />
                    ))}
                  </div>
                }
              >
                <PerfumeGrid searchParams={sp} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
