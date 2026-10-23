'use client';

import Link from 'next/link';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import type { AvailabilityResult } from '../../../lib/availability/availability-engine';
import {
  calendarAccommodationRows, localCalendarDate, safeAvailabilityMessage,
  sortAvailabilityResults, validateAvailabilityForm,
} from '../../../lib/availability/availability-ui';
import { AvailabilityLogoutButton } from './logout-button';

type CalendarDay = { date: string; results: AvailabilityResult[] };
type CalendarData = { month: string; days: CalendarDay[] };
type SyncOutcome = { status?: string };


const names: Record<string, string> = {
  'loft-centro': 'Loft Centro', 'altos-del-talampaya-casa': 'Altos del Talampaya Casa',
  'altos-del-talampaya-casa-ii': 'Altos del Talampaya Casa II',
  'casa-altos-del-talampaya-iii': 'Altos del Talampaya Casa III', 'altos-del-talampaya-dpto': 'Altos del Talampaya Dpto',
};
const statusLabels: Record<AvailabilityResult['status'], string> = {
  DISPONIBLE: 'Disponible', OCUPADO: 'Ocupado', NO_VERIFICABLE: 'No verificable', CAPACIDAD_INSUFICIENTE: 'Capacidad insuficiente',
};

function addDay(value: string): string { const next = new Date(`${value}T00:00:00Z`); next.setUTCDate(next.getUTCDate() + 1); return next.toISOString().slice(0, 10); }
function monthFor(value: string): string { return value.slice(0, 7); }
function displayDate(value: string): string { return new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(new Date(`${value}T00:00:00Z`)); }
function statusClass(status: AvailabilityResult['status']): string {
  if (status === 'DISPONIBLE') return 'border-green-300 bg-green-50 text-green-900';
  if (status === 'OCUPADO') return 'border-red-300 bg-red-50 text-red-900';
  if (status === 'CAPACIDAD_INSUFICIENTE') return 'border-amber-300 bg-amber-50 text-amber-900';
  return 'border-slate-300 bg-slate-50 text-slate-900';
}
function calendarStatusClass(status: AvailabilityResult['status']): string {
  if (status === 'DISPONIBLE') return 'bg-green-100 text-green-900';
  if (status === 'OCUPADO') return 'bg-red-100 text-red-900';
  if (status === 'CAPACIDAD_INSUFICIENTE') return 'bg-amber-100 text-amber-950';
  return 'bg-slate-100 text-slate-900';
}
async function readJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('request');
  return response.json() as Promise<T>;
}

