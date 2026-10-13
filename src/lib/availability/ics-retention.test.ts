import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { purgeSyncRuns } from './ics-retention';
import type { Database } from '../db';

describe('ICS retention boundary', () => {
  it('returns a deleted count', async () => {
    const returning = vi.fn().mockResolvedValue([{ id: 'old-1' }, { id: 'old-2' }]);
    const db = { delete: vi.fn(() => ({ where: vi.fn(() => ({ returning })) })) } as unknown as Database;
    await expect(purgeSyncRuns(new Date('2026-10-01T00:00:00Z'), { db })).resolves.toEqual({ deleted: 2 });
    expect(db.delete).toHaveBeenCalledOnce();
  });
});
