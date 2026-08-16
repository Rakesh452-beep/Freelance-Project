import Image from "next/image";
import { Fragment } from "react";
import Link from "next/link";
import { studioConfig } from "@/lib/config";
import { gmailComposeUrl } from "@/lib/utils";
import AdminLink from "@/components/AdminLink";
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-abyss">
      <div className="aurora-faint pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-8">
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <Link href="/#intro" className="group flex items-center gap-3">
              <span className="relative flex h-12 shrink-0 items-center justify-center rounded-xl bg-black px-2.5 ring-1 ring-electric/25 sm:h-14">
                <Image
                  src="/dhananjaya-logo.png"
                  alt="Dhanunjay Three Lenses Studio"
                  width={800}
                  height={297}
                  className="h-full w-auto object-contain drop-shadow-[0_0_16px_rgba(223,223,231,0.35)]"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-ice">
                  Dhanunjay{" "}
                  <span className="text-gradient-blue">Three Lenses</span>
                </span>
                <span className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-electric">
                  Studio · Est 2024
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ice-soft">
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
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={studioConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ice-soft transition-all hover:border-transparent hover:bg-blue-gradient hover:text-abyss"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-electric">
              <span className="text-gradient-blue">{"//"}</span> Find us
            </h4>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3 text-sm text-ice-soft">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <span>{studioConfig.location}</span>
              </li>
              <li>
                <a
                  href={gmailComposeUrl(studioConfig.email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-sm text-ice-soft transition-colors hover:text-electric"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-teal transition-transform group-hover:scale-110" />
                  {studioConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${studioConfig.phone.replace(/\s/g, "")}`}
                  className="group inline-flex items-center gap-3 text-sm text-ice-soft transition-colors hover:text-electric"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-teal transition-transform group-hover:scale-110" />
                  {studioConfig.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="marquee mt-16 select-none py-6">
          <div className="marquee-track">
            <span
              className="inline-block whitespace-nowrap font-display text-[9vw] font-extrabold uppercase leading-none tracking-tight text-transparent lg:text-[7rem]"
              style={{ WebkitTextStroke: "1px rgba(223, 223, 231, 0.22)" }}
            >
              Dhanunjay Three Lenses
            </span>
            <span
              aria-hidden="true"
              className="inline-block whitespace-nowrap font-display text-[9vw] font-extrabold uppercase leading-none tracking-tight text-transparent lg:text-[7rem]"
              style={{ WebkitTextStroke: "1px rgba(223, 223, 231, 0.22)" }}
            >
              Dhanunjay Three Lenses
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="font-mono text-xs text-ice-faint">
            © {new Date().getFullYear()} {studioConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-electric/60" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ice-faint">
              {studioConfig.tagline}
            </p>
            <span className="h-1.5 w-1.5 rotate-45 bg-electric/60" />
          </div>
          <AdminLink />
        </div>
      </div>
    </footer>
  );
}
