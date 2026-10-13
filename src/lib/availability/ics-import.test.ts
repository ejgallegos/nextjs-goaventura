import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { AvailabilityImportError, deriveOccurrenceId, importAvailabilityPeriods, validateImportPeriods } from './ics-import';
import type { Database } from '../db';

const validPeriod = { checkIn: '2026-10-10', checkOut: '2026-10-12', uid: 'event@example.test' };

describe('ICS import boundary', () => {
  it('requires stable event identity and valid half-open dates before mutation', () => {
    expect(validateImportPeriods([validPeriod])).toEqual([validPeriod]);
    expect(() => validateImportPeriods([{ checkIn: '2026-10-10', checkOut: '2026-10-12' }])).toThrowError(
      expect.objectContaining({ code: 'INVALID_PERIODS' }),
    );
    expect(() => validateImportPeriods([{ ...validPeriod, checkOut: '2026-10-10' }])).toThrowError(AvailabilityImportError);
  });

  it('derives a deterministic occurrence identity from UID and interval', () => {
    expect(deriveOccurrenceId(validPeriod)).toBe(deriveOccurrenceId({ ...validPeriod }));
    expect(deriveOccurrenceId(validPeriod)).not.toBe(deriveOccurrenceId({ ...validPeriod, checkOut: '2026-10-13' }));
  });

  it('returns busy without reading or mutating when the source lock is unavailable', async () => {
    const execute = vi.fn().mockResolvedValue([{ locked: false }]);
    const tx = { execute };
    const db = {
      transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)),
    } as unknown as Database;

    await expect(importAvailabilityPeriods('source-id', [validPeriod], { db })).resolves.toEqual({ status: 'busy' });
    expect(execute).toHaveBeenCalledOnce();
  });

  it('records an empty import as no_data without replacing the snapshot', async () => {
    const update = vi.fn(() => ({
      set: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })),
    }));
    const approvalValues = vi.fn(() => ({ onConflictDoNothing: vi.fn().mockResolvedValue([]) }));
    const approvalInsert = vi.fn(() => ({ values: approvalValues }));
    const snapshotTx = {
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn().mockResolvedValue([{ count: 2 }]) })) })),
      insert: approvalInsert,
      update,
    };
    const tx = {
      execute: vi.fn().mockResolvedValue([{ locked: true }]),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 'source-id' }]) })),
        })),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: 'run-id' }]) })),
      })),
      transaction: vi.fn(async (callback: (transaction: typeof snapshotTx) => Promise<unknown>) => callback(snapshotTx)),
      update,
    };
    const db = { transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)) } as unknown as Database;

    await expect(importAvailabilityPeriods('source-id', [], { db })).resolves.toEqual({
      status: 'no_data',
      syncRunId: 'run-id',
      imported: 0,
    });
    await expect(importAvailabilityPeriods('source-id', [], { db })).resolves.toEqual({
      status: 'no_data',
      syncRunId: 'run-id',
      imported: 0,
    });
    expect(db.transaction).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledTimes(2);
    expect(approvalInsert).toHaveBeenCalledTimes(2);
    expect(approvalValues).toHaveBeenCalledWith(expect.objectContaining({ previousPeriodCount: 2 }));
  });

  it('records a sanitized failure while the snapshot transaction rolls back', async () => {
    const update = vi.fn(() => ({
      set: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })),
    }));
    const tx = {
      execute: vi.fn().mockResolvedValue([{ locked: true }]),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 'source-id' }]) })),
        })),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: 'run-id' }]) })),
      })),
      transaction: vi.fn().mockRejectedValue(new Error('sensitive feed content')),
      update,
    };
    const db = { transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)) } as unknown as Database;

    await expect(importAvailabilityPeriods('source-id', [validPeriod], { db })).resolves.toEqual({
      status: 'failed',
      syncRunId: 'run-id',
      imported: 0,
    });
    expect(update).toHaveBeenCalledOnce();
  });

  it('rolls back snapshot writes when the terminal success update fails', async () => {
    const outerUpdate = vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })) }));
    const snapshotUpdate = vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn().mockRejectedValue(new Error('db failure')) })) }));
    const snapshotTx = {
      delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })),
      insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue([]) })),
      update: snapshotUpdate,
    };
    const tx = {
      execute: vi.fn().mockResolvedValue([{ locked: true }]),
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 'source-id' }]) })) })) })),
      insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: 'run-id' }]) })) })),
      transaction: vi.fn(async (callback: (transaction: typeof snapshotTx) => Promise<unknown>) => callback(snapshotTx)),
      update: outerUpdate,
    };
    const db = { transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)) } as unknown as Database;

    await expect(importAvailabilityPeriods('source-id', [validPeriod], { db })).resolves.toEqual({
      status: 'failed',
      syncRunId: 'run-id',
      imported: 0,
    });
    expect(snapshotUpdate).toHaveBeenCalledOnce();
    expect(outerUpdate).toHaveBeenCalledOnce();
  });

  it('records eventsSeen when completing a reserved non-empty run', async () => {
    const updates: Array<Record<string, unknown>> = [];
    const update = vi.fn(() => ({ set: vi.fn((values: Record<string, unknown>) => {
      updates.push(values);
      return { where: vi.fn().mockResolvedValue([]) };
    }) }));
    let selectCalls = 0;
    const tx = {
      execute: vi.fn().mockResolvedValue([{ locked: true }]),
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => {
        selectCalls += 1;
        return selectCalls === 1
          ? { limit: vi.fn().mockResolvedValue([{ id: 'source-id' }]) }
          : { orderBy: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 'attempt-2' }]) })) };
      }) })) })),
      transaction: vi.fn(async (callback: (transaction: { delete: (...args: unknown[]) => unknown; insert: (...args: unknown[]) => unknown; update: typeof update }) => Promise<unknown>) => callback({
        delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })),
        insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue([]) })),
        update,
      })),
      update,
    };
    const db = { transaction: vi.fn((callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx)) } as unknown as Database;

    await expect(importAvailabilityPeriods('source-id', [validPeriod], { db }, 'attempt-2')).resolves.toMatchObject({ status: 'succeeded' });
    expect(updates).toContainEqual(expect.objectContaining({ eventsSeen: 1 }));
  });
});
