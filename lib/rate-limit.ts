type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const MAX_WINDOW_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 10_000;

const hits = new Map<string, number[]>();

function prune(now: number) {
  if (hits.size < MAX_ENTRIES) return;
  for (const [key, times] of hits) {
    if (times.length === 0 || now - times[times.length - 1] > MAX_WINDOW_MS) {
      hits.delete(key);
    }
  }
}

export function checkRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const { key, limit, windowMs } = options;
  const now = Date.now();
  prune(now);

  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - timestamps[0])) / 1000)
    );
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return {
    allowed: true,
    remaining: limit - timestamps.length,
    retryAfterSeconds: 0,
  };
}

export function clearRateLimit(key: string) {
  hits.delete(key);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}
