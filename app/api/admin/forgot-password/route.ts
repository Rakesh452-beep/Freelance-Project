import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";

const FORGOT_KEY_PREFIX = "forgot:";
const FORGOT_LIMIT = 3;
const FORGOT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email) {
    return Response.json({ error: "Email is required." }, { status: 400 });
  }

  // Always return a generic success so the response cannot be used to
  // confirm whether an account exists. Rate limiting still applies server-side.
  const rate = checkRateLimit({
    key: `${FORGOT_KEY_PREFIX}${clientIp(request)}|${email}`,
    limit: FORGOT_LIMIT,
    windowMs: FORGOT_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/admin/update-password`,
  });

  if (error) {
    console.error("Password reset email failed:", error);
  }

  return Response.json({ ok: true });
}
