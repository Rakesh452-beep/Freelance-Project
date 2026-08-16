import { getAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let supabase;
  try {
    supabase = getAdminClient();
  } catch {
    return Response.json({ error: "Database not configured." }, { status: 500 });
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch bookings failed:", error);
    return Response.json({ error: "Could not fetch bookings." }, { status: 500 });
  }

  const { data: inquiries, error: inquiriesError } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (inquiriesError) {
    console.error("Fetch inquiries failed:", inquiriesError);
  }

  return Response.json({ bookings, inquiries: inquiries ?? [] });
}
