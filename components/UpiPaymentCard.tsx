"use client";

import QRCode from "react-qr-code";
import { studioConfig } from "@/lib/config";
import { buildUpiIntentUri, formatINR } from "@/lib/utils";
import { QrCodeIcon } from "@/components/icons";

interface UpiPaymentCardProps {
  bookingRef: string;
  amount: number;
}

export default function UpiPaymentCard({ bookingRef, amount }: UpiPaymentCardProps) {
  const upiUri = buildUpiIntentUri({
    pa: studioConfig.upiId,
    pn: studioConfig.upiName,
    am: amount,
    tn: `Booking ${bookingRef}`,
  });

  return (
    <div className="relative mx-auto mt-9 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-electric/60 via-cobalt/40 to-teal/50 p-px">
      <div className="relative overflow-hidden rounded-2xl bg-void/95 p-8 backdrop-blur-xl">
        <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <p className="flex items-center justify-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-teal">
            <QrCodeIcon className="h-3.5 w-3.5" />
            Pay your advance via UPI
          </p>
          <p className="mt-3 text-center font-display text-4xl font-extrabold tracking-tight text-gradient-blue">
            {formatINR(amount)}
          </p>
          <p className="mt-1 text-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice-faint">
            Booking ref · {bookingRef}
          </p>

          <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
            <QRCode value={upiUri} size={180} bgColor="#ffffff" fgColor="#0a0f1e" />
          </div>

          <a
            href={upiUri}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-abyss glow-blue-sm transition-all hover:-translate-y-0.5"
          >
            Open UPI app
          </a>
          <p className="mt-3 text-center text-xs leading-relaxed text-ice-soft">
            Scan the QR with <span className="text-teal">GPay · PhonePe · Paytm</span> and
            pay <span className="font-semibold text-ice">{formatINR(amount)}</span> to
            complete your booking.
          </p>

          <p className="mt-5 border-t border-hairline pt-4 text-center text-xs leading-relaxed text-ice-faint">
            Your booking is already saved. Once your payment reflects, we&apos;ll confirm
            your date — the studio verifies UPI payments manually.
          </p>
        </div>
      </div>
    </div>
  );
}
