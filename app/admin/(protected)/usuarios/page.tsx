"use client";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/admin/FormSection";
import { Loader2, Plus, Trash2, KeyRound, ShieldCheck, ShieldOff, AlertCircle } from "lucide-react";

type AdminUser = {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
};

async function authFetch(input: string, init: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (session?.access_token) headers.set("Authorization", `Bearer ${session.access_token}`);
  headers.set("Content-Type", "application/json");
  return fetch(input, { ...init, headers });
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("admin");
  const [newError, setNewError] = useState("");
  const [saving, setSaving] = useState(false);

  const [passwordRowId, setPasswordRowId] = useState<string | null>(null);
  const [rowPassword, setRowPassword] = useState("");
  const [rowError, setRowError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setPageError("");
    const res = await authFetch("/api/admin/users");
    const body = await res.json();
    if (!res.ok) { setPageError(body.error ?? "Error al cargar usuarios."); setLoading(false); return; }
    setUsers(body.users);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewError("");
    if (!newEmail.trim()) { setNewError("El email es obligatorio."); return; }
    if (newPassword.length < 8) { setNewError("La contraseña tiene que tener al menos 8 caracteres."); return; }

    setSaving(true);
    const res = await authFetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole }),
    });
    const body = await res.json();
    setSaving(false);

    if (!res.ok) { setNewError(body.error ?? "Error al crear el usuario."); return; }

    setShowNew(false);
    setNewEmail(""); setNewPassword(""); setNewRole("admin");
    load();
  };

  const handleSetPassword = async (id: string) => {
    setRowError("");
    if (rowPassword.length < 8) { setRowError("La contraseña tiene que tener al menos 8 caracteres."); return; }

    setBusyId(id);
    const res = await authFetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ password: rowPassword }),
    });
    const body = await res.json();
    setBusyId(null);

    if (!res.ok) { setRowError(body.error ?? "Error al cambiar la contraseña."); return; }

    setPasswordRowId(null);
    setRowPassword("");
  };

  const handleToggleRole = async (u: AdminUser) => {
    const nextRole = u.role === "admin" ? "user" : "admin";
    if (!confirm(
      nextRole === "admin"
        ? `¿Convertir a "${u.email}" en administrador?`
        : `¿Quitarle los permisos de administrador a "${u.email}"?`
    )) return;

    setBusyId(u.id);
    const res = await authFetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      body: JSON.stringify({ role: nextRole }),
    });
    const body = await res.json();
    setBusyId(null);

    if (!res.ok) { alert(body.error ?? "Error al cambiar el rol."); return; }
    load();
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`¿Borrar la cuenta de "${u.email}"? Esta acción no se puede deshacer.`)) return;

    setBusyId(u.id);
    const res = await authFetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);

    if (!res.ok) { alert(body.error ?? "Error al borrar el usuario."); return; }
    load();
  };

  const sel = "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} cuentas</p>
        </div>
        <Button variant="primary" onClick={() => setShowNew((v) => !v)}>
          <Plus className="w-4 h-4" /> Nuevo usuario
        </Button>
      </div>

      {pageError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {pageError}
        </div>
      )}

      {showNew && (
        <FormSection title="Nuevo usuario" className="mb-5" description="Crea la cuenta directamente, sin necesidad de que la persona se registre sola.">
          <form onSubmit={handleCreate} className="flex flex-col gap-4 max-w-md">
            {newError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {newError}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label>Email *</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="nombre@email.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Contraseña inicial *</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rol</Label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value as "admin" | "user")} className={sel}>
                <option value="admin">Administrador — acceso completo al panel</option>
                <option value="user">Usuario — sin acceso al panel</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</> : "Crear usuario"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            </div>
          </form>
        </FormSection>
      )}

      {loading ? (
        <div className="flex gap-2 text-gray-400 py-8"><Loader2 className="w-4 h-4 animate-spin" />Cargando...</div>
      ) : (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Email", "Rol", "Último ingreso", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <Fragment key={u.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin"
                        ? <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Admin</span>
                        : <span className="text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">Usuario</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("es-AR") : "Nunca"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost" size="icon"
                          title="Cambiar contraseña"
                          onClick={() => { setPasswordRowId(passwordRowId === u.id ? null : u.id); setRowPassword(""); setRowError(""); }}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          title={u.role === "admin" ? "Quitar admin" : "Hacer admin"}
                          onClick={() => handleToggleRole(u)}
                          disabled={busyId === u.id}
                        >
                          {u.role === "admin" ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          title="Borrar usuario"
                          onClick={() => handleDelete(u)}
                          disabled={busyId === u.id}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          {busyId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {passwordRowId === u.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-4 py-3">
                        <div className="flex items-end gap-2 max-w-sm">
                          <div className="flex flex-col gap-1.5 flex-1">
                            <Label>Nueva contraseña para {u.email}</Label>
                            <Input type="password" value={rowPassword} onChange={(e) => setRowPassword(e.target.value)} placeholder="Mínimo 8 caracteres" autoFocus />
                          </div>
                          <Button variant="primary" onClick={() => handleSetPassword(u.id)} disabled={busyId === u.id}>
                            {busyId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
                          </Button>
                          <Button variant="outline" onClick={() => setPasswordRowId(null)}>Cancelar</Button>
                        </div>
                        {rowError && <p className="text-xs text-red-600 mt-2">{rowError}</p>}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
