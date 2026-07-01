import * as React from "react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  published: "bg-green-100 text-green-800 border-green-200",
  draft:     "bg-yellow-100 text-yellow-800 border-yellow-200",
  archived:  "bg-gray-100 text-gray-600 border-gray-200",
};

const statusLabels: Record<string, string> = {
  published: "Publicado",
  draft:     "Borrador",
  archived:  "Archivado",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", statusStyles[status] ?? "bg-gray-100 text-gray-600")}>
      {statusLabels[status] ?? status}
    </span>
  );
}
