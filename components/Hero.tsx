"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { studioConfig } from "@/lib/config";
import { CameraIcon, ChevronDownIcon } from "@/components/icons";
import StrokeText from "@/components/StrokeText";

type HeroStats = { shoots: number; clients: number; cinematic: number };

export default function Hero({ stats }: { stats: HeroStats }) {
  const sectionRef = useRef<HTMLElement>(null);

  const heroStats = [
    { value: String(stats.shoots), label: "Shoots delivered" },
    { value: String(stats.clients), label: "Happy clients" },
    { value: String(stats.cinematic), label: "Cinematic films" },
  ];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.25]);
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
        className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-16 px-5 py-24 lg:grid-cols-2 lg:py-20"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-7 font-display leading-[1.05] tracking-tight text-ice"
          >
            <StrokeText
              text="It&#x27;s Dhanunjay&#10;Three Lenses&#10;Studio"
              strokeColor="#8b93a7"
              fillColor="#eef1f6"
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
                  <span className="text-gradient-blue">{stat.value}</span>
                </p>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ice-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: imageY, scale: imageScale, opacity: imageOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full"
          >
            <div className="spotlight pointer-events-none absolute -inset-12" />
            <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-electric/50 via-cobalt/35 to-teal/50 p-px">
              <div className="relative overflow-hidden rounded-3xl bg-black">
                <div className="grid-fine pointer-events-none absolute inset-0 opacity-50" />
                <div className="pointer-events-none absolute -inset-10 rounded-full bg-electric/10 blur-3xl" />
                <Image
                  src="/dhananjaya-studio.png"
                  alt={`${studioConfig.name} — Photography · Cinematography · Graphic Design`}
                  width={900}
                  height={1125}
                  priority
                  className="relative h-auto w-full object-contain drop-shadow-[0_0_24px_rgba(223,223,231,0.35)]"
                />
              </div>
            </div>

            <div className="panel-lift absolute -bottom-5 -left-5 rounded-2xl px-6 py-4 glow-blue-sm backdrop-blur-md">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-ice-faint">
                Founder
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold">
                <span className="uppercase text-blood-deep">{studioConfig.founder}</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
