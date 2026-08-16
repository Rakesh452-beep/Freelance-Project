"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    let res: Response;
    try {
      res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setStatus("error");
      setError("Could not reach the server. Please try again.");
      return;
    }

    if (res.status === 429) {
      const data = await res.json().catch(() => null);
      setStatus("error");
      setError(data?.error ?? "Too many login attempts. Please try again later.");
      return;
    }

    if (!res.ok) {
      setStatus("error");
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
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

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-ink-800/70 p-7"
        >
          <h1 className="text-xl font-bold text-white">Admin login</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to manage bookings and client messages.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="a-email" className="mb-1.5 block text-xs font-medium text-slate-400">
                Email
              </label>
              <input
                id="a-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dhananjayastudio.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="a-password" className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </label>
              <input
                id="a-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>

          {status === "error" ? (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-navy-500 to-navy-700 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-navy-900/40 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
            <Link href="/admin/forgot-password" className="text-navy-300 transition-colors hover:text-navy-200">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
