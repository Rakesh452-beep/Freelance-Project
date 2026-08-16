import { NextRequest } from "next/server";
import { getPublicClient } from "@/lib/supabase";
import { sendInquiryAlert } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import type { Inquiry } from "@/lib/types";

export const runtime = "nodejs";

const CONTACT_KEY_PREFIX = "contact:";
const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const rate = checkRateLimit({
    key: `${CONTACT_KEY_PREFIX}${clientIp(request)}`,
    limit: CONTACT_LIMIT,
    windowMs: CONTACT_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json(
      { error: `Too many messages. Try again in ${rate.retryAfterSeconds} seconds.` },
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

  const { error } = await supabase
    .from("inquiries")
    .insert({
      name,
      email,
      phone: phone || null,
      message,
    });

  if (error) {
    console.error("Inquiry insert failed:", error);
    return Response.json({ error: "Could not send your message. Please try again." }, { status: 500 });
  }

  const inquiry: Inquiry = {
    id: "",
    name,
    email,
    phone: phone || "",
    message,
    created_at: new Date().toISOString(),
  };

  await sendInquiryAlert(inquiry);

  return Response.json({ ok: true });
}
