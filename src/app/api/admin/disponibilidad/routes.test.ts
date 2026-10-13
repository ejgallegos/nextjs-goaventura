import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('../../../../lib/data/accommodations', () => ({ accommodations: [] }));

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  listSources: vi.fn(),
  configureSource: vi.fn(),
  setSourceStatus: vi.fn(),
  syncSource: vi.fn(),
  syncAllSources: vi.fn(),
  queryAvailability: vi.fn(),
  queryAvailabilityCalendar: vi.fn(),
  listSyncHistory: vi.fn(),
  approveEmptyFeed: vi.fn(),
}));

vi.mock('../../../../lib/auth/availability-server', () => ({ getAvailabilitySession: mocks.session }));
vi.mock('../../../../lib/availability/source-admin', () => ({
  listSources: mocks.listSources,
  configureSource: mocks.configureSource,
  setSourceStatus: mocks.setSourceStatus,
}));
vi.mock('../../../../lib/availability/ics-sync', () => ({
  syncSource: mocks.syncSource,
  syncAllSources: mocks.syncAllSources,
}));
vi.mock('../../../../lib/availability/availability-engine', () => ({ queryAvailability: mocks.queryAvailability }));
vi.mock('../../../../lib/availability/availability-calendar', () => ({ queryAvailabilityCalendar: mocks.queryAvailabilityCalendar }));
vi.mock('../../../../lib/availability/availability-history', () => ({ listSyncHistory: mocks.listSyncHistory }));
vi.mock('../../../../lib/availability/ics-approval', () => ({ approveEmptyFeed: mocks.approveEmptyFeed }));

import { GET, POST } from './sources/route';
import { PATCH } from './sources/[sourceId]/route';
import { POST as POST_ALL } from './sync/route';
import { POST as POST_ONE } from './sources/[sourceId]/sync/route';
import { GET as GET_AVAILABILITY } from './availability/route';
import { GET as GET_CALENDAR } from './calendar/route';
import { GET as GET_HISTORY } from './history/route';
import { POST as POST_APPROVAL } from './sources/[sourceId]/approvals/[syncRunId]/route';

const origin = 'http://localhost:9002';
const session = { subject: 'admin', issuedAt: 1, expiresAt: 2 };
const sourceId = '00000000-0000-0000-0000-000000000001';

