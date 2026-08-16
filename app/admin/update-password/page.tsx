"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  if (!code) {
    return (
      <div className="rounded-3xl border border-white/10 bg-ink-800/70 p-7">
        <h1 className="text-xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-400">
          This reset link is invalid or incomplete.{" "}
          <Link href="/admin/forgot-password" className="text-navy-300 transition-colors hover:text-navy-200">
            Request a new one
          </Link>
          .
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    if (password.length < 8) {
      setStatus("idle");
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setStatus("idle");
      setError("Passwords do not match.");
      return;
    }

    let res: Response;
    try {
      res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      });
    } catch {
      setStatus("idle");
      setError("Could not reach the server. Please try again.");
      return;
    }

    if (res.status === 429) {
      const data = await res.json().catch(() => null);
      setStatus("idle");
      setError(data?.error ?? "Too many attempts. Please try again later.");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setStatus("idle");
      setError(data?.error ?? "Could not update your password.");
      return;
    }

    setStatus("done");
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-navy-400";

  return (
    <div className="rounded-3xl border border-white/10 bg-ink-800/70 p-7">
      <h1 className="text-xl font-bold text-white">Reset password</h1>
      <p className="mt-1 text-sm text-slate-400">Choose a new password for your admin account.</p>

      {status === "done" ? (
        <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Your password has been updated.{" "}
          <Link href="/admin/login" className="text-emerald-200 underline">
            Sign in with your new password
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="up-password" className="mb-1.5 block text-xs font-medium text-slate-400">
              New password
            </label>
            <input
              id="up-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="up-confirm" className="mb-1.5 block text-xs font-medium text-slate-400">
              Confirm password
            </label>
            <input
              id="up-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <p className="text-xs text-slate-500">
            At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a symbol.
          </p>

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
            {status === "loading" ? "Updating…" : "Update password"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-xs text-slate-500">
        <Link href="/admin/login" className="text-navy-300 transition-colors hover:text-navy-200">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-navy-600/25 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <Suspense fallback={null}>
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
