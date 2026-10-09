import 'server-only';

import { request as httpsRequest } from 'node:https';
import type { IncomingMessage } from 'node:http';
import { decryptIcsUrl } from './ics-secrets';
import {
  lookupWithAddress,
  resolveAllAddresses,
  validateIcsUrl,
  validateTarget,
  type IcsAddressResolver,
  type IcsLookupAddress,
  type IcsLookupCallback,
  type IcsPinnedRequestOptions,
} from './network-policy';

export { validateIcsUrl };
export type { IcsAddressResolver, IcsLookupAddress, IcsLookupCallback, IcsPinnedRequestOptions } from './network-policy';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const ALLOWED_CONTENT_TYPES = new Set(['text/calendar', 'text/plain', 'application/ics', 'text/ics']);
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export interface IcsResponse {
  statusCode: number;
  headers: Record<string, string | undefined>;
  body: AsyncIterable<Uint8Array> | Uint8Array | string;
  destroy?: () => void;
  drain?: () => Promise<void>;
}

export interface IcsRequestOperation {
  response: Promise<IcsResponse>;
  abort: () => void;
}

export type IcsRequest = (options: IcsPinnedRequestOptions) => IcsRequestOperation;

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  resolveHost?: IcsAddressResolver;
  request?: IcsRequest;
}

export interface IcsDocument {
  document: string;
  contentType: string;
  bytes: number;
  redirects: number;
}

