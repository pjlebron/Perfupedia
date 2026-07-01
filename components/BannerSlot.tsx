export default function BannerSlot({ label }: { label: string }) {
  return (
    <div className="my-10 flex items-center justify-center rounded-lg border border-dashed border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] py-6 text-[11px] uppercase tracking-wide text-[var(--color-ink)]/35">
      Espacio publicitario · {label}
    </div>
  );
}
