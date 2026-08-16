import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { services, studioConfig } from "@/lib/config";
import { buildUpiIntentUri, freeTrialActive, generateBookingRef } from "@/lib/utils";
import { sendBookingAlert, sendBookingConfirmation } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import type { BookingPayload, Booking, BookingStatus } from "@/lib/types";

export const runtime = "nodejs";

const BOOKING_KEY_PREFIX = "booking:";
const BOOKING_LIMIT = 10;
const BOOKING_WINDOW_MS = 10 * 60 * 1000;

interface BookingRow {
  id: string;
  booking_ref: string;
  service: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  notes: string | null;
  amount: number;
  advance_amount: number;
  payment_status: "pending" | "paid" | "failed";
  booking_status: BookingStatus;
  created_at: string;
}

export async function POST(request: NextRequest) {
  let payload: BookingPayload;
  try {
    payload = (await request.json()) as BookingPayload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { service, event_type_id, client_name, client_email, client_phone, event_date, event_time, location, notes, payNow } = payload;

  if (!service || !event_type_id || !client_name || !client_email || !client_phone || !event_date || !event_time || !location) {
    return Response.json({ error: "All required fields must be filled." }, { status: 400 });
  }

  const serviceDef = services.find((s) => s.id === service);
  if (!serviceDef) {
    return Response.json({ error: "Invalid service selected." }, { status: 400 });
  }

  const eventType = serviceDef.eventTypes.find((et) => et.id === event_type_id);
  if (!eventType) {
    return Response.json({ error: "Please choose a valid booking type for this service." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(client_email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const rate = checkRateLimit({
    key: `${BOOKING_KEY_PREFIX}${clientIp(request)}`,
    limit: BOOKING_LIMIT,
    windowMs: BOOKING_WINDOW_MS,
  });
  if (!rate.allowed) {
    return Response.json(
      { error: `Too many booking attempts. Try again in ${rate.retryAfterSeconds} seconds.` },
      { status: 429 }
    );
  }

  const bookingRef = generateBookingRef();

  let supabase;
  try {
    supabase = getAdminClient();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Database not configured." },
      { status: 500 }
    );
  }

  const { count, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("client_email", client_email.trim().toLowerCase());

  if (countError) {
    console.error("Booking eligibility check failed:", countError);
    return Response.json({ error: "Could not verify booking eligibility. Please try again." }, { status: 500 });
  }

  const freeTrial = freeTrialActive() && (count ?? 0) === 0;

  const amount = freeTrial ? 0 : eventType.priceFrom;
  const advanceAmount = freeTrial
    ? 0
    : !eventType.quoteOnly && payNow
      ? eventType.advance
      : 0;
  const freeTrialNote = freeTrial
    ? "FREE TRIAL — Aug–Oct launch offer (first booking free)"
    : null;
  const quoteNote = !freeTrial && eventType.quoteOnly
    ? "Full-event design — pricing by discussion/contact"
    : null;

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      booking_ref: bookingRef,
      service,
      client_name,
      client_email,
      client_phone,
      event_type: eventType.label,
      event_date,
      event_time,
      location,
      notes: (() => {
        const parts = [notes?.trim(), freeTrialNote, quoteNote].filter(Boolean);
        return parts.length ? parts.join(" | ") : null;
      })(),
      amount,
      advance_amount: advanceAmount,
      payment_status: freeTrial ? "paid" : "pending",
      booking_status: "new",
    })
    .select()
    .single();

  if (error) {
    console.error("Booking insert failed:", error);
    return Response.json({ error: "Could not save the booking. Please try again." }, { status: 500 });
  }

  const row = data as BookingRow;
  const booking: Booking = {
    ...row,
    service: row.service as Booking["service"],
  };

  await Promise.all([
    sendBookingConfirmation(booking),
    sendBookingAlert(booking),
  ]);

  const upiUri = payNow
    ? buildUpiIntentUri({
        pa: studioConfig.upiId,
        pn: studioConfig.upiName,
        am: advanceAmount,
        tn: `Booking ${booking.booking_ref}`,
      })
    : null;

  return Response.json({
    booking,
    bookingRef: booking.booking_ref,
    payNow: Boolean(payNow),
    payment: upiUri
      ? {
          upiUri,
          amount: advanceAmount,
          currency: "INR",
        }
      : null,
  });
}