function securityError(message: string): Error {
  return new Error(message);
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function configuredTimeoutMs(): number {
  return parsePositiveInteger(process.env.AVAILABILITY_ICS_FETCH_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
}

function configuredMaxBytes(): number {
  return parsePositiveInteger(process.env.AVAILABILITY_ICS_MAX_RESPONSE_BYTES, DEFAULT_MAX_BYTES);
}

async function withinDeadline<T>(operation: Promise<T>, deadline: number, onTimeout?: () => void): Promise<T> {
  const remainingMs = deadline - Date.now();
  if (remainingMs <= 0) throw securityError('ICS request timed out');

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          onTimeout?.();
          reject(securityError('ICS request timed out'));
        }, remainingMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function nodeRequest(options: IcsPinnedRequestOptions): IcsRequestOperation {
  let request: ReturnType<typeof httpsRequest> | undefined;
  let settled = false;
  const responsePromise = new Promise<IcsResponse>((resolve, reject) => {
    request = httpsRequest(
      {
        hostname: options.hostname,
        port: options.port,
        path: options.path,
        method: 'GET',
        headers: { Accept: 'text/calendar, text/plain, application/ics, text/ics' },
        timeout: options.timeoutMs,
        lookup: (_hostname, lookupOptions, callback) => options.lookup(options.hostname, lookupOptions, (error, address, family) => {
          if (error || !address) {
            callback(error ?? securityError('ICS host resolution rejected'), '', family ?? 0);
          } else if (Array.isArray(address)) {
            callback(null, address as never);
          } else {
            callback(null, address, family ?? 0);
          }
        }),
      },
      (response: IncomingMessage) => {
        settled = true;
        const drain = () => new Promise<void>((resolveDrain) => {
          const finish = () => {
            response.removeListener('end', finish);
            response.removeListener('close', finish);
            response.removeListener('error', finish);
            resolveDrain();
          };
          response.once('end', finish);
          response.once('close', finish);
          response.once('error', finish);
          response.resume();
        });
        resolve({
          statusCode: response.statusCode ?? 0,
          headers: {
            'content-type': typeof response.headers['content-type'] === 'string' ? response.headers['content-type'] : undefined,
            location: typeof response.headers.location === 'string' ? response.headers.location : undefined,
            'content-length': typeof response.headers['content-length'] === 'string' ? response.headers['content-length'] : undefined,
          },
          body: response,
          destroy: () => response.destroy(),
          drain,
        });
      },
    );
    request.once('timeout', () => request?.destroy(securityError('ICS request timed out')));
    request.once('error', () => reject(securityError('ICS request failed')));
    request.end();
  });

  return {
    response: responsePromise,
    abort: () => {
      if (!settled) request?.destroy(securityError('ICS request timed out'));
    },
  };
}

async function* iterateBody(body: IcsResponse['body']): AsyncIterable<Uint8Array> {
  if (typeof body === 'string') {
    yield new TextEncoder().encode(body);
    return;
  }
  if (body instanceof Uint8Array) {
    yield body;
    return;
  }
  for await (const chunk of body) yield chunk;
}

async function readBody(response: IcsResponse, maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  try {
    for await (const chunk of iterateBody(response.body)) {
      total += chunk.byteLength;
      if (total > maxBytes) {
        response.destroy?.();
        throw securityError('ICS response exceeded size limit');
      }
      chunks.push(Buffer.from(chunk));
    }
  } catch (error) {
    response.destroy?.();
    if (error instanceof Error && error.message.startsWith('ICS ')) throw error;
    throw securityError('ICS request failed');
  }
  return Buffer.concat(chunks, total);
}

async function cleanupResponse(response: IcsResponse, maxBytes: number, deadline: number): Promise<void> {
  const destroy = response.destroy;
  if (destroy) {
    destroy();
    return;
  }
  try {
    const drain = response.drain ? response.drain() : readBody(response, maxBytes).then(() => undefined);
    await withinDeadline(drain, deadline);
  } catch {
    // A response without a destroy hook has already been fully drained or failed closed.
  }
}

function header(headers: Record<string, string | undefined>, name: string): string | undefined {
  const key = Object.keys(headers).find((candidate) => candidate.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : undefined;
}

export async function fetchIcsDocument(encryptedUrl: string, options: SafeFetchOptions = {}): Promise<IcsDocument> {
  const resolveHost = options.resolveHost ?? resolveAllAddresses;
  const request = options.request ?? nodeRequest;
  const timeoutMs = options.timeoutMs ?? configuredTimeoutMs();
  const maxBytes = options.maxBytes ?? configuredMaxBytes();
  const deadline = Date.now() + timeoutMs;
  let target = await withinDeadline(validateTarget(decryptIcsUrl(encryptedUrl), resolveHost), deadline);
  let redirects = 0;

  while (true) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) throw securityError('ICS request timed out');
    const address = target.addresses[0];
    let operation: IcsRequestOperation;
    try {
      operation = request({
        hostname: target.url.hostname.replace(/^\[|\]$/g, ''),
        port: 443,
        path: `${target.url.pathname}${target.url.search}`,
        timeoutMs: remainingMs,
        lookup: (_hostname, lookupOptions, callback) => lookupWithAddress(address, lookupOptions, callback),
      });
    } catch {
      throw securityError('ICS request failed');
    }
    let response: IcsResponse;
    try {
      response = await withinDeadline(operation.response, deadline, operation.abort);
    } catch (error) {
      if (error instanceof Error && error.message === 'ICS request timed out') throw error;
      throw securityError('ICS request failed');
    }

    const contentLength = Number.parseInt(header(response.headers, 'content-length') ?? '', 10);
    if (Number.isSafeInteger(contentLength) && contentLength > maxBytes) {
      await cleanupResponse(response, maxBytes, deadline);
      throw securityError('ICS response exceeded size limit');
    }
    if (REDIRECT_STATUSES.has(response.statusCode)) {
      await withinDeadline(readBody(response, maxBytes), deadline, () => response.destroy?.());
      if (redirects >= MAX_REDIRECTS) {
        await cleanupResponse(response, maxBytes, deadline);
        throw securityError('ICS redirect limit exceeded');
      }
      const location = header(response.headers, 'location');
      if (!location) {
        await cleanupResponse(response, maxBytes, deadline);
        throw securityError('ICS redirect rejected');
      }
      let nextUrl: string;
      try {
        nextUrl = new URL(location, target.url).toString();
      } catch {
        await cleanupResponse(response, maxBytes, deadline);
        throw securityError('ICS redirect rejected');
      }
      target = await withinDeadline(validateTarget(nextUrl, resolveHost), deadline);
      redirects += 1;
      continue;
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      await cleanupResponse(response, maxBytes, deadline);
      throw securityError('ICS request failed');
    }
    const contentType = (header(response.headers, 'content-type') ?? '').split(';', 1)[0].trim().toLowerCase();
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      await cleanupResponse(response, maxBytes, deadline);
      throw securityError('ICS content type rejected');
    }
    const document = (await withinDeadline(readBody(response, maxBytes), deadline, () => response.destroy?.())).toString('utf8');
    return { document, contentType, bytes: Buffer.byteLength(document, 'utf8'), redirects };
  }
}
