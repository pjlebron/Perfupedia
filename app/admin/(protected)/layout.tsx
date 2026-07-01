"use client";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebarClient from "@/components/admin/AdminSidebarClient";
import AdminHeaderDynamic from "@/components/admin/AdminHeaderDynamic";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebarClient />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeaderDynamic />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
