import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de Privacidad | Perfupedia",
  description: "Política de privacidad de Perfupedia. Cómo recopilamos, usamos y protegemos tu información.",
};

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Política de privacidad" }]} />
          <div className="mt-8">
            <h1 className="font-display text-4xl sm:text-5xl mb-2">Política de privacidad</h1>
            <p className="text-sm text-[var(--color-ink)]/40 mb-8">Última actualización: julio de 2026</p>
            <div className="prose prose-neutral max-w-none text-[var(--color-ink)]/80 leading-relaxed space-y-5">
              <h2 className="font-display text-2xl mb-3">1. Información que recopilamos</h2>
              <p>Perfupedia recopila información de dos maneras:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Automáticamente:</strong> a través de Google Analytics 4, recopilamos datos anónimos de navegación como páginas visitadas, tiempo de permanencia, dispositivo utilizado y ubicación aproximada.</li>
                <li><strong>Voluntariamente:</strong> si en el futuro te registrás o completás formularios, recopilamos la información que nos proporcionás.</li>
              </ul>

              <h2 className="font-display text-2xl mt-8 mb-3">2. Cookies</h2>
              <p>Utilizamos cookies propias y de terceros (Google Analytics) para mejorar la experiencia de navegación y analizar el tráfico del sitio. Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">3. Google Analytics</h2>
              <p>Usamos Google Analytics 4 para entender cómo los usuarios interactúan con el sitio. Los datos recopilados son anónimos y se usan exclusivamente para mejorar el contenido y la experiencia. No vendemos ni compartimos estos datos con terceros.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">4. Links externos y afiliados</h2>
              <p>Perfupedia puede incluir links a tiendas externas o programas de afiliados. No somos responsables por las políticas de privacidad de esos sitios. Cuando un link es de afiliado, lo indicamos claramente.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">5. Seguridad</h2>
              <p>Tomamos medidas razonables para proteger la información del sitio. Sin embargo, ningún sistema de transmisión de datos por internet es 100% seguro.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">6. Cambios en esta política</h2>
              <p>Podemos actualizar esta política periódicamente. Los cambios se publicarán en esta página con la fecha de actualización.</p>

              <h2 className="font-display text-2xl mt-8 mb-3">7. Contacto</h2>
              <p>Para consultas sobre privacidad, escribinos a <strong>hola@perfupedia.com.ar</strong>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
