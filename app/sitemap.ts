import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://perfupedia.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [perfumes, brands, articles, rankings] = await Promise.all([
    supabase.from("perfumes").select("slug, updated_at").eq("status", "published"),
    supabase.from("brands").select("slug, updated_at").eq("status", "published"),
    supabase.from("articles").select("slug, updated_at").eq("status", "published"),
    supabase.from("rankings").select("slug, updated_at").eq("status", "published"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/perfumes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/perfumes-arabes`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/perfumes-nacionales`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/perfumes-low-cost`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/perfumes-mid-cost`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/rankings`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/guias`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/sobre-el-proyecto`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const perfumeRoutes: MetadataRoute.Sitemap = (perfumes.data ?? []).map((p) => ({
    url: `${SITE_URL}/perfume/${p.slug}`,
    lastModified: p.updated_at ?? undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const brandRoutes: MetadataRoute.Sitemap = (brands.data ?? []).map((b) => ({
    url: `${SITE_URL}/marca/${b.slug}`,
    lastModified: b.updated_at ?? undefined,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = (articles.data ?? []).map((a) => ({
    url: `${SITE_URL}/guias/${a.slug}`,
    lastModified: a.updated_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const rankingRoutes: MetadataRoute.Sitemap = (rankings.data ?? []).map((r) => ({
    url: `${SITE_URL}/rankings/${r.slug}`,
    lastModified: r.updated_at ?? undefined,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...perfumeRoutes, ...brandRoutes, ...articleRoutes, ...rankingRoutes];
}
