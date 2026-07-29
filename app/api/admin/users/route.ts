import { NextResponse } from "next/server";
import { getAdminClient, requireAdminCaller } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const auth = await requireAdminCaller(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const admin = getAdminClient();

    const [{ data: authUsers, error: listError }, { data: roles }] = await Promise.all([
      admin.auth.admin.listUsers(),
      admin.from("user_roles").select("user_id, role"),
    ]);

    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

    const roleByUserId = new Map((roles ?? []).map((r) => [r.user_id, r.role]));

    const users = authUsers.users
      .map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        role: roleByUserId.get(u.id) ?? "user",
      }))
      .sort((a, b) => a.created_at.localeCompare(b.created_at));

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminCaller(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { email, password, role } = body as { email?: string; password?: string; role?: "admin" | "user" };

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña son obligatorios." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña tiene que tener al menos 8 caracteres." }, { status: 400 });
  }

  try {
    const admin = getAdminClient();

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !created.user) {
      return NextResponse.json({ error: createError?.message ?? "No se pudo crear el usuario." }, { status: 400 });
    }

    const { error: roleError } = await admin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: role ?? "user" });

    if (roleError) {
      return NextResponse.json(
        { error: "El usuario se creó pero no se pudo asignar el rol: " + roleError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: created.user.id });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
