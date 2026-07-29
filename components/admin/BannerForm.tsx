"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/admin/FormSection";
import ImageUploader from "@/components/admin/ImageUploader";
import { Loader2, Save } from "lucide-react";

const LOCATIONS = [
  { value: "home_mid", label: "Home — medio" },
  { value: "home_bottom", label: "Home — final" },
  { value: "listing_top", label: "Listado de perfumes — arriba (todos + categorías)" },
  { value: "rankings_list_top", label: "Listado de rankings — arriba" },
  { value: "rankings_list_bottom", label: "Listado de rankings — final" },
  { value: "ranking_detail_top", label: "Ranking individual — arriba" },
  { value: "ranking_detail_bottom", label: "Ranking individual — final" },
  { value: "blog_list_top", label: "Listado de guías — arriba" },
  { value: "blog_list_bottom", label: "Listado de guías — final" },
  { value: "brand_top", label: "Página de marca — arriba" },
  { value: "brand_bottom", label: "Página de marca — final" },
  { value: "in_article_top", label: "Artículo/guía — arriba" },
  { value: "in_article_bottom", label: "Artículo/guía — medio" },
  { value: "article_end", label: "Artículo/guía — final" },
  { value: "perfume_top", label: "Ficha de perfume — después del encabezado" },
  { value: "perfume_mid", label: "Ficha de perfume — después del rendimiento" },
  { value: "perfume_bottom", label: "Ficha de perfume — antes de reviews" },
];

interface BannerFormProps {
  defaultValues?: Record<string, unknown>;
  bannerId?: string;
}

export default function BannerForm({ defaultValues, bannerId }: BannerFormProps) {
  const router = useRouter();
  const isEdit = !!bannerId;

  const [form, setForm] = useState({
    internal_name: String(defaultValues?.internal_name ?? ""),
    location: String(defaultValues?.location ?? LOCATIONS[0].value),
    link_url: String(defaultValues?.link_url ?? ""),
    advertiser: String(defaultValues?.advertiser ?? ""),
    start_date: String(defaultValues?.start_date ?? ""),
    end_date: String(defaultValues?.end_date ?? ""),
    priority: Number(defaultValues?.priority ?? 0),
    is_active: Boolean(defaultValues?.is_active ?? true),
    image_path: (defaultValues?.image_path as string | null) ?? null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.internal_name.trim()) { setError("El nombre interno es obligatorio."); return; }
    if (!form.link_url.trim()) { setError("El link de destino es obligatorio."); return; }
    if (!form.image_path) { setError("La imagen es obligatoria."); return; }

    setSaving(true);
    setError("");

    const payload = {
      internal_name: form.internal_name,
      location: form.location,
      link_url: form.link_url,
      advertiser: form.advertiser || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      priority: form.priority,
      is_active: form.is_active,
      image_path: form.image_path,
    };

    const { error: err } = isEdit
      ? await supabase.from("banners").update(payload).eq("id", bannerId)
      : await supabase.from("banners").insert(payload);

    setSaving(false);

    if (err) {
      setError("Error al guardar: " + err.message);
      return;
    }

    router.push("/admin/banners");
    router.refresh();
  };

  const sel = "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]";

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{isEdit ? "Editar banner" : "Nuevo banner"}</h1>
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

      <FormSection title="Datos básicos" description="El nombre interno es solo para identificarlo acá, no se muestra en el sitio.">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre interno *</Label>
          <Input value={form.internal_name} onChange={e => set("internal_name", e.target.value)} placeholder="ej: AdSense home - verano 2026" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Ubicación *</Label>
          <select value={form.location} onChange={e => set("location", e.target.value)} className={sel}>
            {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Link de destino *</Label>
          <Input value={form.link_url} onChange={e => set("link_url", e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Anunciante</Label>
          <Input value={form.advertiser} onChange={e => set("advertiser", e.target.value)} placeholder="ej: Lattafa, Mercado Libre, AdSense" />
        </div>
      </FormSection>

      <FormSection title="Imagen" description="Recomendado: relación 16:9 o similar, buena resolución.">
        <ImageUploader
          label="Imagen del banner"
          bucket="banners"
          value={form.image_path}
          onChange={path => set("image_path", path)}
        />
      </FormSection>

      <FormSection title="Vigencia y prioridad" description="Fechas opcionales — si las dejás vacías, el banner corre sin límite de tiempo. Si hay varios banners activos en la misma ubicación, se muestra el de mayor prioridad.">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Desde</Label>
            <Input type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Hasta</Label>
            <Input type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 max-w-[160px]">
          <Label>Prioridad</Label>
          <Input type="number" value={form.priority} onChange={e => set("priority", Number(e.target.value))} />
        </div>
      </FormSection>

      <FormSection title="Estado">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={e => set("is_active", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[var(--color-amber)] focus:ring-[var(--color-amber)]"
          />
          Activo (visible en el sitio)
        </label>
      </FormSection>
    </div>
  );
}
