import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('../data/accommodations', () => ({ accommodations: [{ slug: 'loft-centro' }] }));

import { configureSource, setSourceStatus } from './source-admin';
import type { Database } from '../db';

function fakeDb(row: Record<string, unknown>): Database {
  return {
    select: () => ({ from: () => ({ where: () => ({ limit: async () => [row] }) }) }),
  } as unknown as Database;
}

describe('source administration ownership boundaries', () => {
  it('rejects configuring a source under another accommodation slug', async () => {
    await expect(configureSource({ sourceId: 'source', accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/a' }, {
      db: fakeDb({ id: 'source', accommodationSlug: 'other', status: 'inactive', icsUrl: null }),
    })).rejects.toMatchObject({ code: 'SOURCE_MISMATCH' });
  });

  it('does not activate an unconfigured source', async () => {
    await expect(setSourceStatus('source', 'active', {
      db: fakeDb({ id: 'source', accommodationSlug: 'loft-centro', status: 'inactive', icsUrl: null }),
    })).rejects.toMatchObject({ code: 'SOURCE_NOT_CONFIGURED' });
  });
});
