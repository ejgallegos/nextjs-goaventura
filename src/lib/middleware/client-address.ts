const UNKNOWN_CLIENT_ADDRESS = 'unknown';
const MAX_ADDRESS_LENGTH = 64;

function isValidIPv4(value: string): boolean {
  const parts = value.split('.');
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isValidIPv6(value: string): boolean {
  if (!value.includes(':') || !/^[0-9a-f:.]+$/i.test(value)) return false;

  const compressionIndex = value.indexOf('::');
  if (compressionIndex !== -1 && value.indexOf('::', compressionIndex + 2) !== -1) return false;

  const groups = value.split(':').filter(Boolean);
  const ipv4GroupIndex = groups.findIndex((group) => group.includes('.'));
  if (ipv4GroupIndex !== -1 && ipv4GroupIndex !== groups.length - 1) return false;

  const groupCount = groups.reduce((count, group) => {
    if (group.includes('.')) return count + (isValidIPv4(group) ? 2 : 100);
    return count + (/^[0-9a-f]{1,4}$/i.test(group) ? 1 : 100);
  }, 0);

  return compressionIndex === -1 ? groupCount === 8 : groupCount < 8;
}

function isValidIPAddress(value: string): boolean {
  return isValidIPv4(value) || isValidIPv6(value);
}

export function getTrustedClientAddress(headers: Pick<Headers, 'get'>): string {
  const candidate = headers.get('x-real-ip')?.trim() ?? '';
  if (candidate.length > 0 && candidate.length <= MAX_ADDRESS_LENGTH && isValidIPAddress(candidate)) {
    return candidate;
  }
  return UNKNOWN_CLIENT_ADDRESS;
}
