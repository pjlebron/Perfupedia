import Link from "next/link";
import Image from "next/image";
import PerfumeSearch from "@/components/PerfumeSearch";

export default function Header() {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-cream)]/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Fila 1: logo + nav */}
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Perfupedia"
              width={32}
              height={32}
              className="rounded-sm"
              priority
            />
            <span className="font-display text-xl tracking-tight text-[var(--color-ink)]">
              Perfu<span className="italic text-[var(--color-amber)]">pedia</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/perfumes-arabes" className="hover:text-[var(--color-arabe-green)] transition-colors">Árabes</Link>
            <Link href="/perfumes-nacionales" className="hover:text-[var(--color-celeste)] transition-colors">Nacionales</Link>
            <Link href="/rankings" className="hover:text-[var(--color-amber)] transition-colors">Rankings</Link>
            <Link href="/guias" className="hover:text-[var(--color-amber)] transition-colors">Guías</Link>
          </nav>
        </div>
        {/* Fila 2: buscador */}
        <div className="pb-3">
          <PerfumeSearch />
        </div>
      </div>
    </header>
  );
}
