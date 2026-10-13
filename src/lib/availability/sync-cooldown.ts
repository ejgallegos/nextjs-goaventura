export const SYNC_COOLDOWN_MS = 2 * 60 * 1000;
export const DEFAULT_SYNC_CONCURRENCY = 3;

export function isWithinSyncCooldown(now: Date, lastAttempt: Date | null): boolean {
  return lastAttempt !== null && now.getTime() - lastAttempt.getTime() < SYNC_COOLDOWN_MS;
}

export function resolveSyncConcurrency(value?: number | string): number {
  const candidate = value === undefined
    ? process.env.AVAILABILITY_SYNC_CONCURRENCY
    : value;
  const valid = typeof candidate === 'number'
    ? candidate
    : typeof candidate === 'string' && /^\d+$/.test(candidate) ? Number(candidate) : NaN;
  return Number.isSafeInteger(valid) && valid > 0 ? Math.min(valid, 32) : DEFAULT_SYNC_CONCURRENCY;
}
