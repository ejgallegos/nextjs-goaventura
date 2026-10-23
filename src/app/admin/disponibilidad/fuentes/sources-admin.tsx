'use client';

import Link from 'next/link';
import React, { FormEvent, useEffect, useState } from 'react';
import {
  confirmEmptyFeedMessage,
  sourceStatusLabel,
  validateSourceUrl,
} from '../../../../lib/availability/availability-ui';
import { AvailabilityLogoutButton } from '../logout-button';

type Source = { id: string; accommodationSlug: string; status: 'active' | 'inactive'; configured: boolean; maskedUrl: string | null };
type HistoryEntry = {
  id: string;
  status: 'running' | 'succeeded' | 'failed' | 'no_data';
  startedAt: string;
  completedAt: string | null;
  eventsSeen: number;
  periodsImported: number;
  warning?: 'SYNC_FAILED' | 'SYNC_WARNING';
};
type SyncOutcome = { status?: string };
type Confirmation = { sourceId: string; runId: string };

const names: Record<string, string> = {
  'loft-centro': 'Loft Centro',
  'altos-del-talampaya-casa': 'Altos del Talampaya Casa',
  'altos-del-talampaya-casa-ii': 'Altos del Talampaya Casa II',
  'casa-altos-del-talampaya-iii': 'Altos del Talampaya Casa III',
  'altos-del-talampaya-dpto': 'Altos del Talampaya Dpto',
};

