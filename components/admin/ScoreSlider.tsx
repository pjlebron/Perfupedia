"use client";
import { Label } from "@/components/ui/label";

const LABELS: Record<string, string[]> = {
  duration:     ["", "Muy corta", "Corta", "Moderada", "Larga", "Excepcional"],
  projection:   ["", "Íntima", "Discreta", "Moderada", "Fuerte", "Bestial"],
  sillage:      ["", "Discreta", "Suave", "Moderada", "Fuerte", "Legendaria"],
  price_quality:["", "Pobre", "Aceptable", "Buena", "Muy buena", "Excelente"],
};

interface ScoreSliderProps {
  label: string;
  type: keyof typeof LABELS;
  value: number | null | undefined;
  onChange: (v: number) => void;
}

export default function ScoreSlider({ label, type, value, onChange }: ScoreSliderProps) {
  const v = value ?? 3;
  const text = LABELS[type]?.[v] ?? "";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium text-[var(--color-amber)]">{v}/5 — {text}</span>
      </div>
      <input
        type="range" min={1} max={5} step={1} value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-amber)]"
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        {LABELS[type]?.slice(1).map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
