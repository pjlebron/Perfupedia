import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Pencil, Plus } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T extends { id: string; status?: string }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  newHref: string;
  editHref: (row: T) => string;
  empty?: string;
}

export default function AdminDataTable<T extends { id: string; status?: string }>({
  title, data, columns, newHref, editHref, empty = "No hay registros todavía.",
}: AdminDataTableProps<T>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.length} registro{data.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href={newHref}>
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Nuevo
          </Button>
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl py-16 text-center text-gray-400">
          <p className="text-sm">{empty}</p>
          <Link href={newHref}>
            <Button variant="outline" size="sm" className="mt-4">
              <Plus className="w-4 h-4" /> Crear el primero
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {columns.map((col) => (
                  <th key={String(col.key)} className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide">
                    {col.label}
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide w-20">
                  Estado
                </th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {row.status && <StatusBadge status={row.status} />}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={editHref(row)}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
