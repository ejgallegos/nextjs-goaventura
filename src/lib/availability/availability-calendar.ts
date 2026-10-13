import 'server-only';

import { queryAvailability, type AvailabilityQuery, type AvailabilityResult } from './availability-engine';

export interface AvailabilityCalendarQuery {
  month: string;
  guests: number;
}

export interface AvailabilityCalendarResult {
  month: string;
  days: Array<{ date: string; results: AvailabilityResult[] }>;
}

export interface AvailabilityCalendarDependencies {
  clock?: () => Date;
  query?: typeof queryAvailability;
}

export class AvailabilityCalendarError extends Error {
  readonly code: 'INVALID_CALENDAR_QUERY' | 'PAST_MONTH';
  constructor(code: 'INVALID_CALENDAR_QUERY' | 'PAST_MONTH') { super(code); this.code = code; }
}

function validMonth(value: string): boolean {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return false;
  const [year, month] = value.split('-').map(Number);
  return year >= 1970 && year <= 9999 && month >= 1 && month <= 12;
}

function localToday(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/La_Rioja', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDay(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export async function queryAvailabilityCalendar(
  input: AvailabilityCalendarQuery,
  dependencies: AvailabilityCalendarDependencies = {},
): Promise<AvailabilityCalendarResult> {
  if (!validMonth(input.month) || !Number.isSafeInteger(input.guests) || input.guests <= 0) {
    throw new AvailabilityCalendarError('INVALID_CALENDAR_QUERY');
  }
  const now = dependencies.clock ?? (() => new Date());
  const today = localToday(now());
  const todayMonth = today.slice(0, 7);
  if (input.month < todayMonth) throw new AvailabilityCalendarError('PAST_MONTH');
  const last = new Date(Date.UTC(Number(input.month.slice(0, 4)), Number(input.month.slice(5, 7)), 0)).getUTCDate();
  const query = dependencies.query ?? queryAvailability;
  const results: Array<{ date: string; results: AvailabilityResult[] }> = [];
  let baseline: AvailabilityResult[] | null = null;
  for (let day = 1; day <= last; day += 1) {
    const date = `${input.month}-${String(day).padStart(2, '0')}`;
    if (date < today) {
      baseline ??= await query({ checkIn: today, checkOut: addDay(today), guests: input.guests }, { clock: now });
      results.push({ date, results: baseline.map((item) => ({ ...item, status: 'NO_VERIFICABLE' as const, verification: undefined })) });
      continue;
    }
    const request: AvailabilityQuery = { checkIn: date, checkOut: addDay(date), guests: input.guests };
    results.push({ date, results: await query(request, { clock: now }) });
  }
  return { month: input.month, days: results };
}
