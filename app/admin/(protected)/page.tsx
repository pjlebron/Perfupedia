import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FlaskConical, Tag, FileText, Trophy, Plus } from "lucide-react";

async function getStats() {
  const supabase = await createSupabaseServerClient();
  const [perfumes, brands, articles, rankings] = await Promise.all([
    supabase.from("perfumes").select("id, status", { count: "exact" }),
    supabase.from("brands").select("id, status", { count: "exact" }),
    supabase.from("articles").select("id, status", { count: "exact" }),
    supabase.from("rankings").select("id, status", { count: "exact" }),
  ]);
  const count = (data: { status: string }[] | null, s: string) =>
    data?.filter((r) => r.status === s).length ?? 0;
  return {
    perfumes: { total: perfumes.count ?? 0, published: count(perfumes.data, "published") },
    brands:   { total: brands.count ?? 0,   published: count(brands.data, "published") },
    articles: { total: articles.count ?? 0, published: count(articles.data, "published") },
    rankings: { total: rankings.count ?? 0, published: count(rankings.data, "published") },
  };
}

const SECTIONS = [
  { key: "perfumes",  label: "Perfumes",  icon: FlaskConical, href: "/admin/perfumes"  },
  { key: "brands",    label: "Marcas",    icon: Tag,          href: "/admin/marcas"    },
  { key: "articles",  label: "Artículos", icon: FileText,     href: "/admin/articulos" },
  { key: "rankings",  label: "Rankings",  icon: Trophy,       href: "/admin/rankings"  },
] as const;

export default async function AdminDashboard() {
  const stats = await getStats();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen del contenido de Perfupedia</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SECTIONS.map(({ key, label, icon: Icon, href }) => {
          const s = stats[key as keyof typeof stats];
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{s.published}</div>
                <p className="text-xs text-gray-500 mt-1">publicados de {s.total} total</p>
                <Link href={href}>
                  <Button variant="ghost" size="sm" className="mt-3 w-full text-xs">
                    Ver todos →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <h2 className="font-medium text-gray-700 mb-3">Acciones rápidas</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SECTIONS.map(({ label, icon: Icon, href }) => (
          <Link key={href} href={`${href}/new`}>
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <Icon className="w-5 h-5" />
              <span className="text-xs">Nuevo {label.slice(0, -1)}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