function displayDate(value: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${value}T00:00:00Z`));
}

function safeSyncMessage(outcome?: SyncOutcome): string {
  if (outcome?.status === 'cooldown') return 'La fuente se sincronizó recientemente; se conserva ese resultado.';
  if (outcome?.status === 'no_data') return 'Feed vacío pendiente de revisión; se conservaron los datos válidos.';
  if (outcome?.status === 'succeeded') return 'Sincronización completada.';
  return 'La sincronización terminó con advertencias. Se conservan los últimos datos válidos.';
}

async function readJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('request');
  return response.json() as Promise<T>;
}

export function SourcesAdmin() {
  const [sources, setSources] = useState<Source[]>([]);
  const [sourceUrls, setSourceUrls] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  async function loadSources() {
    try {
      const body = await readJson<{ sources: Source[] }>('/api/admin/disponibilidad/sources');
      setSources(body.sources ?? []);
    } catch {
      setSourceError('No se pudieron cargar las fuentes.');
    }
  }

  useEffect(() => {
    void loadSources();
  }, []);

  async function configure(source: Source, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (source.status === 'active') {
      setSourceError('Desactivá la fuente antes de reemplazar su URL.');
      return;
    }
    const icsUrl = sourceUrls[source.id]?.trim() ?? '';
    const validation = validateSourceUrl(icsUrl);
    if (validation) {
      setSourceError(validation);
      return;
    }

    setPending(`configure:${source.id}`);
    setSourceError(null);
    try {
      const body = await readJson<{ source: Source }>('/api/admin/disponibilidad/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: source.id,
          accommodationSlug: source.accommodationSlug,
          icsUrl,
        }),
      });
      setSources((current) => current.map((item) => (item.id === source.id ? body.source : item)));
      setSourceUrls((current) => ({ ...current, [source.id]: '' }));
    } catch {
      setSourceError('No se pudo guardar la fuente.');
    } finally {
      setPending(null);
    }
  }

  async function toggleSource(source: Source) {
    if (source.status === 'inactive' && !source.configured) {
      setSourceError('Configurá la fuente antes de activarla.');
      return;
    }

    setPending(`toggle:${source.id}`);
    setSourceError(null);
    try {
      const body = await readJson<{ source: Source }>(`/api/admin/disponibilidad/sources/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: source.status === 'active' ? 'inactive' : 'active' }),
      });
      setSources((current) => current.map((item) => (item.id === source.id ? body.source : item)));
    } catch {
      setSourceError('No se pudo actualizar el estado de la fuente.');
    } finally {
      setPending(null);
    }
  }

  async function syncSource(sourceId: string, force: boolean) {
    setPending(`sync:${sourceId}`);
    setSyncMessage(null);
    try {
      const body = await readJson<{ outcome: SyncOutcome }>(`/api/admin/disponibilidad/sources/${sourceId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      setSyncMessage(safeSyncMessage(body.outcome));
      await loadHistory(sourceId);
    } catch {
      setSyncMessage('No se pudo sincronizar la fuente. Se conservan los datos válidos.');
    } finally {
      setPending(null);
    }
  }

  async function syncAll(force: boolean) {
    setPending(`sync-all:${force}`);
    setSyncMessage(null);
    try {
      const body = await readJson<{ outcomes: SyncOutcome[] }>('/api/admin/disponibilidad/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      setSyncMessage(
        body.outcomes?.some((item) => item.status !== 'succeeded' && item.status !== 'cooldown')
          ? safeSyncMessage()
          : 'Sincronización completada.',
      );
      await loadSources();
    } catch {
      setSyncMessage('No se pudo sincronizar. Se conservan los datos válidos.');
    } finally {
      setPending(null);
    }
  }

  async function loadHistory(sourceId: string) {
    setHistoryLoading(sourceId);
    try {
      const body = await readJson<{ history: HistoryEntry[] }>(
        `/api/admin/disponibilidad/history?sourceId=${encodeURIComponent(sourceId)}`,
      );
      setHistory((current) => ({ ...current, [sourceId]: body.history ?? [] }));
    } catch {
      setSourceError('No se pudo cargar el historial.');
    } finally {
      setHistoryLoading(null);
    }
  }

  async function approveEmptyFeed() {
    if (!confirmation) return;
    const { sourceId, runId } = confirmation;
    setPending(`approve:${runId}`);
    try {
      await readJson(`/api/admin/disponibilidad/sources/${sourceId}/approvals/${runId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      setConfirmation(null);
      await loadHistory(sourceId);
      setSyncMessage('Feed vacío aprobado.');
    } catch {
      setSourceError('No se pudo aprobar el feed vacío.');
    } finally {
      setPending(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link className="text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="/admin/disponibilidad">
              ← Volver a disponibilidad
            </Link>
            <p className="mt-5 text-sm font-medium text-muted-foreground">Módulo interno</p>
            <h1 className="mt-2 text-3xl font-bold">Fuentes ICS</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Configurá, sincronizá y revisá el historial de las fuentes de disponibilidad. Las URLs no se muestran después de guardarlas.</p>
          </div>
          <AvailabilityLogoutButton />
        </header>

        {syncMessage ? <p className="rounded border p-4 text-sm" role="status" aria-live="polite">{syncMessage}</p> : null}
        {sourceError ? <p className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700" role="alert">{sourceError}</p> : null}

        <section aria-labelledby="sources-actions-heading" className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold" id="sources-actions-heading">Sincronización general</h2>
              <p className="mt-1 text-sm text-muted-foreground">Actualizá todas las fuentes activas o forzá una sincronización fuera de la ventana habitual.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="min-h-11 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null} onClick={() => void syncAll(false)} type="button">Sincronizar todas</button>
              <button className="min-h-11 rounded border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null} onClick={() => void syncAll(true)} type="button">Forzar todas</button>
            </div>
          </div>
        </section>

        <section aria-labelledby="sources-list-heading" className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold" id="sources-list-heading">Fuentes configuradas</h2>
          {sources.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">No hay fuentes configuradas.</p> : <div className="mt-5 space-y-4">{sources.map((source) => <article className="rounded border p-4" key={source.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="font-semibold">{names[source.accommodationSlug] ?? 'Alojamiento'}</h3><p className="mt-1 text-sm text-muted-foreground">{sourceStatusLabel(source.status, source.configured)}</p></div>
              <div className="flex flex-wrap gap-2">
                <button className="min-h-11 rounded border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null} onClick={() => void toggleSource(source)} type="button">{source.status === 'active' ? 'Desactivar' : 'Activar'}</button>
                <button className="min-h-11 rounded border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null || source.status !== 'active'} onClick={() => void syncSource(source.id, false)} type="button">Sincronizar</button>
                <button className="min-h-11 rounded border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null || source.status !== 'active'} onClick={() => void syncSource(source.id, true)} type="button">Forzar</button>
              </div>
            </div>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end" onSubmit={(event) => void configure(source, event)}>
              <label className="flex-1 text-sm font-medium" htmlFor={`ics-url-${source.id}`}>URL ICS<input className="mt-2 min-h-11 w-full rounded border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none read-only:bg-muted read-only:text-muted-foreground" id={`ics-url-${source.id}`} onChange={(event) => setSourceUrls((current) => ({ ...current, [source.id]: event.target.value }))} placeholder={source.status === 'active' ? 'URL protegida' : 'https://…'} readOnly={source.status === 'active'} type="url" value={source.status === 'active' ? source.maskedUrl ?? '••••' : sourceUrls[source.id] ?? ''} /></label>
              <button className="min-h-11 rounded border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null || source.status === 'active'} type="submit">Guardar URL</button>
            </form>
            {source.status === 'inactive' && source.maskedUrl ? <p className="mt-2 text-sm text-muted-foreground">URL configurada: {source.maskedUrl}</p> : null}
            <div className="mt-4">
              <button className="min-h-11 text-sm font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" onClick={() => void loadHistory(source.id)} type="button">{historyLoading === source.id ? 'Cargando historial…' : 'Ver historial'}</button>
              {history[source.id] ? <ul className="mt-3 space-y-2 text-sm">{history[source.id].length === 0 ? <li className="text-muted-foreground">Sin ejecuciones registradas.</li> : history[source.id].map((entry) => <li className="rounded bg-muted p-3" key={entry.id}>
                <div className="flex flex-wrap justify-between gap-2"><span>{entry.status === 'failed' ? 'Sincronización fallida' : entry.status === 'no_data' ? 'Feed vacío pendiente de revisión' : entry.status === 'running' ? 'Sincronización en curso' : 'Sincronización exitosa'}</span><span>{displayDate(entry.startedAt.slice(0, 10))}</span></div>
                <span className="text-muted-foreground">Eventos: {entry.eventsSeen} · Períodos: {entry.periodsImported}</span>
                {entry.status === 'no_data' ? <button className="mt-2 min-h-11 rounded border px-3 py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" onClick={() => setConfirmation({ sourceId: source.id, runId: entry.id })} type="button">Revisar feed vacío</button> : null}
              </li>)}</ul> : null}
            </div>
          </article>)}</div>}
        </section>

        {confirmation ? <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4" role="presentation"><section aria-labelledby="empty-feed-title" aria-modal="true" className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl" role="dialog"><h2 className="text-xl font-semibold" id="empty-feed-title">Confirmar feed vacío</h2><p className="mt-3 text-sm">{confirmEmptyFeedMessage()}</p><div className="mt-5 flex flex-wrap justify-end gap-3"><button className="min-h-11 rounded border px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none" onClick={() => setConfirmation(null)} type="button">Cancelar</button><button className="min-h-11 rounded bg-primary px-4 py-2 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50" disabled={pending !== null} onClick={() => void approveEmptyFeed()} type="button">Confirmar aprobación</button></div></section></div> : null}
      </div>
    </main>
  );
}
