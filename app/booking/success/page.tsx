import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingSuccessContent from "@/components/BookingSuccessContent";

export const metadata: Metadata = {
  title: "Booking Confirmed | Dhanunjay Three Lenses Studio",
};

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { ref, pay, amount, mode } = await searchParams;
  const bookingRef = typeof ref === "string" ? ref : null;
  const advanceAmount = typeof amount === "string" ? Number(amount) : 0;
  const payOnline = pay === "1";
  const successMode =
    mode === "free" || mode === "quote" ? mode : "paid";

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-abyss px-5 pt-24 pb-16">
        <div className="aurora pointer-events-none absolute inset-0" />
        <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
        <div className="vignette pointer-events-none absolute inset-0" />

        <BookingSuccessContent
          bookingRef={bookingRef}
          advanceAmount={advanceAmount}
          payOnline={payOnline}
          successMode={successMode}
        />
      </main>
      <Footer />
    </>
  );
}
