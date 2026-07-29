import { NextResponse } from "next/server";
import { getAdminClient, requireAdminCaller } from "@/lib/supabase-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminCaller(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await request.json();
  const { password, role } = body as { password?: string; role?: "admin" | "user" };

  if (!password && !role) {
    return NextResponse.json({ error: "No hay nada para actualizar." }, { status: 400 });
  }
  if (password && password.length < 8) {
    return NextResponse.json({ error: "La contraseña tiene que tener al menos 8 caracteres." }, { status: 400 });
  }

  try {
    const admin = getAdminClient();

    if (password) {
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (role) {
      if (role === "user" && auth.user.id === id) {
        return NextResponse.json({ error: "No podés quitarte el rol de admin a vos mismo." }, { status: 400 });
      }
      const { error } = await admin.from("user_roles").upsert({ user_id: id, role });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminCaller(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  if (auth.user.id === id) {
    return NextResponse.json({ error: "No podés borrar tu propia cuenta." }, { status: 400 });
  }

  try {
    const admin = getAdminClient();
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
