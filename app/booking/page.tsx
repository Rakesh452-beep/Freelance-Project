import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { services, studioConfig } from "@/lib/config";
import { formatINR, freeTrialActive } from "@/lib/utils";
import { CameraIcon, CheckIcon, SparklesIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Book a Shoot | Dhanunjay Three Lenses Studio",
  description:
    "Book photography, cinematography, or graphic design services with Dhanunjay Three Lenses Studio in under two minutes.",
};

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex-1 overflow-hidden bg-abyss pt-28">
        <div className="aurora pointer-events-none absolute inset-0" />
        <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
        <div className="vignette pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-panel/70 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-electric backdrop-blur-sm">
              <CameraIcon className="h-3.5 w-3.5" />
              {studioConfig.name}
            </p>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-ice sm:text-6xl lg:text-7xl">
              Book your <span className="text-gradient-blue">shoot</span>
            </h1>
            <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.24em] text-ice-faint">
              Fill the form below. We&apos;ll confirm your slot within a few hours.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
            <div className="panel-lift relative overflow-hidden rounded-2xl p-6 sm:p-9">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-gradient opacity-10 blur-3xl" />
              <div className="relative">
                <Suspense fallback={null}>
                  <BookingForm />
                </Suspense>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="panel-lift rounded-2xl p-6">
                <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-electric">
                  <span className="text-gradient-blue">{"//"}</span> Why book online?
                </h3>
                <ul className="mt-5 space-y-3">
                  {[
                    "Instant booking reference",
                    "Pay deposit online via UPI",
                    "Date secured before anyone else",
                    "Direct line to the studio",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ice-soft">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel-lift rounded-2xl p-6">
                <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-electric">
                  <span className="text-gradient-blue">{"//"}</span> Starting prices
                </h3>
                <ul className="mt-5 space-y-3">
                  {services.map((s) => (
                    <li key={s.id} className="border-b border-hairline pb-2.5 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-ice-soft">{s.name}</span>
                        <span className="font-display text-lg font-extrabold text-gradient-blue">
                          from {formatINR(s.priceFrom)}
                        </span>
                      </div>
                      {s.priceNote ? (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ice-faint">
                          {s.priceNote}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice-faint">
                  Final quote depends on duration, location, and requirements.
                </p>
              </div>

              {freeTrialActive() ? (
                <div className="relative overflow-hidden rounded-2xl border border-teal/50 bg-gradient-to-br from-teal/15 via-panel/70 to-royal/15 p-6 backdrop-blur-sm">
                  <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-blue-gradient opacity-20 blur-3xl" />
                  <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-teal">
                    <SparklesIcon className="h-4 w-4" />
                    FREE TRIAL · Aug 16 – Oct 31
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ice-soft">
                    Your <span className="font-bold text-ice">first booking is completely
                    free</span> — no advance, no payment. From November, bookings are
                    charged at the regular rates. Already booked once? Regular rates apply.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
