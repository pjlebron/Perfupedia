"use client";
import { Label } from "@/components/ui/label";

const OPTIONS = [
  { value: "draft",     label: "Borrador — no visible en el sitio" },
  { value: "published", label: "Publicado — visible para todos" },
  { value: "archived",  label: "Archivado — oculto sin borrar" },
];

interface StatusSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Estado de publicación</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
