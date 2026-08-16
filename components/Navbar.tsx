"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PillNav from "@/components/PillNav";
import { studioConfig } from "@/lib/config";

const navItems = [
  { label: "Home", href: "/#intro" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [activeHref, setActiveHref] = useState("/#intro");

  useEffect(() => {
    const update = () => {
      const hash = window.location.hash || "#intro";
      setActiveHref(`${window.location.pathname}${hash}`);
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
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
