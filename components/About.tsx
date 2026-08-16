"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import CountUp from "@/components/CountUp";
import { studioConfig } from "@/lib/config";
import { ArrowRightIcon } from "@/components/icons";

const values = [
  { numeral: "I", label: "Story first", text: "Every frame serves the story you want to tell." },
  { numeral: "II", label: "Craft & care", text: "Deliberate lighting, composition, and attention to detail." },
  { numeral: "III", label: "Personal touch", text: "You work directly with the founder — no middlemen." },
];

type AboutStats = { shoots: number; clients: number; cinematic: number };

export default function About({ stats }: { stats: AboutStats }) {
  const ledger = [
    { value: stats.shoots, label: "Shoots delivered", count: true },
    { value: stats.clients, label: "Happy clients", count: true },
    { value: stats.cinematic, label: "Cinematic films", count: true },
    { value: 1, label: "Studio, one mind", count: false },
  ];
  return (
    <section id="about" className="relative overflow-hidden bg-void py-28">
      <div className="aurora-faint pointer-events-none absolute inset-0" />
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          index="04"
          eyebrow="The studio"
          title="One person. Three lenses."
          description="A creative who treats every client's story as his own."
        />

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-electric">
              About me
            </p>
            <h3 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ice sm:text-5xl">
              Hi, I&apos;m{" "}
              <span className="uppercase text-blood-deep">{studioConfig.founder}</span>
            </h3>
            <p className="mt-7 font-display text-xl font-medium leading-relaxed text-ice">
              I run <span className="text-gradient-blue">{studioConfig.name}</span> — the hands
              behind every frame, every cut, every pixel.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ice-soft">
              {studioConfig.intro}
            </p>

            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue-gradient px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue transition-all hover:-translate-y-0.5"
            >
              Work with me
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="spotlight pointer-events-none absolute -inset-10" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-electric/50 via-cobalt/35 to-teal/50 p-px">
              <div className="relative overflow-hidden rounded-3xl bg-black">
                <div className="grid-fine pointer-events-none absolute inset-0 opacity-50" />
                <div className="pointer-events-none absolute -inset-10 rounded-full bg-electric/10 blur-3xl" />
                <Image
                  src="/dhananjaya-studio-about.png"
                  alt={`${studioConfig.name} — brand mark`}
                  width={900}
                  height={1125}
                  className="relative h-auto w-full object-contain drop-shadow-[0_0_24px_rgba(223,223,231,0.3)]"
                />
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="panel-lift absolute -bottom-5 -left-5 rounded-2xl px-6 py-4 glow-blue-sm backdrop-blur-md"
            >
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-ice-faint">
                Est. 2024 · India
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold">
                <span className="uppercase text-blood-deep">{studioConfig.founder}</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 border-t border-l border-hairline lg:grid-cols-4">
          {ledger.map((item) => (
            <div
              key={item.label}
              className="group border-b border-r border-hairline bg-panel/30 p-8 transition-colors hover:bg-panel/60"
            >
              <p className="font-display text-5xl font-extrabold">
                <span className="text-gradient-blue">
                  {item.count ? <CountUp value={item.value} /> : item.value}
                </span>
              </p>
              <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-electric">
            How I work
          </p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.numeral}
                className="group flex flex-col gap-3 bg-void/90 p-8 transition-colors hover:bg-panel/60"
              >
                <span className="font-display text-3xl font-extrabold italic text-gradient-blue">
                  {value.numeral}
                </span>
                <h4 className="font-display text-2xl font-bold tracking-tight text-ice transition-colors group-hover:text-electric">
                  {value.label}
                </h4>
                <p className="text-sm leading-relaxed text-ice-soft">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
