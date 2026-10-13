import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { encryptIcsUrl } from './ics-secrets';
import {
  fetchIcsDocument,
  type IcsPinnedRequestOptions,
  type IcsRequestOperation,
  type IcsResponse,
} from './safe-fetch';

const encryptionKey = Buffer.alloc(32, 7).toString('base64');
const safeAddress = '93.184.216.34';
const testUrl = 'https://calendar.example.test/feed.ics';
const originalKey = process.env.AVAILABILITY_ICS_ENCRYPTION_KEY;

function response(statusCode: number, headers: Record<string, string | undefined>, body: IcsResponse['body'] = ''): IcsResponse {
  return { statusCode, headers, body };
}

function scriptedRequest(
  responses: IcsResponse[],
  observed: IcsPinnedRequestOptions[] = [],
  pinnedAddresses: string[] = [],
) {
  return (options: IcsPinnedRequestOptions): IcsRequestOperation => {
    observed.push(options);
    const responsePromise = (async () => {
      await new Promise<void>((resolve, reject) => {
        options.lookup(options.hostname, { all: false }, (error, address) => {
          if (error) reject(error);
          else {
            if (typeof address === 'string') pinnedAddresses.push(address);
            resolve();
          }
        });
      });
      const next = responses.shift();
      if (!next) throw new Error('No scripted response');
      return next;
    })();
    return { response: responsePromise, abort: vi.fn() };
  };
}

