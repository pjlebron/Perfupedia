import { z } from "zod";

export const perfumeSchema = z.object({
  // Datos básicos
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  brand_id: z.string().uuid("Seleccioná una marca"),
  line: z.string().optional(),
  origin: z.enum(["nacional", "arabe", "disenador", "importado", "otro"]),
  country: z.string().optional(),
  gender: z.enum(["hombre", "mujer", "unisex"]),
  concentration: z.enum(["edt", "edp", "extrait", "perfume", "body_splash", "otro"]).optional(),
  available_sizes: z.string().optional(),
  olfactive_family_id: z.string().uuid().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  // Descripción editorial
  aroma_summary: z.string().optional(),
  editorial_description: z.string().optional(),
  quick_opinion: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  verdict: z.string().optional(),
  editorial_score: z.number().min(0).max(10).optional().nullable(),
  // Precio y disponibilidad
  price_range_ars: z.string().optional(),
  price_quality_ratio: z.string().optional(),
  availability_in_argentina: z.string().optional(),
  // Recomendaciones
  recommended_season: z.string().optional(),
  recommended_occasion: z.string().optional(),
  recommended_time_of_day: z.string().optional(),
  recommended_user_style: z.string().optional(),
  // Rendimiento (se guardan en perfume_editorial_scores)
  duration_score: z.number().min(1).max(5).optional().nullable(),
  projection_score: z.number().min(1).max(5).optional().nullable(),
  sillage_score: z.number().min(1).max(5).optional().nullable(),
  price_quality_score: z.number().min(1).max(5).optional().nullable(),
  // SEO
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type PerfumeFormValues = z.infer<typeof perfumeSchema>;
