"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function matchesShortcut(e: KeyboardEvent): boolean {
  const key = e.key.toLowerCase();
  if (key !== "a") return false;
  if (e.metaKey) return e.shiftKey || e.altKey;
  if (e.ctrlKey) return e.altKey || e.shiftKey;
  return false;
}

export default function AdminShortcut() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!matchesShortcut(e)) return;
      e.preventDefault();
      e.stopPropagation();
      router.push("/admin");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
