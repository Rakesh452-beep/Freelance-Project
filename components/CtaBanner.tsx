"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";
import { studioConfig } from "@/lib/config";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-abyss py-32">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-40" />
      <div className="light-wash pointer-events-none absolute inset-0" />

      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[22vw] font-extrabold uppercase leading-none text-transparent opacity-25 lg:text-[15rem]"
        style={{ WebkitTextStroke: "1px rgba(223, 223, 231, 0.14)" }}
      >
        Three Lenses
      </p>

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="flex items-center justify-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-electric">
            <span className="h-2 w-2 rounded-full bg-electric blink" />
            {"Limited dates each month"}
          </p>

          <h2 className="mx-auto mt-6 font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-ice sm:text-7xl">
            Ready to tell <em className="italic text-gradient-blue">your</em> story?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ice-soft">
            Lock in your date today — slots fill quickly, and every project is handled
            personally by <span className="uppercase text-blood-deep">{studioConfig.founder}</span>.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-blue-gradient px-9 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue transition-all hover:-translate-y-0.5"
            >
              Book Your Date
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${studioConfig.phone.replace(/\s/g, "")}`}
              className="glass-blue inline-flex items-center gap-2 rounded-full px-9 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ice transition-colors hover:border-electric/50 hover:text-electric"
            >
              Call us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
