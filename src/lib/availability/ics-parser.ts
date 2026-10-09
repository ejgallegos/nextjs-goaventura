import 'server-only';

import ICAL from 'ical.js';

export const AVAILABILITY_TIME_ZONE = 'America/Argentina/La_Rioja';

export type IcsParserErrorCode = 'MALFORMED_FEED' | 'INVALID_PERIOD' | 'INVALID_DATETIME' | 'UNSUPPORTED_TIMEZONE' | 'RECURRENCE_UNSUPPORTED';

export class IcsParserError extends Error {
  readonly code: IcsParserErrorCode;

  constructor(code: IcsParserErrorCode, message: string) {
    super(message);
    this.name = 'IcsParserError';
    this.code = code;
  }
}

export interface OccupancyPeriod {
  checkIn: string;
  checkOut: string;
  uid?: string;
}

export interface IcsParserOptions {
  synchronizationDate: Date;
}

function parserError(code: IcsParserErrorCode): IcsParserError {
  const messages: Record<IcsParserErrorCode, string> = {
    MALFORMED_FEED: 'ICS feed is malformed',
    INVALID_PERIOD: 'ICS event period is invalid',
    INVALID_DATETIME: 'ICS event date-time is invalid',
    UNSUPPORTED_TIMEZONE: 'ICS timezone is unsupported',
    RECURRENCE_UNSUPPORTED: 'ICS recurrence processing is deferred',
  };
  return new IcsParserError(code, messages[code]);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function dateString(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`;
}

function formattedParts(date: Date, timeZone: string): Record<string, number> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
}

function dateInZone(date: Date, timeZone: string): string {
  const parts = formattedParts(date, timeZone);
  return dateString(parts.year, parts.month, parts.day);
}

function localTimeToInstant(time: ICAL.Time, timeZone: string): Date {
  const naive = Date.UTC(time.year, time.month - 1, time.day, time.hour, time.minute, time.second);
  let estimate = naive;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = formattedParts(new Date(estimate), timeZone);
    const renderedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    estimate = naive - (renderedAsUtc - estimate);
  }
  return new Date(estimate);
}

function normalizedDate(time: ICAL.Time): string {
  if (time.isDate) return dateString(time.year, time.month, time.day);
  const timeZone = time.zone?.tzid;
  if (!timeZone || timeZone === 'floating') return dateString(time.year, time.month, time.day);
  if (timeZone === 'UTC') return dateInZone(time.toJSDate(), AVAILABILITY_TIME_ZONE);
  try {
    return dateInZone(localTimeToInstant(time, timeZone), AVAILABILITY_TIME_ZONE);
  } catch (error) {
    if (error instanceof RangeError) throw parserError('UNSUPPORTED_TIMEZONE');
    throw parserError('INVALID_DATETIME');
  }
}

function validateRawDateTime(property: ICAL.Property): void {
  const raw = String(property.jCal[3] ?? '');
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(Z)?)?$/.exec(raw);
  if (!match) throw parserError('INVALID_DATETIME');
  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = hourText === undefined ? 0 : Number(hourText);
  const minute = minuteText === undefined ? 0 : Number(minuteText);
  const second = secondText === undefined ? 0 : Number(secondText);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth || hour > 23 || minute > 59 || second > 59) {
    throw parserError('INVALID_DATETIME');
  }
}

function validateTimezoneParameter(property: ICAL.Property): void {
  const timezone = property.getFirstParameter('tzid');
  if (typeof timezone !== 'string' || timezone.length === 0) return;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format();
  } catch {
    throw parserError('UNSUPPORTED_TIMEZONE');
  }
}

function hasDeferredFeatures(component: ICAL.Component): boolean {
  return ['rrule', 'rdate', 'exdate', 'recurrence-id'].some((name) => component.hasProperty(name)) ||
    String(component.getFirstPropertyValue('status') ?? '').toUpperCase() === 'CANCELLED';
}

function eventPeriod(component: ICAL.Component): OccupancyPeriod {
  if (hasDeferredFeatures(component) || !component.hasProperty('dtstart') ||
    (!component.hasProperty('dtend') && !component.hasProperty('duration'))) {
    if (hasDeferredFeatures(component)) throw parserError('RECURRENCE_UNSUPPORTED');
    throw parserError('INVALID_PERIOD');
  }

  const startProperty = component.getFirstProperty('dtstart');
  const endProperty = component.getFirstProperty('dtend');
  if (!startProperty) throw parserError('INVALID_PERIOD');
  validateRawDateTime(startProperty);
  validateTimezoneParameter(startProperty);
  if (endProperty) {
    validateRawDateTime(endProperty);
    validateTimezoneParameter(endProperty);
  }

  let event: ICAL.Event;
  try {
    event = new ICAL.Event(component);
  } catch {
    throw parserError('INVALID_PERIOD');
  }

  let checkIn: string;
  let checkOut: string;
  try {
    checkIn = normalizedDate(event.startDate);
    checkOut = normalizedDate(event.endDate);
  } catch (error) {
    if (error instanceof IcsParserError) throw error;
    throw parserError('INVALID_DATETIME');
  }
  if (checkOut <= checkIn) throw parserError('INVALID_PERIOD');
  const uid = event.uid?.trim();
  return uid ? { checkIn, checkOut, uid } : { checkIn, checkOut };
}

export function parseIcsCalendar(source: string, options: IcsParserOptions): OccupancyPeriod[] {
  if (typeof source !== 'string' || !(options?.synchronizationDate instanceof Date) || Number.isNaN(options.synchronizationDate.getTime())) {
    throw parserError('MALFORMED_FEED');
  }

  let calendar: ICAL.Component;
  try {
    calendar = new ICAL.Component(ICAL.parse(source));
    if (calendar.name !== 'vcalendar') throw parserError('MALFORMED_FEED');
  } catch (error) {
    if (error instanceof IcsParserError) throw error;
    throw parserError('MALFORMED_FEED');
  }

  try {
    return calendar.getAllSubcomponents('vevent').map(eventPeriod).sort((left, right) =>
      left.checkIn.localeCompare(right.checkIn) || left.checkOut.localeCompare(right.checkOut) || (left.uid ?? '').localeCompare(right.uid ?? ''),
    );
  } catch (error) {
    if (error instanceof IcsParserError) throw error;
    throw parserError('MALFORMED_FEED');
  }
}
