"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ReviewModal, { type Review } from "@/components/ReviewModal";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  QuoteIcon,
  StarIcon,
} from "@/components/icons";

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!mounted) return;
        setReviews(data.reviews ?? []);
      })
      .catch(() => {
        if (mounted) setReviews([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (paused || reviews.length === 0) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % reviews.length),
      6000
    );
    return () => clearInterval(timer);
  }, [paused, reviews.length]);

  const current = reviews[index];

  const handleReviewAdded = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <section id="testimonials" className="relative overflow-hidden bg-abyss py-28">
      <div className="aurora pointer-events-none absolute inset-0 opacity-70" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5">
        <SectionHeading
          index="03"
          eyebrow="Kind words"
          title="What clients say"
          description="Only real reviews from real clients — no placeholder text. Yours could be the first."
        />

        {loading ? (
          <div className="panel-lift relative mt-16 overflow-hidden rounded-3xl p-10 soft-shadow sm:p-16">
            <p className="text-center font-mono text-sm font-bold uppercase tracking-[0.2em] text-ice-faint">
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="panel-lift relative mt-16 overflow-hidden rounded-3xl p-10 text-center soft-shadow sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-gradient opacity-10 blur-3xl" />
            <QuoteIcon className="mx-auto h-12 w-12 text-electric/40" />
            <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ice sm:text-4xl">
              No reviews yet
            </h3>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ice-soft">
              Be the first to share your experience with{" "}
              <span className="uppercase text-blood-deep">Dhanunjay</span> Three Lenses — every
              review below comes from a real client.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-blue-gradient px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue-sm transition-all hover:-translate-y-0.5"
            >
              <StarIcon className="h-4 w-4" />
              Leave a review
            </button>
          </div>
        ) : (
          <>
            <div
              className="panel-lift relative mt-16 overflow-hidden rounded-3xl p-10 soft-shadow sm:p-16"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-gradient opacity-10 blur-3xl" />
              <QuoteIcon className="pointer-events-none absolute right-8 top-8 h-20 w-20 text-electric/10" />

              <AnimatePresence mode="wait">
                <motion.figure
                  key={current.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45 }}
                  className="relative"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: current.rating }).map((_, star) => (
                      <StarIcon key={star} className="h-5 w-5 text-electric" />
                    ))}
                  </div>

                  <blockquote className="mt-7 font-display text-2xl font-medium leading-relaxed text-ice sm:text-3xl">
                    {current.message}
                  </blockquote>

                  <figcaption className="mt-9 flex items-center gap-4 border-t border-hairline pt-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-gradient font-display text-lg font-extrabold text-abyss glow-blue-sm">
                      {current.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-ice">{current.name}</p>
                      <p className="font-mono text-xs text-ice-faint">
                        Verified client
                      </p>
                    </div>
                    <span className="ml-auto hidden font-mono text-5xl font-bold text-transparent sm:block" style={{ WebkitTextStroke: "1px rgba(223,223,231,0.3)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {reviews.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show review ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-8 bg-blue-gradient" : "w-4 bg-hairline"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)}
                    aria-label="Previous review"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ice-soft transition-all hover:border-transparent hover:bg-blue-gradient hover:text-abyss hover:glow-blue-sm"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((index + 1) % reviews.length)}
                    aria-label="Next review"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ice-soft transition-all hover:border-transparent hover:bg-blue-gradient hover:text-abyss hover:glow-blue-sm"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-blue-gradient px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue-sm transition-all hover:-translate-y-0.5"
              >
                <StarIcon className="h-4 w-4" />
                Leave a review
              </button>
            </div>
          </>
        )}
      </div>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />
    </section>
  );
}