export function AvailabilityDashboard() {
  const today = useMemo(() => localCalendarDate(), []);
  const [checkIn, setCheckIn] = useState(today); const [checkOut, setCheckOut] = useState(addDay(today)); const [guests, setGuests] = useState('2');
  const [results, setResults] = useState<AvailabilityResult[]>([]); const [calendar, setCalendar] = useState<CalendarData | null>(null); const [calendarMonth, setCalendarMonth] = useState(monthFor(today));
  const [syncing, setSyncing] = useState(true); const [syncWarning, setSyncWarning] = useState<string | null>(null); const [queryError, setQueryError] = useState<string | null>(null); const [calendarError, setCalendarError] = useState<string | null>(null);
  const [loadingQuery, setLoadingQuery] = useState(false); const [loadingCalendar, setLoadingCalendar] = useState(false);

  useEffect(() => {
    let current = true;
    readJson<{ outcomes?: SyncOutcome[] }>('/api/admin/disponibilidad/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ force: false }) })
      .then((body) => { if (current && body.outcomes?.some((item) => ['failed', 'busy', 'no_data'].includes(item.status ?? ''))) setSyncWarning('La sincronización terminó con advertencias. Se conservan los últimos datos válidos.'); })
      .catch(() => { if (current) setSyncWarning('No se pudo sincronizar ahora. Se conservan los últimos datos válidos.'); })
      .finally(() => { if (current) setSyncing(false); });
    return () => { current = false; };
  }, []);

  async function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const validation = validateAvailabilityForm({ checkIn, checkOut, guests }, today); if (validation) { setQueryError(validation); return; } setQueryError(null); setLoadingQuery(true); try { const params = new URLSearchParams({ checkIn, checkOut, guests }); const body = await readJson<{ results: AvailabilityResult[] }>(`/api/admin/disponibilidad/availability?${params}`); setResults(sortAvailabilityResults(body.results ?? [])); } catch (error) { setQueryError(safeAvailabilityMessage(error)); } finally { setLoadingQuery(false); } }
  async function loadCalendar(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setCalendarError(null); setLoadingCalendar(true); try { const params = new URLSearchParams({ month: calendarMonth, guests }); setCalendar(await readJson<CalendarData>(`/api/admin/disponibilidad/calendar?${params}`)); } catch (error) { setCalendarError(safeAvailabilityMessage(error)); } finally { setLoadingCalendar(false); } }
  return <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12" aria-busy={syncing}><div className="mx-auto max-w-6xl space-y-8">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Módulo interno</p><h1 className="mt-2 text-3xl font-bold">Disponibilidad</h1></div><div className="flex items-start gap-2"><details className="relative sm:hidden"><summary className="flex min-h-11 cursor-pointer list-none items-center rounded border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">Menú</summary><div className="absolute right-0 z-10 mt-2 min-w-48 rounded-lg border bg-card p-2 shadow-lg"><Link className="flex min-h-11 items-center rounded px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" href="/admin/disponibilidad/fuentes">Administrar fuentes</Link></div></details><nav aria-label="Administración" className="hidden items-center gap-2 sm:flex"><Link className="inline-flex min-h-11 items-center rounded border px-4 py-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" href="/admin/disponibilidad/fuentes">Administrar fuentes</Link><AvailabilityLogoutButton /></nav><div className="sm:hidden"><AvailabilityLogoutButton /></div></div></header>
    <aside className="rounded border border-blue-300 bg-blue-50 p-4 text-sm text-blue-950" role="note"><strong>Información estimada:</strong> la disponibilidad depende de la última sincronización exitosa y puede requerir confirmación manual.</aside>
    {syncing ? <section className="rounded-lg border border-amber-300 bg-amber-50 p-5" role="status" aria-live="polite"><h2 className="font-semibold">Esperando la sincronización inicial</h2><p className="mt-2 text-sm">Estamos verificando las fuentes. No se muestran datos hasta completar este paso.</p></section> : null}
    {syncWarning ? <p className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="status">{syncWarning}</p> : null}
    <section className="rounded-lg border bg-card p-4 shadow-sm sm:p-6"><h2 className="text-xl font-semibold">Buscar disponibilidad</h2><form className="mt-5 grid gap-4 sm:grid-cols-3" onSubmit={search}><label className="text-sm font-medium" htmlFor="availability-check-in">Check-in<input className="mt-2 min-h-11 w-full rounded border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" id="availability-check-in" min={today} onChange={(event) => { const value = event.target.value; setCheckIn(value); setCheckOut(addDay(value)); }} required type="date" value={checkIn} /></label><label className="text-sm font-medium" htmlFor="availability-check-out">Check-out<input className="mt-2 min-h-11 w-full rounded border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" id="availability-check-out" min={addDay(checkIn)} onChange={(event) => setCheckOut(event.target.value)} required type="date" value={checkOut} /></label><label className="text-sm font-medium" htmlFor="availability-guests">Huéspedes<input className="mt-2 min-h-11 w-full rounded border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" id="availability-guests" min="1" onChange={(event) => setGuests(event.target.value)} required type="number" value={guests} /></label><button className="min-h-11 rounded bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50 sm:col-span-3 sm:justify-self-start" disabled={syncing || loadingQuery} type="submit">{loadingQuery ? 'Consultando…' : 'Consultar disponibilidad'}</button></form>{queryError ? <p className="mt-4 text-sm text-red-700" role="alert">{queryError}</p> : null}</section>
    {results.length ? <section aria-label="Resultados de disponibilidad" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((result) => <article className={`rounded-lg border p-4 ${statusClass(result.status)}`} key={result.accommodationId}><h2 className="font-semibold">{names[result.accommodationSlug] ?? 'Alojamiento'}</h2><p className="mt-2 font-medium">{statusLabels[result.status]}</p><p className="mt-2 text-sm">Capacidad máxima: {result.maxCapacity}</p>{result.verification ? <p className="mt-1 text-sm">Última sincronización: {displayDate(result.verification.lastSuccessfulSyncAt.slice(0, 10))}</p> : result.status === 'NO_VERIFICABLE' ? <p className="mt-1 text-sm">Fuente aún no verificable.</p> : null}</article>)}</section> : !syncing ? <p className="rounded border p-4 text-sm text-muted-foreground">Ingresá un rango para consultar los alojamientos.</p> : null}
    <section className="rounded-lg border bg-card p-4 shadow-sm sm:p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">Calendario mensual</h2><p className="mt-1 text-sm text-muted-foreground">Consultá el estado diario con los datos verificados.</p></div><form className="flex flex-wrap items-end gap-3" onSubmit={loadCalendar}><label className="text-sm font-medium" htmlFor="availability-calendar-month">Mes<input className="mt-2 min-h-11 rounded border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" id="availability-calendar-month" onChange={(event) => setCalendarMonth(event.target.value)} type="month" value={calendarMonth} /></label><button className="min-h-11 rounded border px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={loadingCalendar || syncing} type="submit">{loadingCalendar ? 'Cargando…' : 'Ver mes'}</button></form></div>{calendarError ? <p className="mt-4 text-sm text-red-700" role="alert">{calendarError}</p> : null}{calendar ? <><div aria-label="Referencias de disponibilidad" className="mt-5 flex flex-wrap gap-2 text-xs" role="list"><span className="rounded bg-green-100 px-2 py-1 font-medium text-green-900" role="listitem">Disponible</span><span className="rounded bg-red-100 px-2 py-1 font-medium text-red-900" role="listitem">Ocupado</span><span className="rounded bg-amber-100 px-2 py-1 font-medium text-amber-950" role="listitem">Capacidad insuficiente</span><span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-900" role="listitem">No verificable</span></div><div className="mt-3 overflow-x-auto rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" role="region" aria-label="Disponibilidad por alojamiento" tabIndex={0}><table className="min-w-max w-full text-left text-sm"><thead><tr className="border-b"><th className="sticky left-0 bg-card p-3" scope="col">Alojamiento</th>{calendar.days.map((day) => <th className="p-3 text-center font-medium" key={day.date} scope="col">{displayDate(day.date)}</th>)}</tr></thead><tbody>{calendarAccommodationRows(calendar.days).map((row) => <tr className="border-b last:border-0" key={row.accommodationId}><th className="sticky left-0 bg-card p-3 font-medium" scope="row">{names[row.accommodationSlug] ?? 'Alojamiento'}</th>{row.days.map((day) => <td aria-label={`${displayDate(day.date)}: ${statusLabels[day.status]}`} className={`p-3 text-center font-medium ${calendarStatusClass(day.status)}`} key={day.date}>{statusLabels[day.status]}</td>)}</tr>)}</tbody></table></div></> : <p className="mt-5 text-sm text-muted-foreground">Elegí un mes para ver el calendario.</p>}</section>

  </div></main>;
}
