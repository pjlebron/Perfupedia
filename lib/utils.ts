import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Slug consistente para notas/marcas/etc: sin acentos, sin puntuacion, con guiones.
export function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Los campos de texto de notas (notes_top/heart/base) vienen separados por
// coma o punto y coma segun el perfume, con puntos finales sueltos.
export function splitNotes(text: string | null | undefined) {
  return (text ?? "")
    .split(/[,;]/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);
}
