import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Solo se usa en Route Handlers (servidor). Nunca importar desde un componente "use client".
export function getAdminClient() {
  if (!SERVICE_ROLE_KEY) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno del servidor.",
    );
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type AdminCallerResult =
  | { user: { id: string; email: string | undefined } }
  | { error: string; status: 401 | 403 };

// Valida, usando el propio token del que llama, que sea un admin real antes de
// permitirle usar operaciones con la clave de servicio.
export async function requireAdminCaller(request: Request): Promise<AdminCallerResult> {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return { error: "No autorizado.", status: 401 };

  const asUser = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error: userError } = await asUser.auth.getUser(token);
  if (userError || !user) return { error: "Sesión inválida o expirada.", status: 401 };

  const { data: roleRow } = await asUser
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleRow?.role !== "admin") {
    return { error: "Tu cuenta no tiene permisos de administrador.", status: 403 };
  }

  return { user: { id: user.id, email: user.email } };
}
