"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    let res: Response;
    try {
      res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      setStatus("idle");
      setError("Could not reach the server. Please try again.");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setStatus("idle");
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setStatus("done");
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-navy-400";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-navy-600/25 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="text-lg font-bold text-white">
            Dhanunjay <span className="text-navy-300">Three Lenses Studio</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-ink-800/70 p-7">
          <h1 className="text-xl font-bold text-white">Forgot password</h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter your admin email and we&apos;ll send you a reset link. It expires in 1 hour.
          </p>

          {status === "done" ? (
            <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              If that email is registered, a reset link is on its way. Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="fp-email" className="mb-1.5 block text-xs font-medium text-slate-400">
                  Email
                </label>
                <input
                  id="fp-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dhananjayastudio.com"
                  className={inputClass}
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-gradient-to-r from-navy-500 to-navy-700 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-navy-900/40 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-slate-500">
            <Link href="/admin/login" className="text-navy-300 transition-colors hover:text-navy-200">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
