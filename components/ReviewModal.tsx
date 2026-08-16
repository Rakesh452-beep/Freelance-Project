"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReviewForm, { type Review } from "@/components/ReviewForm";
import { XIcon } from "@/components/icons";

export type { Review } from "@/components/ReviewForm";

export default function ReviewModal({
  open,
  onClose,
  onReviewAdded,
}: {
  open: boolean;
  onClose: () => void;
  onReviewAdded: (review: Review) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="panel-lift relative w-full max-w-lg overflow-hidden rounded-2xl p-8 soft-shadow sm:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-gradient opacity-10 blur-3xl" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close review form"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ice-soft transition-colors hover:bg-blue-gradient hover:text-abyss"
            >
              <XIcon className="h-4 w-4" />
            </button>

            <ReviewForm onReviewAdded={onReviewAdded} onDone={onClose} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
