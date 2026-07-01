type FAQ = { question: string; answer: string };

export default function PerfumeFAQ({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="mt-10 mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Preguntas frecuentes
      </h2>
      <div className="flex flex-col divide-y divide-[var(--color-line)]">
        {faqs.map((f, i) => (
          <details key={i} className="group py-4">
            <summary className="flex justify-between items-center cursor-pointer text-sm font-medium list-none">
              {f.question}
              <span className="text-[var(--color-ink)]/40 group-open:rotate-45 transition-transform text-xl leading-none ml-4 flex-shrink-0">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-[var(--color-ink)]/75 leading-relaxed pr-8">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
