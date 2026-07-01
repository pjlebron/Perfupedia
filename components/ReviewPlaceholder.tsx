export default function ReviewPlaceholder() {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Opiniones de la comunidad
      </h2>
      <div className="border border-dashed border-[var(--color-ink)]/20 rounded-2xl p-10 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="font-display text-xl mb-2">Las opiniones de usuarios estarán disponibles próximamente</h3>
        <p className="text-sm text-[var(--color-ink)]/55 max-w-sm mx-auto">
          Cuando activemos la comunidad, vas a poder ver votos reales, reseñas y calificaciones de quienes probaron este perfume en Argentina.
        </p>
      </div>
    </section>
  );
}
