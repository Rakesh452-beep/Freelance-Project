"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { services } from "@/lib/config";
import { formatINR } from "@/lib/utils";
import type { ServiceId } from "@/lib/types";
import {
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  FilmIcon,
  PenToolIcon,
} from "@/components/icons";

const serviceIcons: Record<ServiceId, typeof CameraIcon> = {
  photography: CameraIcon,
  cinematography: FilmIcon,
  "graphic-design": PenToolIcon,
};

const lensLabels = ["Lens 01", "Lens 02", "Lens 03"];

export default function Services() {
  const [open, setOpen] = useState<ServiceId[]>([
    "photography",
    "cinematography",
    "graphic-design",
  ]);

  return (
    <section id="services" className="relative overflow-hidden bg-void py-28">
      <div className="aurora-faint pointer-events-none absolute inset-0" />
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          index="01"
          eyebrow="The three lenses"
          title="Three crafts. One vision."
          description="Pick the lens you need — every project is handled personally, start to finish."
        />

        <div className="mt-14 border-t border-hairline">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.id];
            const isOpen = open.includes(service.id);
            return (
              <div
                key={service.id}
                className={`border-b border-hairline transition-colors ${
                  isOpen ? "bg-panel/40" : "bg-panel/15 hover:bg-panel/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpen((prev) =>
                      isOpen
                        ? prev.filter((id) => id !== service.id)
                        : [...prev, service.id]
                    )
                  }
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 py-8 text-left sm:gap-10"
                >
                  <span
                    className={`hidden font-mono text-[11px] font-bold uppercase tracking-[0.26em] sm:block ${
                      isOpen ? "text-electric" : "text-ice-faint"
                    }`}
                  >
                    {lensLabels[i]}
                  </span>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-gradient text-abyss glow-blue-sm transition-transform duration-300 group-hover:rotate-6 ${
                      isOpen ? "rotate-6" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`truncate font-display text-3xl font-extrabold tracking-tight transition-colors sm:text-4xl ${
                        isOpen ? "text-gradient-blue" : "text-ice group-hover:text-electric"
                      }`}
                    >
                      {service.name}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint">
                      {service.tagline}
                    </p>
                  </div>

                  <span
                    className={`hidden font-mono text-5xl font-bold transition-opacity sm:block ${
                      isOpen ? "text-gradient-blue opacity-100" : "text-ice/15 opacity-60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <ChevronDownIcon
                    className={`h-6 w-6 shrink-0 text-ice-soft transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-electric" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-10 lg:grid-cols-3">
                        <p className="text-sm leading-relaxed text-ice-soft">
                          {service.description}
                        </p>

                        <ul className="space-y-2.5">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-3 text-sm text-ice-soft"
                            >
                              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-col items-start gap-4">
                          <div>
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice-faint">
                              Starting from
                            </p>
                            <p className="mt-1 font-display text-4xl font-extrabold">
                              <span className="text-gradient-blue">
                                from {formatINR(service.priceFrom)}
                              </span>
                            </p>
                            {service.priceNote ? (
                              <p className="mt-1 max-w-[220px] font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ice-faint">
                                {service.priceNote}
                              </p>
                            ) : (
                              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice-faint">
                                {service.duration}
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/booking?service=${service.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-gradient px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue-sm transition-all hover:-translate-y-0.5"
                          >
                            Book this lens
                            <ArrowRightIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
