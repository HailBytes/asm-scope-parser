import type { ParsedEntry } from './types.js';

/** Convert a dotted-decimal IPv4 string to a 32-bit unsigned integer */
export function ipToInt(ip: string): number {
  const parts = ip.split('.');
  if (parts.length !== 4) throw new Error(`Invalid IPv4 address: ${ip}`);
  return parts.reduce((acc, part) => {
    const n = parseInt(part, 10);
    if (isNaN(n) || n < 0 || n > 255) throw new Error(`Invalid IPv4 octet: ${part} in ${ip}`);
    return (acc << 8) | n;
  }, 0) >>> 0;
}

/** Convert a 32-bit unsigned integer to a dotted-decimal IPv4 string */
export function intToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join('.');
}

/** Build a 32-bit subnet mask from a prefix length */
export function prefixToMask(prefix: number): number {
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const CIDR_RE = /^(\d{1,3}\.){3}\d{1,3}\/([0-9]|[12]\d|3[0-2])$/;
const DOMAIN_RE = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const WILDCARD_RE = /^\*\.(.+)$/;

/**
 * Parse a single scope entry string into a ParsedEntry.
 * Entries prefixed with `!` are treated as exclusions.
 */
export function parseEntry(raw: string): ParsedEntry {
  const trimmed = raw.trim();
  const exclude = trimmed.startsWith('!');
  const value = exclude ? trimmed.slice(1).trim() : trimmed;

  // CIDR
  if (CIDR_RE.test(value)) {
    const [ipPart, prefixStr] = value.split('/');
    const prefixLen = parseInt(prefixStr, 10);
    const maskInt = prefixToMask(prefixLen);
    const networkInt = (ipToInt(ipPart) & maskInt) >>> 0;
    return { raw: trimmed, kind: 'cidr', exclude, networkInt, maskInt, prefixLen };
  }

  // Single IPv4
  if (IPV4_RE.test(value)) {
    try {
      const networkInt = ipToInt(value);
      return { raw: trimmed, kind: 'ipv4', exclude, networkInt };
    } catch {
      // fall through to domain check
    }
  }

  // Wildcard domain: *.example.com
  const wildcardMatch = value.match(WILDCARD_RE);
  if (wildcardMatch) {
    return {
      raw: trimmed,
      kind: 'wildcard-domain',
      exclude,
      domain: wildcardMatch[1].toLowerCase(),
      isWildcard: true,
    };
  }

  // Plain domain
  if (DOMAIN_RE.test(value)) {
    return { raw: trimmed, kind: 'domain', exclude, domain: value.toLowerCase() };
  }

  throw new Error(`Cannot parse scope entry: "${raw}"`);
}
