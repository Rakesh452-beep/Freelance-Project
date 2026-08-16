import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, UnauthorizedError } from "@/lib/admin-auth";
import { sendBookingConfirmedEmail } from "@/lib/email";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    return Response.json(
      { error: err instanceof UnauthorizedError ? "Unauthorized" : "Auth error" },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body: { booking_status?: BookingStatus; payment_status?: PaymentStatus };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: { booking_status?: BookingStatus; payment_status?: PaymentStatus } = {};
  if (body.booking_status) updates.booking_status = body.booking_status;
  if (body.payment_status) updates.payment_status = body.payment_status;

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "Nothing to update." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getAdminClient();
  } catch {
    return Response.json({ error: "Database not configured." }, { status: 500 });
  }

  const { data: previous, error: fetchError } = await supabase
    .from("bookings")
    .select()
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Fetch booking failed:", fetchError);
    return Response.json({ error: "Could not load booking." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update booking failed:", error);
    return Response.json({ error: "Could not update booking." }, { status: 500 });
  }

  if (data.booking_status === "confirmed" && previous.booking_status !== "confirmed") {
    await sendBookingConfirmedEmail(data as Booking);
  }

  return Response.json({ booking: data });
}

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

  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("Delete booking failed:", error);
    return Response.json({ error: "Could not delete booking." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
