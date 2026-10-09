import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { IcsParserError, parseIcsCalendar } from './ics-parser';

const fixture = (name: string) => readFileSync(new URL(`./fixtures/ics/${name}`, import.meta.url), 'utf8');
const syncDate = new Date('2026-10-01T12:00:00Z');

describe('ICS parser B1', () => {
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

  it('rejects recurrence-specific fields for the B2 parser', () => {
    const recurring = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:r\nDTSTART;VALUE=DATE:20261010\nDTEND;VALUE=DATE:20261011\nRRULE:FREQ=DAILY\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(recurring, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'RECURRENCE_UNSUPPORTED' }),
    );
  });

  it('rejects custom TZIDs without leaking source values', () => {
    const custom = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;TZID=Custom/Zone:20261010T120000\nDTEND;TZID=Custom/Zone:20261011T120000\nEND:VEVENT\nEND:VCALENDAR';
    expect(() => parseIcsCalendar(custom, { synchronizationDate: syncDate })).toThrowError(
      expect.objectContaining({ code: 'UNSUPPORTED_TIMEZONE' }),
    );
  });
});
