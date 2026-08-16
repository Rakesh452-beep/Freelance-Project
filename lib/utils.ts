export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function gmailComposeUrl(to: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export const FREE_TRIAL_WINDOW = { start: "2026-08-16", end: "2026-10-31" };

export function freeTrialActive(now: Date = new Date()): boolean {
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);
  return localDate >= FREE_TRIAL_WINDOW.start && localDate <= FREE_TRIAL_WINDOW.end;
}

export function generateBookingRef(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `DJS-${ts}${rand}`;
}

export function buildUpiIntentUri(opts: {
  pa: string;
  pn: string;
  am: number;
  tn: string;
}): string {
  const query = [
    `pa=${opts.pa}`,
    `pn=${encodeURIComponent(opts.pn)}`,
    `am=${opts.am}`,
    `cu=INR`,
    `tn=${encodeURIComponent(opts.tn)}`,
    `mode=02`,
  ].join("&");
  return `upi://pay?${query}`;
}

export function toTitleCase(value: string): string {
  return value.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
