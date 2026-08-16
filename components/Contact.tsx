"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { studioConfig } from "@/lib/config";
import { gmailComposeUrl } from "@/lib/utils";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/icons";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const channels = [
  {
    label: "Email",
    display: studioConfig.email,
    href: gmailComposeUrl(studioConfig.email),
    icon: MailIcon,
  },
  {
    label: "Call",
    display: studioConfig.phone,
    href: `tel:${studioConfig.phone.replace(/\s/g, "")}`,
    icon: PhoneIcon,
  },
];

const inputClass =
  "w-full rounded-lg border border-hairline bg-abyss/70 px-4 py-3 text-sm text-ice placeholder:text-ice-faint outline-none transition-colors focus:border-electric/60 focus:ring-2 focus:ring-electric/15";

const labelClass =
  "mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("idle");
      alert("Could not send your message. Please try again.");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-void py-28">
      <div className="aurora-faint pointer-events-none absolute inset-0" />
      <div className="grid-fine pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          index="05"
          eyebrow="Get in touch"
          title="Start a conversation"
          description="Tell us about your project — we usually reply within a day."
        />

        <div className="mt-16 grid min-w-0 gap-16 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="font-display text-2xl font-bold leading-snug text-ice">
              Pick a channel — <span className="text-gradient-blue">any channel</span> — and
              let&apos;s talk about your story.
            </p>

            <div className="mt-10 space-y-0">
              {channels.map((channel, i) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 border-t border-hairline py-6 transition-colors last:border-b"
                >
                  <span className="hidden font-mono text-2xl font-bold text-transparent sm:block" style={{ WebkitTextStroke: "1px rgba(223,223,231,0.35)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-gradient text-abyss glow-blue-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <channel.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ice transition-colors group-hover:text-electric [overflow-wrap:anywhere]">
                      {channel.display}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice-faint transition-colors group-hover:text-electric">
                    Reach out →
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-hairline bg-panel/50 px-5 py-4">
              <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-teal blink" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ice-soft">
                Currently taking bookings for this season
              </p>
            </div>
          </div>

          <div className="panel-lift relative min-w-0 overflow-hidden rounded-2xl p-8 soft-shadow sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-gradient opacity-10 blur-3xl" />
            <div className="relative">
              <h3 className="font-display text-3xl font-bold tracking-tight text-ice">
                Send a message
              </h3>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      placeholder="Full name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      required
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project, dates, and ideas..."
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-abyss glow-blue transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === "sent" ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Message sent
                    </>
                  ) : status === "sending" ? (
                    <>
                      <ClockIcon className="h-4 w-4 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon className="h-4 w-4" />
                      Send message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
