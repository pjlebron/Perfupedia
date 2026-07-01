import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  slug: z.string().min(2, "El slug es obligatorio").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  category_id: z.string().uuid().optional().nullable(),
  author: z.string().optional(),
  content_json: z.any().optional(),
  content: z.string().optional(), // HTML generado
  status: z.enum(["draft", "published", "archived"]),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
