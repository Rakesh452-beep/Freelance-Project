import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { studioConfig } from "@/lib/config";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const CONFIRM_KEY_PREFIX = "confirm:";
const CONFIRM_LIMIT = 5;
const CONFIRM_WINDOW_MS = 15 * 60 * 1000;

const secret = process.env.ADMIN_CONFIRM_SECRET;

export async function POST(request: NextRequest) {
  if (!secret) {
    return Response.json(
      { error: "ADMIN_CONFIRM_SECRET is not set on the server." },
      { status: 500 }
    );
  }

  const provided = request.headers.get("x-confirm-secret");
  if (!provided || provided !== secret) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rate = checkRateLimit({
    key: `${CONFIRM_KEY_PREFIX}${clientIp(request)}`,
    limit: CONFIRM_LIMIT,
    windowMs: CONFIRM_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let supabase;
  try {
    supabase = getAdminClient();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Database not configured." },
      { status: 500 }
    );
  }

  const targetEmail = studioConfig.adminEmail.toLowerCase();

  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    console.error("confirm-email listUsers failed:", error);
    return Response.json({ error: "Could not look up the admin user." }, { status: 500 });
  }

  const user = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
  if (!user) {
    return Response.json({ error: "Admin user not found." }, { status: 404 });
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });
  if (updateError) {
    console.error("confirm-email updateUserById failed:", updateError);
    return Response.json({ error: "Could not confirm the admin email." }, { status: 500 });
  }

  return Response.json({ ok: true, email: user.email });
}
