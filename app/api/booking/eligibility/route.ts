import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { freeTrialActive } from "@/lib/utils";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ELIGIBILITY_KEY_PREFIX = "eligibility:";
const ELIGIBILITY_LIMIT = 60;
const ELIGIBILITY_WINDOW_MS = 10 * 60 * 1000;

export async function GET(request: NextRequest) {
  const email = (request.nextUrl.searchParams.get("email") || "")
    .trim()
    .toLowerCase();

  const active = freeTrialActive();
  if (!email) {
    return Response.json({ freeTrialActive: active, free: false });
  }

  const rate = checkRateLimit({
    key: `${ELIGIBILITY_KEY_PREFIX}${clientIp(request)}`,
    limit: ELIGIBILITY_LIMIT,
    windowMs: ELIGIBILITY_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json({ freeTrialActive: active, free: false }, { status: 429 });
  }

  try {
    const supabase = getAdminClient();
    const { count, error } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("client_email", email);

    if (error) {
      return Response.json({ freeTrialActive: active, free: false }, { status: 500 });
    }

    return Response.json({
      freeTrialActive: active,
      free: active && (count ?? 0) === 0,
    });
  } catch {
    return Response.json({ freeTrialActive: active, free: false }, { status: 500 });
  }
}
