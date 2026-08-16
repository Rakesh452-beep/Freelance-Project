import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let supabase;
  try {
    supabase = getAdminClient();
  } catch {
    return Response.json({ error: "Database not configured." }, { status: 500 });
  }

  const { error } = await supabase.from("inquiries").delete().eq("id", id);

  if (error) {
    console.error("Delete inquiry failed:", error);
    return Response.json({ error: "Could not delete inquiry." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
