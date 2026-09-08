"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const hasError = Boolean(searchParams.get("error"));
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    hasError ? "error" : "idle"
  );

  async function handleGoogleSignIn() {
    setStatus("loading");
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-navy-600/25 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-ink-800/70 p-7">
        <Link href="/" className="mb-2 block text-center">
          <span className="text-lg font-bold text-white">
            Dhanunjay <span className="text-navy-300">Three Lenses Studio</span>
          </span>
        </Link>
        <h1 className="mt-4 text-center text-xl font-bold text-white">
          Sign in to continue
        </h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          Use your Google account to access the website.
        </p>

        {status === "error" ? (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Google sign-in failed. Please make sure Google Sign-In is enabled in
            Supabase (Auth → Providers), then try again.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
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
          {status === "loading" ? "Redirecting to Google…" : "Sign in with Google"}
        </button>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-500">
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-400 transition-colors hover:text-white"
          >
            Sign out
          </button>
          <span>·</span>
          <Link href="/admin/login" className="text-navy-300 transition-colors hover:text-navy-200">
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}