function request(method: string, body?: unknown, withOrigin = true): Request {
  return new Request('http://localhost/api/admin/disponibilidad/sources', {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(withOrigin ? { origin } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('availability administration API boundaries', () => {
  it('rejects an invalid or missing session across every protected API', async () => {
    mocks.session.mockResolvedValue(null);
    const unauthenticated = [
      GET(new Request('http://localhost/api/admin/disponibilidad/sources')),
      GET_AVAILABILITY(new Request('http://localhost/api/admin/disponibilidad/availability?checkIn=2026-10-10&checkOut=2026-10-11&guests=1')),
      GET_CALENDAR(new Request('http://localhost/api/admin/disponibilidad/calendar?month=2026-10&guests=1')),
      GET_HISTORY(new Request(`http://localhost/api/admin/disponibilidad/history?sourceId=${sourceId}`)),
      POST_ALL(request('POST', { force: false })),
      POST(request('POST', { sourceId, accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/a' })),
      PATCH(request('PATCH', { status: 'active' }), { params: { sourceId } }),
      POST_ONE(request('POST', { force: false }), { params: { sourceId } }),
      POST_APPROVAL(request('POST', {}), { params: { sourceId, syncRunId: sourceId } }),
    ];
    for (const response of await Promise.all(unauthenticated)) {
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
  });

  it('enforces the exact origin on every mutating availability API', async () => {
    mocks.session.mockResolvedValue(session);
    const missingOrigin = [
      POST_ALL(request('POST', { force: false }, false)),
      POST(request('POST', { sourceId, accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/a' }, false)),
      PATCH(request('PATCH', { status: 'active' }, false), { params: { sourceId } }),
      POST_ONE(request('POST', { force: false }, false), { params: { sourceId } }),
      POST_APPROVAL(request('POST', {}, false), { params: { sourceId, syncRunId: sourceId } }),
    ];
    for (const response of await Promise.all(missingOrigin)) expect(response.status).toBe(403);
  });

  it('rejects unauthenticated source reads without caching', async () => {
    mocks.session.mockResolvedValueOnce(null);
    const response = await GET(new Request('http://localhost/api/admin/disponibilidad/sources'));
    expect(response.status).toBe(401);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('rejects mutations without an exact allowed origin', async () => {
    mocks.session.mockResolvedValue(session);
    expect((await POST(request('POST', { sourceId, accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/a', }, false))).status).toBe(403);
    expect((await POST(new Request('http://localhost/api/admin/disponibilidad/sources', {
      method: 'POST', headers: { origin: 'https://goaventura.com.ar.evil.example', 'content-type': 'application/json' },
      body: JSON.stringify({ sourceId, accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/a' }),
    }))).status).toBe(403);
  });

  it('returns sanitized source configuration and never encrypted URL data', async () => {
    mocks.session.mockResolvedValue(session);
    mocks.configureSource.mockResolvedValue({ id: sourceId, accommodationSlug: 'loft-centro', status: 'inactive', configured: true });
    const response = await POST(request('POST', { sourceId, accommodationSlug: 'loft-centro', icsUrl: 'https://feed.example/a' }));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ source: { id: sourceId, accommodationSlug: 'loft-centro', status: 'inactive', configured: true } });
    expect(JSON.stringify(body)).not.toContain('v1.secret-ciphertext');
  });

  it('validates ownership/status and preserves force semantics for sync', async () => {
    mocks.session.mockResolvedValue(session);
    mocks.setSourceStatus.mockResolvedValue({ id: sourceId, accommodationSlug: 'loft-centro', status: 'active', configured: true });
    expect((await PATCH(request('PATCH', { status: 'active' }), { params: { sourceId } })).status).toBe(200);
    mocks.syncSource.mockResolvedValue({ sourceId, status: 'cooldown', code: 'COOLDOWN' });
    const response = await POST_ONE(request('POST', { force: false }), { params: { sourceId } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ outcome: { sourceId, status: 'cooldown', code: 'COOLDOWN' } });
    expect(mocks.syncSource).toHaveBeenCalledWith(sourceId, { force: false });
  });

  it('synchronizes active sources with sanitized stable outcomes', async () => {
    mocks.session.mockResolvedValue(session);
    mocks.syncAllSources.mockResolvedValue([{ sourceId, status: 'succeeded', imported: 2 }]);
    const response = await POST_ALL(request('POST', { force: true }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ outcomes: [{ sourceId, status: 'succeeded', imported: 2 }] });
    expect(mocks.syncAllSources).toHaveBeenCalledWith({ force: true });
  });

  it('validates availability queries and returns typed results', async () => {
    mocks.session.mockResolvedValue(session);
    mocks.queryAvailability.mockResolvedValue([{ accommodationSlug: 'loft-centro', status: 'NO_VERIFICABLE' }]);
    const invalid = await GET_AVAILABILITY(new Request('http://localhost/api/admin/disponibilidad/availability?checkIn=bad&checkOut=2026-10-02&guests=1'));
    expect(invalid.status).toBe(400);
    const response = await GET_AVAILABILITY(new Request('http://localhost/api/admin/disponibilidad/availability?checkIn=2026-10-01&checkOut=2026-10-02&guests=1'));
    expect(await response.json()).toEqual({ results: [{ accommodationSlug: 'loft-centro', status: 'NO_VERIFICABLE' }] });
  });

  it('returns ordered calendar/history and approves only through the protected boundary', async () => {
    mocks.session.mockResolvedValue(session);
    mocks.queryAvailabilityCalendar.mockResolvedValue({ month: '2026-10', days: [{ date: '2026-10-01', results: [] }] });
    mocks.listSyncHistory.mockResolvedValue([{ id: 'run-1', status: 'failed', startedAt: '2026-10-01T00:00:00.000Z' }]);
    mocks.approveEmptyFeed.mockResolvedValue({ status: 'approved', syncRunId: 'run-1', cleared: 2 });
    const calendarResponse = await GET_CALENDAR(new Request('http://localhost/api/admin/disponibilidad/calendar?month=2026-10&guests=1'));
    expect(await calendarResponse.json()).toEqual({ month: '2026-10', days: [{ date: '2026-10-01', results: [] }] });
    const historyResponse = await GET_HISTORY(new Request('http://localhost/api/admin/disponibilidad/history?sourceId=' + sourceId));
    expect(await historyResponse.json()).toEqual({ history: [{ id: 'run-1', status: 'failed', startedAt: '2026-10-01T00:00:00.000Z' }] });
    const response = await POST_APPROVAL(request('POST', {}, true), { params: { sourceId, syncRunId: sourceId } });
    expect(await response.json()).toEqual({ approval: { status: 'approved', syncRunId: 'run-1', cleared: 2 } });
    mocks.approveEmptyFeed.mockResolvedValueOnce({ status: 'rejected', code: 'STALE_RUN' });
    expect((await POST_APPROVAL(request('POST', {}, true), { params: { sourceId, syncRunId: sourceId } })).status).toBe(400);
    expect(JSON.stringify(await (await GET_HISTORY(new Request('http://localhost/api/admin/disponibilidad/history?sourceId=' + sourceId))).json())).not.toContain('encrypted');
  });
});
