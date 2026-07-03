import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contacto | Perfupedia",
  description: "Contactate con el equipo de Perfupedia para consultas, sugerencias o acuerdos comerciales.",
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />
          <div className="mt-8">
            <h1 className="font-display text-4xl sm:text-5xl mb-6">Contacto</h1>
            <div className="text-[var(--color-ink)]/80 leading-relaxed space-y-5">
              <p>¿Tenés una consulta, sugerencia o querés proponer un acuerdo comercial? Escribinos.</p>

              <div className="border border-[var(--color-line)] rounded-2xl p-6 space-y-4 bg-white">
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]/50 uppercase tracking-wide mb-1">Consultas generales y sugerencias</p>
                  <p className="font-medium">hola@perfupedia.com.ar</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]/50 uppercase tracking-wide mb-1">Acuerdos comerciales y publicidad</p>
                  <p className="font-medium">publicidad@perfupedia.com.ar</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]/50 uppercase tracking-wide mb-1">Sugerir un perfume para reseñar</p>
                  <p className="text-sm text-[var(--color-ink)]/60">Usá el mail de consultas generales con el asunto "Sugerencia de perfume".</p>
                </div>
              </div>

              <p className="text-sm text-[var(--color-ink)]/50">
                Respondemos en un plazo de 48 a 72 horas hábiles. Para acuerdos comerciales, incluí información sobre tu marca o producto.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
