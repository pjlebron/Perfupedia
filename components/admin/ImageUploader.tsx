"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  label: string;
  bucket: "perfumes" | "marcas";
  value?: string | null; // path actual guardado
  onChange: (path: string | null) => void;
  hint?: string;
}

export default function ImageUploader({ label, bucket, value, onChange, hint }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const publicUrl = value
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${value}`
    : null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });

    setUploading(false);

    if (uploadError) {
      setError("Error al subir: " + uploadError.message);
      return;
    }

    onChange(path);
  };

  const handleRemove = async () => {
    if (!value) return;
    await supabase.storage.from(bucket).remove([value]);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label}
        {hint && <span className="text-gray-400 font-normal text-xs ml-1">{hint}</span>}
      </Label>

      {publicUrl ? (
        <div className="relative w-40 h-40 rounded-xl border border-gray-200 overflow-hidden group">
          <Image src={publicUrl} alt={label} fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-40 h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
        >
          {uploading
            ? <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-xs">Subiendo...</span></>
            : <><ImageIcon className="w-6 h-6" /><span className="text-xs">Subir imagen</span><Upload className="w-3.5 h-3.5" /></>
          }
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">JPG, PNG o WEBP · Máximo 5MB</p>
    </div>
  );
}
