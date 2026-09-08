"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });
      if (error) {
        setGoogleLoading(false);
        setStatus("error");
        setError("Google sign-in failed. Please try again.");
      }
    } catch {
      setGoogleLoading(false);
      setStatus("error");
      setError("Could not reach the server. Please try again.");
    }
  }

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

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
              or
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-4">
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
