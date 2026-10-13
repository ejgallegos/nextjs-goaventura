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

import { GET, POST } from './sources/route';
import { PATCH } from './sources/[sourceId]/route';
import { POST as POST_ALL } from './sync/route';
import { POST as POST_ONE } from './sources/[sourceId]/sync/route';

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
});
