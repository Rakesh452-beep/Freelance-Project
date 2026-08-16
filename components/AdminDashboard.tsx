"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { services } from "@/lib/config";
import { formatDateTime, formatINR, gmailComposeUrl, toTitleCase } from "@/lib/utils";
import type { Booking, BookingStatus, Inquiry, PaymentStatus } from "@/lib/types";
import {
  CheckIcon,
  InboxIcon,
  MailIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons";

type Tab = "bookings" | "messages";
type BookingFilter = "all" | BookingStatus;

const bookingStatusStyles: Record<BookingStatus, string> = {
  new: "bg-navy-500/15 text-navy-200 ring-navy-400/40",
  confirmed: "bg-slate-500/15 text-slate-300 ring-slate-400/40",
  completed: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/40",
  cancelled: "bg-red-500/15 text-red-300 ring-red-400/40",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  pending: "bg-slate-500/10 text-slate-300 ring-slate-400/30",
  paid: "bg-emerald-500/10 text-emerald-400 ring-emerald-400/30",
  failed: "bg-red-500/10 text-red-400 ring-red-400/30",
};

const selectClass =
  "rounded-lg border border-white/10 bg-ink-900 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-navy-400";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("bookings");
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/bookings");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load data.");
        const data = await res.json();
        if (!active) return;
        setBookings(data.bookings);
        setInquiries(data.inquiries);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [router]);

  async function updateBooking(
    id: string,
    patch: { booking_status?: BookingStatus; payment_status?: PaymentStatus }
  ) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setError("Could not update booking.");
      return;
    }
    const data = await res.json();
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data.booking } : b))
    );
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete booking.");
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  async function deleteInquiry(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete message.");
      return;
    }
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const filteredBookings = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.booking_status === filter)),
    [bookings, filter]
  );

  const stats = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((b) => b.booking_status === "confirmed").length,
      paid: bookings.filter((b) => b.payment_status === "paid").length,
      newMessages: inquiries.length,
    }),
    [bookings, inquiries]
  );

  function serviceName(id: string) {
    return services.find((s) => s.id === id)?.name ?? toTitleCase(id.replace("-", " "));
  }

  return (
    <main className="relative flex-1 px-5 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage bookings and client messages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-navy-400/50 hover:text-navy-200"
            >
              View site
            </Link>
            <button
              onClick={signOut}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-red-400/50 hover:text-red-300"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total bookings", value: stats.total },
            { label: "Confirmed", value: stats.confirmed },
            { label: "Paid", value: stats.paid },
            { label: "New messages", value: stats.newMessages },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-ink-800/60 p-5">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 rounded-full border border-white/10 bg-ink-800/60 p-1">
            {(
              [
                { id: "bookings", label: "Bookings" },
                { id: "messages", label: "Messages" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-navy-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "bookings" ? (
            <div className="flex items-center gap-2">
              <label htmlFor="filter" className="text-xs text-slate-500">
                Status:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as BookingFilter)}
                className={selectClass}
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">Loading…</p>
        ) : tab === "bookings" ? (
          <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-ink-800/60">
            <p className="border-b border-white/10 px-5 py-3 text-xs text-slate-500">
              Confirming a booking sends the client an automated confirmation email with a review link.
            </p>
            {filteredBookings.length === 0 ? (
                <p className="p-10 text-center text-sm text-slate-500">
                  No bookings yet. They&apos;ll appear here as soon as clients book.
                </p>
            ) : (
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="align-top transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-slate-300">
                          {booking.booking_ref}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {formatDateTime(booking.created_at)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{booking.client_name}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{booking.client_phone}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{booking.client_email}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {booking.event_type} · {booking.location}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{serviceName(booking.service)}</td>
                      <td className="px-5 py-4">
                        <p className="text-slate-300">{booking.event_date}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{booking.event_time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-slate-200">{formatINR(booking.amount)}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Advance: {formatINR(booking.advance_amount)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={booking.payment_status}
                          onChange={(e) =>
                            updateBooking(booking.id, {
                              payment_status: e.target.value as PaymentStatus,
                            })
                          }
                          className={`${selectClass} ${paymentStatusStyles[booking.payment_status]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={booking.booking_status}
                          onChange={(e) =>
                            updateBooking(booking.id, {
                              booking_status: e.target.value as BookingStatus,
                            })
                          }
                          className={`${selectClass} ${bookingStatusStyles[booking.booking_status]}`}
                        >
                          <option value="new">New</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.booking_status === "new" ? (
                            <button
                              onClick={() =>
                                updateBooking(booking.id, {
                                  booking_status: "confirmed",
                                })
                              }
                              title="Confirm booking — sends the client a confirmation email"
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40 transition-colors hover:bg-emerald-500/25"
                            >
                              <CheckIcon className="h-4 w-4" />
                              Confirm
                            </button>
                          ) : null}
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            title="Delete booking"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {inquiries.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-ink-800/60 p-10 text-center">
                <InboxIcon className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm text-slate-500">No messages yet.</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-3xl border border-white/10 bg-ink-800/60 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-navy-200 ring-1 ring-navy-400/30">
                        <UserIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-white">{inquiry.name}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(inquiry.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={gmailComposeUrl(inquiry.email)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-slate-200"
                        title={`Reply to ${inquiry.email}`}
                      >
                        <MailIcon className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
                        title="Delete message"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition-colors hover:border-red-400/50 hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{inquiry.message}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MailIcon className="h-3.5 w-3.5" /> {inquiry.email}
                    </span>
                    {inquiry.phone ? (
                      <span className="flex items-center gap-1.5">
                        <UserIcon className="h-3.5 w-3.5" /> {inquiry.phone}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
