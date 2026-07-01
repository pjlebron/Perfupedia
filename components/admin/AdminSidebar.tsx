"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FlaskConical, Tag, FileText,
  Trophy, ChevronRight
} from "lucide-react";

const NAV = [
  { href: "/admin",           label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/perfumes",  label: "Perfumes",     icon: FlaskConical },
  { href: "/admin/marcas",    label: "Marcas",       icon: Tag },
  { href: "/admin/articulos", label: "Artículos",    icon: FileText },
  { href: "/admin/rankings",  label: "Rankings",     icon: Trophy },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-gray-100">
        <Image src="/logo.png" alt="Perfupedia" width={28} height={28} className="rounded-sm" />
        <span className="font-display text-base">
          Perfu<span className="italic text-[var(--color-amber)]">pedia</span>
        </span>
        <span className="text-[10px] bg-[var(--color-amber)]/15 text-[var(--color-amber)] rounded px-1.5 py-0.5 font-medium ml-auto">
          Admin
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[var(--color-arabe-green)] text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Ver sitio público ↗
        </Link>
      </div>
    </aside>
  );
}
