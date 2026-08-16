"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PillNav from "@/components/PillNav";
import { studioConfig } from "@/lib/config";

const navItems = [
  { label: "Home", href: "/#intro" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Review", href: "/#testimonials" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [activeHref, setActiveHref] = useState("/#intro");

  useEffect(() => {
    const ids = navItems
      .map((item) => item.href.split("#")[1])
      .filter(Boolean) as string[];

    const setFromHash = () => {
      const hash = window.location.hash || "#intro";
      setActiveHref(`${window.location.pathname}${hash}`);
    };

    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= probe) current = id;
        }
      }
      setActiveHref(`/#${current}`);
    };

    setFromHash();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", setFromHash);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", setFromHash);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <PillNav
        logo={
          <span className="flex items-center gap-3">
            <Image
              src="/dhananjaya-logo.png"
              alt={studioConfig.name}
              width={800}
              height={297}
              priority
              className="h-10 w-auto object-contain"
            />
            <span className="hidden flex-col leading-none lg:flex">
              <span className="font-display text-base font-bold tracking-tight text-ice">
                It&apos;s{" "}
                <span className="uppercase text-blood-deep">Dhanunjay</span>{" "}
                <span className="text-gradient-blue">Three Lenses</span>
              </span>
              <span className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-electric">
                Est. 2024 · Studio
              </span>
            </span>
          </span>
        }
        logoAlt={studioConfig.name}
        items={navItems}
        activeHref={activeHref}
        baseColor="#0e1e37"
        pillColor="#dfe3e9"
        hoveredPillTextColor="#0e1e37"
        pillTextColor="#dfe3e9"
      />
    </header>
  );
}
