"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, type ArticleFormValues } from "@/schemas/article.schema";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/admin/FormSection";
import SlugInput from "@/components/admin/SlugInput";
import StatusSelect from "@/components/admin/StatusSelect";
import SeoFields from "@/components/admin/SeoFields";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Loader2, Save } from "lucide-react";

type Category = { id: string; name: string };

interface ArticleFormProps {
  defaultValues?: Partial<ArticleFormValues>;
  articleId?: string;
  categories: Category[];
}

export default function ArticleForm({ defaultValues, articleId, categories }: ArticleFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!articleId;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: { status: "draft", ...defaultValues },
  });

  const titleVal  = watch("title") ?? "";
  const slugVal   = watch("slug") ?? "";
  const statusVal = watch("status") ?? "draft";
  const metaTitle = watch("meta_title") ?? "";
  const metaDesc  = watch("meta_description") ?? "";

  const onSubmit = async (values: ArticleFormValues) => {
    setSaving(true);
    setError("");
    const payload = {
      ...values,
      published_at: values.status === "published" && !values.published_at
        ? new Date().toISOString()
        : values.published_at,
    };
    const { error: err } = isEdit
      ? await supabase.from("articles").update(payload).eq("id", articleId)
      : await supabase.from("articles").insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/admin/articulos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{isEdit ? "Editar artículo" : "Nuevo artículo"}</h1>
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
          <Label>Título del artículo *</Label>
          <Input {...register("title")} placeholder="ej: Los mejores perfumes árabes para hombre en Argentina" />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <SlugInput
          nameValue={titleVal}
          slugValue={slugVal}
          onSlugChange={(v) => setValue("slug", v)}
          error={errors.slug?.message}
          isEdit={isEdit}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Categoría</Label>
            <select
              {...register("category_id")}
              className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]"
            >
              <option value="">— Sin categoría —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Autor</Label>
            <Input {...register("author")} placeholder="ej: Equipo Perfupedia" />
          </div>
        </div>
      </FormSection>

      {/* 2. CONTENIDO */}
      <FormSection title="2 · Contenido" description="Escribí el artículo acá. Usá los botones de formato para dar estructura.">
        <RichTextEditor
          value={defaultValues?.content_json}
          onChange={(json, html) => {
            setValue("content_json", json);
            setValue("content", html);
          }}
        />
      </FormSection>

      {/* 3. SEO */}
      <FormSection title="3 · SEO" description="Opcional. Si lo dejás vacío se genera automáticamente.">
        <SeoFields
          metaTitle={metaTitle}
          metaDescription={metaDesc}
          onMetaTitleChange={(v) => setValue("meta_title", v)}
          onMetaDescriptionChange={(v) => setValue("meta_description", v)}
        />
      </FormSection>

      {/* 4. ESTADO */}
      <FormSection title="4 · Estado de publicación">
        <StatusSelect value={statusVal} onChange={(v) => setValue("status", v as "draft" | "published" | "archived")} />
        <p className="text-xs text-gray-400">Al publicar por primera vez se guarda la fecha de publicación automáticamente.</p>
      </FormSection>
    </form>
  );
}
