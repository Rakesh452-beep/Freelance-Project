import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export async function requestSiteUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto")?.split(",")[0] || "https";
    if (host) return `${proto}://${host}`;
  } catch {
    // Not inside a request scope (e.g. during build).
  }
  return "http://localhost:3000";
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
              })
            );
          } catch {
            // Called from a Server Component — safe to ignore when the
            // session is refreshed by the client or login flow.
          }
        },
      },
    }
  );
}
