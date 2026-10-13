import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { syncAllSources, syncSource, type SyncDataAccess, type SyncSource } from './ics-sync';
import { isWithinSyncCooldown, resolveSyncConcurrency, SYNC_COOLDOWN_MS } from './sync-cooldown';

const now = new Date('2026-10-01T12:00:00Z');

function source(id: string): SyncSource {
  return { id, icsUrl: `encrypted-${id}` };
}

function dataAccess(sources: SyncSource[], lastAttempt: Date | null = null): SyncDataAccess {
  return {
    listActiveSources: async () => sources,
    findActiveSource: async (id) => sources.find((item) => item.id === id) ?? null,
    latestAttempt: async () => lastAttempt,
  };
}

describe('ICS synchronization orchestration', () => {
  it('applies the two-minute cooldown boundary and force bypass', async () => {
    const fetchDocument = vi.fn(async () => ({ document: 'ics', contentType: 'text/calendar', bytes: 3, redirects: 0 }));
    const dependencies = {
      data: dataAccess([source('one')], new Date(now.getTime() - SYNC_COOLDOWN_MS + 1)),
      fetchDocument,
      parseCalendar: vi.fn(() => []),
      importPeriods: vi.fn(async () => ({ status: 'no_data' as const, syncRunId: 'run', imported: 0 })),
      now: () => now,
    };

    await expect(syncSource('one', {}, dependencies)).resolves.toMatchObject({ status: 'cooldown', code: 'COOLDOWN' });
    dependencies.data.latestAttempt = async () => new Date(now.getTime() - SYNC_COOLDOWN_MS);
    await expect(syncSource('one', {}, dependencies)).resolves.toMatchObject({ status: 'no_data' });
    dependencies.data.latestAttempt = async () => now;
    await expect(syncSource('one', { force: true }, dependencies)).resolves.toMatchObject({ status: 'no_data' });
    expect(fetchDocument).toHaveBeenCalledTimes(2);
  });

  it('returns busy imports without weakening the safety pipeline', async () => {
    const fetchDocument = vi.fn(async () => ({ document: 'ics', contentType: 'text/calendar', bytes: 3, redirects: 0 }));
    const parseCalendar = vi.fn(() => []);
    const importPeriods = vi.fn(async () => ({ status: 'busy' as const }));
    await expect(syncSource('one', { force: true }, {
      data: dataAccess([source('one')]), fetchDocument, parseCalendar, importPeriods, now: () => now,
    })).resolves.toEqual({ sourceId: 'one', status: 'busy', code: 'BUSY' });
    expect(fetchDocument).toHaveBeenCalledOnce();
    expect(parseCalendar).toHaveBeenCalledOnce();
    expect(importPeriods).toHaveBeenCalledOnce();
  });

  it('records pre-import failures for cooldown while force retries', async () => {
    let lastAttempt: Date | null = null;
    let failures = 0;
    const fetchDocument = vi.fn(async () => {
      if (failures++ === 0) throw new Error('raw URL must stay hidden');
      return { document: 'ics', contentType: 'text/calendar', bytes: 3, redirects: 0 };
    });
    const data = dataAccess([source('one')]);
    data.latestAttempt = async () => lastAttempt;
    data.recordPreImportFailure = async (_sourceId, completedAt) => { lastAttempt = completedAt; };
    const dependencies = { data, fetchDocument, parseCalendar: vi.fn(() => []), importPeriods: vi.fn(async () => ({ status: 'no_data' as const, syncRunId: 'run', imported: 0 })), now: () => now };

    await expect(syncSource('one', { force: true }, dependencies)).resolves.toMatchObject({ status: 'failed', code: 'SYNC_FAILED' });
    await expect(syncSource('one', {}, dependencies)).resolves.toMatchObject({ status: 'cooldown', code: 'COOLDOWN' });
    await expect(syncSource('one', { force: true }, dependencies)).resolves.toMatchObject({ status: 'no_data' });
    expect(fetchDocument).toHaveBeenCalledTimes(2);
  });

  it('bounds concurrency, isolates failures, and preserves stable source order', async () => {
    let active = 0;
    let maximum = 0;
    const fetchDocument = vi.fn(async (encryptedUrl: string) => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      if (encryptedUrl === 'encrypted-m') throw new Error('https://secret.example/feed.ics');
      return { document: encryptedUrl, contentType: 'text/calendar', bytes: 3, redirects: 0 };
    });
    const sources = [source('z'), source('m'), source('a')];
    const outcomes = await syncAllSources({ force: true }, {
      data: dataAccess(sources),
      fetchDocument,
      parseCalendar: vi.fn(() => []),
      importPeriods: vi.fn(async () => ({ status: 'succeeded' as const, syncRunId: 'run', imported: 1 })),
      now: () => now,
      concurrency: 2,
    });
    expect(outcomes.map((outcome) => outcome.sourceId)).toEqual(['a', 'm', 'z']);
    expect(outcomes[1]).toEqual({ sourceId: 'm', status: 'failed', code: 'SYNC_FAILED' });
    expect(maximum).toBeLessThanOrEqual(2);
    expect(fetchDocument).toHaveBeenCalledTimes(3);
  });

  it('resolves safe concurrency defaults and caps configured values', () => {
    expect(resolveSyncConcurrency(undefined)).toBe(3);
    expect(resolveSyncConcurrency(4)).toBe(4);
    expect(resolveSyncConcurrency(100)).toBe(32);
    expect(resolveSyncConcurrency('4junk')).toBe(3);
    expect(resolveSyncConcurrency('2.5')).toBe(3);
    expect(resolveSyncConcurrency('-1')).toBe(3);
    expect(resolveSyncConcurrency('NaN')).toBe(3);
    expect(isWithinSyncCooldown(now, new Date(now.getTime() - SYNC_COOLDOWN_MS))).toBe(false);
  });
});
