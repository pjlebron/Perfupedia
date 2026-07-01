export default function PerfumeProsCons({
  pros,
  cons,
}: {
  pros: string | null;
  cons: string | null;
}) {
  if (!pros && !cons) return null;

  const prosList = pros?.split(";").map((s) => s.trim()).filter(Boolean) ?? [];
  const consList = cons?.split(";").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl mb-5 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-[var(--color-line)]">
        Pros y contras
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {prosList.length > 0 && (
          <div className="border border-[var(--color-line)] rounded-xl p-5">
            <div className="text-xs uppercase tracking-wide font-semibold text-[var(--color-celeste)] mb-4">
              ✓ A favor
            </div>
            <ul className="flex flex-col gap-2.5">
              {prosList.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[var(--color-ink)]/85">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-celeste)] flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {consList.length > 0 && (
          <div className="border border-[var(--color-line)] rounded-xl p-5">
            <div className="text-xs uppercase tracking-wide font-semibold text-[var(--color-copper)] mb-4">
              ✗ A tener en cuenta
            </div>
            <ul className="flex flex-col gap-2.5">
              {consList.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[var(--color-ink)]/85">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-copper)] flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
