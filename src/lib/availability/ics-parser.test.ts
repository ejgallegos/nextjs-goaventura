import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { IcsParserError, parseIcsCalendar } from './ics-parser';

const fixture = (name: string) => readFileSync(new URL(`./fixtures/ics/${name}`, import.meta.url), 'utf8');
const syncDate = new Date('2026-10-01T12:00:00Z');

describe('ICS parser B1/B2', () => {
  it('normalizes DATE, UTC, floating, and TZID events into half-open periods', () => {
    const periods = parseIcsCalendar(fixture('base-events.ics'), { synchronizationDate: syncDate });
    expect(periods).toEqual([
      { checkIn: '2026-10-10', checkOut: '2026-10-12', uid: 'date-event@example.test' },
      { checkIn: '2026-10-14', checkOut: '2026-10-15', uid: 'utc-event@example.test' },
      { checkIn: '2026-10-20', checkOut: '2026-10-21', uid: 'floating-event@example.test' },
    ]);

    const tzid = parseIcsCalendar(fixture('tzid-event.ics'), { synchronizationDate: syncDate });
    expect(tzid).toEqual([{ checkIn: '2026-10-26', checkOut: '2026-10-27', uid: 'tzid-event@example.test' }]);
  });

  it('rejects malformed and non-positive ranges without leaking feed content', () => {
    const source = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20261012\nDTEND;VALUE=DATE:20261010\nX-SECRET:SECRET_URL\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(source, { synchronizationDate: syncDate })).toThrow(IcsParserError);
    try {
      parseIcsCalendar(source, { synchronizationDate: syncDate });
    } catch (error) {
      expect(error).toMatchObject({ code: 'INVALID_PERIOD' });
      expect(String(error)).not.toContain('SECRET_URL');
    }
    expect(() => parseIcsCalendar('not-an-ics-feed', { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'MALFORMED_FEED' }),
    );
    const missingRange = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20261012\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(missingRange, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'INVALID_PERIOD' }),
    );
    const invalidDate = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20261301\nDTEND;VALUE=DATE:20261302\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(invalidDate, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'INVALID_DATETIME' }),
    );
  });

  it('derives check-out from a positive DURATION when DTEND is absent', () => {
    const periods = parseIcsCalendar(fixture('duration-event.ics'), { synchronizationDate: syncDate });
    expect(periods).toEqual([{ checkIn: '2026-11-10', checkOut: '2026-11-12', uid: 'duration-event@example.test' }]);
  });

  it('expands recurrence rules, exclusions, additions, overrides, cancellations, and duplicates', () => {
    expect(parseIcsCalendar(fixture('recurrence.ics'), { synchronizationDate: syncDate })).toEqual([
      { checkIn: '2026-10-05', checkOut: '2026-10-06', uid: 'weekly@example.test' },
      { checkIn: '2026-10-21', checkOut: '2026-10-22', uid: 'weekly@example.test' },
      { checkIn: '2026-10-30', checkOut: '2026-10-31', uid: 'weekly@example.test' },
      { checkIn: '2026-11-05', checkOut: '2026-11-06', uid: 'duplicate@example.test' },
    ]);
  });

  it('bounds recurrence expansion at an exclusive eighteen-month horizon', () => {
    const monthly = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:monthly@example.test\nDTSTART;VALUE=DATE:20261001\nDTEND;VALUE=DATE:20261002\nRRULE:FREQ=MONTHLY\nEND:VEVENT\nEND:VCALENDAR';
    const periods = parseIcsCalendar(monthly, { synchronizationDate: syncDate });
    expect(periods).toHaveLength(18);
    expect(periods[0].checkIn).toBe('2026-10-01');
    expect(periods.at(-1)?.checkIn).toBe('2028-03-01');
  });

  it('rejects malformed recurrence definitions with a sanitized typed error', () => {
    expect(() => parseIcsCalendar(fixture('invalid-recurrence.ics'), { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'INVALID_RECURRENCE' }),
    );
  });

  it('uses effective override dates across synchronization and horizon boundaries', () => {
    const source = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:boundary@example.test\nDTSTART;VALUE=DATE:20260901\nDTEND;VALUE=DATE:20260902\nRRULE:FREQ=MONTHLY;COUNT=1\nEND:VEVENT\nBEGIN:VEVENT\nUID:boundary@example.test\nRECURRENCE-ID;VALUE=DATE:20260901\nDTSTART;VALUE=DATE:20261005\nDTEND;VALUE=DATE:20261006\nEND:VEVENT\nBEGIN:VEVENT\nUID:future@example.test\nDTSTART;VALUE=DATE:20280401\nDTEND;VALUE=DATE:20280402\nRRULE:FREQ=MONTHLY;COUNT=1\nEND:VEVENT\nBEGIN:VEVENT\nUID:future@example.test\nRECURRENCE-ID;VALUE=DATE:20280401\nDTSTART;VALUE=DATE:20271205\nDTEND;VALUE=DATE:20271206\nEND:VEVENT\nEND:VCALENDAR';
    expect(parseIcsCalendar(source, { synchronizationDate: syncDate })).toEqual([
      { checkIn: '2026-10-05', checkOut: '2026-10-06', uid: 'boundary@example.test' },
      { checkIn: '2027-12-05', checkOut: '2027-12-06', uid: 'future@example.test' },
    ]);
  });

  it('classifies malformed RDATE-only recurrence input safely', () => {
    const source = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:bad-rdate@example.test\nDTSTART;VALUE=DATE:20261001\nDTEND;VALUE=DATE:20261002\nRDATE;VALUE=DATE:20261301\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(source, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'INVALID_RECURRENCE' }),
    );
  });

  it('validates every RDATE and EXDATE value', () => {
    const rdate = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:bad-rdate-list@example.test\nDTSTART;VALUE=DATE:20261001\nDTEND;VALUE=DATE:20261002\nRDATE;VALUE=DATE:20261003,20261301\nEND:VEVENT\nEND:VCALENDAR';
    const exdate = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:bad-exdate-list@example.test\nDTSTART;VALUE=DATE:20261001\nDTEND;VALUE=DATE:20261002\nRRULE:FREQ=DAILY;COUNT=2\nEXDATE;VALUE=DATE:20261002,20261301\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(rdate, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'INVALID_RECURRENCE' }),
    );
    expect(() => parseIcsCalendar(exdate, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'INVALID_RECURRENCE' }),
    );
  });

  it('rejects custom TZIDs without leaking source values', () => {
    const custom = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;TZID=Custom/Zone:20261010T120000\nDTEND;TZID=Custom/Zone:20261011T120000\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(custom, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'UNSUPPORTED_TIMEZONE' }),
    );
  });
});
