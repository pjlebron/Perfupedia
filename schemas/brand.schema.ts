import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  country: z.string().optional(),
  type: z.enum(["nacional", "arabe", "disenador", "independiente", "importador", "otra"]),
  description: z.string().optional(),
  price_range: z.string().optional(),
  general_style: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
