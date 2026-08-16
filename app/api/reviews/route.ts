import { NextRequest } from "next/server";
import { getPublicClient } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const REVIEW_KEY_PREFIX = "review:";
const REVIEW_LIMIT = 5;
const REVIEW_WINDOW_MS = 10 * 60 * 1000;

export async function GET() {
  let supabase;
  try {
    supabase = getPublicClient();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Database not configured." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, rating, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Reviews fetch failed:", error);
    return Response.json({ error: "Could not load reviews." }, { status: 500 });
  }

  return Response.json({ reviews: data ?? [] });
}

export async function POST(request: NextRequest) {
  let body: { name?: string; rating?: number; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, rating, message } = body;

  if (!name || !message || !name.trim() || !message.trim()) {
    return Response.json({ error: "Name and review are required." }, { status: 400 });
  }
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return Response.json({ error: "Please select a rating from 1 to 5 stars." }, { status: 400 });
  }

  const rate = checkRateLimit({
    key: `${REVIEW_KEY_PREFIX}${clientIp(request)}`,
    limit: REVIEW_LIMIT,
    windowMs: REVIEW_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json(
      { error: `Too many reviews. Try again in ${rate.retryAfterSeconds} seconds.` },
      { status: 429 }
    );
  }

  let supabase;
  try {
    supabase = getPublicClient();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Database not configured." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({ name: name.trim(), rating, message: message.trim() })
    .select("id, name, rating, message, created_at")
    .single();

  if (error) {
    console.error("Review insert failed:", error);
    return Response.json(
      { error: "Could not submit your review. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ review: data });
}
