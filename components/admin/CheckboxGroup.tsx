"use client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxGroupProps {
  label: string;
  options: string[];
  value: string; // comma-separated
  onChange: (v: string) => void;
  columns?: number;
}

export default function CheckboxGroup({ label, options, value, onChange, columns = 3 }: CheckboxGroupProps) {
  const selected = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    onChange(next.join(", "));
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className={cn("grid gap-2", {
        "grid-cols-2": columns === 2,
        "grid-cols-3": columns === 3,
        "grid-cols-4": columns === 4,
      })}>
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                checked
                  ? "border-[var(--color-arabe-green)] bg-[var(--color-arabe-green)]/8 text-[var(--color-arabe-green)] font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <span className={cn(
                "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center",
                checked ? "bg-[var(--color-arabe-green)] border-[var(--color-arabe-green)]" : "border-gray-300"
              )}>
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
