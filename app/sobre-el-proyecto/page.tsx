import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sobre Perfupedia | La guía argentina de perfumes",
  description: "Perfupedia es la plataforma editorial argentina de perfumes nacionales, árabes y accesibles. Fichas, reseñas, rankings y guías de compra.",
};

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Sobre Perfupedia" }]} />
          <div className="mt-8">
            <h1 className="font-display text-4xl sm:text-5xl mb-6">Sobre Perfupedia</h1>
            <div className="prose prose-neutral max-w-none text-[var(--color-ink)]/80 leading-relaxed space-y-5">
              <p>
                <strong>Perfupedia</strong> es la guía editorial argentina de perfumes nacionales, árabes y accesibles. Nació con una idea simple: que cualquier persona en Argentina pueda descubrir qué perfumes realmente valen la pena, cuánto duran, cómo proyectan y para qué ocasión sirven — sin tener que gastar una fortuna ni depender de reseñas genéricas de otros países.
              </p>
              <p>
                En Argentina hay marcas nacionales excelentes, perfumes árabes con una relación precio/calidad increíble y alternativas accesibles a los grandes clásicos del mundo. El problema es que esa información está dispersa, es difícil de encontrar y casi nunca está adaptada al mercado local: precios en pesos, disponibilidad real, clima argentino.
              </p>
              <p>
                Perfupedia apunta a cambiar eso. Cada ficha que publicamos está pensada para el consumidor argentino: con precios en ARS, recomendaciones por estación (nuestro verano, nuestro invierno), y una mirada editorial honesta que no depende de ninguna marca ni acuerdo comercial.
              </p>
              <h2 className="font-display text-2xl mt-8 mb-3">¿Qué encontrás en Perfupedia?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Fichas completas de perfumes con notas olfativas, rendimiento, precio y disponibilidad</li>
                <li>Rankings editoriales por duración, proyección, precio/calidad, estación y ocasión</li>
                <li>Guías de compra pensadas para el mercado argentino</li>
                <li>Información sobre perfumes árabes, nacionales y alternativas económicas</li>
                <li>Comparaciones entre perfumes para ayudarte a elegir</li>
              </ul>
              <h2 className="font-display text-2xl mt-8 mb-3">Sobre las comparaciones</h2>
              <p>
                Cuando mencionamos que un perfume es "similar" o "inspirado en" otro perfume conocido, nos referimos exclusivamente a una similitud olfativa percibida. Estas comparaciones son referencias para orientar al consumidor y no implican ninguna relación comercial, jurídica ni de propiedad entre las marcas mencionadas. Cada marca es propietaria de sus nombres, marcas registradas e identidad.
              </p>
              <h2 className="font-display text-2xl mt-8 mb-3">Transparencia editorial</h2>
              <p>
                Los puntajes y reseñas de Perfupedia son editoriales hasta que el sistema de votos de usuarios esté activo. Cuando una reseña o contenido es patrocinado, lo indicamos claramente. Nunca publicamos contenido pagado sin identificarlo.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
