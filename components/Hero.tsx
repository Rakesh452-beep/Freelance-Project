"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { studioConfig } from "@/lib/config";
import { CameraIcon, ChevronDownIcon } from "@/components/icons";
import StrokeText from "@/components/StrokeText";
import CountUp from "@/components/CountUp";

type HeroStats = { shoots: number; clients: number; cinematic: number };

export default function Hero({ stats }: { stats: HeroStats }) {
  const sectionRef = useRef<HTMLElement>(null);

  const heroStats = [
    { value: stats.shoots, label: "Shoots delivered" },
    { value: stats.clients, label: "Happy clients" },
    { value: stats.cinematic, label: "Cinematic films" },
  ];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.35]);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative flex min-h-screen flex-col overflow-hidden bg-abyss"
    >
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="grid-fine pointer-events-none absolute inset-0" />
      <div className="light-wash pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-24 lg:py-20"
      >
        <div className="w-full max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-7 font-display leading-[1.05] tracking-tight text-ice"
          >
            <StrokeText
              text="It&#x27;s Dhanunjay&#10;Three Lenses&#10;Studio"
              strokeColor="#96d9ad"
              fillColor="#effff4"
              strokeWidth={1.2}
              drawDuration={1.8}
              fillDelay={0.35}
              stagger={0.02}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={88}
              fontWeight={800}
              letterSpacing={-1}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-ice-soft sm:text-lg"
          >
            {studioConfig.intro.split(studioConfig.founder).map((part, i, arr) => (
              <Fragment key={i}>
                {part}
                {i < arr.length - 1 ? (
                  <span className="font-bold uppercase text-blood-deep">
                    {studioConfig.founder}
                  </span>
                ) : null}
              </Fragment>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-blue-gradient px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue transition-all hover:-translate-y-0.5"
            >
              <CameraIcon className="h-4 w-4" />
              Book a Shoot
            </Link>
            <a
              href="#services"
              className="glass-blue inline-flex items-center gap-2 rounded-full px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ice transition-colors hover:border-electric/50 hover:text-electric"
            >
              Explore Services
              <ChevronDownIcon className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 grid max-w-md grid-cols-3 gap-8"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-electric/40 pl-4">
                <p className="font-display text-4xl font-bold">
                  <span className="text-gradient-blue">
                    <CountUp value={stat.value} />
                  </span>
                </p>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ice-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
}
