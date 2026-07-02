"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfumeSchema, type PerfumeFormValues } from "@/schemas/perfume.schema";
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
import SeoFields from "@/components/admin/SeoFields";
import ScoreSlider from "@/components/admin/ScoreSlider";
import CheckboxGroup from "@/components/admin/CheckboxGroup";
import ImageUploader from "@/components/admin/ImageUploader";
import { Loader2, Save } from "lucide-react";

type Brand = { id: string; name: string };
type Family = { id: string; name: string };

interface PerfumeFormProps {
  defaultValues?: Partial<PerfumeFormValues>;
  perfumeId?: string;
  brands: Brand[];
  families: Family[];
}

const GENDERS  = [{ value: "hombre", label: "Hombre" }, { value: "mujer", label: "Mujer" }, { value: "unisex", label: "Unisex" }];
const ORIGINS  = [{ value: "arabe", label: "Árabe" }, { value: "nacional", label: "Nacional" }, { value: "disenador", label: "Diseñador" }, { value: "importado", label: "Importado" }, { value: "otro", label: "Otro" }];
const CONCS    = [{ value: "edp", label: "EDP" }, { value: "edt", label: "EDT" }, { value: "extrait", label: "Extrait" }, { value: "perfume", label: "Perfume" }, { value: "body_splash", label: "Body Splash" }, { value: "otro", label: "Otro" }];

