"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  StarIcon,
} from "@/components/icons";

export interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

const inputClass =
  "w-full rounded-lg border border-hairline bg-abyss/70 px-4 py-3 text-sm text-ice placeholder:text-ice-faint outline-none transition-colors focus:border-electric/60 focus:ring-2 focus:ring-electric/15";

const labelClass =
  "mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint";

export default function ReviewForm({
  onReviewAdded,
  onDone,
  heading = "Share your experience",
  subtext = "Real reviews from real clients — your feedback helps others choose.",
}: {
  onReviewAdded?: (review: Review) => void;
  onDone?: () => void;
  heading?: string;
  subtext?: string;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (rating < 1) {
      setError("Please select a rating.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");
      setStatus("sent");
      onReviewAdded?.(data.review as Review);
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit your review. Please try again."
      );
    }
  };

  if (status === "sent") {
    return (
      <div className="relative py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-gradient text-abyss glow-blue-sm">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ice">
          Thank you!
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ice-soft">
          Your review has been submitted and will appear in the testimonials section.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-gradient px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue-sm transition-all hover:-translate-y-0.5"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-electric">
        <StarIcon className="h-3.5 w-3.5" />
        {"// Leave a review"}
      </p>
      <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ice">
        {heading}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ice-soft">{subtext}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="review-name" className={labelClass}>
            Your name
          </label>
          <input
            id="review-name"
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <span className={labelClass}>Your rating</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hovered || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110"
                >
                  <StarIcon
                    className={`h-8 w-8 transition-colors ${
                      active ? "text-electric" : "text-ice-faint/40"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="review-message" className={labelClass}>
            Your review
          </label>
          <textarea
            id="review-message"
            required
            rows={4}
            placeholder="How was working with Dhanunjay Three Lenses?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <ClockIcon className="h-4 w-4 animate-pulse" />
              Submitting...
            </>
          ) : (
            <>
              <ArrowRightIcon className="h-4 w-4" />
              Submit review
            </>
          )}
        </button>
      </form>
    </div>
  );
}