describe('ICS safe fetch transport', () => {
  beforeAll(() => {
    process.env.AVAILABILITY_ICS_ENCRYPTION_KEY = encryptionKey;
  });

  afterAll(() => {
    if (originalKey === undefined) delete process.env.AVAILABILITY_ICS_ENCRYPTION_KEY;
    else process.env.AVAILABILITY_ICS_ENCRYPTION_KEY = originalKey;
  });

  it('pins each request to an already validated address and follows safe redirects', async () => {
    const observed: IcsPinnedRequestOptions[] = [];
    const pinnedAddresses: string[] = [];
    const result = await fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      request: scriptedRequest([
        response(302, { location: '/next.ics' }),
        response(200, { 'content-type': 'text/calendar; charset=utf-8' }, 'BEGIN:VCALENDAR\nEND:VCALENDAR'),
      ], observed, pinnedAddresses),
    });

    expect(result).toEqual({
      document: 'BEGIN:VCALENDAR\nEND:VCALENDAR',
      contentType: 'text/calendar',
      bytes: 29,
      redirects: 1,
    });
    expect(observed).toHaveLength(2);
    expect(pinnedAddresses).toEqual([safeAddress, safeAddress]);
    for (const options of observed) {
      expect(options.hostname).toBe('calendar.example.test');
      expect(options.port).toBe(443);
      expect(options.path).toMatch(/^\//);
    }
  });

  it('passes the Node lookup all-address contract through the pinned request seam', async () => {
    let seenLookupAddresses: unknown;
    const request = (options: IcsPinnedRequestOptions): IcsRequestOperation => ({
      response: new Promise<IcsResponse>((resolve, reject) => {
        options.lookup(options.hostname, { all: true }, (error, address) => {
          if (error) {
            reject(error);
            return;
          }
          seenLookupAddresses = address;
          resolve(response(200, { 'content-type': 'text/calendar' }, 'BEGIN:VCALENDAR'));
        });
      }),
      abort: vi.fn(),
    });

    const result = await fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      request,
    });

    expect(result.document).toBe('BEGIN:VCALENDAR');
    expect(seenLookupAddresses).toEqual([{ address: safeAddress, family: 4 }]);
  });

  it('rejects insecure, excessive, and malformed redirects', async () => {
    await expect(fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      request: scriptedRequest([response(302, { location: 'http://calendar.example.test/nope' })]),
    })).rejects.toThrow('ICS URL rejected by security policy');

    const redirects = Array.from({ length: 4 }, (_, index) => response(302, { location: `/step-${index}.ics` }));
    await expect(fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      request: scriptedRequest(redirects),
    })).rejects.toThrow('ICS redirect limit exceeded');
  });

  it('rejects failed HTTP responses without exposing response content', async () => {
    const responseBody = 'private feed failure with https://secret.example.test/calendar.ics';
    await expect(fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      request: scriptedRequest([response(503, { 'content-type': 'text/plain' }, responseBody)]),
    })).rejects.toThrow('ICS request failed');
    try {
      await fetchIcsDocument(encryptIcsUrl(testUrl), {
        resolveHost: async () => [safeAddress],
        request: scriptedRequest([response(503, { 'content-type': 'text/plain' }, responseBody)]),
      });
    } catch (error) {
      expect(String(error)).not.toContain(responseBody);
      expect(String(error)).not.toContain(testUrl);
    }
  });

  it('aborts pending requests and destroys active responses on timeout or rejection', async () => {
    const abort = vi.fn();
    const pendingRequest = (() => ({
      response: new Promise<IcsResponse>(() => {}),
      abort,
    })) as never;

    await expect(fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      timeoutMs: 5,
      request: pendingRequest,
    })).rejects.toThrow('ICS request timed out');
    expect(abort).toHaveBeenCalledOnce();

    const destroy = vi.fn();
    const rejectedResponse = Object.assign(response(200, { 'content-type': 'application/json' }, '{}'), { destroy });
    const invalidResponseRequest = (() => ({
      response: Promise.resolve(rejectedResponse),
      abort: vi.fn(),
    })) as never;

    await expect(fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      request: invalidResponseRequest,
    })).rejects.toThrow('ICS content type rejected');
    expect(destroy).toHaveBeenCalledOnce();

    const bodyDestroy = vi.fn();
    const hangingBody: AsyncIterable<Uint8Array> = {
      async *[Symbol.asyncIterator]() {
        yield new Uint8Array([1]);
        await new Promise<void>(() => {});
      },
    };
    const activeResponse = Object.assign(response(200, { 'content-type': 'text/calendar' }, hangingBody), { destroy: bodyDestroy });
    const activeBodyRequest = (() => ({
      response: Promise.resolve(activeResponse),
      abort: vi.fn(),
    })) as never;

    await expect(fetchIcsDocument(encryptIcsUrl(testUrl), {
      resolveHost: async () => [safeAddress],
      timeoutMs: 5,
      request: activeBodyRequest,
    })).rejects.toThrow('ICS request timed out');
    expect(bodyDestroy).toHaveBeenCalledOnce();
  });

  it('enforces timeout, response size, and content-type boundaries without secrets', async () => {
    const encrypted = encryptIcsUrl(testUrl);
    const cases: Array<[() => Promise<unknown>, string]> = [
      [() => fetchIcsDocument(encrypted, { resolveHost: async () => [safeAddress], timeoutMs: -1, request: scriptedRequest([]) }), 'ICS request timed out'],
      [() => fetchIcsDocument(encrypted, { resolveHost: async () => [safeAddress], timeoutMs: 5, request: (() => ({ response: new Promise<IcsResponse>(() => {}), abort: vi.fn() })) as never }), 'ICS request timed out'],
      [() => fetchIcsDocument(encrypted, { resolveHost: async () => [safeAddress], maxBytes: 4, request: scriptedRequest([response(200, { 'content-type': 'text/calendar' }, 'too large')]) }), 'ICS response exceeded size limit'],
      [() => fetchIcsDocument(encrypted, { resolveHost: async () => [safeAddress], request: scriptedRequest([response(200, { 'content-type': 'application/json' }, '{}')]) }), 'ICS content type rejected'],
    ];

    for (const [operation, message] of cases) await expect(operation()).rejects.toThrow(message);
    await expect(fetchIcsDocument(encrypted, {
      resolveHost: async () => [safeAddress],
      request: () => { throw new Error('network secret should be sanitized'); },
    })).rejects.not.toThrow(testUrl);
  });
});
