"use client";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface SlugInputProps {
  nameValue: string;
  slugValue: string;
  onSlugChange: (slug: string) => void;
  prefix?: string;
  error?: string;
  isEdit?: boolean;
}

export default function SlugInput({ nameValue, slugValue, onSlugChange, prefix, error, isEdit }: SlugInputProps) {
  useEffect(() => {
    if (!isEdit && nameValue) {
      const generated = prefix ? `${prefix}-${toSlug(nameValue)}` : toSlug(nameValue);
      onSlugChange(generated);
    }
  }, [nameValue, prefix, isEdit, onSlugChange]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Slug (URL)</Label>
      <Input
        value={slugValue}
        onChange={(e) => onSlugChange(e.target.value)}
        placeholder="nombre-del-perfume"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">
        URL: /perfume/<strong>{slugValue || "..."}</strong>
      </p>
    </div>
  );
}
