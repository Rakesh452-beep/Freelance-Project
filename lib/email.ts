import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";
import { studioConfig } from "@/lib/config";
import { formatINR } from "@/lib/utils";
import { requestSiteUrl } from "@/lib/supabase-server";
import type { Booking, Inquiry } from "@/lib/types";

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

let gmailTransporter: Transporter | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getGmailTransporter(): Transporter | null {
  if (!gmailUser || !gmailAppPassword) return null;
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailAppPassword },
    });
  }
  return gmailTransporter;
}

export function isEmailConfigured(): boolean {
  return Boolean(gmailUser && gmailAppPassword) || Boolean(apiKey);
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const transporter = getGmailTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${studioConfig.name}" <${gmailUser}>`,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
      console.log("Email sent via Gmail:", opts.to, info.messageId);
      return;
    }

    if (apiKey) {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from: `${studioConfig.name} <${fromEmail}>`,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
      if (result.error) {
        console.error("Email send failed:", opts.to, JSON.stringify(result.error));
      } else {
        console.log("Email sent:", opts.to, result.data?.id || "");
      }
      return;
    }

    console.error("Email not sent (no Gmail or Resend configured):", opts.to);
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

function isFreeTrialBooking(booking: Booking): boolean {
  return Boolean(booking.notes?.includes("FREE TRIAL"));
}

function isQuoteBooking(booking: Booking): boolean {
  return booking.amount === 0 && !isFreeTrialBooking(booking);
}

function bookingRows(booking: Booking): string {
  return `
    <p>Service: <strong>${escapeHtml(booking.service)}</strong></p>
    <p>Event: ${escapeHtml(booking.event_type)} · ${escapeHtml(booking.event_date)} at ${escapeHtml(booking.event_time)}</p>
    <p>Location: ${escapeHtml(booking.location)}</p>
    <p>${
      isFreeTrialBooking(booking)
        ? "Amount: <strong>FREE</strong> (Aug–Oct launch offer — no payment needed)"
        : isQuoteBooking(booking)
          ? "Amount: <strong>By quote</strong> — pricing discussed via contact"
          : `Amount: ${formatINR(booking.amount)} · Advance: ${formatINR(booking.advance_amount)}`
    }</p>
    ${booking.notes ? `<p>Notes: ${escapeHtml(booking.notes)}</p>` : ""}
  `;
}

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  await send({
    to: booking.client_email,
    subject: `Booking received — ${booking.booking_ref}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Hi ${escapeHtml(booking.client_name)},</h2>
        <p>Thank you for booking with <strong>${escapeHtml(studioConfig.name)}</strong>. Your booking request has been received.</p>
        <p>Booking reference: <strong>${escapeHtml(booking.booking_ref)}</strong></p>
        ${bookingRows(booking)}
        ${
          booking.advance_amount > 0
            ? `<p>Advance due: <strong>${formatINR(booking.advance_amount)}</strong> via UPI — scan the QR on your booking page to pay. We'll confirm once it reflects.</p>`
            : isFreeTrialBooking(booking)
              ? `<p>This booking is <strong>FREE</strong> — no advance needed. Enjoy the offer!</p>`
              : isQuoteBooking(booking)
                ? `<p>We'll contact you shortly to discuss pricing for your posters / flyers / banners.</p>`
                : `<p>We'll reach out shortly to confirm your slot and settle the advance.</p>`
        }
        <p>Reply to this email with any questions.</p>
      </div>
    `,
  });
}

export async function sendBookingAlert(booking: Booking): Promise<void> {
  await send({
    to: studioConfig.adminEmail,
    subject: `New booking — ${booking.booking_ref} (${booking.service})`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>New booking received</h2>
        <p><strong>${escapeHtml(booking.client_name)}</strong> · ${escapeHtml(booking.client_email)} · ${escapeHtml(booking.client_phone)}</p>
        ${bookingRows(booking)}
        <p>Status: ${escapeHtml(booking.payment_status)} / ${escapeHtml(booking.booking_status)}</p>
        <p><a href="${await requestSiteUrl()}/admin">Open dashboard</a></p>
      </div>
    `,
  });
}

export async function sendBookingConfirmedEmail(booking: Booking): Promise<void> {
  await send({
    to: booking.client_email,
    subject: `Your booking is confirmed — ${booking.booking_ref} 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Hi ${escapeHtml(booking.client_name)},</h2>
        <p>Great news — we are from <strong>${escapeHtml(studioConfig.name)}</strong>, and your booking has been <strong>confirmed</strong>!</p>
        <p>Thank you for booking with us. Your date is now secured.</p>
        <p>Booking reference: <strong>${escapeHtml(booking.booking_ref)}</strong></p>
        ${bookingRows(booking)}
        ${
          booking.advance_amount > 0
            ? `<p>Advance amount: <strong>${formatINR(booking.advance_amount)}</strong> — if you haven't paid yet, open your booking page and scan the QR to pay via UPI.</p>`
            : isFreeTrialBooking(booking)
              ? `<p>This booking is <strong>FREE</strong> — nothing to pay. Enjoy the offer!</p>`
              : isQuoteBooking(booking)
                ? `<p>Pricing for your posters / flyers / banners will be shared after we discuss your event.</p>`
                : ""
        }
        <p>Need anything? Just reply to this email.</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
        <p style="color:#555">After your event, we'd love to hear about your experience. Please review our work on our website:</p>
        <p><a href="${await requestSiteUrl()}/review" style="background:#1a2a6c;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Leave a review</a></p>
        <p style="color:#555">Thank you,<br/>${escapeHtml(studioConfig.name)}</p>
      </div>
    `,
  });
}

export async function sendInquiryAlert(inquiry: Inquiry): Promise<void> {
  await send({
    to: studioConfig.adminEmail,
    subject: `New contact message from ${inquiry.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>New contact message</h2>
        <p><strong>${escapeHtml(inquiry.name)}</strong> · ${escapeHtml(inquiry.email)}${inquiry.phone ? ` · ${escapeHtml(inquiry.phone)}` : ""}</p>
        <p>${escapeHtml(inquiry.message).replace(/\n/g, "<br/>")}</p>
        <p><a href="${await requestSiteUrl()}/admin">Open dashboard</a></p>
      </div>
    `,
  });
}
