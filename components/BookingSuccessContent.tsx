"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import UpiPaymentCard from "@/components/UpiPaymentCard";
import { formatINR } from "@/lib/utils";
import { BadgeCheckIcon, HomeIcon } from "@/components/icons";

interface BookingSuccessContentProps {
  bookingRef: string | null;
  advanceAmount: number;
  payOnline: boolean;
  successMode?: "free" | "quote" | "paid";
}

export default function BookingSuccessContent({
  bookingRef,
  advanceAmount,
  payOnline,
  successMode = "paid",
}: BookingSuccessContentProps) {
  return (
    <div className="relative mx-auto w-full max-w-xl text-center">
      <motion.div
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-gradient text-abyss glow-blue"
      >
        <BadgeCheckIcon className="h-12 w-12" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="mt-9 flex items-center justify-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-electric">
          <span className="h-1.5 w-1.5 rounded-full bg-teal blink" />
          {"Booking log"}
        </p>
        <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ice sm:text-6xl">
          Booking <span className="text-gradient-blue">received!</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ice-soft">
          {successMode === "free"
            ? "Your booking is saved and completely FREE — no payment needed. We'll reach out shortly to confirm your slot."
            : successMode === "quote"
              ? "Your booking is saved. We'll contact you to discuss pricing for your posters / flyers / banners — no online payment needed."
              : payOnline
                ? `Your booking is saved. Pay your advance of ${formatINR(advanceAmount)} to secure the date — the studio confirms once the payment reflects.`
                : "Your booking is saved. We'll reach out shortly to confirm your slot and settle the advance payment."}
        </p>
      </motion.div>

      {bookingRef ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative mx-auto mt-9 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-electric/60 via-cobalt/40 to-teal/50 p-px"
        >
          <div className="relative overflow-hidden rounded-2xl bg-void/95 p-8 backdrop-blur-xl">
            <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <span className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-electric/60" />
              <span className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-electric/60" />
              <span className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-electric/60" />
              <span className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-electric/60" />

              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-ice-faint">
                Your booking reference
              </p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[0.14em] text-gradient-blue">
                {bookingRef}
              </p>
              <div className="mx-auto mt-5 h-px w-40 bg-electric/40" />
              <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint">
                Save this reference — quote it when you talk to us.
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {payOnline && bookingRef && advanceAmount > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <UpiPaymentCard bookingRef={bookingRef} amount={advanceAmount} />
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/"
          className="glass-blue inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ice transition-colors hover:border-electric/50 hover:text-electric"
        >
          <HomeIcon className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
