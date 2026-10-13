import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { approveEmptyFeed } from './ics-approval';
import type { Database } from '../db';

function approvalDb(latestId: string, approval: { id: string; previousPeriodCount: number } | null): Database {
  let selectCalls = 0;
  const deleted = vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) }));
  const update = vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: 'approval-id' }]) })) })) }));
  const tx = {
    execute: vi.fn().mockResolvedValue([{ locked: true }]),
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => {
      selectCalls += 1;
      if (selectCalls === 1) return { limit: vi.fn().mockResolvedValue([{ id: 'run-id', status: 'no_data' }]) };
      if (selectCalls === 2) return { orderBy: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: latestId }]) })) };
      return { limit: vi.fn().mockResolvedValue(approval ? [approval] : []) };
    }) })) })),
    delete: deleted,
    update,
  };
  return { transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)) } as unknown as Database;
}

describe('ICS empty-feed approval boundary', () => {
  it('approves only the exact no-data run', async () => {
    await expect(approveEmptyFeed('source-id', 'run-id', { db: approvalDb('run-id', { id: 'approval-id', previousPeriodCount: 2 }) }))
      .resolves.toEqual({ status: 'approved', syncRunId: 'run-id', cleared: 2 });
  });

  it('rejects stale and already-reviewed runs without deleting periods', async () => {
    await expect(approveEmptyFeed('source-id', 'run-id', { db: approvalDb('newer-run', { id: 'approval-id', previousPeriodCount: 2 }) }))
      .resolves.toEqual({ status: 'rejected', code: 'STALE_RUN' });
    await expect(approveEmptyFeed('source-id', 'run-id', { db: approvalDb('run-id', null) }))
      .resolves.toEqual({ status: 'rejected', code: 'ALREADY_REVIEWED' });
  });
});
