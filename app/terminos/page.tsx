import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Perfupedia",
  description: "Términos y condiciones de uso de Perfupedia.",
};

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Términos y condiciones" }]} />
          <div className="mt-8">
            <h1 className="font-display text-4xl sm:text-5xl mb-2">Términos y condiciones</h1>
            <p className="text-sm text-[var(--color-ink)]/40 mb-8">Última actualización: julio de 2026</p>
            <div className="prose prose-neutral max-w-none text-[var(--color-ink)]/80 leading-relaxed space-y-5">
              <h2 className="font-display text-2xl mb-3">1. Uso del sitio</h2>
              <p>Al acceder a Perfupedia aceptás estos términos. El contenido del sitio es de carácter informativo y editorial. No nos hacemos responsables por decisiones de compra basadas en la información publicada.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">2. Propiedad intelectual</h2>
              <p>El contenido editorial de Perfupedia — textos, reseñas, rankings, descripciones y diseño — es propiedad de Perfupedia y no puede reproducirse sin autorización. Los nombres de marcas y perfumes mencionados pertenecen a sus respectivos propietarios.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">3. Comparaciones olfativas</h2>
              <p>Las referencias a similitudes entre perfumes ("inspirado en", "similar a", "dupe de") son exclusivamente descripciones olfativas editoriales basadas en la percepción del aroma. <strong>No implican ninguna relación comercial, de propiedad, ni jurídica entre las marcas mencionadas.</strong> Cada marca es propietaria de su identidad, nombre y registros.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">4. Precios y disponibilidad</h2>
              <p>Los precios en ARS son estimados y pueden variar. Perfupedia no garantiza la disponibilidad ni el precio de ningún producto. Los rangos de precio son orientativos al momento de publicación.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">5. Links de afiliado</h2>
              <p>Perfupedia puede recibir comisiones por compras realizadas a través de links de afiliados. Esto no afecta la objetividad de nuestras reseñas. Identificamos claramente el contenido patrocinado.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">6. Contenido patrocinado</h2>
              <p>Cualquier reseña, artículo o mención pagada estará claramente identificada como "contenido patrocinado" o "publicidad". El contenido editorial no está influenciado por acuerdos comerciales.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">7. Modificaciones</h2>
              <p>Podemos modificar estos términos en cualquier momento. Los cambios se publicarán en esta página con la fecha de actualización.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">8. Contacto</h2>
              <p>Para consultas sobre estos términos, escribinos a <strong>hola@perfupedia.com.ar</strong>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
