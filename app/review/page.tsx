import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";
import { studioConfig } from "@/lib/config";
import { HomeIcon, StarIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Leave a Review | Dhanunjay Three Lenses Studio",
  description:
    "Share your experience with Dhanunjay Three Lenses Studio. Your review helps other clients choose us.",
};

export default function ReviewPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-abyss px-5 pt-28 pb-20">
        <div className="aurora pointer-events-none absolute inset-0" />
        <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />
        <div className="vignette pointer-events-none absolute inset-0" />

        <div className="relative mx-auto w-full max-w-lg">
          <div className="panel-lift relative overflow-hidden rounded-2xl p-8 soft-shadow sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-gradient opacity-10 blur-3xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-panel/70 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-electric backdrop-blur-sm">
                <StarIcon className="h-3.5 w-3.5" />
                {studioConfig.name}
              </p>
              <div className="mt-6">
                <ReviewForm
                  heading="We'd love your feedback!"
                  subtext="Loved working with us? Share your experience — your review appears in our testimonials."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="glass-blue inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ice transition-colors hover:border-electric/50 hover:text-electric"
            >
              <HomeIcon className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
