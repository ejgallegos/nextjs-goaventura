import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('../data/accommodations', () => ({ accommodations: [{ slug: 'loft-centro' }] }));

import { configureSource, listSources, setSourceStatus } from './source-admin';
import type { Database } from '../db';

function fakeDb(row: Record<string, unknown>): Database {
  return {
    select: () => ({ from: () => ({ where: () => ({ limit: async () => [row] }) }) }),
  } as unknown as Database;
}

function fakeListDb(rows: Record<string, unknown>[]): Database {
  return { select: () => ({ from: async () => rows }) } as unknown as Database;
}

describe('source administration ownership boundaries', () => {
  it('returns only a masked origin for configured URLs', async () => {
    const privateUrl = 'https://user:secret@feed.example/private.ics?token=top-secret';
    const sources = await listSources({
      db: fakeListDb([{ id: 'source', accommodationSlug: 'loft-centro', status: 'active', icsUrl: 'encrypted-payload' }]),
      decryptUrl: () => privateUrl,
    });

    expect(sources[0]).toMatchObject({ configured: true, maskedUrl: 'https://feed.example/••••' });
    expect(JSON.stringify(sources)).not.toContain(privateUrl);
    expect(JSON.stringify(sources)).not.toContain('top-secret');
  });

  it('rejects reconfiguring an active source before validating or encrypting the URL', async () => {
    const validateUrl = vi.fn(async () => new URL('https://feed.example/replacement'));

    await expect(configureSource({ sourceId: 'source', accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/replacement' }, {
      db: fakeDb({ id: 'source', accommodationSlug: 'loft-centro', status: 'active', icsUrl: 'encrypted-payload' }),
      validateUrl,
    })).rejects.toMatchObject({ code: 'SOURCE_ACTIVE' });
    expect(validateUrl).not.toHaveBeenCalled();
  });

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

  it('rejects unsafe URL configuration without leaking URL or resolver details', async () => {
    const secretUrl = 'https://user:secret@127.0.0.1/private.ics';
    await expect(configureSource({ sourceId: 'source', accommodationSlug: 'loft-centro', icsUrl: secretUrl }, {
      db: fakeDb({ id: 'source', accommodationSlug: 'loft-centro', status: 'inactive', icsUrl: null }),
      validateUrl: async () => { throw new Error(`resolver rejected ${secretUrl}`); },
    })).rejects.toMatchObject({ code: 'INVALID_URL' });
    try {
      await configureSource({ sourceId: 'source', accommodationSlug: 'loft-centro', icsUrl: secretUrl }, {
        db: fakeDb({ id: 'source', accommodationSlug: 'loft-centro', status: 'inactive', icsUrl: null }),
        validateUrl: async () => { throw new Error(`resolver rejected ${secretUrl}`); },
      });
    } catch (error) {
      expect(String(error)).not.toContain(secretUrl);
      expect(String(error)).not.toContain('resolver rejected');
    }
  });
});
