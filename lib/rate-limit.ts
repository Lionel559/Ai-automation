import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfter: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

declare global {
  var aiflowRateLimitStore: RateLimitStore | undefined;
}

// Simple in-memory limiter for the MVP. Replace with Redis/Upstash in production.
const store =
  globalThis.aiflowRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalThis.aiflowRateLimitStore) {
  globalThis.aiflowRateLimitStore = store;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      retryAfter: 0,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;

  return {
    allowed: true,
    retryAfter: 0,
  };
}

export function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimitExceededResponse(message: string, retryAfter: number) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      headers: {
        "Retry-After": String(Math.max(1, retryAfter)),
      },
      status: 429,
    }
  );
}
