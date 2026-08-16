"use client";

import Link from "next/link";
import { LockIcon } from "@/components/icons";

export default function AdminLink() {
  return (
    <Link
      href="/admin"
      title="Studio admin"
      className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ice-faint/70 transition-colors hover:text-electric"
    >
      <LockIcon className="h-3 w-3" />
      Admin
    </Link>
  );
}
