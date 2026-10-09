import 'server-only';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';

const LOCAL_HOSTNAMES = new Set(['localhost', 'localhost.localdomain', 'metadata', 'metadata.google.internal']);

export type IcsAddressResolver = (hostname: string) => Promise<string[]>;

export interface IcsLookupAddress {
  address: string;
  family: number;
}

export type IcsLookupCallback = (
  error: NodeJS.ErrnoException | null,
  address?: string | IcsLookupAddress[],
  family?: number,
) => void;

export interface IcsPinnedRequestOptions {
  hostname: string;
  port: 443;
  path: string;
  timeoutMs: number;
  lookup: (hostname: string, options: { all?: boolean }, callback: IcsLookupCallback) => void;
}

function securityError(message: string): Error {
  return new Error(message);
}

function parseIPv4(value: string): number[] | null {
  const parts = value.split('.');
  if (parts.length !== 4 || !parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)) return null;
  return parts.map(Number);
}

function ipv4ToNumber(parts: number[]): number {
  return (((parts[0] * 256 + parts[1]) * 256 + parts[2]) * 256 + parts[3]) >>> 0;
}

function isUnsafeIPv4(value: string): boolean {
  const parts = parseIPv4(value);
  if (!parts) return true;
  const address = ipv4ToNumber(parts);
  const range = (first: number, second: number, third: number, last: number): [number, number] => {
    const start = ipv4ToNumber([first, second, third, 0]);
    return [start, start + last];
  };
  const blockedRanges: Array<[number, number]> = [
    range(0, 0, 0, 0xffffff),
    range(10, 0, 0, 0xffffff),
    range(100, 64, 0, 0x3fffff),
    range(127, 0, 0, 0xffffff),
    range(169, 254, 0, 0xffff),
    range(172, 16, 0, 0xfffff),
    range(192, 0, 0, 0xff),
    range(192, 0, 2, 0xff),
    range(192, 88, 99, 0xff),
    range(192, 168, 0, 0xffff),
    range(198, 18, 0, 0x1ffff),
    range(198, 51, 100, 0xff),
    range(203, 0, 113, 0xff),
    range(224, 0, 0, 0xfffffff),
    range(240, 0, 0, 0xfffffff),
  ];
  return blockedRanges.some(([start, end]) => address >= start && address <= end);
}

function expandIPv6(value: string): number[] | null {
  const compression = value.indexOf('::');
  if (compression !== -1 && value.indexOf('::', compression + 2) !== -1) return null;

  const [left, right] = compression === -1 ? [value, ''] : [value.slice(0, compression), value.slice(compression + 2)];
  const groups = (part: string): number[] | null => {
    if (!part) return [];
    const pieces = part.split(':');
    const values: number[] = [];
    for (const piece of pieces) {
      if (piece.includes('.')) {
        const ipv4 = parseIPv4(piece);
        if (!ipv4 || piece !== pieces[pieces.length - 1]) return null;
        values.push((ipv4[0] << 8) | ipv4[1], (ipv4[2] << 8) | ipv4[3]);
      } else if (/^[0-9a-f]{1,4}$/i.test(piece)) {
        values.push(Number.parseInt(piece, 16));
      } else {
        return null;
      }
    }
    return values;
  };

  const leftGroups = groups(left);
  const rightGroups = groups(right);
  if (!leftGroups || !rightGroups) return null;
  if (compression === -1) return leftGroups.length === 8 ? leftGroups : null;
  const missing = 8 - leftGroups.length - rightGroups.length;
  return missing > 0 ? [...leftGroups, ...Array.from({ length: missing }, () => 0), ...rightGroups] : null;
}

function isUnsafeIPv6(value: string): boolean {
  const groups = expandIPv6(value);
  if (!groups) return true;
  const allZero = groups.every((group) => group === 0);
  const loopback = allZero || (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1);
  const multicast = (groups[0] & 0xff00) === 0xff00;
  const uniqueLocal = (groups[0] & 0xfe00) === 0xfc00;
  const linkLocal = (groups[0] & 0xffc0) === 0xfe80;
  const siteLocal = (groups[0] & 0xffc0) === 0xfec0;
  const documentation = groups[0] === 0x2001 && groups[1] === 0x0db8;
  const benchmarking = groups[0] === 0x2001 && groups[1] === 0x0002;
  const orchid = groups[0] === 0x2001 && (groups[1] === 0x0010 || groups[1] === 0x0020);
  const teredo = groups[0] === 0x2001 && groups[1] === 0x0000;
  const sixToFour = groups[0] === 0x2002;
  const translated = groups[0] === 0x0064 && groups[1] === 0xff9b;
  const discard = groups[0] === 0x0100 && groups[1] === 0;
  const ipv4Translatable = groups.slice(0, 4).every((group) => group === 0) && groups[4] === 0xffff && groups[5] === 0;
  const mappedIPv4 = groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff;
  const compatibleIPv4 = groups.slice(0, 6).every((group) => group === 0);
  const embeddedIPv4 = `${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`;
  return (
    loopback ||
    multicast ||
    uniqueLocal ||
    linkLocal ||
    siteLocal ||
    documentation ||
    benchmarking ||
    orchid ||
    teredo ||
    sixToFour ||
    translated ||
    discard ||
    ipv4Translatable ||
    ((mappedIPv4 || compatibleIPv4) && isUnsafeIPv4(embeddedIPv4))
  );
}

function isUnsafeAddress(address: string): boolean {
  const family = isIP(address);
  return family === 4 ? isUnsafeIPv4(address) : family === 6 ? isUnsafeIPv6(address) : true;
}

function isLocalHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/\.$/, '');
  return (
    LOCAL_HOSTNAMES.has(lower) ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    !lower.includes('.')
  );
}

function validateUrlShape(input: string): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw securityError('ICS URL rejected by security policy');
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.hash ||
    (url.port !== '' && url.port !== '443') ||
    !hostname ||
    isLocalHostname(hostname)
  ) {
    throw securityError('ICS URL rejected by security policy');
  }

  if (isIP(hostname) > 0 && isUnsafeAddress(hostname)) {
    throw securityError('ICS URL rejected by security policy');
  }
  return url;
}

export async function resolveAllAddresses(hostname: string): Promise<string[]> {
  if (isIP(hostname) > 0) return [hostname];
  const results = await Promise.allSettled([dns.resolve4(hostname), dns.resolve6(hostname)]);
  const addresses = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
  if (addresses.length === 0 || addresses.some(isUnsafeAddress)) throw securityError('ICS host resolution rejected');
  return addresses;
}

export async function validateTarget(input: string, resolveHost: IcsAddressResolver): Promise<{ url: URL; addresses: string[] }> {
  const url = validateUrlShape(input);
  let addresses: string[];
  try {
    addresses = await resolveHost(url.hostname.replace(/^\[|\]$/g, ''));
  } catch {
    throw securityError('ICS host resolution rejected');
  }
  if (addresses.length === 0 || addresses.some(isUnsafeAddress)) throw securityError('ICS host resolution rejected');
  return { url, addresses };
}

export async function validateIcsUrl(input: string, options: { resolveHost?: IcsAddressResolver } = {}): Promise<URL> {
  const resolveHost = options.resolveHost ?? resolveAllAddresses;
  return (await validateTarget(input, resolveHost)).url;
}

export function lookupWithAddress(address: string, options: { all?: boolean }, callback: IcsLookupCallback): void {
  const family = isIP(address);
  queueMicrotask(() => {
    if (options.all) callback(null, [{ address, family }]);
    else callback(null, address, family);
  });
}
