import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Endpoint protegido — usa service role para ignorar RLS
export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { table, id, action, motivo } = await req.json();

  if (!["salaries", "reviews"].includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }
  if (!["aprovar", "rejeitar"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json({ error: "Service key not configured" }, { status: 500 });
  }
  const admin = createClient(url, serviceKey);

  const newStatus = action === "aprovar" ? "aprovado" : "rejeitado";
  const update: any = { status: newStatus };
  if (action === "rejeitar" && motivo) update.motivo_rejeicao = motivo;

  const { error } = await admin.from(table).update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
