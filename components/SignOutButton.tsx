"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { LogOutIcon } from "@/components/icons";

export default function SignOutButton() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ email: data.user.email });
    });
  }, []);

  if (!user) return null;

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      title="Sign out"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/90 px-4 py-2 text-xs font-medium text-slate-300 shadow-xl backdrop-blur transition-all hover:scale-[1.03] hover:text-white"
    >
      <LogOutIcon className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}