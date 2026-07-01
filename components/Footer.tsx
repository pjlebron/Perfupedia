import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-cream)]">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 text-sm text-[var(--color-ink)]/70">
        <p className="font-display text-base text-[var(--color-ink)] mb-2">
          Perfu<span className="italic text-[var(--color-amber)]">pedia</span>
        </p>
        <p className="max-w-md mb-6">
          La guía argentina para descubrir perfumes nacionales, árabes y
          accesibles según aroma, duración, ocasión, estación y presupuesto.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
          <Link href="/sobre-el-proyecto" className="hover:text-[var(--color-amber)]">Sobre Perfupedia</Link>
          <Link href="/contacto" className="hover:text-[var(--color-amber)]">Contacto</Link>
          <Link href="/privacidad" className="hover:text-[var(--color-amber)]">Política de privacidad</Link>
          <Link href="/terminos" className="hover:text-[var(--color-amber)]">Términos y condiciones</Link>
        </div>
        <p className="text-xs text-[var(--color-ink)]/50 max-w-2xl">
          Las marcas mencionadas pertenecen a sus respectivos dueños. Las
          comparaciones entre perfumes son referencias olfativas y no
          implican relación comercial con las marcas originales.
        </p>
      </div>
    </footer>
  );
}
