"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { services } from "@/lib/config";
import { formatINR } from "@/lib/utils";
import type { BookingPayload, ServiceId } from "@/lib/types";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/icons";

interface SubmitResult {
  bookingRef: string;
  payNow: boolean;
  booking: { advance_amount: number };
}

type SuccessMode = "quote" | "paid";

const timeSlots = [
  "9:00 AM",
  "11:00 AM",
  "1:00 PM",
  "3:00 PM",
  "5:00 PM",
  "7:00 PM",
  "9:00 PM",
];

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") as ServiceId | null;

  const [service, setService] = useState<ServiceId>(
    preselected && services.some((s) => s.id === preselected) ? preselected : services[0].id
  );
  const [eventTypeId, setEventTypeId] = useState<string>(
    () =>
      services.find(
        (s) => s.id === (preselected && services.some((p) => p.id === preselected) ? preselected : services[0].id)
      )?.eventTypes[0]?.id ?? ""
  );
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    event_date: "",
    event_time: "",
    delivery_date: "",
    location: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const activeService = useMemo(
    () => services.find((s) => s.id === service)!,
    [service]
  );

  const activeEventType = useMemo(
    () =>
      activeService.eventTypes.find((et) => et.id === eventTypeId) ??
      activeService.eventTypes[0],
    [activeService, eventTypeId]
  );

  const today = new Date().toISOString().split("T")[0];
  const depositAmount = activeEventType?.quoteOnly
    ? 0
    : activeEventType?.advance ?? 0;

  function selectService(id: ServiceId) {
    setService(id);
    const def = services.find((s) => s.id === id);
    setEventTypeId(def?.eventTypes[0]?.id ?? "");
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const payload: BookingPayload = {
      service,
      event_type_id: activeEventType.id,
      event_type: activeEventType.label,
      client_name: form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone,
      event_date: form.event_date,
      event_time: service === "graphic-design" ? "Anytime" : form.event_time,
      location: form.location,
      notes: [
        form.notes.trim(),
        service === "graphic-design" && form.delivery_date
          ? `Delivery date: ${form.delivery_date}`
          : null,
      ]
        .filter(Boolean)
        .join("\n") || undefined,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Booking failed. Please try again.");

      const result = data as SubmitResult;
      const actualAdvance = result.booking?.advance_amount ?? depositAmount;
      const mode: SuccessMode = activeEventType.quoteOnly ? "quote" : "paid";

      router.push(
        `/booking/success?ref=${encodeURIComponent(result.bookingRef)}&pay=${result.payNow ? "1" : "0"}&amount=${actualAdvance}&mode=${mode}`
      );
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-hairline bg-abyss/70 px-4 py-3 text-sm text-ice placeholder:text-ice-faint outline-none transition-colors focus:border-electric/60 focus:ring-2 focus:ring-electric/15";

  const labelClass =
    "mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint";

  const stepTitleClass =
    "flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ice-soft";

  const stepBadgeClass =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-gradient font-mono text-xs font-bold text-abyss";

  const optionClass = (selected: boolean) =>
    `rounded-xl border p-4 text-left transition-all ${
      selected
        ? "border-electric/60 bg-blue-gradient/10 shadow-[0_0_0_3px_rgba(105,223,152,0.15)]"
        : "border-hairline bg-abyss/60 hover:border-electric/40"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <h2 className={stepTitleClass}>
          <span className={stepBadgeClass}>1</span>
          <UserIcon className="h-4 w-4 text-electric" /> Choose a service
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {services.map((s) => {
            const selected = service === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => selectService(s.id)}
                className={optionClass(selected)}
              >
                <p className="font-display text-xl font-bold tracking-tight text-ice">
                  {s.name}
                </p>
                <p className="mt-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ice-faint">
                  from {formatINR(s.priceFrom)}
                </p>
                {selected ? (
                  <p className="mt-2 inline-flex items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-teal">
                    <CheckIcon className="h-3.5 w-3.5" /> Selected
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className={stepTitleClass}>
          <span className={stepBadgeClass}>2</span>
          {service === "graphic-design" ? (
            <>
              <CalendarIcon className="h-4 w-4 text-electric" /> Date &amp; delivery
            </>
          ) : (
            <>
              <ClockIcon className="h-4 w-4 text-electric" /> Date &amp; time
            </>
          )}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b-date" className={labelClass}>
              {service === "graphic-design" ? "Start date *" : "Event date *"}
            </label>
            <input
              id="b-date"
              type="date"
              required
              min={today}
              value={form.event_date}
              onChange={(e) => {
                const value = e.target.value;
                update("event_date", value);
                if (service === "graphic-design") {
                  update("delivery_date", value ? addDays(value, 3) : "");
                }
              }}
              className={inputClass}
            />
            {service === "graphic-design" ? (
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ice-faint">
                We deliver 2–3 days after this date
              </p>
            ) : null}
          </div>
          {service === "graphic-design" ? (
            <div>
              <label htmlFor="b-delivery" className={labelClass}>
                Delivery date *
              </label>
              <input
                id="b-delivery"
                type="date"
                required
                min={form.event_date ? addDays(form.event_date, 2) : today}
                value={form.delivery_date}
                onChange={(e) => update("delivery_date", e.target.value)}
                className={inputClass}
              />
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ice-faint">
                Earliest delivery is 2 days out — auto-set to 3
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="b-time" className={labelClass}>
                Preferred time *
              </label>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 shrink-0 text-electric" />
                <select
                  id="b-time"
                  required
                  value={form.event_time}
                  onChange={(e) => update("event_time", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a slot
                  </option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className={stepTitleClass}>
          <span className={stepBadgeClass}>3</span>
          <UserIcon className="h-4 w-4 text-electric" /> Your details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b-name" className={labelClass}>
              Full name *
            </label>
            <input
              id="b-name"
              required
              value={form.client_name}
              onChange={(e) => update("client_name", e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="b-email" className={labelClass}>
              Email *
            </label>
            <input
              id="b-email"
              type="email"
              required
              value={form.client_email}
              onChange={(e) => update("client_email", e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="b-phone" className={labelClass}>
              Phone *
            </label>
            <input
              id="b-phone"
              type="tel"
              required
              value={form.client_phone}
              onChange={(e) => update("client_phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="b-event" className={labelClass}>
              What are we booking? *
            </label>
            <select
              id="b-event"
              required
              value={eventTypeId}
              onChange={(e) => setEventTypeId(e.target.value)}
              className={inputClass}
            >
              {activeService.eventTypes.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.label} {et.quoteOnly ? "· by quote" : ""}
                </option>
              ))}
            </select>
            {activeEventType.note ? (
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ice-faint">
                {activeEventType.note}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="b-location" className={labelClass}>
              Location *
            </label>
            <input
              id="b-location"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City / venue"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="b-notes" className={labelClass}>
              Anything else?
            </label>
            <input
              id="b-notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Guest count, theme, special requests…"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={stepTitleClass}>
          <span className={stepBadgeClass}>4</span>
          Payment
        </h2>
        {activeEventType.quoteOnly ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-electric/40 bg-gradient-to-br from-royal/15 via-panel/70 to-royal/15 p-6">
            <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-electric">
              <SparklesIcon className="h-4 w-4" />
              Pricing by discussion
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ice-soft">
              Full-event posters, flyers and banners are quoted after a quick call or
              message. Confirm the booking and we&apos;ll reach out with a price — no
              online payment needed now.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-electric/40 bg-panel/50 p-5">
            <p className="font-display text-xl font-bold tracking-tight text-ice">
              Advance payment via UPI required
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ice-faint">
              Pay the {formatINR(depositAmount)} advance to secure your date. GPay,
              PhonePe and Paytm are supported.
            </p>
          </div>
        )}
      </div>

      {status === "error" ? (
        <p className="rounded-xl border border-blood/30 bg-blood/5 px-4 py-3 text-sm font-medium text-blood">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading"
          ? "Booking…"
          : activeEventType.quoteOnly
            ? "Confirm Booking — we'll contact you"
            : `Confirm & Pay ${formatINR(depositAmount)}`}
        {status !== "loading" ? <ArrowRightIcon className="h-4 w-4" /> : null}
      </button>
    </form>
  );
}