export default function PerfumeForm({ defaultValues, perfumeId, brands, families }: PerfumeFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!perfumeId;

  const supabase = getSupabaseBrowser();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PerfumeFormValues>({
    resolver: zodResolver(perfumeSchema),
    defaultValues: {
      status: "draft",
      origin: "arabe",
      gender: "unisex",
      concentration: "edp",
      duration_score: 3,
      projection_score: 3,
      sillage_score: 3,
      price_quality_score: 4,
      ...defaultValues,
    },
  });

  const nameVal       = watch("name") ?? "";
  const imageVal      = watch("main_image_path");
  const slugVal     = watch("slug") ?? "";
  const brandVal    = watch("brand_id") ?? "";
  const statusVal   = watch("status") ?? "draft";
  const metaTitle   = watch("meta_title") ?? "";
  const metaDesc    = watch("meta_description") ?? "";
  const durScore    = watch("duration_score");
  const projScore   = watch("projection_score");
  const silScore    = watch("sillage_score");
  const pqScore     = watch("price_quality_score");

  // Genera el slug con el prefijo de la marca
  const selectedBrand = brands.find((b) => b.id === brandVal);
  const brandSlug = selectedBrand?.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "";

  const onSubmit = async (values: PerfumeFormValues) => {
    setSaving(true);
    setError("");

    const { duration_score, projection_score, sillage_score, price_quality_score, ...perfumeData } = values;

    // Guardar/actualizar perfume
    let perfId = perfumeId;
    if (isEdit) {
      const { error: err } = await supabase.from("perfumes").update(perfumeData).eq("id", perfumeId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { data, error: err } = await supabase.from("perfumes").insert(perfumeData).select("id").single();
      if (err) { setError(err.message); setSaving(false); return; }
      perfId = data.id;
    }

    // Guardar scores editoriales
    if (perfId) {
      await supabase.from("perfume_editorial_scores").upsert({
        perfume_id: perfId,
        duration_score, projection_score, sillage_score, price_quality_score,
      }, { onConflict: "perfume_id" });
    }

    setSaving(false);
    router.push("/admin/perfumes");
    router.refresh();
  };

  const sel = (field: string) => ({
    ...register(field as keyof PerfumeFormValues),
    className: "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]"
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{isEdit ? "Editar perfume" : "Nuevo perfume"}</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : <><Save className="w-4 h-4" /> Guardar</>}
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

      {/* 1. DATOS BÁSICOS */}
      <FormSection title="1 · Datos básicos">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre del perfume *</Label>
          <Input {...register("name")} placeholder="ej: Khamrah" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Marca *</Label>
          <select {...sel("brand_id")}>
            <option value="">— Elegí una marca —</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          {errors.brand_id && <p className="text-xs text-red-500">{errors.brand_id.message}</p>}
        </div>

        <SlugInput
          nameValue={nameVal}
          slugValue={slugVal}
          onSlugChange={(v) => setValue("slug", v)}
          prefix={brandSlug}
          error={errors.slug?.message}
          isEdit={isEdit}
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Origen *</Label>
            <select {...sel("origin")}>
              {ORIGINS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Género *</Label>
            <select {...sel("gender")}>
              {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Concentración</Label>
            <select {...sel("concentration")}>
              {CONCS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Tamaños disponibles</Label>
            <Input {...register("available_sizes")} placeholder="ej: 100ml, 50ml" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>País de origen</Label>
            <Input {...register("country")} placeholder="ej: Emiratos Árabes Unidos" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Familia olfativa</Label>
          <select {...sel("olfactive_family_id")}>
            <option value="">— Sin familia asignada —</option>
            {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      </FormSection>

      {/* 2. DESCRIPCIÓN EDITORIAL */}
      <FormSection title="2 · Descripción editorial">
        <div className="flex flex-col gap-1.5">
          <Label>Frase resumen del aroma</Label>
          <Input {...register("aroma_summary")} placeholder="ej: Especiado, dulce y cálido, ideal para climas fríos" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Descripción completa</Label>
          <Textarea {...register("editorial_description")} rows={5} placeholder="Descripción detallada del perfume: cómo huele, evolución, estilo, público..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Opinión rápida</Label>
          <Input {...register("quick_opinion")} placeholder="ej: Uno de los mejores árabes de entrada en Argentina" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Pros (separá con ";")</Label>
            <Textarea {...register("pros")} rows={3} placeholder="ej: Muy duradero; buena proyección; precio accesible" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Contras (separá con ";")</Label>
            <Textarea {...register("cons")} rows={3} placeholder="ej: Muy intenso para verano; puede invadir" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Veredicto</Label>
          <Textarea {...register("verdict")} rows={2} placeholder="Conclusión final sobre el perfume..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Puntaje editorial (0 a 10)</Label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={10} step={0.5}
              value={watch("editorial_score") ?? 7}
              onChange={(e) => setValue("editorial_score", Number(e.target.value))}
              className="flex-1 accent-[var(--color-amber)]"
            />
            <span className="text-lg font-display w-12 text-center">
              {watch("editorial_score") ?? 7}
            </span>
          </div>
        </div>
      </FormSection>

      {/* 3. RENDIMIENTO */}
      <FormSection title="3 · Rendimiento" description="Del 1 (peor) al 5 (mejor). Se muestra como barras en la ficha.">
        <ScoreSlider label="Duración"          type="duration"      value={durScore}  onChange={(v) => setValue("duration_score", v)} />
        <ScoreSlider label="Proyección"         type="projection"    value={projScore} onChange={(v) => setValue("projection_score", v)} />
        <ScoreSlider label="Estela / Sillage"   type="sillage"       value={silScore}  onChange={(v) => setValue("sillage_score", v)} />
        <ScoreSlider label="Precio / Calidad"   type="price_quality" value={pqScore}   onChange={(v) => setValue("price_quality_score", v)} />
      </FormSection>

      {/* 4. NOTAS OLFATIVAS */}
      <FormSection title="4 · Pirámide olfativa" description="Escribí las notas separadas por coma. Ej: Vainilla, Oud, Canela">
        <div className="flex flex-col gap-1.5">
          <Label>Notas de salida <span className="text-gray-400 font-normal text-xs">(las primeras que se sienten)</span></Label>
          <Input {...register("notes_top")} placeholder="ej: Bergamota, Limón, Pimienta" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Notas de corazón <span className="text-gray-400 font-normal text-xs">(el alma del perfume)</span></Label>
          <Input {...register("notes_heart")} placeholder="ej: Rosa, Jazmín, Canela" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Notas de fondo <span className="text-gray-400 font-normal text-xs">(las que quedan en la piel)</span></Label>
          <Input {...register("notes_base")} placeholder="ej: Vainilla, Oud, Almizcle" />
        </div>
      </FormSection>

      {/* 5. PRECIO Y DISPONIBILIDAD */}
      <FormSection title="4 · Precio y disponibilidad">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Rango de precio en AR$</Label>
            <Input {...register("price_range_ars")} placeholder="ej: $15.000 - $20.000" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Relación precio/calidad</Label>
            <Input {...register("price_quality_ratio")} placeholder="ej: Excelente" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Dónde conseguirlo en Argentina</Label>
          <Input {...register("availability_in_argentina")} placeholder="ej: Perfumerías árabes y online" />
        </div>
      </FormSection>

      {/* 6. RECOMENDACIONES */}
      <FormSection title="6 · Recomendaciones de uso">
        <CheckboxGroup
          label="Estación recomendada"
          options={["Primavera", "Verano", "Otoño", "Invierno"]}
          value={watch("recommended_season") ?? ""}
          onChange={(v) => setValue("recommended_season", v)}
          columns={4}
        />
        <CheckboxGroup
          label="Momento del día"
          options={["Mañana", "Tarde", "Noche", "Cualquier momento"]}
          value={watch("recommended_time_of_day") ?? ""}
          onChange={(v) => setValue("recommended_time_of_day", v)}
          columns={4}
        />
        <CheckboxGroup
          label="Ocasión de uso"
          options={["Uso diario", "Trabajo / Oficina", "Casual", "Citas", "Salidas / Noche", "Formal / Eventos", "Deportivo", "Regalo"]}
          value={watch("recommended_occasion") ?? ""}
          onChange={(v) => setValue("recommended_occasion", v)}
          columns={2}
        />
        <div className="flex flex-col gap-1.5">
          <Label>Perfil de usuario recomendado <span className="text-gray-400 font-normal">(opcional)</span></Label>
          <Input {...register("recommended_user_style")} placeholder="ej: Hombres que buscan presencia y duración" />
        </div>
      </FormSection>

      {/* 7. IMAGEN */}
      <FormSection title="7 · Imagen del frasco" description="Foto del perfume que se muestra en la ficha y en los listados.">
        <ImageUploader
          label="Imagen principal"
          bucket="perfumes"
          value={imageVal}
          onChange={(path) => setValue("main_image_path", path)}
          hint="(recomendado: fondo blanco, cuadrada)"
        />
      </FormSection>

      {/* 8. SEO */}
      <FormSection title="8 · SEO" description="Opcional. Si lo dejás vacío se genera automáticamente.">
        <SeoFields
          metaTitle={metaTitle}
          metaDescription={metaDesc}
          onMetaTitleChange={(v) => setValue("meta_title", v)}
          onMetaDescriptionChange={(v) => setValue("meta_description", v)}
        />
      </FormSection>

      {/* 8. ESTADO */}
      <FormSection title="9 · Estado de publicación">
        <StatusSelect value={statusVal} onChange={(v) => setValue("status", v as "draft" | "published" | "archived")} />
      </FormSection>
    </form>
  );
}
