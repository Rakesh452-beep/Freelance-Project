import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const RESET_KEY_PREFIX = "reset:";
const RESET_LIMIT = 5;
const RESET_WINDOW_MS = 15 * 60 * 1000;

const PASSWORD_REQUIREMENTS =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export async function POST(request: NextRequest) {
  let body: { code?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const code = body.code ?? "";
  const password = body.password ?? "";

  if (!code) {
    return Response.json(
      { error: "This reset link is invalid. Request a new one." },
      { status: 400 }
    );
  }

  if (!PASSWORD_REQUIREMENTS.test(password)) {
    return Response.json(
      {
        error:
          "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.",
      },
      { status: 400 }
    );
  }

  const rate = checkRateLimit({
    key: `${RESET_KEY_PREFIX}${clientIp(request)}`,
    limit: RESET_LIMIT,
    windowMs: RESET_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json(
      {
        error: `Too many attempts. Try again in ${rate.retryAfterSeconds} seconds.`,
        retryAfter: rate.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  const supabase = await createClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return Response.json(
      { error: "This reset link is invalid or has expired. Request a new one." },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    console.error("Password update failed:", updateError);
    return Response.json(
      { error: "Could not update your password. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
