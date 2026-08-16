import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { checkRateLimit, clearRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const LOGIN_KEY_PREFIX = "login:";
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const key = `${LOGIN_KEY_PREFIX}${clientIp(request)}|${email}`;

  const rate = checkRateLimit({ key, limit: LOGIN_LIMIT, windowMs: LOGIN_WINDOW_MS });
  if (!rate.allowed) {
    return Response.json(
      {
        error: `Too many login attempts. Try again in ${rate.retryAfterSeconds} seconds.`,
        retryAfter: rate.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  clearRateLimit(key);
  return Response.json({ ok: true });
}
