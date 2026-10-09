import 'server-only';

import ICAL from 'ical.js';

export const AVAILABILITY_TIME_ZONE = 'America/Argentina/La_Rioja';

export type IcsParserErrorCode = 'MALFORMED_FEED' | 'INVALID_PERIOD' | 'INVALID_DATETIME' | 'UNSUPPORTED_TIMEZONE' | 'RECURRENCE_UNSUPPORTED' | 'INVALID_RECURRENCE';

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
    INVALID_RECURRENCE: 'ICS recurrence definition is invalid',
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

function validateRawValue(raw: string): void {
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

function validateRawDateTime(property: ICAL.Property): void {
  validateRawValue(String(property.jCal[3] ?? ''));
}

function validateRecurrenceDates(component: ICAL.Component): void {
  for (const name of ['rdate', 'exdate']) {
    for (const property of component.getAllProperties(name)) {
      for (const raw of property.jCal.slice(3)) {
        const values = Array.isArray(raw) ? raw : [raw];
        for (const value of values) validateRawValue(String(value));
      }
    }
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

function isCancelled(component: ICAL.Component): boolean {
  return String(component.getFirstPropertyValue('status') ?? '').toUpperCase() === 'CANCELLED';
}

function eventPeriod(component: ICAL.Component): OccupancyPeriod {
  if (!component.hasProperty('dtstart') ||
    (!component.hasProperty('dtend') && !component.hasProperty('duration'))) {
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

function addCalendarMonths(value: string, months: number): string {
  const [year, month, day] = value.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return dateString(target.getUTCFullYear(), target.getUTCMonth() + 1, Math.min(day, lastDay));
}

function validateComponentDates(component: ICAL.Component): void {
  const startProperty = component.getFirstProperty('dtstart');
  const endProperty = component.getFirstProperty('dtend');
  if (!startProperty) throw parserError('INVALID_PERIOD');
  validateRawDateTime(startProperty);
  validateTimezoneParameter(startProperty);
  if (endProperty) {
    validateRawDateTime(endProperty);
    validateTimezoneParameter(endProperty);
  }
}

function periodFromTimes(startDate: ICAL.Time, endDate: ICAL.Time, uid?: string): OccupancyPeriod {
  let checkIn: string;
  let checkOut: string;
  try {
    checkIn = normalizedDate(startDate);
    checkOut = normalizedDate(endDate);
  } catch (error) {
    if (error instanceof IcsParserError) throw error;
    throw parserError('INVALID_DATETIME');
  }
  if (checkOut <= checkIn) throw parserError('INVALID_PERIOD');
  return uid ? { checkIn, checkOut, uid } : { checkIn, checkOut };
}

function overlapsWindow(period: OccupancyPeriod, synchronizationDate: string, horizon: string): boolean {
  return period.checkOut > synchronizationDate && period.checkIn < horizon;
}

function recurrenceExceptionPeriod(component: ICAL.Component, uid: string | undefined): OccupancyPeriod | null {
  const recurrenceId = component.getFirstProperty('recurrence-id');
  if (!recurrenceId) throw parserError('INVALID_RECURRENCE');
  validateRawDateTime(recurrenceId);
  validateTimezoneParameter(recurrenceId);
  validateComponentDates(component);
  if (isCancelled(component)) return null;
  let event: ICAL.Event;
  try {
    event = new ICAL.Event(component);
  } catch {
    throw parserError('INVALID_RECURRENCE');
  }
  return periodFromTimes(event.startDate, event.endDate, uid);
}

function recurringPeriods(
  component: ICAL.Component,
  synchronizationDate: string,
  horizon: string,
  exceptions: ICAL.Component[],
): OccupancyPeriod[] {
  validateComponentDates(component);
  try {
    validateRecurrenceDates(component);
  } catch (error) {
    if (error instanceof IcsParserError) throw parserError('INVALID_RECURRENCE');
    throw error;
  }
  if (!component.hasProperty('dtend') && !component.hasProperty('duration')) throw parserError('INVALID_RECURRENCE');
  let event: ICAL.Event;
  try {
    event = new ICAL.Event(component);
  } catch {
    throw parserError('INVALID_RECURRENCE');
  }
  if (!event.isRecurring()) throw parserError('INVALID_RECURRENCE');
  const uid = event.uid?.trim();
  const iterator = event.iterator();
  const periods: OccupancyPeriod[] = [];
  let finished = false;
  for (let count = 0; count < 100_000; count += 1) {
    let occurrence: ICAL.Time | null;
    try {
      occurrence = iterator.next();
    } catch {
      throw parserError('INVALID_RECURRENCE');
    }
    if (!occurrence) {
      finished = true;
      break;
    }
    const occurrenceDate = normalizedDate(occurrence);
    if (occurrenceDate >= horizon) {
      finished = true;
      break;
    }
    const details = event.getOccurrenceDetails(occurrence);
    const itemComponent = details.item.component;
    validateComponentDates(itemComponent);
    if (isCancelled(itemComponent)) continue;
    const period = periodFromTimes(details.startDate, details.endDate, uid);
    if (overlapsWindow(period, synchronizationDate, horizon)) periods.push(period);
  }
  if (!finished) throw parserError('INVALID_RECURRENCE');
  for (const exception of exceptions) {
    const period = recurrenceExceptionPeriod(exception, uid);
    if (period && overlapsWindow(period, synchronizationDate, horizon)) periods.push(period);
  }
  return periods;
}

export function parseIcsCalendar(source: string, options: IcsParserOptions): OccupancyPeriod[] {
  if (typeof source !== 'string' || !(options?.synchronizationDate instanceof Date) || Number.isNaN(options.synchronizationDate.getTime())) {
    throw parserError('MALFORMED_FEED');
  }

  let calendar: ICAL.Component;
  const hasRecurrenceProperty = /(?:^|\r?\n)(?:RRULE|RDATE|EXDATE|RECURRENCE-ID)(?:;[^:]*)?:/i.test(source);
  try {
    calendar = new ICAL.Component(ICAL.parse(source));
    if (calendar.name !== 'vcalendar') throw parserError('MALFORMED_FEED');
  } catch (error) {
    if (error instanceof IcsParserError) throw error;
    throw parserError(hasRecurrenceProperty ? 'INVALID_RECURRENCE' : 'MALFORMED_FEED');
  }

  try {
    const synchronizationDate = dateInZone(options.synchronizationDate, AVAILABILITY_TIME_ZONE);
    const horizon = addCalendarMonths(synchronizationDate, 18);
    const periods: OccupancyPeriod[] = [];
    const components = calendar.getAllSubcomponents('vevent');
    const exceptionsByUid = new Map<string, ICAL.Component[]>();
    for (const component of components) {
      if (!component.hasProperty('recurrence-id')) continue;
      const uid = String(component.getFirstPropertyValue('uid') ?? '').trim();
      if (!uid) throw parserError('INVALID_RECURRENCE');
      exceptionsByUid.set(uid, [...(exceptionsByUid.get(uid) ?? []), component]);
    }
    for (const component of components) {
      if (component.hasProperty('recurrence-id')) continue;
      if (isCancelled(component)) continue;
      const uid = String(component.getFirstPropertyValue('uid') ?? '').trim();
      if (component.hasProperty('rrule') || component.hasProperty('rdate') || component.hasProperty('exdate') || exceptionsByUid.has(uid)) {
        periods.push(...recurringPeriods(component, synchronizationDate, horizon, exceptionsByUid.get(uid) ?? []));
      } else {
        periods.push(eventPeriod(component));
      }
    }
    const unique = new Map<string, OccupancyPeriod>();
    for (const period of periods) unique.set(`${period.uid ?? ''}|${period.checkIn}|${period.checkOut}`, period);
    return [...unique.values()].sort((left, right) =>
      left.checkIn.localeCompare(right.checkIn) || left.checkOut.localeCompare(right.checkOut) || (left.uid ?? '').localeCompare(right.uid ?? ''),
    );
  } catch (error) {
    if (error instanceof IcsParserError) throw error;
    throw parserError('MALFORMED_FEED');
  }
}
