"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Tag, FileText, Trophy, Loader2 } from "lucide-react";

const SECTIONS = [
  { key: "perfumes",  label: "Perfumes",  icon: FlaskConical, href: "/admin/perfumes"  },
  { key: "brands",    label: "Marcas",    icon: Tag,          href: "/admin/marcas"    },
  { key: "articles",  label: "Artículos", icon: FileText,     href: "/admin/articulos" },
  { key: "rankings",  label: "Rankings",  icon: Trophy,       href: "/admin/rankings"  },
] as const;

type Stats = Record<string, { total: number; published: number }>;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const sb = getSupabaseBrowser();
      const [p, b, a, r] = await Promise.all([
        sb.from("perfumes").select("status"),
        sb.from("brands").select("status"),
        sb.from("articles").select("status"),
        sb.from("rankings").select("status"),
      ]);
      const count = (data: { status: string }[] | null, s: string) =>
        data?.filter((x) => x.status === s).length ?? 0;
      setStats({
        perfumes:  { total: p.data?.length ?? 0, published: count(p.data, "published") },
        brands:    { total: b.data?.length ?? 0, published: count(b.data, "published") },
        articles:  { total: a.data?.length ?? 0, published: count(a.data, "published") },
        rankings:  { total: r.data?.length ?? 0, published: count(r.data, "published") },
      });
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen del contenido de Perfupedia</p>
      </div>

      {!stats ? (
        <div className="flex items-center gap-2 text-gray-400 py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando estadísticas...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {SECTIONS.map(({ key, label, icon: Icon, href }) => {
              const s = stats[key];
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
                      <Button variant="ghost" size="sm" className="mt-3 w-full text-xs">Ver todos →</Button>
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
        </>
      )}
    </div>
  );
}
