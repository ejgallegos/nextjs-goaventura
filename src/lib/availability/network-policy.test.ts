import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { lookupWithAddress, validateIcsUrl } from './network-policy';

const safeAddress = '93.184.216.34';
const testUrl = 'https://calendar.example.test/feed.ics';

describe('ICS network policy', () => {
  it('rejects unsafe URL shapes and every unsafe DNS address', async () => {
    const safeResolver = async () => [safeAddress];
    await expect(validateIcsUrl(testUrl, { resolveHost: safeResolver })).resolves.toEqual(new URL(testUrl));

    for (const value of [
      'http://calendar.example.test/feed.ics',
      'https://user:password@calendar.example.test/feed.ics',
      'https://calendar.example.test/feed.ics#fragment',
      'https://calendar.example.test:8443/feed.ics',
      'https://localhost/feed.ics',
      'https://127.0.0.1/feed.ics',
      'https://[::1]/feed.ics',
      'https://[fc00::1]/feed.ics',
    ]) {
      await expect(validateIcsUrl(value, { resolveHost: safeResolver })).rejects.toThrow('ICS URL rejected by security policy');
    }

    for (const address of [
      '10.0.0.1',
      '169.254.169.254',
      '100.64.0.1',
      '100.127.255.254',
      '224.0.0.1',
      '240.0.0.1',
      '0.0.0.0',
      '192.0.0.1',
      '192.0.2.1',
      '198.18.0.1',
      '198.51.100.1',
      '203.0.113.1',
      'malformed',
      '2001:db8::1',
      '2001:2::1',
      '64:ff9b::1',
      'fec0::1',
      '2002:c000:0201::1',
      '2001:0000:4136:e378:8000:63bf:3fff:fdd2',
      '::ffff:192.168.1.1',
      '::ffff:0:192.168.1.1',
      '::ffff:0:c0a8:0101',
    ]) {
      await expect(validateIcsUrl(testUrl, { resolveHost: async () => [safeAddress, address] })).rejects.toThrow(
        'ICS host resolution rejected',
      );
    }

    await expect(validateIcsUrl(testUrl, { resolveHost: async () => ['2001:4860:4860::8888'] })).resolves.toEqual(new URL(testUrl));
  });

  it('defers pinned lookup callbacks while preserving scalar and all-address forms', async () => {
    const callbacks: Array<{ all: boolean; synchronous: boolean; address: unknown }> = [];
    let allStack = true;
    lookupWithAddress(safeAddress, { all: true }, (error, address) => {
      if (!error) callbacks.push({ all: true, synchronous: allStack, address });
    });
    allStack = false;

    let scalarStack = true;
    lookupWithAddress(safeAddress, { all: false }, (error, address) => {
      if (!error) callbacks.push({ all: false, synchronous: scalarStack, address });
    });
    scalarStack = false;

    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(callbacks).toEqual([
      { all: true, synchronous: false, address: [{ address: safeAddress, family: 4 }] },
      { all: false, synchronous: false, address: safeAddress },
    ]);
  });
});
