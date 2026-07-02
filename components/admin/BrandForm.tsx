"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema, type BrandFormValues } from "@/schemas/brand.schema";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/admin/FormSection";
import SlugInput from "@/components/admin/SlugInput";
import StatusSelect from "@/components/admin/StatusSelect";
import ImageUploader from "@/components/admin/ImageUploader";
import SeoFields from "@/components/admin/SeoFields";
import { Loader2, Save } from "lucide-react";

const BRAND_TYPES = [
  { value: "arabe",         label: "Árabe" },
  { value: "nacional",      label: "Nacional argentina" },
  { value: "disenador",     label: "Diseñador internacional" },
  { value: "independiente", label: "Independiente" },
  { value: "importador",    label: "Importador" },
  { value: "otra",          label: "Otra" },
];

interface BrandFormProps {
  defaultValues?: Partial<BrandFormValues>;
  brandId?: string;
}

export default function BrandForm({ defaultValues, brandId }: BrandFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const isEdit = !!brandId;

  const supabase = getSupabaseBrowser();

  // Limpiar campos de Supabase que no están en el schema (id, created_at, etc.)
  const cleanDefaults = defaultValues ? {
    name:              defaultValues.name,
    slug:              defaultValues.slug,
    country:           defaultValues.country,
    type:              defaultValues.type,
    description:       defaultValues.description,
    price_range:       defaultValues.price_range,
    general_style:     defaultValues.general_style,
    status:            defaultValues.status,
    meta_title:        defaultValues.meta_title,
    meta_description:  defaultValues.meta_description,
    main_image_path:   (defaultValues as Record<string,string>).main_image_path,
  } : {};

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      status: "draft",
      type: "arabe",
      ...cleanDefaults,
    },
  });

  const nameValue = watch("name") ?? "";
  const slugValue = watch("slug") ?? "";
  const statusValue = watch("status") ?? "draft";
  const metaTitle = watch("meta_title") ?? "";
  const metaDescription = watch("meta_description") ?? "";

  const onSubmit = async (values: BrandFormValues) => {
    setSaving(true);
    setError("");
    const { error: err } = isEdit
      ? await supabase.from("brands").update(values).eq("id", brandId)
      : await supabase.from("brands").insert(values);
    setSaving(false);
    if (err) { setError("Error al guardar: " + err.message + " (code: " + err.code + ")"); setSaving(false); return; }
    router.push("/admin/marcas");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{isEdit ? "Editar marca" : "Nueva marca"}</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4" /> Guardar</>}
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

      {/* Datos básicos */}
      <FormSection title="Datos básicos">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre de la marca *</Label>
          <Input {...register("name")} placeholder="ej: Lattafa" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <SlugInput
          nameValue={nameValue}
          slugValue={slugValue}
          onSlugChange={(v) => setValue("slug", v)}
          error={errors.slug?.message}
          isEdit={isEdit}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Tipo de marca *</Label>
            <select {...register("type")} className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]">
              {BRAND_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>País de origen</Label>
            <Input {...register("country")} placeholder="ej: Emiratos Árabes Unidos" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Descripción</Label>
          <Textarea {...register("description")} placeholder="Breve descripción de la marca..." rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Rango de precio</Label>
            <Input {...register("price_range")} placeholder="ej: low-mid cost" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Estilo general</Label>
            <Input {...register("general_style")} placeholder="ej: Oriental, dulce, intenso" />
          </div>
        </div>
      </FormSection>

      {/* IMAGEN */}
      <FormSection title="Imagen de la marca" description="Logo o imagen representativa de la marca.">
        <ImageUploader
          label="Logo / Imagen"
          bucket="marcas"
          value={watch("main_image_path") ?? null}
          onChange={(path) => setValue("main_image_path", path)}
          hint="(recomendado: fondo blanco, cuadrada)"
        />
      </FormSection>

      {/* SEO */}
      <FormSection title="SEO" description="Opcional. Si lo dejás vacío se genera automáticamente.">
        <SeoFields
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          onMetaTitleChange={(v) => setValue("meta_title", v)}
          onMetaDescriptionChange={(v) => setValue("meta_description", v)}
        />
      </FormSection>

      {/* Estado */}
      <FormSection title="Estado de publicación">
        <StatusSelect value={statusValue} onChange={(v) => setValue("status", v as "draft" | "published" | "archived")} />
      </FormSection>
    </form>
  );
}
