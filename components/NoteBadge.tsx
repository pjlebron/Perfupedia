import Link from "next/link";

export default function NoteBadge({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return (
    <Link
      href={`/notas/${slug}`}
      className="inline-flex items-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-3 py-1 text-xs text-[var(--color-ink)]/80 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/20 transition-colors"
    >
      {name}
    </Link>
  );
}
