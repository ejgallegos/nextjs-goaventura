import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
export interface LoginRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface LoginRateLimiter {
  consume(key: string, nowMs?: number): LoginRateLimitResult;
  reset(key?: string): void;
  size(): number;
}

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

export interface LoginRateLimiterOptions {
  maxAttempts: number;
  windowMs: number;
  maxEntries: number;
}

export function createLoginRateLimiter(options: LoginRateLimiterOptions): LoginRateLimiter {
  const entries = new Map<string, RateLimitEntry>();

  function removeExpired(nowMs: number): void {
    for (const [key, entry] of entries) {
      if (nowMs >= entry.resetAt) entries.delete(key);
    }
  }

  function evictToBound(): void {
    while (entries.size >= options.maxEntries) {
      const [key] = [...entries.entries()]
        .sort(([leftKey, left], [rightKey, right]) => {
          if (left.resetAt !== right.resetAt) return left.resetAt - right.resetAt;
          return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
        })[0];
      entries.delete(key);
    }
  }

  return {
    consume(key, nowMs = Date.now()) {
      removeExpired(nowMs);
      const existing = entries.get(key);
      if (!existing) {
        evictToBound();
        entries.set(key, { attempts: 1, resetAt: nowMs + options.windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (existing.attempts >= options.maxAttempts) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - nowMs) / 1000)),
        };
      }

      existing.attempts += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
    reset(key) {
      if (key === undefined) entries.clear();
      else entries.delete(key);
    },
    size() {
      return entries.size;
    },
  };
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const availabilityLoginRateLimiter = createLoginRateLimiter({
  maxAttempts: parsePositiveInteger(process.env.AVAILABILITY_LOGIN_RATE_LIMIT_MAX, 5),
  windowMs: parsePositiveInteger(process.env.AVAILABILITY_LOGIN_RATE_LIMIT_WINDOW_SECONDS, 900) * 1000,
  maxEntries: parsePositiveInteger(process.env.AVAILABILITY_LOGIN_RATE_LIMIT_MAX_ENTRIES, 10_000),
});

export function getPrivacySafeLoginIdentifier(request: { headers: Headers }, secret: string): string {
  const trustedAddress = request.headers.get('x-real-ip')?.trim() || '';
  const clientBucket = isIP(trustedAddress) > 0 ? trustedAddress : 'untrusted-client';
  return createHmac('sha256', secret).update(`availability-login:${clientBucket}`).digest('hex');
}
