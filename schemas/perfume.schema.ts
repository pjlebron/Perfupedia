import { z } from "zod";

// Helper: convierte string vacío a null (para campos select opcionales)
const optionalUuid = z.string().uuid().optional().nullable()
  .or(z.literal("").transform(() => null));

const optionalStr = z.string().optional().nullable()
  .or(z.literal("").transform(() => null));

export const perfumeSchema = z.object({
  // Datos básicos
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  brand_id: z.string().uuid("Seleccioná una marca"),
  line: optionalStr,
  origin: z.enum(["nacional", "arabe", "disenador", "importado", "otro"]),
  country: optionalStr,
  gender: z.enum(["hombre", "mujer", "unisex"]),
  concentration: z.enum(["edt", "edp", "extrait", "perfume", "body_splash", "otro"]).optional().nullable(),
  available_sizes: optionalStr,
  olfactive_family_id: optionalUuid,
  status: z.enum(["draft", "published", "archived"]),

  // Descripción editorial
  aroma_summary: optionalStr,
  editorial_description: optionalStr,
  quick_opinion: optionalStr,
  pros: optionalStr,
  cons: optionalStr,
  verdict: optionalStr,
  editorial_score: z.number().min(0).max(10).optional().nullable(),

  // Precio y disponibilidad
  price_range_ars: optionalStr,
  price_quality_ratio: optionalStr,
  availability_in_argentina: optionalStr,

  // Recomendaciones — todos opcionales
  recommended_season: optionalStr,
  recommended_occasion: optionalStr,
  recommended_time_of_day: optionalStr,
  recommended_user_style: optionalStr,

  // Rendimiento (se guardan en perfume_editorial_scores)
  duration_score: z.number().min(1).max(5).optional().nullable(),
  projection_score: z.number().min(1).max(5).optional().nullable(),
  sillage_score: z.number().min(1).max(5).optional().nullable(),
  price_quality_score: z.number().min(1).max(5).optional().nullable(),

  // Notas olfativas (texto libre separado por comas)
  notes_top: optionalStr,
  notes_heart: optionalStr,
  notes_base: optionalStr,

  // SEO
  meta_title: optionalStr,
  meta_description: optionalStr,
});

export type PerfumeFormValues = z.infer<typeof perfumeSchema>;
