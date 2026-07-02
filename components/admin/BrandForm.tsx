"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/admin/FormSection";
import StatusSelect from "@/components/admin/StatusSelect";
import SeoFields from "@/components/admin/SeoFields";
import ImageUploader from "@/components/admin/ImageUploader";
import { Loader2, Save } from "lucide-react";

const BRAND_TYPES = [
  { value: "arabe",         label: "Árabe" },
  { value: "nacional",      label: "Nacional argentina" },
  { value: "disenador",     label: "Diseñador internacional" },
  { value: "independiente", label: "Independiente" },
  { value: "importador",    label: "Importador" },
  { value: "otra",          label: "Otra" },
];

function toSlug(str: string) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

interface BrandFormProps {
  defaultValues?: Record<string, unknown>;
  brandId?: string;
}

export default function BrandForm({ defaultValues, brandId }: BrandFormProps) {
  const router = useRouter();
  const isEdit = !!brandId;

  const [form, setForm] = useState({
    name:             String(defaultValues?.name ?? ""),
    slug:             String(defaultValues?.slug ?? ""),
    country:          String(defaultValues?.country ?? ""),
    type:             String(defaultValues?.type ?? "arabe"),
    description:      String(defaultValues?.description ?? ""),
    price_range:      String(defaultValues?.price_range ?? ""),
    general_style:    String(defaultValues?.general_style ?? ""),
    status:           String(defaultValues?.status ?? "draft"),
    meta_title:       String(defaultValues?.meta_title ?? ""),
    meta_description: String(defaultValues?.meta_description ?? ""),
    main_image_path:  (defaultValues?.main_image_path as string | null) ?? null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: unknown) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      // Auto-generar slug desde el nombre (solo en modo nuevo)
      if (field === "name" && !isEdit) {
        next.slug = toSlug(String(value));
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    if (!form.slug.trim()) { setError("El slug es obligatorio."); return; }

    setSaving(true);
    setError("");

    const payload = {
      name:             form.name,
      slug:             form.slug,
      country:          form.country || null,
      type:             form.type,
      description:      form.description || null,
      price_range:      form.price_range || null,
      general_style:    form.general_style || null,
      status:           form.status,
      meta_title:       form.meta_title || null,
      meta_description: form.meta_description || null,
      main_image_path:  form.main_image_path || null,
    };

    const { error: err } = isEdit
      ? await supabase.from("brands").update(payload).eq("id", brandId)
      : await supabase.from("brands").insert(payload);

    setSaving(false);

    if (err) {
      setError("Error al guardar: " + err.message);
      return;
    }

    router.push("/admin/marcas");
    router.refresh();
  };

  const sel = "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]";

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{isEdit ? "Editar marca" : "Nueva marca"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4" /> Guardar</>}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <FormSection title="Datos básicos">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre de la marca *</Label>
          <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="ej: Lattafa" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Slug (URL)</Label>
          <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="ej: lattafa" />
          <p className="text-xs text-gray-400">URL: /marca/<strong>{form.slug || "..."}</strong></p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Tipo de marca *</Label>
            <select value={form.type} onChange={e => set("type", e.target.value)} className={sel}>
              {BRAND_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>País de origen</Label>
            <Input value={form.country} onChange={e => set("country", e.target.value)} placeholder="ej: Emiratos Árabes Unidos" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Descripción</Label>
          <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Breve descripción de la marca..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Rango de precio</Label>
            <Input value={form.price_range} onChange={e => set("price_range", e.target.value)} placeholder="ej: low-mid cost" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Estilo general</Label>
            <Input value={form.general_style} onChange={e => set("general_style", e.target.value)} placeholder="ej: Oriental, dulce, intenso" />
          </div>
        </div>
      </FormSection>

      <FormSection title="Imagen">
        <ImageUploader
          label="Logo / Imagen"
          bucket="marcas"
          value={form.main_image_path}
          onChange={path => set("main_image_path", path)}
          hint="(recomendado: fondo blanco, cuadrada)"
        />
      </FormSection>

      <FormSection title="SEO" description="Opcional — se genera automáticamente si lo dejás vacío.">
        <SeoFields
          metaTitle={form.meta_title}
          metaDescription={form.meta_description}
          onMetaTitleChange={v => set("meta_title", v)}
          onMetaDescriptionChange={v => set("meta_description", v)}
        />
      </FormSection>

      <FormSection title="Estado de publicación">
        <StatusSelect value={form.status} onChange={v => set("status", v)} />
      </FormSection>
    </div>
  );
}
